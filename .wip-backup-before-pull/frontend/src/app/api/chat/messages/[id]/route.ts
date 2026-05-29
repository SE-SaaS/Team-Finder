import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/serverAuth';
import { createClient } from '@/lib/supabaseServer';
import { logger } from '@/lib/logger';

/**
 * PATCH /api/chat/messages/[id]
 * Body: { body: string }
 * Edit own message. RLS limits this to sender_id = auth.uid().
 * NO delete endpoint — message history is immutable by design.
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const text = typeof body?.body === 'string' ? body.body.trim() : '';
  if (text.length < 1 || text.length > 5000) {
    return NextResponse.json({ error: 'Message must be 1–5000 characters' }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('chat_messages')
    .update({ body: text })
    .eq('id', params.id)
    .eq('sender_id', user.id)
    .select('id')
    .maybeSingle();

  if (error) {
    logger.error('[API edit message]', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Message not found or not yours' }, { status: 404 });
  }

  return NextResponse.json({ id: data.id });
}
