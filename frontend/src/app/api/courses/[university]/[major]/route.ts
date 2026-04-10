import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { logger } from '@/lib/logger';

/**
 * ISR Configuration: Cache courses for 24 hours
 * This makes the API instant for all users while keeping data fresh
 */
export const revalidate = 86400; // 24 hours

/**
 * GET /api/courses/[university]/[major]
 * Returns all courses for a specific university and major
 *
 * @example GET /api/courses/JU/CS
 * @example GET /api/courses/HU/AI
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { university: string; major: string } }
) {
  const { university, major } = params;

  // Validate parameters
  if (!university || !major) {
    return NextResponse.json(
      { error: 'University and major are required' },
      { status: 400 }
    );
  }

  try {
    const supabase = createClient();

    // Convert full university names to codes
    const universityMap: Record<string, string> = {
      'University of Jordan': 'JU',
      'Hashemite University': 'HU',
      'JU': 'JU',
      'HU': 'HU',
    };

    const universityCode = universityMap[university] || university.toUpperCase();

    // Fetch all courses for this university + major
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('university', universityCode)
      .eq('major', major.toUpperCase())
      .order('year', { ascending: true })
      .order('semester', { ascending: true })
      .order('code', { ascending: true });

    if (error) {
      logger.error('Supabase error fetching courses:', error);
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      );
    }

    // Return with aggressive caching headers
    return NextResponse.json(courses, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        // public: CDN can cache this
        // s-maxage=86400: Fresh for 24 hours
        // stale-while-revalidate=604800: Serve stale for 7 days while revalidating
      },
    });
  } catch (error) {
    logger.error('Error in courses API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
