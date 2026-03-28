'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function ProfileCompletionBanner() {
  const { user } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkProfileCompletion() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check if profile exists and has required fields
        const { data: profile } = await supabase
          .from('profiles')
          .select('major, year, semester')
          .eq('id', user.id)
          .single();

        // Check if user has completed courses
        const { count: coursesCount } = await supabase
          .from('user_courses')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Check if user has skills
        const { count: skillsCount } = await supabase
          .from('user_skills')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Profile is complete if they have major, year, at least 1 course, and at least 3 skills
        const isComplete = !!(
          profile?.major &&
          profile?.year &&
          (coursesCount ?? 0) > 0 &&
          (skillsCount ?? 0) >= 3
        );

        console.log('Profile completion check:', {
          major: profile?.major,
          year: profile?.year,
          coursesCount,
          skillsCount,
          isComplete
        });

        setIsProfileComplete(isComplete);
      } catch (error) {
        console.error('Error checking profile completion:', error);
        setIsProfileComplete(false);
      } finally {
        setLoading(false);
      }
    }

    checkProfileCompletion();
  }, [user]);

  if (loading || isProfileComplete) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Link href="/profile">
        <div className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white px-6 py-4 rounded-lg shadow-2xl border border-red-400/20 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">Complete Your Profile</h3>
              <p className="text-xs text-white/90">
                Finish your profile to unlock all features and start matching with teams!
              </p>
              <div className="mt-2 text-xs font-semibold text-white/80 flex items-center gap-1">
                <span>Complete now</span>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
