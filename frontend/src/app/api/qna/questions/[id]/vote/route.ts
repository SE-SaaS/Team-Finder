import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/serverAuth';
import { createClient } from '@/lib/supabaseServer';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createClient();

  const { data: existing, error: selErr } = await supabase
    .from('qna_question_votes')
    .select('user_id')
    .eq('question_id', params.id)
    .eq('user_id', user.id)
    .maybeSingle();
  if (selErr) {
    logger.error('[API /qna/questions/[id]/vote select]', selErr);
    return NextResponse.json({ error: selErr.message }, { status: 400 });
  }

  if (existing) {
    const { error } = await supabase
      .from('qna_question_votes')
      .delete()
      .eq('question_id', params.id)
      .eq('user_id', user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ voted: false });
  }

  const { error } = await supabase
    .from('qna_question_votes')
    .insert({ question_id: params.id, user_id: user.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ voted: true });
}
