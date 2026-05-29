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
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Left panel ── */}
      <div style={{
        width: '44%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '80px 60px', position: 'relative', overflow: 'hidden', background: '#120306',
      }} className="auth-panel-l">

        {/* decorative circles */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(220,38,38,0.1)', top: -220, right: -200, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)', bottom: -100, left: -60, pointerEvents: 'none' }} />

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 56, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>T</div>
          <span style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>TeamFinder</span>
        </div>

        {/* Tag */}
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#dc2626', marginBottom: 16, position: 'relative', zIndex: 1 }}>
          University Team Platform
        </p>

        {/* Headline */}
        <h1 style={{ fontSize: 44, fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 20, position: 'relative', zIndex: 1 }}>
          Welcome<br />
          <strong style={{ display: 'block', fontSize: 56 }}>
            <span style={{ color: '#dc2626' }}>back.</span>
          </strong>
        </h1>

        {/* Description */}
        <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 14, lineHeight: 1.75, maxWidth: 280, marginBottom: 40, position: 'relative', zIndex: 1 }}>
          Match with the right teammates. Launch projects that make a difference.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 32, position: 'relative', zIndex: 1 }}>
          {[{ n: '124+', l: 'Students' }, { n: '48+', l: 'Projects' }, { n: '94%', l: 'Match Rate' }].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 2 }}>{s.n}</div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.25)' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
          {['Skill-based matching', 'University-verified accounts', 'JU & HU students only'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 60px', background: '#fff5f5' }} className="auth-panel-r">
        <div style={{ width: '100%', maxWidth: 400 }}>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#120306', marginBottom: 6, letterSpacing: '-0.4px' }}>Sign in</h2>
          <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', marginBottom: 32 }}>Access your TeamFinder account</p>

          {/* Toggle */}
          <div style={{ background: '#fde8e8', borderRadius: 40, padding: 4, display: 'flex', marginBottom: 28 }}>
            <span style={{ flex: 1, padding: '9px 12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#111', borderRadius: 36, background: '#fffafa', boxShadow: '0 1px 8px rgba(0,0,0,0.1)' }}>
              Sign in
            </span>
            <Link href="/auth/signup" style={{ flex: 1, padding: '9px 12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.35)', borderRadius: 36, textDecoration: 'none' }}>
              Register
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(220,38,38,0.08)', border: '1.5px solid rgba(220,38,38,0.3)', color: '#dc2626', padding: '10px 14px', borderRadius: 12, fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="email" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 6 }}>University Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@ju.edu.jo"
                autoComplete="email"
                style={{ width: '100%', padding: '13px 16px', background: '#fffafa', border: '1.5px solid #fecaca', borderRadius: 14, color: '#111', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => (e.target.style.borderColor = '#dc2626')}
                onBlur={e => (e.target.style.borderColor = '#fecaca')}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <label htmlFor="password" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 6 }}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
                style={{ width: '100%', padding: '13px 16px', background: '#fffafa', border: '1.5px solid #fecaca', borderRadius: 14, color: '#111', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => (e.target.style.borderColor = '#dc2626')}
                onBlur={e => (e.target.style.borderColor = '#fecaca')}
              />
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginBottom: 8 }}>
              <Link href="/auth/forgot-password" style={{ fontSize: 12, color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', background: '#dc2626', border: 'none', borderRadius: 40,
                color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
                cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8,
                letterSpacing: '-0.2px', transition: 'all 0.22s', opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(0,0,0,0.35)', marginTop: 18 }}>
            By signing in you agree to our{' '}
            <Link href="/legal/terms" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>Terms</Link>
            {' '}&amp;{' '}
            <Link href="/legal/privacy" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>Privacy</Link>
          </p>
        </div>
      </div>

      {/* Responsive: hide left panel on small screens */}
      <style>{`
        @media (max-width: 820px) {
          .auth-panel-l { display: none !important; }
          .auth-panel-r { padding: 48px 28px !important; }
        }
      `}</style>
    </div>
  );
}
