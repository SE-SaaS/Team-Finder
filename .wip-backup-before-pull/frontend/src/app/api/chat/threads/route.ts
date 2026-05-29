import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/serverAuth';
import { createClient } from '@/lib/supabaseServer';
import { logger } from '@/lib/logger';

/**
 * POST /api/chat/threads
 * Body: { other_user_id: string }
 * Returns: { id: string } — id of the existing-or-newly-created thread
 *
 * Canonical ordering: user_a_id < user_b_id (lexicographic UUID compare)
 * ensures one thread per pair regardless of who initiates.
 */
export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const other = body?.other_user_id;
  if (typeof other !== 'string' || !other) {
    return NextResponse.json({ error: 'other_user_id is required' }, { status: 400 });
  }
  if (other === user.id) {
    return NextResponse.json({ error: 'Cannot DM yourself' }, { status: 400 });
  }

  const supabase = createClient();

  // Confirm the other user actually exists
  const { data: otherProfile, error: profErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', other)
    .maybeSingle();
  if (profErr) return NextResponse.json({ error: profErr.message }, { status: 400 });
  if (!otherProfile) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const [a, b] = user.id < other ? [user.id, other] : [other, user.id];

  // Look up or create the thread
  const { data: existing, error: selErr } = await supabase
    .from('chat_threads')
    .select('id')
    .eq('user_a_id', a)
    .eq('user_b_id', b)
    .maybeSingle();
  if (selErr) {
    logger.error('[API /chat/threads select]', selErr);
    return NextResponse.json({ error: selErr.message }, { status: 400 });
  }

  let threadId: string;
  if (existing) {
    threadId = existing.id;
  } else {
    const { data: created, error: insErr } = await supabase
      .from('chat_threads')
      .insert({ user_a_id: a, user_b_id: b })
      .select('id')
      .single();
    if (insErr || !created) {
      logger.error('[API /chat/threads insert]', insErr);
      return NextResponse.json({ error: insErr?.message ?? 'Insert failed' }, { status: 400 });
    }
    threadId = created.id;
  }

  // Ensure participant_state row exists for the caller. The other user's row is
  // created on demand the first time they hit /api/chat/threads or open it.
  await supabase
    .from('chat_participant_state')
    .upsert(
      { thread_id: threadId, user_id: user.id },
      { onConflict: 'thread_id,user_id', ignoreDuplicates: true }
    );

  return NextResponse.json({ id: threadId });
}
