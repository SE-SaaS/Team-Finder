'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthenticatedUser } from '@/contexts/AuthenticatedUserContext';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Tab = 'account' | 'contact' | 'danger';

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut } = useAuthenticatedUser();

  const [activeTab, setActiveTab] = useState<Tab>('account');
  const [loading, setLoading] = useState(true);

  // Account fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Reset password
  const [resetSent, setResetSent] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Contact & Info fields
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [discordLink, setDiscordLink] = useState('');
  const [savingContact, setSavingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactError, setContactError] = useState('');

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        // Load base fields (always exist)
        const { data: base } = await supabase
          .from('profiles')
          .select('name, email, university, bio')
          .eq('id', user!.id)
          .maybeSingle();
        if (base) {
          setName(base.name || '');
          setEmail(base.email || user!.email || '');
          setUniversity(base.university || user!.user_metadata?.university || '');
          setBio(base.bio || '');
        } else {
          setEmail(user!.email || '');
        }

        // Load contact fields (added in migration 04 — may not exist yet)
        try {
          const { data: contact } = await supabase
            .from('profiles')
            .select('phone, linkedin_url, github_url, website_url, discord_link')
            .eq('id', user!.id)
            .maybeSingle();
          if (contact) {
            setPhone(contact.phone || '');
            setLinkedinUrl(contact.linkedin_url || '');
            setGithubUrl(contact.github_url || '');
            setWebsiteUrl(contact.website_url || '');
            setDiscordLink(contact.discord_link || '');
          }
        } catch {
          // migration 04 not applied yet — contact fields simply stay empty
        }
      } catch {
        setEmail(user!.email || '');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const handleSaveAccount = async () => {
    if (!name.trim()) { setErrorMsg('Display name cannot be empty'); return; }
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: name.trim() })
        .eq('id', user.id);
      if (error) throw error;
      setSuccessMsg('Account settings saved.');
    } catch {
      setErrorMsg('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) return;
    setResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      setResetSent(true);
    } catch {
      setErrorMsg('Failed to send reset email. Please try again.');
    } finally {
      setResetting(false);
    }
  };

  const handleSaveContact = async () => {
    setSavingContact(true);
    setContactSuccess('');
    setContactError('');
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          bio: bio.trim() || null,
          phone: phone.trim() || null,
          linkedin_url: linkedinUrl.trim() || null,
          github_url: githubUrl.trim() || null,
          website_url: websiteUrl.trim() || null,
          discord_link: discordLink.trim() || null,
        })
        .eq('id', user.id);
      if (error) throw error;
      setContactSuccess('Contact info saved.');
    } catch {
      setContactError('Failed to save. Please try again.');
    } finally {
      setSavingContact(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setDeleting(true);
    setDeleteError('');
    try {
      await supabase.from('profiles').delete().eq('id', user!.id);
      await signOut();
      router.push('/');
    } catch {
      setDeleteError('Failed to delete account. Contact support.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-[#8b949e]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Header */}
      <header className="border-b border-[#30363d] bg-[#161b22] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#8b949e] hover:text-[#f0f6fc] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Dashboard</span>
          </Link>
          <span className="text-[#30363d]">/</span>
          <span className="text-[#f0f6fc] text-sm font-medium">Settings</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#f0f6fc] mb-1">Settings</h1>
          <p className="text-[#8b949e] text-sm">Manage your account preferences</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar tabs */}
          <nav className="w-44 shrink-0 space-y-1">
            {([
              { id: 'account', label: 'Account' },
              { id: 'contact', label: 'Contact & Info' },
              { id: 'danger',  label: 'Danger Zone' },
            ] as { id: Tab; label: string }[]).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  id === 'danger'
                    ? activeTab === id
                      ? 'bg-[#f85149]/10 text-[#f85149] font-medium'
                      : 'text-[#8b949e] hover:text-[#f85149] hover:bg-[#f85149]/5'
                    : activeTab === id
                      ? 'bg-[#21262d] text-[#f0f6fc] font-medium'
                      : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* ── Account Tab ── */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                  <h2 className="text-base font-semibold text-[#f0f6fc] mb-4">Profile Information</h2>

                  {successMsg && (
                    <div className="mb-4 px-3 py-2 bg-[#238636]/10 border border-[#238636]/40 text-[#3fb950] text-sm rounded-md">
                      {successMsg}
                    </div>
                  )}
                  {errorMsg && (
                    <div className="mb-4 px-3 py-2 bg-[#f85149]/10 border border-[#f85149]/40 text-[#f85149] text-sm rounded-md">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Display Name */}
                    <div>
                      <label className="block text-sm font-medium text-[#c9d1d9] mb-1.5">Display Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent text-sm"
                      />
                    </div>

                    {/* Email + Reset Password */}
                    <div>
                      <label className="block text-sm font-medium text-[#c9d1d9] mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        readOnly
                        className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#8b949e] text-sm cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-[#8b949e]">Email cannot be changed</p>
                      <div className="mt-3">
                        {resetSent ? (
                          <p className="text-sm text-[#3fb950]">
                            Reset link sent — check your inbox.
                          </p>
                        ) : (
                          <button
                            onClick={handleResetPassword}
                            disabled={resetting}
                            className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs font-medium rounded-md border border-[#30363d] transition-colors disabled:opacity-50"
                          >
                            {resetting ? 'Sending...' : 'Reset Password'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* University */}
                    <div>
                      <label className="block text-sm font-medium text-[#c9d1d9] mb-1.5">University</label>
                      <input
                        type="text"
                        value={university}
                        readOnly
                        className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#8b949e] text-sm cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-[#8b949e]">University is set at registration and cannot be changed</p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleSaveAccount}
                        disabled={saving}
                        className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Contact & Info Tab ── */}
            {activeTab === 'contact' && (
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                <h2 className="text-base font-semibold text-[#f0f6fc] mb-1">Contact & Info</h2>
                <p className="text-xs text-[#8b949e] mb-5">
                  This info is shown on your public profile. URLs in your bio will be clickable.
                </p>

                {contactSuccess && (
                  <div className="mb-4 px-3 py-2 bg-[#238636]/10 border border-[#238636]/40 text-[#3fb950] text-sm rounded-md">
                    {contactSuccess}
                  </div>
                )}
                {contactError && (
                  <div className="mb-4 px-3 py-2 bg-[#f85149]/10 border border-[#f85149]/40 text-[#f85149] text-sm rounded-md">
                    {contactError}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-[#c9d1d9] mb-1.5">Bio</label>
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      rows={4}
                      placeholder="Tell people about yourself. Paste any links (Discord, GitHub, etc.) and they will be clickable."
                      className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent text-sm resize-none"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-[#c9d1d9] mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+962 7x xxx xxxx"
                      className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent text-sm"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-sm font-medium text-[#c9d1d9] mb-1.5">LinkedIn</label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={e => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent text-sm"
                    />
                  </div>

                  {/* GitHub */}
                  <div>
                    <label className="block text-sm font-medium text-[#c9d1d9] mb-1.5">GitHub</label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={e => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                      className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-[#c9d1d9] mb-1.5">Website</label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={e => setWebsiteUrl(e.target.value)}
                      placeholder="https://yoursite.com"
                      className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Discord */}
                  <div>
                    <label className="block text-sm font-medium text-[#c9d1d9] mb-1.5">Discord</label>
                    <input
                      type="text"
                      value={discordLink}
                      onChange={e => setDiscordLink(e.target.value)}
                      placeholder="https://discord.gg/invite or username"
                      className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSaveContact}
                      disabled={savingContact}
                      className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingContact ? 'Saving...' : 'Save Contact Info'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Danger Zone Tab ── */}
            {activeTab === 'danger' && (
              <div className="bg-[#161b22] border border-[#f85149]/40 rounded-lg p-6">
                <h2 className="text-base font-semibold text-[#f85149] mb-2">Delete Account</h2>
                <p className="text-sm text-[#8b949e] mb-5">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>

                {deleteError && (
                  <div className="mb-4 px-3 py-2 bg-[#f85149]/10 border border-[#f85149]/40 text-[#f85149] text-sm rounded-md">
                    {deleteError}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#c9d1d9] mb-1.5">
                      Type <span className="font-mono text-[#f85149]">DELETE</span> to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirm}
                      onChange={e => setDeleteConfirm(e.target.value)}
                      placeholder="DELETE"
                      className="w-full px-3 py-2 bg-[#0d1117] border border-[#f85149]/30 rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#f85149] focus:border-transparent text-sm font-mono"
                    />
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirm !== 'DELETE' || deleting}
                    className="px-4 py-2 bg-[#f85149] hover:bg-[#da3633] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {deleting ? 'Deleting...' : 'Delete My Account'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
