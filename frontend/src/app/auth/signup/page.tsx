'use client';

import { useState } from 'react';
import { getUniversityFromEmail, isValidUniversityEmail } from '@/data/universities';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SignupPage() {
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [detectedUniversity, setDetectedUniversity] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (email: string) => {
    setEmail(email);

    if (!email || !email.includes('@')) {
      setDetectedUniversity(null);
      setError('');
      return;
    }

    const university = getUniversityFromEmail(email);
    if (!university) {
      setError('Only @ju.edu.jo or @hu.edu.jo emails are accepted');
      setDetectedUniversity(null);
      return;
    }

    setDetectedUniversity(university);
    setError('');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidUniversityEmail(email)) {
      setError('Invalid university email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            university: getUniversityFromEmail(email),
            verification_method: 'email_domain',
            enrollment_confirmed: false,
          }
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Verification Screen
  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#08080e] to-[#0f0f18] flex items-center justify-center px-4">
        {/* Starfield Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="stars stars-blue"></div>
          <div className="stars stars-red"></div>
        </div>

        {/* Verification Message */}
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-[#16161f]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-[#4455ff]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#4455ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-white mb-3">Check your email</h1>
              <p className="text-white/70 mb-2">
                We've sent a verification link to
              </p>
              <p className="text-[#4455ff] font-medium mb-6">
                {email}
              </p>
              <p className="text-white/50 text-sm mb-8">
                Click the link in the email to verify your account and complete signup.
              </p>

              <div className="bg-[#4455ff]/10 border border-[#4455ff]/30 rounded-lg p-4 mb-6">
                <p className="text-white/60 text-xs">
                  💡 <strong>Tip:</strong> Check your spam folder if you don't see the email within a few minutes
                </p>
              </div>

              <Link
                href="/auth/login"
                className="inline-block w-full bg-[#4455ff] hover:bg-[#3344ee] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105"
              >
                Go to Login
              </Link>

              <div className="mt-6">
                <Link href="/" className="text-white/40 hover:text-white/60 text-sm transition-colors">
                  ← Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Signup Form
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08080e] to-[#0f0f18] flex items-center justify-center px-4">
      {/* Starfield Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars stars-blue"></div>
        <div className="stars stars-red"></div>
      </div>

      {/* Signup Form */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#16161f]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-2 text-center">Join TeamFinder</h1>
          <p className="text-white/60 text-center mb-8">Use your university email to get started</p>

          {error && (
            <div className="bg-[#e8294a]/10 border border-[#e8294a]/50 text-[#e8294a] px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                University Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#08080e] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#4455ff] transition-colors"
                placeholder="student@ju.edu.jo or student@hu.edu.jo"
              />
              {detectedUniversity && (
                <p className="mt-2 text-sm text-[#4ade80] flex items-center gap-1">
                  <span>✓</span> {detectedUniversity} detected
                </p>
              )}
              {!detectedUniversity && email && email.includes('@') && (
                <p className="mt-2 text-xs text-white/40">
                  Accepted domains: @ju.edu.jo, @hu.edu.jo
                </p>
              )}
            </div>

            {/* University Field (Read-only) */}
            {detectedUniversity && (
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-white/70 mb-2">
                  University
                </label>
                <input
                  id="university"
                  type="text"
                  value={detectedUniversity}
                  disabled
                  className="w-full px-4 py-3 bg-[#08080e]/50 border border-white/10 rounded-lg text-white/50 cursor-not-allowed"
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-[#08080e] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#4455ff] transition-colors"
                placeholder="At least 6 characters"
              />
              <p className="mt-1 text-xs text-white/40">
                Minimum 6 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !detectedUniversity || !password}
              className={`
                w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200
                ${
                  detectedUniversity && password
                    ? 'bg-[#4455ff] hover:bg-[#3344ee] text-white hover:scale-105'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }
              `}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#4455ff] hover:text-[#3344ee] font-semibold">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
