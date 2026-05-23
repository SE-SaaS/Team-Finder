import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/serverAuth';
import { createClient } from '@/lib/supabaseServer';
import { logger } from '@/lib/logger';

/**
 * POST /api/profile/complete
 * Single-call write path for the profile wizard: profile fields, user_skills,
 * user_courses, and skills auto-unlocked by completed courses.
 *
 * Skill-unlock rule: a course X grants its unlocks_skills to the user only when
 * every entry in X.prerequisite_ids is also present in the user's selected
 * courses. The user can still mark X completed without prerequisites; they
 * just don't earn the skill credit until the prerequisites are also checked.
 *
 * SECURITY:
 *   - university comes from user.user_metadata.university, never from body
 *   - email/name/username are not modified here (handled at signup)
 *   - all writes are scoped by user_id; RLS is the secondary guard
 *
 * NOT YET ATOMIC: Supabase JS does not expose multi-statement transactions
 * via the standard client. Sequential writes in this order:
 *   1. profile upsert (idempotent)
 *   2. user_skills replace
 *   3. user_courses replace
 * For true atomicity, promote to a Postgres RPC function.
 */

const ALLOWED_SEMESTERS = [1, 2] as const;
const ALLOWED_AVAILABILITY = ['Full-time', 'Flexible', 'Evenings', 'Weekends'] as const;
type AvailabilityValue = typeof ALLOWED_AVAILABILITY[number];
const MAX_SKILLS = 50;
const MAX_COURSES = 100;
const DEFAULT_PROFICIENCY = 'intermediate' as const;

interface CompletePayload {
  major:           string;
  year:            number;
  semester:        number;
  availability:    AvailabilityValue;
  specialization:  string | null;
  bio:             string | null;
  avatar:          string | null;
  avatarColor:     string | null;
  skills:          string[];
  courses:         Array<{ code: string; name: string }>;
}

interface ValidationError {
  field:   string;
  message: string;
}

function parseYear(input: unknown): number | null {
  if (input === null || input === undefined) return null;
  if (typeof input === 'number') return Math.trunc(input);
  if (typeof input === 'string') {
    const digits = input.replace(/\D/g, '');
    if (!digits) return null;
    return parseInt(digits, 10);
  }
  return null;
}

function validatePayload(body: unknown): { ok: true; data: CompletePayload } | { ok: false; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  if (typeof body !== 'object' || body === null) {
    return { ok: false, errors: [{ field: '_root', message: 'Body must be an object' }] };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.major !== 'string' || !b.major.trim()) {
    errors.push({ field: 'major', message: 'Major is required' });
  }

  const year = parseYear(b.year);
  if (year === null || year < 1 || year > 4) {
    errors.push({ field: 'year', message: 'Year must be between 1 and 4' });
  }

  const semester = typeof b.semester === 'number' ? b.semester : parseInt(String(b.semester), 10);
  if (!ALLOWED_SEMESTERS.includes(semester as 1 | 2)) {
    errors.push({ field: 'semester', message: 'Semester must be 1 or 2' });
  }

  const availabilityRaw = typeof b.availability === 'string' ? b.availability.trim() : '';
  const availability = availabilityRaw as AvailabilityValue;
  if (!ALLOWED_AVAILABILITY.includes(availability)) {
    errors.push({ field: 'availability', message: `Availability must be one of: ${ALLOWED_AVAILABILITY.join(', ')}` });
  }

  const skills = Array.isArray(b.skills) ? b.skills : [];
  if (skills.length > MAX_SKILLS) {
    errors.push({ field: 'skills', message: `Maximum ${MAX_SKILLS} skills allowed` });
  }
  if (skills.some(s => typeof s !== 'string')) {
    errors.push({ field: 'skills', message: 'Skills must be an array of strings' });
  }

  const courses = Array.isArray(b.courses) ? b.courses : [];
  if (courses.length > MAX_COURSES) {
    errors.push({ field: 'courses', message: `Maximum ${MAX_COURSES} courses allowed` });
  }
  for (const c of courses) {
    if (typeof c !== 'object' || c === null
        || typeof (c as { code?: unknown }).code !== 'string'
        || typeof (c as { name?: unknown }).name !== 'string') {
      errors.push({ field: 'courses', message: 'Each course must have a code and name (string)' });
      break;
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      major:          String(b.major).trim(),
      year:           year!,
      semester:       semester as 1 | 2,
      availability,
      specialization: typeof b.specialization === 'string'
                        && b.specialization.trim()
                        && b.specialization !== '__unknown__'
                        ? b.specialization.trim()
                        : null,
      bio:            typeof b.bio === 'string' ? b.bio.slice(0, 2000) : null,
      avatar:         typeof b.avatar === 'string' ? b.avatar : null,
      avatarColor:    typeof b.avatarColor === 'string' ? b.avatarColor : null,
      skills:         (skills as string[]).map(s => s.trim()).filter(Boolean),
      courses:        (courses as Array<{ code: string; name: string }>)
                        .map(c => ({ code: c.code.trim(), name: c.name.trim() }))
                        .filter(c => c.code && c.name),
    },
  };
}

/**
 * For each completed course, only grant its unlocks_skills when every
 * entry in its prerequisite_ids is also among the completed courses.
 * Returns the deduplicated skill name array.
 */
function computeUnlockedSkills(
  selectedRows: Array<{ id: string; prerequisite_ids: string[] | null; unlocks_skills: string[] | null }>
): string[] {
  const completedIds = new Set(selectedRows.map(r => r.id));
  const unlocked = new Set<string>();

  for (const row of selectedRows) {
    const prereqs = Array.isArray(row.prerequisite_ids) ? row.prerequisite_ids : [];
    const skills  = Array.isArray(row.unlocks_skills)   ? row.unlocks_skills   : [];

    const prereqsSatisfied = prereqs.every(p => completedIds.has(p));
    if (!prereqsSatisfied) continue;

    for (const s of skills) {
      if (typeof s === 'string' && s.trim()) unlocked.add(s.trim());
    }
  }

  return Array.from(unlocked);
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const university = user.user_metadata?.university;
  if (!university) {
    return NextResponse.json({ error: 'Unverified university email' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = validatePayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.errors }, { status: 400 });
  }
  const data = parsed.data;

  const supabase = createClient();

  // 1) Profile upsert. university is forced from auth metadata.
  const profileError = await supabase
    .from('profiles')
    .upsert({
      id:                  user.id,
      email:               user.email,
      university,
      verification_method: 'email_domain',
      major:               data.major,
      specialization:      data.specialization,
      year:                data.year,
      semester:            data.semester,
      availability:        data.availability,
      bio:                 data.bio,
      avatar:              data.avatar,
      avatar_color:        data.avatarColor,
      updated_at:          new Date().toISOString(),
    })
    .then(r => r.error);

  if (profileError) {
    logger.error('[profile/complete] profile upsert failed:', profileError);
    return NextResponse.json({ error: profileError.message, stage: 'profile' }, { status: 400 });
  }

  // 2) Compute skills auto-unlocked by selected courses, gated on prerequisites.
  let unlockedSkills: string[] = [];
  if (data.courses.length > 0) {
    const courseCodes = data.courses.map(c => c.code);
    const { data: courseRows, error: courseLookupError } = await supabase
      .from('courses')
      .select('id, code, prerequisite_ids, unlocks_skills')
      .in('code', courseCodes);

    if (courseLookupError) {
      logger.warn('[profile/complete] course lookup failed (continuing without unlocks):', courseLookupError);
    } else if (courseRows && courseRows.length > 0) {
      unlockedSkills = computeUnlockedSkills(
        courseRows as Array<{ id: string; prerequisite_ids: string[] | null; unlocks_skills: string[] | null }>
      );
    }
  }

  const mergedSkills = Array.from(new Set([...data.skills, ...unlockedSkills]));

  // 3) Replace user_skills
  const delSkillsError = await supabase
    .from('user_skills')
    .delete()
    .eq('user_id', user.id)
    .then(r => r.error);

  if (delSkillsError) {
    logger.error('[profile/complete] user_skills delete failed:', delSkillsError);
    return NextResponse.json({ error: delSkillsError.message, stage: 'skills_delete' }, { status: 400 });
  }

  if (mergedSkills.length > 0) {
    const skillRows = mergedSkills.map(skill => ({
      user_id:     user.id,
      skill_name:  skill,
      proficiency: DEFAULT_PROFICIENCY,
    }));
    const insSkillsError = await supabase
      .from('user_skills')
      .insert(skillRows)
      .then(r => r.error);

    if (insSkillsError) {
      logger.error('[profile/complete] user_skills insert failed:', insSkillsError);
      return NextResponse.json({ error: insSkillsError.message, stage: 'skills_insert' }, { status: 400 });
    }
  }

  // 4) Replace user_courses (existing schema: course_code + course_name)
  const delCoursesError = await supabase
    .from('user_courses')
    .delete()
    .eq('user_id', user.id)
    .then(r => r.error);

  if (delCoursesError) {
    logger.error('[profile/complete] user_courses delete failed:', delCoursesError);
    return NextResponse.json({ error: delCoursesError.message, stage: 'courses_delete' }, { status: 400 });
  }

  if (data.courses.length > 0) {
    const courseRows = data.courses.map(c => ({
      user_id:     user.id,
      course_code: c.code,
      course_name: c.name,
      status:      'completed' as const,
    }));
    const insCoursesError = await supabase
      .from('user_courses')
      .insert(courseRows)
      .then(r => r.error);

    if (insCoursesError) {
      logger.error('[profile/complete] user_courses insert failed:', insCoursesError);
      return NextResponse.json({ error: insCoursesError.message, stage: 'courses_insert' }, { status: 400 });
    }
  }

  return NextResponse.json({
    success:        true,
    skills_total:   mergedSkills.length,
    skills_user:    data.skills.length,
    skills_unlocked: unlockedSkills.length,
    courses_total:  data.courses.length,
  });
}
