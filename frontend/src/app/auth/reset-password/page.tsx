'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    // Check if we have a valid session (from password reset link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setValidToken(true);
      } else {
        setMessage({
          type: 'error',
          text: 'Invalid or expired reset link. Please request a new one.',
        });
      }
    });
  }, []);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage({ type: 'error', text: passwordError });
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setMessage({
          type: 'error',
          text: error.message,
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Password updated successfully! Redirecting to login...',
        });

        // Sign out and redirect to login after 2 seconds
        setTimeout(async () => {
          await supabase.auth.signOut();
          router.push('/auth/login');
        }, 2000);
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

  if (!validToken && !message) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-[#8b949e]">Loading...</div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-[#f0f6fc] mb-2">Create new password</h2>
          <p className="text-[#8b949e] mb-6">
            Enter your new password below.
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

          {validToken ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#c9d1d9] mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="mt-2 text-xs text-[#8b949e]">
                  At least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#c9d1d9] mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
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
                {loading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <Link
                href="/auth/forgot-password"
                className="inline-block bg-[#238636] hover:bg-[#2ea043] text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
              >
                Request new reset link
              </Link>
            </div>
          )}

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
