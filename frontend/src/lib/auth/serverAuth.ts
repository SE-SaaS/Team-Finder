import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';

/**
 * Get authenticated user from request cookies
 * @param req - Next.js request object
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
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
