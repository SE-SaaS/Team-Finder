import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';

/**
 * Get authenticated user from API route request
 * @param req - Next.js request object with cookies
 * @returns User object or null if not authenticated
 */
export async function getUserFromRequest(req: NextRequest): Promise<User | null> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Can't set cookies in API routes, but we can read them
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('[serverAuth] Cookies from request:', req.cookies.getAll().map(c => c.name));
  console.log('[serverAuth] User from session:', user ? user.email : 'NULL');

  return user;
}
