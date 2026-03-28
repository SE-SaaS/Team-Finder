'use client';

import { useState, useEffect } from 'react';
import { getUniversityFromEmail } from '@/data/universities';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [detectedUniversity, setDetectedUniversity] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ students: 0, projects: 0, matchRate: 94 });

  // Fetch real stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const [studentsRes, projectsRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('projects').select('id', { count: 'exact', head: true }),
        ]);
        setStats({
          students: studentsRes.count || 0,
          projects: projectsRes.count || 0,
          matchRate: 94,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    }
    fetchStats();
  }, []);

  const handleEmailChange = (email: string) => {
    setEmail(email);

    if (!email || !email.includes('@')) {
      setDetectedUniversity(null);
      setError('');
      return;
    }

    const university = getUniversityFromEmail(email);
    if (!university) {
      setError('Only @ju.edu.jo or @hu.edu.jo emails accepted');
      setDetectedUniversity(null);
      return;
    }

    setDetectedUniversity(university);
    setError('');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate full name
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName: fullName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account');
        return;
      }

      setStep('verify');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verification Screen
  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="stars stars-blue"></div>
          <div className="stars stars-red"></div>
        </div>

        <div className="relative z-10 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-[#dc2626]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">Check your email</h1>
          <p className="text-gray-400 mb-2">Verification link sent to</p>
          <p className="text-[#dc2626] font-medium mb-8">{email}</p>

          <Link
            href="/auth/login"
            className="inline-block w-full max-w-sm bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Signup Form
  return (
    <div className="min-h-screen bg-black flex">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars stars-blue"></div>
        <div className="stars stars-red"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-16">
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#dc2626] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">TeamFinder</span>
          </Link>
        </div>

        <div className="mb-6">
          <span className="text-[#dc2626] text-xs font-semibold tracking-widest uppercase">
            University Team Platform
          </span>
        </div>

        <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
          Find your<br />
          <span className="text-[#dc2626]">perfect</span><br />
          <span className="text-gray-400">team.</span>
        </h1>

        <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
          Match with teammates based on skills and availability.
        </p>

        <div className="flex gap-12">
          <div>
            <div className="text-4xl font-bold text-white mb-1">{stats.students}+</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">{stats.projects}+</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Projects</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">{stats.matchRate}%</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Match Rate</div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Join TeamFinder</h2>
            <p className="text-gray-400">Create your account</p>
          </div>

          <div className="flex gap-4 mb-8">
            <Link
              href="/auth/login"
              onClick={() => {
                setFullName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setError('');
                setDetectedUniversity(null);
              }}
              className="flex-1 bg-transparent border border-gray-700 text-gray-400 font-semibold py-3 rounded-lg text-center hover:border-gray-600 transition-colors"
            >
              Sign in
            </Link>
            <button className="flex-1 bg-[#dc2626] text-white font-semibold py-3 rounded-lg">
              Create account
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#dc2626] transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                University Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#dc2626] transition-colors"
                placeholder="you@ju.edu.jo or you@hu.edu.jo"
              />
              {detectedUniversity && (
                <p className="mt-2 text-sm text-green-400 flex items-center gap-1">
                  <span>✓</span> {detectedUniversity}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={16}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#dc2626] transition-colors"
                placeholder="••••••••"
              />
              <p className="mt-1.5 text-xs text-gray-600">
                8-16 chars · uppercase · number · symbol
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                maxLength={16}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#dc2626] transition-colors"
                placeholder="••••••••"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400">
                  Passwords do not match
                </p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="mt-1.5 text-xs text-green-400 flex items-center gap-1">
                  <span>✓</span> Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !detectedUniversity || !password || !confirmPassword || !fullName.trim() || password !== confirmPassword}
              className={`
                w-full font-semibold py-3.5 rounded-lg transition-all duration-200 mt-6
                ${
                  detectedUniversity && password && confirmPassword && fullName.trim() && password === confirmPassword
                    ? 'bg-[#dc2626] hover:bg-[#b91c1c] text-white'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-6">
            By signing up you agree to our{' '}
            <Link href="#" className="text-gray-500 hover:text-gray-400 underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="#" className="text-gray-500 hover:text-gray-400 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
