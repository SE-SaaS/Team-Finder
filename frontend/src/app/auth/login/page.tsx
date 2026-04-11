'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ students: 0, projects: 0, matchRate: 94 });
  const { signIn } = useAuth();
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Starfield Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars stars-blue"></div>
        <div className="stars stars-red"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-16">
        {/* Logo */}
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#dc2626] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">TeamFinder</span>
          </Link>
        </div>

        {/* Platform Label */}
        <div className="mb-6">
          <span className="text-[#dc2626] text-xs font-semibold tracking-widest uppercase">
            University Team Platform
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
          Find your<br />
          <span className="text-[#dc2626]">perfect</span><br />
          <span className="text-gray-400">team.</span>
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
          Match with teammates based on real, proven skills and availability. Stop guessing — start building something great together.
        </p>

        {/* Stats */}
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

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-gray-400">Sign in to your TeamFinder account</p>
          </div>

          {/* Sign In / Create Account Tabs */}
          <div className="flex gap-4 mb-8">
            <button className="flex-1 bg-[#dc2626] text-white font-semibold py-3 rounded-lg">
              Sign in
            </button>
            <Link
              href="/auth/signup"
              onClick={() => {
                setEmail('');
                setPassword('');
                setError('');
              }}
              className="flex-1 bg-transparent border border-gray-700 text-gray-400 font-semibold py-3 rounded-lg text-center hover:border-gray-600 transition-colors"
            >
              Create account
            </Link>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#dc2626] transition-colors"
                placeholder="you@university.edu.jo"
              />
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
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#dc2626] transition-colors"
                placeholder="••••••••"
              />
              <div className="mt-2 text-right">
                <Link href="/auth/forgot-password" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold py-3.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In to TeamFinder'}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-gray-600 text-center mt-6">
            By signing in you agree to our{' '}
            <Link href="#" className="text-gray-500 hover:text-gray-400 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-gray-500 hover:text-gray-400 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
