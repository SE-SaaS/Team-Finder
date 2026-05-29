import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { getUniversityFromEmail } from '@/data/universities';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const { email, password, fullName } = await req.json();

  const supabase = createClient();

  // Per-IP rate limit (5 / 15 min) enforced in the DB via SECURITY DEFINER fn.
  const ip =
    (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '';
  const { data: allowed, error: rlError } = await supabase.rpc(
    'check_signup_rate_limit',
    { p_ip: ip }
  );
  if (rlError) {
    logger.error('[signup] rate-limit check failed', rlError);
    // fail open: do not block legitimate signups if the limiter errors
  } else if (allowed === false) {
    return NextResponse.json(
      { error: 'Too many signup attempts. Please try again in a few minutes.' },
      { status: 429 }
    );
  }

  const university = getUniversityFromEmail(email);
  if (!university) {
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

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    'http://localhost:3002';

  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_APP_URL) {
    logger.error('[signup] NEXT_PUBLIC_APP_URL is not set in production — confirmation emails will be broken');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
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
