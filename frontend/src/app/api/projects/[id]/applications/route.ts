import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/serverAuth';
import { createClient } from '@/lib/supabaseServer';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const projectId = params.id;
  const supabase = createClient();

  const { data: ownership } = await supabase
    .from('project_members')
    .select('user_id')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .eq('role', 'owner')
    .maybeSingle();
  if (!ownership) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data, error } = await supabase
    .from('project_applications')
    .select(`
      id,
      message,
      applied_at,
      profiles (
        id, name, username, avatar, avatar_color, major, year
      )
    `)
    .eq('project_id', projectId)
    .eq('status', 'pending')
    .order('applied_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const applications = (data ?? []).map((row: any) => ({
    id: row.id,
    message: row.message,
    applied_at: row.applied_at,
    applicant: row.profiles,
  }));

  return NextResponse.json({ applications });
}
