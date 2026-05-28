'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthenticatedUser } from '@/contexts/AuthenticatedUserContext';
import { supabase } from '@/lib/supabase';
import { isProfileComplete as checkProfileComplete } from '@/lib/validation/profileValidation';
import { logger } from '@/lib/logger';

const DISMISSED_KEY = 'profile_banner_dismissed';

export default function ProfileCompletionBanner() {
  const { user } = useAuthenticatedUser();
  const [isIncomplete, setIsIncomplete] = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [dismissed,  setDismissed]  = useState(false);

  useEffect(() => {
    // Restore dismiss state for this session
    if (sessionStorage.getItem(DISMISSED_KEY) === '1') {
      setDismissed(true);
    }
  }, []);

  useEffect(() => {
    async function check() {
      try {
        const { data: profile } = await supabase
          .from('profiles').select('major, year, semester').eq('id', user.id).maybeSingle();
        const { count: skillsCount } = await supabase
          .from('user_skills').select('*', { count: 'exact', head: true }).eq('user_id', user.id);

        setIsIncomplete(!checkProfileComplete({
          major: profile?.major,
          year: profile?.year,
          skillsCount: skillsCount ?? 0,
        }));
      } catch (e) {
        logger.error('Error checking profile completion:', e);
        setIsIncomplete(true);
      } finally {
        setLoading(false);
      }
    }
    check();
  }, [user]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    sessionStorage.setItem(DISMISSED_KEY, '1');
  };

  if (loading || !isIncomplete || dismissed) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="relative bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white rounded-lg shadow-2xl border border-red-400/20">

        <Link href="/profile" className="block px-6 py-4 hover:opacity-90 transition-opacity">
          <div className="flex items-start gap-3 pr-4">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">Complete Your Profile</h3>
              <p className="text-xs text-white/85">
                Finish your profile to unlock all features and start matching with teams!
              </p>
              <div className="mt-2 text-xs font-semibold text-white/75 flex items-center gap-1">
                <span>Complete now</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Dismiss button — after Link in DOM so it stacks on top */}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/30 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
