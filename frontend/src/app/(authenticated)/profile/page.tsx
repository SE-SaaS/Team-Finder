'use client';

import Link from 'next/link';
import { useAuthenticatedUser } from '@/contexts/AuthenticatedUserContext';
import ProfileWizardController from '@/components/profile/ProfileWizardController';

export default function ProfilePage() {
  useAuthenticatedUser();

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars stars-blue" />
        <div className="stars stars-red" />
      </div>

      <header className="border-b border-gray-800 bg-black/60 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <span className="text-xs uppercase tracking-wider text-gray-500">Profile</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 relative z-10">
        <div className="bg-[#111] border border-gray-800 rounded-xl p-6 min-h-[420px]">
          <ProfileWizardController />
        </div>
      </main>
    </div>
  );
}
