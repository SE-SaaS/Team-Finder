'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ProfileCompletionBanner from '@/components/dashboard/ProfileCompletionBanner';
import BackgroundCanvas from '@/components/dashboard/background/BackgroundCanvas';
import ThemeToggle from '@/components/dashboard/background/ThemeToggle';
import { BackgroundThemeProvider } from '@/contexts/BackgroundThemeContext';

interface Project {
  id: string;
  type: 'university' | 'external';
  title: string;
  description: string;
  difficulty: string;
  tech_stack: string[];
  skills_needed?: string[];
  tags?: string[];
  team_size?: number;
  deadline?: string;
  university?: string;
  source?: string;
  external_url?: string;
  creator_id?: string;
  status: string;
}

interface ProfileStats {
  major: string | null;
  year: number | null;
  name: string | null;
  skillsCount: number;
  university: string | null;
  semester?: number | null;
}

// ── Difficulty badge ───────────────────────────────────────────────────────
const difficultyMap: Record<string, { dot: string; text: string }> = {
  beginner:     { dot: 'bg-emerald-400', text: 'text-emerald-400' },
  intermediate: { dot: 'bg-amber-400',   text: 'text-amber-400'   },
  advanced:     { dot: 'bg-red-400',     text: 'text-red-400'     },
};

// ── Project Row (GitHub repo-card style) ──────────────────────────────────
function ProjectRow({ project }: { project: Project }) {
  const diff = difficultyMap[project.difficulty];
  const tags = project.tech_stack ?? project.tags ?? [];
  const primaryTag = tags[0];

  return (
    <div className="group px-4 py-4 border-b border-[#21262d] last:border-0 hover:bg-[#161b22] transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-[#8b949e] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
            <Link
              href={`/projects/${project.id}`}
              className="text-[#58a6ff] font-semibold text-sm hover:underline truncate"
            >
              {project.title}
            </Link>
            {project.status === 'open' && (
              <span className="shrink-0 px-2 py-0.5 text-[10px] font-medium border border-[#238636]/50 text-[#3fb950] rounded-full">
                Open
              </span>
            )}
            {project.status === 'locked' && (
              <span className="shrink-0 px-2 py-0.5 text-[10px] font-medium border border-[#8b949e]/50 text-[#8b949e] rounded-full">
                🔒 Locked
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[#8b949e] text-xs mb-2.5 line-clamp-1 leading-relaxed">
            {project.description}
          </p>

          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[#8b949e] text-[11px]">
            {primaryTag && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] inline-block" />
                {primaryTag}
              </span>
            )}
            {diff && (
              <span className={`flex items-center gap-1.5 ${diff.text}`}>
                <span className={`w-2 h-2 rounded-full ${diff.dot} inline-block`} />
                {project.difficulty}
              </span>
            )}
            {project.team_size && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {project.team_size} members
              </span>
            )}
            {project.deadline && (
              <span>
                Due {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
            {project.source && (
              <span className="capitalize">{project.source}</span>
            )}
          </div>
        </div>

        {/* Join/Star button */}
        <button
          disabled={project.status === 'locked'}
          className={`flex items-center gap-1.5 border rounded-md px-2.5 py-1 text-xs transition-all shrink-0 ${
            project.status === 'locked'
              ? 'text-[#484f58] border-[#21262d] cursor-not-allowed opacity-50'
              : 'text-[#8b949e] hover:text-[#f0f6fc] border-[#30363d] hover:border-[#8b949e]'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          {project.status === 'locked' ? 'Locked' : 'Star'}
        </button>
      </div>
    </div>
  );
}

// ── Left sidebar nav item ──────────────────────────────────────────────────
function SideNavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
        active
          ? 'bg-[#21262d] text-[#f0f6fc] font-semibold'
          : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]'
      }`}
    >
      <span className="w-4 h-4 shrink-0">{icon}</span>
      {label}
    </Link>
  );
}

// ── Checklist item ─────────────────────────────────────────────────────────
function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-[#238636]' : 'border border-[#30363d]'}`}>
        {done && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={done ? 'text-[#8b949e] line-through' : 'text-[#c9d1d9]'}>{label}</span>
    </div>
  );
}

// ── Course Status Component ────────────────────────────────────────────────
function CourseStatusBadge({ status }: { status: 'completed' | 'in-progress' | 'locked' }) {
  const config = {
    completed: { bg: 'bg-[#238636]/20', text: 'text-[#3fb950]', icon: '✓', label: 'Completed' },
    'in-progress': { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: '⟳', label: 'In Progress' },
    locked: { bg: 'bg-[#30363d]', text: 'text-[#8b949e]', icon: '🔒', label: 'Locked' },
  };
  const { bg, text, icon, label } = config[status];

  return (
    <span className={`px-2 py-0.5 text-[10px] rounded-full ${bg} ${text} font-medium`}>
      {icon} {label}
    </span>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [checkingProfile, setCheckingProfile]     = useState(true);
  const [profileStats, setProfileStats]           = useState<ProfileStats>({
    major: null, year: null, name: null, skillsCount: 0, university: null,
  });
  const [universityProjects, setUniversityProjects] = useState<Project[]>([]);
  const [externalProjects, setExternalProjects]     = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects]       = useState(true);
  const [activeTab, setActiveTab]                   = useState<'university' | 'external' | 'my'>('university');
  const [userCourses, setUserCourses]               = useState<string[]>([]);
  const [userSkills, setUserSkills]                 = useState<string[]>([]);
  const [allCourses, setAllCourses]                 = useState<any[]>([]);
  const [searchQuery, setSearchQuery]               = useState('');
  const [myProjects, setMyProjects]                 = useState<Project[]>([]);
  const [trendingProjects, setTrendingProjects]     = useState<Project[]>([]);
  const [difficultyFilter, setDifficultyFilter]     = useState('');
  const [techFilter, setTechFilter]                 = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    async function checkProfile() {
      if (!user) return;
      try {
        const { data: profile } = await supabase
          .from('profiles').select('major, year, name, university, semester').eq('id', user.id).single();
        const { count: skillsCount } = await supabase
          .from('user_skills').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
        const count = skillsCount ?? 0;
        setProfileStats({
          major: profile?.major ?? null,
          year: profile?.year ?? null,
          name: profile?.name ?? null,
          skillsCount: count,
          university: profile?.university ?? null,
          semester: profile?.semester ?? null,
        });
        const isComplete = !!(profile?.major && profile?.year && count >= 3);
        setIsProfileComplete(isComplete);

        console.log('👤 Profile Check:', {
          major: profile?.major,
          year: profile?.year,
          skills: count,
          isComplete
        });
      } catch { setIsProfileComplete(false); }
      finally { setCheckingProfile(false); }
    }
    checkProfile();
  }, [user]);

  useEffect(() => {
    async function fetchProjects() {
      if (!isProfileComplete) {
        setLoadingProjects(false);
        return;
      }

      try {
        console.log('📥 Fetching projects...');

        const [uniResult, extResult] = await Promise.all([
          supabase
            .from('projects')
            .select('*')
            .eq('type', 'university')
            .eq('status', 'open')
            .order('created_at', { ascending: false })
            .limit(10),
          supabase
            .from('projects')
            .select('*')
            .eq('type', 'external')
            .order('created_at', { ascending: false })
            .limit(10),
        ]);

        console.log(`✅ University: ${uniResult.data?.length ?? 0}, External: ${extResult.data?.length ?? 0}`);

        setUniversityProjects(uniResult.data ?? []);
        setExternalProjects(extResult.data ?? []);
      } catch (error) {
        console.error('❌ Error fetching projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    }
    fetchProjects();
  }, [isProfileComplete]);

  // Fetch user's own projects + trending projects
  useEffect(() => {
    async function fetchMyAndTrending() {
      if (!user) return;
      try {
        const [myResult, trendingResult] = await Promise.all([
          supabase
            .from('projects')
            .select('*')
            .eq('creator_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('projects')
            .select('*')
            .eq('status', 'open')
            .order('created_at', { ascending: false })
            .limit(6),
        ]);
        setMyProjects(myResult.data ?? []);
        setTrendingProjects(trendingResult.data ?? []);
      } catch (e) {
        console.error('Error fetching my/trending projects:', e);
      }
    }
    fetchMyAndTrending();
  }, [user]);

  // Fetch user's courses and skills
  useEffect(() => {
    async function fetchUserData() {
      if (!user || !profileStats.major || !profileStats.university) return;

      try {
        // Fetch user's completed courses from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('completed_courses')
          .eq('id', user.id)
          .single();

        setUserCourses(profile?.completed_courses || []);

        // Fetch user's skills
        const { data: skills } = await supabase
          .from('user_skills')
          .select('skill_name')
          .eq('user_id', user.id);

        setUserSkills(skills?.map(s => s.skill_name) || []);

        // Fetch all courses for the user's major and university
        const response = await fetch(`/api/courses/${profileStats.university}/${profileStats.major}`);
        if (response.ok) {
          const coursesData = await response.json();
          setAllCourses(coursesData || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, [user, profileStats.major, profileStats.university]);

  const handleSignOut = async () => { await signOut(); router.push('/'); };

  const displayName = profileStats.name
    || user?.user_metadata?.name
    || 'Student';

  const uniShort = profileStats.university === 'Hashemite University' ? 'HU'
    : profileStats.university === 'University of Jordan' ? 'JU'
    : profileStats.university ?? '—';

  if (loading || checkingProfile) {
    return (
      <BackgroundThemeProvider>
        <BackgroundCanvas />
        <div className="min-h-screen bg-transparent flex items-center justify-center relative">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-[#dc2626] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#8b949e] text-sm">Loading dashboard…</p>
          </div>
        </div>
      </BackgroundThemeProvider>
    );
  }

  if (!user) return null;

  const baseProjects = activeTab === 'university' ? universityProjects
    : activeTab === 'external' ? externalProjects
    : myProjects;

  const filteredProjects = baseProjects.filter(p => {
    const q = searchQuery.toLowerCase();
    if (q && !p.title.toLowerCase().includes(q) &&
        !p.description.toLowerCase().includes(q) &&
        !(p.tech_stack ?? p.tags ?? []).some(t => t.toLowerCase().includes(q))) return false;
    if (difficultyFilter && p.difficulty !== difficultyFilter) return false;
    if (techFilter) {
      const tags = p.tech_stack ?? p.tags ?? [];
      if (!tags.some(t => t.toLowerCase().includes(techFilter.toLowerCase()))) return false;
    }
    return true;
  });

  return (
    <BackgroundThemeProvider>
      <BackgroundCanvas />
      <div className="min-h-screen bg-transparent text-[#c9d1d9] relative">
        <ProfileCompletionBanner />

      {/* ── Top Nav (GitHub Style - Fully Responsive) ── */}
      <header className="sticky top-0 z-40 bg-[#161b22] border-b border-[#30363d]">
        <div className="w-full px-3 sm:px-4 md:px-6 h-14 flex items-center gap-2 sm:gap-3">
          {/* Logo - Absolute Left */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#dc2626] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-[#f0f6fc] font-semibold text-sm hidden xs:inline">TeamFinder</span>
          </Link>

          {/* Search Bar - Functional */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] rounded-md px-2 sm:px-3 py-1.5 text-sm text-[#8b949e] focus-within:border-[#58a6ff] transition-colors">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search projects…"
                className="flex-1 bg-transparent outline-none text-xs text-[#c9d1d9] placeholder-[#8b949e] min-w-0"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-[#8b949e] hover:text-[#f0f6fc] shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Actions - Absolute Right (tight spacing, responsive) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeToggle />
            <Link
              href="/projects/create"
              className="flex items-center gap-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-md transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New</span>
            </Link>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="w-8 h-8 rounded-full bg-[#dc2626] flex items-center justify-center text-white font-bold text-sm ring-1 ring-[#30363d] hover:ring-[#8b949e] transition-all"
            >
              {displayName.charAt(0).toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      {/* ── Page body (Full Width Layout) ── */}
      <div className="w-full">
        <div className="flex w-full">

          {/* ── Left sidebar (Absolute Left) ── */}
          <aside className="hidden lg:flex flex-col gap-1 w-64 shrink-0 sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-[#30363d] bg-[#0d1117] px-3 py-4 custom-scrollbar">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-9 h-9 rounded-full bg-[#dc2626] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-[#f0f6fc] font-semibold text-sm truncate">{displayName}</p>
                <p className="text-[#8b949e] text-xs truncate">{uniShort}</p>
              </div>
            </div>

            <SideNavItem href="/dashboard" active icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            } label="Home" />

            <SideNavItem href="/projects" icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>
            } label="All Projects" />

            <SideNavItem href="/projects?type=university" icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            } label="University" />

            <SideNavItem href="/projects?type=external" icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            } label="Suggested" />

            <SideNavItem href="/profile" icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            } label="Profile" />

            <SideNavItem href="/learning" icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            } label="Learning" />

            <div className="mt-2 border-t border-[#21262d] pt-3">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] w-full transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </aside>

          {/* ── Main content (Center Feed) ── */}
          <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6">
            <h1 className="text-[#f0f6fc] text-lg font-semibold mb-4 break-words">
              Good to see you, {displayName} 👋
            </h1>

            {/* ── Stats Strip ── */}
            {isProfileComplete && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Projects Created', value: myProjects.length,                              color: 'text-[#58a6ff]'  },
                  { label: 'Skills Added',      value: profileStats.skillsCount,                      color: 'text-[#3fb950]'  },
                  { label: 'Courses Done',      value: userCourses.length,                             color: 'text-[#f78166]'  },
                  { label: 'Open Projects',     value: universityProjects.length + externalProjects.length, color: 'text-amber-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-[#161b22] border border-[#30363d] rounded-md p-3 text-center hover:border-[#8b949e] transition-colors">
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    <p className="text-[#8b949e] text-[11px] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            )}

            {!isProfileComplete && (
              <div className="mb-4 bg-[#161b22] border border-[#30363d] rounded-md p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#f0883e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-[#f0f6fc] text-sm font-medium mb-2">Complete your profile to unlock projects</p>
                    <div className="space-y-1.5 mb-3">
                      <ChecklistItem done={!!profileStats.major} label="Set your major" />
                      <ChecklistItem done={!!profileStats.year} label="Set your year" />
                      <ChecklistItem done={profileStats.skillsCount >= 3} label={`Add 3 skills (${profileStats.skillsCount}/3)`} />
                    </div>
                    <Link href="/profile" className="inline-flex items-center gap-1 text-xs bg-[#238636] hover:bg-[#2ea043] text-white font-semibold px-3 py-1.5 rounded-md transition-colors">
                      Complete Profile →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="border border-[#30363d] rounded-md overflow-hidden">
              <div className="flex bg-[#161b22] border-b border-[#30363d] px-3 pt-2 gap-1">
                <button
                  onClick={() => setActiveTab('university')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'university'
                      ? 'border-[#f78166] text-[#f0f6fc]'
                      : 'border-transparent text-[#8b949e] hover:text-[#f0f6fc]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                  </svg>
                  University
                  <span className="text-[10px] bg-[#30363d] text-[#8b949e] rounded-full px-2 py-0.5">
                    {universityProjects.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('external')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'external'
                      ? 'border-[#f78166] text-[#f0f6fc]'
                      : 'border-transparent text-[#8b949e] hover:text-[#f0f6fc]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Suggested
                  <span className="text-[10px] bg-[#30363d] text-[#8b949e] rounded-full px-2 py-0.5">
                    {externalProjects.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('my')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'my'
                      ? 'border-[#f78166] text-[#f0f6fc]'
                      : 'border-transparent text-[#8b949e] hover:text-[#f0f6fc]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Projects
                  <span className="text-[10px] bg-[#30363d] text-[#8b949e] rounded-full px-2 py-0.5">
                    {myProjects.length}
                  </span>
                </button>

                <div className="ml-auto flex items-center pb-1">
                  <Link
                    href="/projects/create"
                    className="flex items-center gap-1 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Project
                  </Link>
                </div>
              </div>

              {/* ── Quick Filters ── */}
              <div className="flex items-center gap-2 px-3 py-2 bg-[#0d1117] border-b border-[#21262d] flex-wrap">
                <span className="text-[#8b949e] text-[11px] shrink-0 font-medium">Difficulty:</span>
                {(['', 'beginner', 'intermediate', 'advanced'] as const).map(d => (
                  <button
                    key={d || 'all'}
                    onClick={() => setDifficultyFilter(d)}
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors capitalize ${
                      difficultyFilter === d
                        ? 'border-[#58a6ff] text-[#58a6ff] bg-[#58a6ff]/10'
                        : 'border-[#30363d] text-[#8b949e] hover:border-[#8b949e] hover:text-[#c9d1d9]'
                    }`}
                  >
                    {d || 'All'}
                  </button>
                ))}
                {(searchQuery || difficultyFilter) && (
                  <button
                    onClick={() => { setSearchQuery(''); setDifficultyFilter(''); setTechFilter(''); }}
                    className="ml-auto text-[10px] text-[#f78166] hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {!isProfileComplete ? (
                <div className="px-4 py-12 text-center">
                  <svg className="w-10 h-10 text-[#8b949e] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-[#8b949e] text-sm">Complete your profile to see projects</p>
                </div>
              ) : loadingProjects ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 60, color: "#555", fontSize: 12 }}>
                  Loading...
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  {searchQuery || difficultyFilter ? (
                    <>
                      <svg className="w-10 h-10 text-[#8b949e] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-[#f0f6fc] font-medium mb-1">No results found</p>
                      <p className="text-[#8b949e] text-sm mb-3">Try adjusting your search or filters</p>
                      <button
                        onClick={() => { setSearchQuery(''); setDifficultyFilter(''); setTechFilter(''); }}
                        className="text-xs text-[#58a6ff] hover:underline"
                      >
                        Clear filters
                      </button>
                    </>
                  ) : activeTab === 'my' ? (
                    <>
                      <svg className="w-12 h-12 text-[#8b949e] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-[#f0f6fc] font-medium mb-1">No projects yet</p>
                      <p className="text-[#8b949e] text-sm mb-4">Create your first project and start building your team!</p>
                      <Link
                        href="/projects/create"
                        className="inline-flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Project
                      </Link>
                    </>
                  ) : activeTab === 'university' ? (
                    <>
                      <svg className="w-12 h-12 text-[#8b949e] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="text-[#f0f6fc] font-medium mb-1">No university projects yet</p>
                      <p className="text-[#8b949e] text-sm mb-4">Be the first to create a project for your university!</p>
                      <Link
                        href="/projects/create"
                        className="inline-flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create University Project
                      </Link>
                    </>
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-[#8b949e] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <p className="text-[#f0f6fc] font-medium mb-1">No suggested projects</p>
                      <p className="text-[#8b949e] text-sm">External projects will appear here based on your skills and major</p>
                    </>
                  )}
                </div>
              ) : (
                filteredProjects.map(p => <ProjectRow key={p.id} project={p} />)
              )}
            </div>
          </main>

          {/* ── Right sidebar (Absolute Right) ── */}
          <aside className="hidden xl:flex flex-col gap-4 w-80 shrink-0 sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto border-l border-[#30363d] bg-[#0d1117] px-4 py-6 custom-scrollbar">
            <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#dc2626] flex items-center justify-center text-white font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[#f0f6fc] font-semibold text-sm">{displayName}</p>
                  <p className="text-[#8b949e] text-xs">{uniShort} · {profileStats.year ? `Year ${profileStats.year}` : 'Year —'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8b949e]">Major</span>
                  <span className="text-[#f0f6fc] font-medium">{profileStats.major ?? '—'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#8b949e]">Skills</span>
                  <span className="text-[#f0f6fc] font-medium">{profileStats.skillsCount} added</span>
                </div>
              </div>
              <Link
                href="/profile"
                className="mt-3 block text-center text-xs text-[#8b949e] hover:text-[#f0f6fc] border border-[#30363d] hover:border-[#8b949e] rounded-md py-1.5 transition-colors"
              >
                Edit profile
              </Link>
            </div>

            {/* Courses Section */}
            {allCourses.length > 0 && profileStats.year && (
              <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
                <p className="text-[#8b949e] text-xs font-semibold uppercase tracking-wider mb-3">
                  My Courses
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {[1, 2, 3, 4].map(year =>
                    [1, 2].map(semester => {
                      const currentYear = profileStats.year || 1;
                      const currentSem = profileStats.semester || 1;

                      // Only show up to current year/semester
                      if (year > currentYear) return null;
                      if (year === currentYear && semester > currentSem) return null;

                      const coursesInSemester = allCourses.filter(
                        c => c.year === year && c.semester === semester
                      );

                      if (coursesInSemester.length === 0) return null;

                      return (
                        <div key={`${year}-${semester}`} className="space-y-1">
                          <p className="text-[10px] text-[#8b949e] font-semibold">
                            Y{year} S{semester}
                          </p>
                          {coursesInSemester.map(course => {
                            const isCompleted = userCourses.includes(course.id);
                            const isInProgress = year === currentYear && semester === currentSem;
                            const status = isCompleted ? 'completed' : isInProgress ? 'in-progress' : 'locked';

                            return (
                              <div
                                key={course.id}
                                className="flex flex-col gap-0.5 text-[11px] p-1.5 rounded hover:bg-[#21262d] transition-colors"
                                title={`${course.code} - ${course.name}`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`flex-1 truncate font-medium ${isCompleted ? 'text-[#3fb950]' : 'text-[#8b949e]'}`}>
                                    {course.name}
                                  </span>
                                  <CourseStatusBadge status={status} />
                                </div>
                                <span className="text-[9px] text-[#8b949e]/60">{course.code}</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Skills Section */}
            {userSkills.length > 0 && (
              <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
                <p className="text-[#8b949e] text-xs font-semibold uppercase tracking-wider mb-3">
                  My Skills ({userSkills.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {userSkills.slice(0, 12).map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-[10px] rounded bg-[#388bfd]/20 text-[#58a6ff] border border-[#388bfd]/30"
                    >
                      {skill}
                    </span>
                  ))}
                  {userSkills.length > 12 && (
                    <Link
                      href="/profile"
                      className="px-2 py-1 text-[10px] rounded bg-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] transition-colors"
                    >
                      +{userSkills.length - 12} more
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
              <p className="text-[#8b949e] text-xs font-semibold uppercase tracking-wider mb-3">Quick Actions</p>
              <div className="space-y-2">
                <Link href="/projects/create" className="flex items-center gap-2 text-sm text-[#58a6ff] hover:underline">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Create a project
                </Link>
                <Link href="/projects" className="flex items-center gap-2 text-sm text-[#58a6ff] hover:underline">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  Browse all projects
                </Link>
                <Link href="/profile" className="flex items-center gap-2 text-sm text-[#58a6ff] hover:underline">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Update your skills
                </Link>
              </div>
            </div>

            {/* Trending Projects */}
            {trendingProjects.length > 0 && (
              <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
                <p className="text-[#8b949e] text-xs font-semibold uppercase tracking-wider mb-3">
                  Recently Active
                </p>
                <div className="space-y-2.5">
                  {trendingProjects.map((p, i) => (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}`}
                      className="flex items-start gap-2 group"
                    >
                      <span className="text-[10px] text-[#8b949e] w-4 shrink-0 mt-0.5 font-mono">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#58a6ff] group-hover:underline truncate">{p.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] ${difficultyMap[p.difficulty]?.text ?? 'text-[#8b949e]'}`}>
                            {p.difficulty}
                          </span>
                          {p.tech_stack?.[0] && (
                            <span className="text-[10px] text-[#8b949e] truncate">{p.tech_stack[0]}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty Legend */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
              <p className="text-[#8b949e] text-xs font-semibold uppercase tracking-wider mb-3">Difficulty</p>
              <div className="space-y-1.5">
                {[
                  { label: 'Beginner',     color: 'bg-emerald-400' },
                  { label: 'Intermediate', color: 'bg-amber-400'   },
                  { label: 'Advanced',     color: 'bg-red-400'     },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-[#8b949e]">
                    <span className={`w-2.5 h-2.5 rounded-full ${color} shrink-0`} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(48, 54, 61, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(88, 166, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(88, 166, 255, 0.5);
        }
      `}</style>
    </BackgroundThemeProvider>
  );
}