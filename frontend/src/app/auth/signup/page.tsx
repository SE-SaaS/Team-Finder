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

  useEffect(() => {
    async function fetchStats() {
      try {
        const [studentsRes, projectsRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('projects').select('id', { count: 'exact', head: true }),
        ]);
        setStats({ students: studentsRes.count || 0, projects: projectsRes.count || 0, matchRate: 94 });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    }
    fetchStats();
  }, []);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!val || !val.includes('@')) { setDetectedUniversity(null); setError(''); return; }
    const university = getUniversityFromEmail(val);
    if (!university) { setError('Only @ju.edu.jo or @hu.edu.jo emails accepted'); setDetectedUniversity(null); return; }
    setDetectedUniversity(university);
    setError('');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (!fullName.trim() || fullName.trim().length < 2) { setError('Please enter your full name'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName: fullName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to create account'); return; }
      setStep('verify');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Verification screen ───────────────────────────────────────────────────
  if (step === 'verify') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#120306', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="28" height="28" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Check your email</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>Verification link sent to</p>
          <p style={{ fontSize: 14, color: '#dc2626', fontWeight: 600, marginBottom: 32 }}>{email}</p>
          <Link href="/auth/login" style={{ display: 'block', width: '100%', padding: '14px', background: '#dc2626', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 40, textDecoration: 'none', textAlign: 'center' }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ── Signup form ───────────────────────────────────────────────────────────
  const canSubmit = !!detectedUniversity && !!password && !!confirmPassword && !!fullName.trim() && password === confirmPassword;

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Left panel ── */}
      <div style={{
        width: '44%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '80px 60px', position: 'relative', overflow: 'hidden', background: '#120306',
        // hide on small screens via inline is not possible — handled by the media wrapper below
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
          Build<br />
          <strong style={{ display: 'block', fontSize: 56 }}>
            <span style={{ color: '#dc2626' }}>great</span><br />teams.
          </strong>
        </h1>

        {/* Description */}
        <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 14, lineHeight: 1.75, maxWidth: 280, marginBottom: 40, position: 'relative', zIndex: 1 }}>
          Match with the right teammates. Launch projects that make a difference.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 32, position: 'relative', zIndex: 1 }}>
          {[
            { n: `${stats.students}+`, l: 'Students' },
            { n: `${stats.projects}+`, l: 'Projects' },
            { n: `${stats.matchRate}%`, l: 'Match Rate' },
          ].map(s => (
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

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#120306', marginBottom: 6, letterSpacing: '-0.4px' }}>Get started</h2>
          <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', marginBottom: 32 }}>Create your free account</p>

          {/* Toggle */}
          <div style={{ background: '#fde8e8', borderRadius: 40, padding: 4, display: 'flex', marginBottom: 28 }}>
            <Link href="/auth/login" style={{ flex: 1, padding: '9px 12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.35)', borderRadius: 36, textDecoration: 'none' }}>
              Sign in
            </Link>
            <span style={{ flex: 1, padding: '9px 12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#111', borderRadius: 36, background: '#fffafa', boxShadow: '0 1px 8px rgba(0,0,0,0.1)' }}>
              Register
            </span>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(220,38,38,0.08)', border: '1.5px solid rgba(220,38,38,0.3)', color: '#dc2626', padding: '10px 14px', borderRadius: 12, fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            {/* Full Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 6 }}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                placeholder="John Doe"
                style={{ width: '100%', padding: '13px 16px', background: '#fffafa', border: '1.5px solid #fecaca', borderRadius: 14, color: '#111', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => (e.target.style.borderColor = '#dc2626')}
                onBlur={e => (e.target.style.borderColor = '#fecaca')}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 6 }}>University Email</label>
              <input
                type="email"
                value={email}
                onChange={e => handleEmailChange(e.target.value)}
                required
                placeholder="you@ju.edu.jo or you@hu.edu.jo"
                style={{ width: '100%', padding: '13px 16px', background: '#fffafa', border: '1.5px solid #fecaca', borderRadius: 14, color: '#111', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => (e.target.style.borderColor = '#dc2626')}
                onBlur={e => (e.target.style.borderColor = '#fecaca')}
              />
              {detectedUniversity && (
                <p style={{ fontSize: 11, color: '#16a34a', marginTop: 5, fontWeight: 600 }}>✓ {detectedUniversity} detected</p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={16}
                placeholder="Minimum 8 characters"
                style={{ width: '100%', padding: '13px 16px', background: '#fffafa', border: '1.5px solid #fecaca', borderRadius: 14, color: '#111', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => (e.target.style.borderColor = '#dc2626')}
                onBlur={e => (e.target.style.borderColor = '#fecaca')}
              />
              <p style={{ fontSize: 11, color: '#bbb', marginTop: 5 }}>8–16 chars · uppercase · number · symbol</p>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 6 }}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                maxLength={16}
                placeholder="Repeat your password"
                style={{ width: '100%', padding: '13px 16px', background: '#fffafa', border: '1.5px solid #fecaca', borderRadius: 14, color: '#111', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => (e.target.style.borderColor = '#dc2626')}
                onBlur={e => (e.target.style.borderColor = '#fecaca')}
              />
              {confirmPassword && password !== confirmPassword && (
                <p style={{ fontSize: 11, color: '#dc2626', marginTop: 5, fontWeight: 600 }}>Passwords do not match</p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p style={{ fontSize: 11, color: '#16a34a', marginTop: 5, fontWeight: 600 }}>✓ Passwords match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !canSubmit}
              style={{
                width: '100%', padding: '14px', background: canSubmit ? '#dc2626' : '#f5c6c6',
                border: 'none', borderRadius: 40, color: '#fff', fontSize: 15, fontWeight: 700,
                fontFamily: 'inherit', cursor: canSubmit ? 'pointer' : 'not-allowed',
                marginTop: 8, letterSpacing: '-0.2px', transition: 'all 0.22s',
              }}
            >
              {loading ? 'Creating account…' : 'Create account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(0,0,0,0.35)', marginTop: 18 }}>
            By signing up you agree to our{' '}
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
