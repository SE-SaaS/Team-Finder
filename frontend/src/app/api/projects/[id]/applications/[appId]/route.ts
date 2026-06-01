import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/serverAuth';
import { createClient } from '@/lib/supabaseServer';
import { logger } from '@/lib/logger';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; appId: string } }
) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: projectId, appId } = params;
  const supabase = createClient();

  const { data: ownership } = await supabase
    .from('project_members')
    .select('user_id')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .eq('role', 'owner')
    .maybeSingle();
  if (!ownership) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data: application, error: fetchErr } = await supabase
    .from('project_applications')
    .select('id, applicant_id, status')
    .eq('id', appId)
    .eq('project_id', projectId)
    .maybeSingle();
  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 400 });
  if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const action: string = body?.action;
  if (action !== 'accept' && action !== 'reject') {
    return NextResponse.json({ error: 'action must be accept or reject' }, { status: 400 });
  }

  if (action === 'accept') {
    const { error: updateErr } = await supabase
      .from('project_applications')
      .update({ status: 'accepted' })
      .eq('id', appId);
    if (updateErr) {
      logger.error('[API /applications accept] update failed', updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 400 });
    }

    const { error: memberErr } = await supabase
      .from('project_members')
      .insert({ project_id: projectId, user_id: application.applicant_id, role: 'member' });
    if (memberErr) {
      logger.error('[API /applications accept] member insert failed', memberErr);
      return NextResponse.json({ error: memberErr.message }, { status: 400 });
    }

    await supabase.from('notifications').insert({
      user_id: application.applicant_id,
      type: 'application_accepted',
      title: 'Application accepted',
      message: 'Your application was accepted',
      data: { project_id: projectId },
    });
  } else {
    const { error: updateErr } = await supabase
      .from('project_applications')
      .update({ status: 'rejected' })
      .eq('id', appId);
    if (updateErr) {
      logger.error('[API /applications reject] update failed', updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 400 });
    }

    await supabase.from('notifications').insert({
      user_id: application.applicant_id,
      type: 'application_rejected',
      title: 'Application rejected',
      message: 'Your application was not accepted this time',
      data: { project_id: projectId },
    });
  }

  return NextResponse.json({ success: true, action });
}
