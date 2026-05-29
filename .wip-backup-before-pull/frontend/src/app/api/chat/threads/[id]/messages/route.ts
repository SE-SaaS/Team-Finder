import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/serverAuth';
import { createClient } from '@/lib/supabaseServer';
import { logger } from '@/lib/logger';

/**
 * POST /api/chat/threads/[id]/messages
 * Body: { body: string }
 *
 * RLS already enforces that only participants can insert.
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const text = typeof body?.body === 'string' ? body.body.trim() : '';
  if (text.length < 1 || text.length > 5000) {
    return NextResponse.json({ error: 'Message must be 1–5000 characters' }, { status: 400 });
  }

  const supabase = createClient();

  // Load thread to find the recipient
  const { data: thread, error: thErr } = await supabase
    .from('chat_threads')
    .select('id, user_a_id, user_b_id')
    .eq('id', params.id)
    .maybeSingle();
  if (thErr) return NextResponse.json({ error: thErr.message }, { status: 400 });
  if (!thread) return NextResponse.json({ error: 'Thread not found' }, { status: 404 });

  const { data: inserted, error: insErr } = await supabase
    .from('chat_messages')
    .insert({ thread_id: thread.id, sender_id: user.id, body: text })
    .select('id, created_at')
    .single();
  if (insErr || !inserted) {
    logger.error('[API send message]', insErr);
    return NextResponse.json({ error: insErr?.message ?? 'Insert failed' }, { status: 400 });
  }

  // Ensure the sender has participant state for mute/read tracking.
  await supabase
    .from('chat_participant_state')
    .upsert(
      { thread_id: thread.id, user_id: user.id },
      { onConflict: 'thread_id,user_id', ignoreDuplicates: true }
    );

  // Mark the sender as having read up to this moment (they obviously have)
  await supabase
    .from('chat_participant_state')
    .update({ last_read_at: inserted.created_at })
    .eq('thread_id', thread.id)
    .eq('user_id', user.id);

  return NextResponse.json({ id: inserted.id, created_at: inserted.created_at });
}
