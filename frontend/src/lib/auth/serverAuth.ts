import { createClient } from '@/lib/supabaseServer';
import type { NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';

/**
 * Get authenticated user from request
 * @param req - Next.js request object
 * @returns User object or null if not authenticated
 */
export async function getUserFromRequest(req: NextRequest): Promise<User | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
