'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-body min-h-screen bg-ink text-faint overflow-hidden">
      {/* Noise overlay */}
      <div className="bg-noise pointer-events-none fixed inset-0 z-[999] opacity-[0.028]" />

      <div className="grid h-screen grid-cols-1 lg:grid-cols-[1fr_1px_560px]">
        {/* LEFT — branding */}
        <div className="relative hidden flex-col justify-between overflow-hidden px-[52px] py-9 lg:flex">
          {/* Grid lines */}
          <div className="bg-grid-60 pointer-events-none absolute inset-0 opacity-[0.35]" />

          {/* Ghost word */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-10 -left-5 select-none opacity-50"
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 'clamp(120px, 18vw, 260px)',
              fontWeight: 800,
              color: 'transparent',
              WebkitTextStroke: '1px #222222',
              letterSpacing: '-0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            TEAM
          </div>

          {/* Logo */}
          <div className="animate-fade-up relative z-10 flex items-center gap-2.5">
            <div className="font-display flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[4px] bg-accent text-[15px] font-extrabold text-white">
              T
            </div>
            <span className="font-display text-[17px] font-bold tracking-tight text-white">
              TeamFinder
            </span>
          </div>

          {/* Hero */}
          <div className="animate-fade-up relative z-10" style={{ animationDelay: '0.15s' }}>
            <p className="mb-7 text-[10px] font-medium uppercase tracking-[0.2em] text-dim">
              University Team Platform
            </p>
            <h1
              className="font-display text-white"
              style={{
                fontSize: 'clamp(44px, 5.5vw, 78px)',
                lineHeight: 1.0,
                fontWeight: 400,
                letterSpacing: '-0.03em',
              }}
            >
              Find your<br />
              <em className="font-light italic text-dim">team.</em>
            </h1>
            <p className="mt-5 text-sm font-light tracking-wide text-dim">
              Real skills. Real teammates.
            </p>
          </div>

          {/* Footer label */}
          <div
            className="animate-fade-up relative z-10 text-[9px] uppercase tracking-[0.2em] text-muted"
            style={{ animationDelay: '0.25s' }}
          >
            Built for university teams
          </div>
        </div>

        {/* DIVIDER */}
        <div className="hidden bg-line lg:block" />

        {/* RIGHT — form */}
        <div
          className="animate-fade-up flex flex-col justify-center bg-surface px-8 py-[52px] sm:px-16"
          style={{ animationDelay: '0.1s' }}
        >
          <h2 className="font-display mb-1.5 text-[30px] font-bold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="mb-9 text-[13px] font-light text-dim">Sign in to your account</p>

          {/* Tabs */}
          <div className="mb-8 flex gap-7 border-b border-line">
            <button
              type="button"
              className="relative -mb-px border-b-2 border-accent pb-3.5 text-sm font-medium text-white"
            >
              Sign in
            </button>
            <Link
              href="/auth/signup"
              className="pb-3.5 text-sm font-medium text-dim transition-colors hover:text-faint"
            >
              Create account
            </Link>
          </div>

          {/* Dash decoration */}
          <div className="mb-7 flex gap-1.5">
            <div className="h-0.5 w-[22px] rounded-sm bg-accent" />
            <div className="h-0.5 w-[14px] rounded-sm bg-accent" />
            <div className="h-0.5 w-[28px] rounded-sm bg-muted" />
          </div>

          {error && (
            <div className="mb-5 rounded-sm border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-dim"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@university.edu.jo"
                autoComplete="email"
                className="w-full border-0 border-b border-muted bg-transparent py-2.5 text-sm tracking-wide text-faint placeholder:text-muted focus:border-accent focus:outline-none focus:ring-0"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-dim"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                autoComplete="current-password"
                className="w-full border-0 border-b border-muted bg-transparent py-2.5 text-sm tracking-wide text-faint placeholder:text-muted focus:border-accent focus:outline-none focus:ring-0"
              />
              <div className="mt-1.5 flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-dim transition-colors hover:text-faint"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="font-display mt-8 w-full rounded-sm bg-accent py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-accent-dim active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In to TeamFinder'}
            </button>
          </form>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-muted">
            By signing in you agree to our{' '}
            <Link
              href="/legal/terms"
              className="text-dim underline underline-offset-2 transition-colors hover:text-faint"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/legal/privacy"
              className="text-dim underline underline-offset-2 transition-colors hover:text-faint"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
