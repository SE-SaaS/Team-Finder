import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/serverAuth';
import { createClient } from '@/lib/supabaseServer';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const answerId =
    body.answer_id === null
      ? null
      : typeof body.answer_id === 'string'
      ? body.answer_id
      : undefined;
  if (answerId === undefined) {
    return NextResponse.json({ error: 'answer_id must be a string or null' }, { status: 400 });
  }

  const supabase = createClient();

  const { data: q, error: qErr } = await supabase
    .from('qna_questions')
    .select('id, author_id')
    .eq('id', params.id)
    .maybeSingle();
  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 400 });
  if (!q) return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  if (q.author_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  if (answerId !== null) {
    const { data: a, error: aErr } = await supabase
      .from('qna_answers')
      .select('id')
      .eq('id', answerId)
      .eq('question_id', params.id)
      .maybeSingle();
    if (aErr) return NextResponse.json({ error: aErr.message }, { status: 400 });
    if (!a) return NextResponse.json({ error: 'Answer not found on this question' }, { status: 404 });
  }

  const { error } = await supabase
    .from('qna_questions')
    .update({ accepted_answer_id: answerId })
    .eq('id', params.id);

  if (error) {
    logger.error('[API /qna/questions/[id]/accept POST]', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ accepted: answerId !== null });
}
