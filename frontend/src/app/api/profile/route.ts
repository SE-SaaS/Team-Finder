import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/serverAuth';
import { createClient } from '@/lib/supabaseServer';

/**
 * POST /api/profile
 * Create or update user profile
 *
 * SECURITY: University is ALWAYS taken from user.user_metadata.university
 * Request body university field is IGNORED completely
 */
export async function POST(req: NextRequest) {
  // Get authenticated user
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // CRITICAL: University MUST come from auth metadata, never from request
  const university = user.user_metadata?.university;
  if (!university) {
    return NextResponse.json(
      { error: 'Unverified university email' },
      { status: 403 }
    );
  }

  // Parse request body
  const body = await req.json();

  // Initialize server-side Supabase client
  const supabase = createClient();

  // Upsert profile with university from metadata (IGNORING request body)
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email,
      university, // Always from user_metadata, NEVER from request body
      verification_method: 'email_domain',
      major: body.major,
      specialization: body.specialization,
      year: body.year,
      availability: body.availability,
      bio: body.bio,
      avatar: body.avatar,
      avatar_color: body.avatarColor,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

/**
 * GET /api/profile
 * Get current user's profile
 */
export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
