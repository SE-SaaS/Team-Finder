import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/serverAuth';
import { createClient } from '@/lib/supabaseServer';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const text = typeof body.body === 'string' ? body.body.trim() : '';
  const tags = Array.isArray(body.tags)
    ? body.tags
        .filter((t: unknown): t is string => typeof t === 'string')
        .map((t: string) => t.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 5)
    : [];

  if (title.length < 5 || title.length > 200) {
    return NextResponse.json({ error: 'Title must be 5–200 characters' }, { status: 400 });
  }
  if (text.length < 10 || text.length > 10000) {
    return NextResponse.json({ error: 'Body must be 10–10000 characters' }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('qna_questions')
    .insert({ author_id: user.id, title, body: text, tags })
    .select('id')
    .single();

  if (error) {
    logger.error('[API /qna/questions POST]', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.id });
}
