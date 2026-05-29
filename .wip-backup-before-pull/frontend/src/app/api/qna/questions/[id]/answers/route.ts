import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/serverAuth';
import { createClient } from '@/lib/supabaseServer';
import { logger } from '@/lib/logger';

/**
 * POST /api/qna/questions/[id]/answers
 * Body: { body: string }
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const text = typeof body.body === 'string' ? body.body.trim() : '';
  if (text.length < 5 || text.length > 10000) {
    return NextResponse.json({ error: 'Answer must be 5–10000 characters' }, { status: 400 });
  }

  const supabase = createClient();

  // Make sure the question exists before inserting (better 404 than RLS-fail)
  const { data: q, error: qErr } = await supabase
    .from('qna_questions')
    .select('id')
    .eq('id', params.id)
    .maybeSingle();
  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 400 });
  if (!q) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

  const { data, error } = await supabase
    .from('qna_answers')
    .insert({ question_id: params.id, author_id: user.id, body: text })
    .select('id')
    .single();

  if (error) {
    logger.error('[API /qna/questions/[id]/answers POST]', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.id });
}
