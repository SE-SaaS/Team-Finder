import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/serverAuth';
import { createClient } from '@/lib/supabaseServer';
import { logger } from '@/lib/logger';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const projectId = params.id;
  const supabase = createClient();

  const { data: project, error: projectErr } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .maybeSingle();
  if (projectErr) return NextResponse.json({ error: projectErr.message }, { status: 400 });
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  const { data: membership } = await supabase
    .from('project_members')
    .select('id')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .maybeSingle();
  if (membership) return NextResponse.json({ error: 'already a member' }, { status: 400 });

  const { data: existing } = await supabase
    .from('project_applications')
    .select('id')
    .eq('project_id', projectId)
    .eq('applicant_id', user.id)
    .eq('status', 'pending')
    .maybeSingle();
  if (existing) return NextResponse.json({ error: 'application already pending' }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const message = typeof body?.message === 'string' ? body.message.trim() || null : null;

  const { data: application, error: appErr } = await supabase
    .from('project_applications')
    .insert({ project_id: projectId, applicant_id: user.id, message, status: 'pending' })
    .select('id')
    .single();
  if (appErr || !application) {
    logger.error('[API /projects/apply] insert failed', appErr);
    return NextResponse.json({ error: appErr?.message ?? 'Insert failed' }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, username')
    .eq('id', user.id)
    .maybeSingle();
  const displayName = profile?.name ?? profile?.username ?? 'Someone';

  const { data: owner } = await supabase
    .from('project_members')
    .select('user_id')
    .eq('project_id', projectId)
    .eq('role', 'owner')
    .maybeSingle();

  if (owner) {
    await supabase.from('notifications').insert({
      user_id: owner.user_id,
      type: 'application_received',
      title: 'New application',
      message: `${displayName} applied to join your project`,
      data: { project_id: projectId, application_id: application.id, applicant_id: user.id },
    });
  }

  return NextResponse.json({ success: true });
}
