import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Redirect to login with error
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`
      );
    }

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Create profile entry if it doesn't exist
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || 'Student',
          username: user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`,
          university: user.user_metadata?.university || 'University of Jordan',
          verification_method: 'email_domain',
        });

        if (insertError) {
          console.error('Profile creation error:', insertError);
          return NextResponse.redirect(
            `${requestUrl.origin}/auth/login?error=${encodeURIComponent('Failed to create profile')}`
          );
        }
      }
    }

    // Redirect to dashboard after successful verification
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
  }

  // No code provided, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`);
}
