import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/serverAuth';
import { createClient } from '@/lib/supabaseServer';
import { finalScore, explainMatch } from '@/algorithm';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const skills: unknown = body?.skills;
  if (!Array.isArray(skills) || skills.length === 0) {
    return NextResponse.json(
      { error: 'skills is required and must be a non-empty array' },
      { status: 400 }
    );
  }
  const projectSkills = skills as string[];

  const supabase = createClient();

  // All profiles except current user
  const { data: profiles, error: profilesErr } = await supabase
    .from('profiles')
    .select('id, name, username, avatar, avatar_color, university, availability, major, year')
    .neq('id', user.id);

  if (profilesErr) {
    logger.error('[API /teammates] profiles fetch failed', profilesErr);
    return NextResponse.json({ error: profilesErr.message }, { status: 400 });
  }

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ matches: [] });
  }

  const profileIds = profiles.map((p) => p.id);

  // All skills for those profiles in one query
  const { data: userSkills, error: skillsErr } = await supabase
    .from('user_skills')
    .select('user_id, skill_name')
    .in('user_id', profileIds);

  if (skillsErr) {
    logger.error('[API /teammates] user_skills fetch failed', skillsErr);
    return NextResponse.json({ error: skillsErr.message }, { status: 400 });
  }

  const skillsByUser = new Map<string, string[]>();
  for (const row of userSkills ?? []) {
    const arr = skillsByUser.get(row.user_id) ?? [];
    arr.push(row.skill_name);
    skillsByUser.set(row.user_id, arr);
  }

  // All trust scores in one round trip
  const { data: trustRows, error: trustErr } = await supabase
    .rpc('compute_trust_scores_batch', { p_user_ids: profileIds });

  if (trustErr) {
    logger.error('[API /teammates] trust score batch failed', trustErr);
    return NextResponse.json({ error: trustErr.message }, { status: 400 });
  }

  const trustByUser = new Map<string, number>();
  for (const row of trustRows ?? []) {
    trustByUser.set(row.user_id, row.trust_score);
  }

  // Score and explain each profile
  const matches = profiles
    .map((profile) => {
      const profileSkillNames = skillsByUser.get(profile.id) ?? [];
      const trustScore = trustByUser.get(profile.id) ?? 0.5;

      const score = finalScore(projectSkills, {
        skills: profileSkillNames,
        rating: trustScore,
        availability: profile.availability ?? 'Flexible',
      });

      const explanation = explainMatch(projectSkills, profileSkillNames);

      return { profile, score, explanation };
    })
    .filter((r) => r.score.total > 0)
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, 20)
    .map((r) => ({
      profile: {
        id: r.profile.id,
        name: r.profile.name,
        username: r.profile.username,
        avatar: r.profile.avatar,
        avatar_color: r.profile.avatar_color,
        university: r.profile.university,
        major: r.profile.major,
        year: r.profile.year,
        availability: r.profile.availability,
      },
      score: {
        total: r.score.total,
        base: r.score.base,
        penaltyActive: r.score.penaltyActive,
        breakdown: r.score.breakdown,
      },
      explanation: {
        matched: r.explanation.matched,
        missing: r.explanation.missing,
      },
    }));

  return NextResponse.json({ matches });
}
