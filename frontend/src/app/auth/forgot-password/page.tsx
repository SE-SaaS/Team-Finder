'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate university email
    if (!email.endsWith('@ju.edu.jo') && !email.endsWith('@hu.edu.jo')) {
      setMessage({
        type: 'error',
        text: 'Please use your university email (@ju.edu.jo or @hu.edu.jo)',
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setMessage({
          type: 'error',
          text: error.message,
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Password reset link sent! Check your university email.',
        });
        setEmail('');
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#dc2626] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <h1 className="text-[#f0f6fc] text-2xl font-bold">TeamFinder</h1>
        </div>

        {/* Form Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[#f0f6fc] mb-2">Reset your password</h2>
          <p className="text-[#8b949e] mb-6">
            Enter your university email and we'll send you a password reset link.
          </p>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-[#0d4429] border-[#1f6f3e] text-[#56d364]'
                  : 'bg-[#490202] border-[#8b1c1c] text-[#ff7b72]'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#c9d1d9] mb-2">
                University Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@ju.edu.jo"
                required
                disabled={loading}
                className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#30363d] text-center">
            <Link
              href="/auth/login"
              className="text-[#58a6ff] hover:underline transition-colors"
            >
              ← Back to login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-[#8b949e]">
          <div className="flex justify-center gap-4">
            <Link href="/legal/terms" className="hover:text-[#58a6ff] transition-colors">
              Terms
            </Link>
            <Link href="/legal/privacy" className="hover:text-[#58a6ff] transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
