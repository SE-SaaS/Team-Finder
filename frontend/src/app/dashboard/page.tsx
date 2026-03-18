'use client';

/**
 * Dashboard Page - Main Application
 * Team matching, project browsing, and profile management
 */

import { useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'browse' | 'projects' | 'profile'>('browse');

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#08080e] to-[#0f0f18] relative overflow-hidden">
      {/* Starfield Background */}
      <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
        <div className="stars stars-blue"></div>
        <div className="stars stars-red"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/75 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white">
            TeamFinder
          </Link>

          {/* Profile Avatar */}
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-sm text-white/70 hover:text-white transition-all"
            >
              Edit Profile
            </Link>
            <div className="w-10 h-10 rounded-full bg-[#4455ff] flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-all">
              AH
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold text-white mb-4">
              Welcome to TeamFinder! 🚀
            </h1>
            <p className="text-xl text-white/60">
              Your profile is complete. Start matching with teams!
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('browse')}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all
                ${
                  activeTab === 'browse'
                    ? 'bg-[#4455ff] text-white shadow-[0_0_20px_rgba(68,85,255,0.4)]'
                    : 'bg-[#16161f] text-white/60 hover:text-white'
                }
              `}
            >
              Browse Students
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all
                ${
                  activeTab === 'projects'
                    ? 'bg-[#4455ff] text-white shadow-[0_0_20px_rgba(68,85,255,0.4)]'
                    : 'bg-[#16161f] text-white/60 hover:text-white'
                }
              `}
            >
              Active Projects
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all
                ${
                  activeTab === 'profile'
                    ? 'bg-[#4455ff] text-white shadow-[0_0_20px_rgba(68,85,255,0.4)]'
                    : 'bg-[#16161f] text-white/60 hover:text-white'
                }
              `}
            >
              Your Profile
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-[#16161f] rounded-xl p-12 border border-white/10 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {activeTab === 'browse' && 'Browse Students'}
              {activeTab === 'projects' && 'Active Projects'}
              {activeTab === 'profile' && 'Your Profile'}
            </h2>
            <p className="text-white/60 mb-6 max-w-2xl mx-auto">
              {activeTab === 'browse' &&
                'Discover talented students to collaborate with. Use the matching algorithm to find the perfect team members based on skills, ratings, and availability.'}
              {activeTab === 'projects' &&
                'Explore active projects looking for team members. Filter by tech stack, timeline, and team size to find your next big challenge.'}
              {activeTab === 'profile' &&
                'View and manage your profile. Take skill exams to boost your match score and increase your chances of joining top teams.'}
            </p>

            {/* Coming Soon Badge */}
            <div className="inline-block px-6 py-3 bg-[#4455ff]/20 border border-[#4455ff]/50 rounded-full">
              <p className="text-[#4455ff] font-semibold">
                🚧 Full dashboard implementation coming soon
              </p>
            </div>

            {/* Quick Actions */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0f0f18] rounded-lg p-6 border border-white/10">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-white font-semibold mb-2">Match Score</h3>
                <p className="text-white/50 text-sm">
                  View compatibility scores with projects
                </p>
              </div>

              <div className="bg-[#0f0f18] rounded-lg p-6 border border-white/10">
                <div className="text-3xl mb-3">📝</div>
                <h3 className="text-white font-semibold mb-2">Take Exams</h3>
                <p className="text-white/50 text-sm">
                  Verify your skills to boost your rating
                </p>
              </div>

              <div className="bg-[#0f0f18] rounded-lg p-6 border border-white/10">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="text-white font-semibold mb-2">Messages</h3>
                <p className="text-white/50 text-sm">
                  Connect with teams and project leads
                </p>
              </div>
            </div>

            {/* Back to Profile Link */}
            <div className="mt-12">
              <Link
                href="/profile"
                className="inline-block px-8 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                ← Back to Profile Setup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
