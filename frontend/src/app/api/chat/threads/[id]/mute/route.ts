import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/serverAuth';
import { createClient } from '@/lib/supabaseServer';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createClient();

  const { data: existing, error: selErr } = await supabase
    .from('chat_participant_state')
    .select('muted')
    .eq('thread_id', params.id)
    .eq('user_id', user.id)
    .maybeSingle();
  if (selErr) {
    logger.error('[API toggle mute select]', selErr);
    return NextResponse.json({ error: selErr.message }, { status: 400 });
  }

  const next = !(existing?.muted ?? false);

  const { error: upErr } = await supabase
    .from('chat_participant_state')
    .upsert(
      { thread_id: params.id, user_id: user.id, muted: next },
      { onConflict: 'thread_id,user_id' }
    );

  if (upErr) {
    logger.error('[API toggle mute upsert]', upErr);
    return NextResponse.json({ error: upErr.message }, { status: 400 });
  }

  return NextResponse.json({ muted: next });
}
