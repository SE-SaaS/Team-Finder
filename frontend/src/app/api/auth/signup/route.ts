import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { isValidUniversityEmail, getUniversityFromEmail } from '@/data/universities';

export async function POST(req: NextRequest) {
  const { email, password, fullName } = await req.json();

  // Server-side domain validation — cannot be bypassed from client
  if (!email || !isValidUniversityEmail(email)) {
    return NextResponse.json(
      { error: 'Only @ju.edu.jo or @hu.edu.jo emails are accepted' },
      { status: 400 }
    );
  }

  if (!password || password.length < 8 || password.length > 16) {
    return NextResponse.json(
      { error: 'Password must be 8–16 characters' },
      { status: 400 }
    );
  }

  if (!/[A-Z]/.test(password)) {
    return NextResponse.json(
      { error: 'Password must contain at least one uppercase letter' },
      { status: 400 }
    );
  }

  if (!/[0-9]/.test(password)) {
    return NextResponse.json(
      { error: 'Password must contain at least one number' },
      { status: 400 }
    );
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return NextResponse.json(
      { error: 'Password must contain at least one symbol' },
      { status: 400 }
    );
  }

  const university = getUniversityFromEmail(email);
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/auth/callback`,
      data: {
        name: fullName,
        university,
        verification_method: 'email_domain',
        enrollment_confirmed: false,
        profile_completed: false,
      },
    },
  });

  if (error) {
    console.error('Supabase signup error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
