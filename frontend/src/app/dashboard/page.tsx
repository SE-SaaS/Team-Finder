'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ProfileCompletionBanner from '@/components/dashboard/ProfileCompletionBanner';

interface Project {
  id: string;
  type: 'university' | 'external';
  title: string;
  description: string;
  difficulty: string;
  tech_stack: string[];
  skills_needed?: string[];
  team_size?: number;
  deadline?: string;
  university?: string;
  source?: string;
  external_url?: string;
  creator_id?: string;
  status: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [universityProjects, setUniversityProjects] = useState<Project[]>([]);
  const [externalProjects, setExternalProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Check profile completion
  useEffect(() => {
    async function checkProfile() {
      if (!user) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('major, year')
          .eq('id', user.id)
          .single();

        const { count: skillsCount } = await supabase
          .from('user_skills')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setIsProfileComplete(!!(profile?.major && profile?.year && (skillsCount ?? 0) >= 3));
      } catch (error) {
        console.error('Error checking profile:', error);
        setIsProfileComplete(false);
      } finally {
        setCheckingProfile(false);
      }
    }

    checkProfile();
  }, [user]);

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      if (!isProfileComplete) {
        setLoadingProjects(false);
        return;
      }

      try {
        const { data: uniProjects } = await supabase
          .from('projects')
          .select('*')
          .eq('type', 'university')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(6);

        const { data: extProjects } = await supabase
          .from('projects')
          .select('*')
          .eq('type', 'external')
          .order('created_at', { ascending: false })
          .limit(6);

        setUniversityProjects(uniProjects || []);
        setExternalProjects(extProjects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    }

    fetchProjects();
  }, [isProfileComplete]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-black relative">
      {/* Starfield Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="stars stars-blue"></div>
        <div className="stars stars-red"></div>
      </div>

      {/* Profile Completion Banner */}
      <ProfileCompletionBanner />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#dc2626] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-white text-xl font-bold">TeamFinder</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-sm text-gray-400 hover:text-white transition-colors">
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-400 hover:text-[#dc2626] transition-colors"
            >
              Sign Out
            </button>
            <div className="w-10 h-10 rounded-full bg-[#dc2626] flex items-center justify-center text-white font-bold">
              {user.user_metadata?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Welcome */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-3">
              Welcome back, {user.user_metadata?.name?.split(' ')[0] || 'Student'}
            </h1>
            <p className="text-gray-400 text-lg">
              {isProfileComplete ? 'Discover projects and build something amazing' : 'Complete your profile to unlock all features'}
            </p>
          </div>

          {/* Projects Sections */}
          <div className={!isProfileComplete ? 'relative' : ''}>
            {/* Blur Overlay for Incomplete Profiles */}
            {!isProfileComplete && (
              <div className="absolute inset-0 z-10 backdrop-blur-sm bg-black/50 rounded-2xl flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="w-16 h-16 bg-[#dc2626]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h3>
                  <p className="text-gray-300 mb-6 max-w-md">
                    Unlock all projects by completing your profile
                  </p>
                  <Link
                    href="/profile"
                    className="inline-block bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold px-6 py-3 rounded-lg transition-all"
                  >
                    Complete Profile
                  </Link>
                </div>
              </div>
            )}

            {/* University Projects */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">University Projects</h2>
                  <p className="text-gray-400">Join teams from your university</p>
                </div>
                <Link href="/projects?type=university" className="text-[#dc2626] hover:text-[#b91c1c] font-medium">
                  View all →
                </Link>
              </div>

              {loadingProjects ? (
                <div className="text-gray-400 text-center py-12">Loading projects...</div>
              ) : universityProjects.length === 0 ? (
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 text-center">
                  <p className="text-gray-400">No university projects yet. Be the first to create one!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {universityProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} type="university" />
                  ))}
                </div>
              )}
            </section>

            {/* External/Personal Projects */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Suggested Projects</h2>
                  <p className="text-gray-400">Explore projects matched to your skills</p>
                </div>
                <Link href="/projects?type=external" className="text-[#dc2626] hover:text-[#b91c1c] font-medium">
                  View all →
                </Link>
              </div>

              {loadingProjects ? (
                <div className="text-gray-400 text-center py-12">Loading projects...</div>
              ) : externalProjects.length === 0 ? (
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 text-center">
                  <p className="text-gray-400">No suggested projects available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {externalProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} type="external" />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function ProjectCard({ project, type }: { project: Project; type: 'university' | 'external' }) {
  const difficultyColors = {
    beginner: 'bg-green-500/20 text-green-400',
    intermediate: 'bg-yellow-500/20 text-yellow-400',
    advanced: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-[#dc2626]/50 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-[#dc2626] transition-colors">
          {project.title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[project.difficulty as keyof typeof difficultyColors]}`}>
          {project.difficulty}
        </span>
      </div>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech_stack.slice(0, 3).map((tech, i) => (
          <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
            {tech}
          </span>
        ))}
        {project.tech_stack.length > 3 && (
          <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">
            +{project.tech_stack.length - 3}
          </span>
        )}
      </div>

      {/* University Project Info */}
      {type === 'university' && (
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          {project.team_size && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {project.team_size} members
            </span>
          )}
          {project.deadline && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(project.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      {/* External Project Info */}
      {type === 'external' && project.source && (
        <div className="text-sm text-gray-500 mb-4">
          <span className="capitalize">{project.source}</span>
          {project.skills_needed && ` · ${project.skills_needed.length} skills needed`}
        </div>
      )}

      <Link
        href={`/projects/${project.id}`}
        className="block w-full text-center bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold py-2 rounded-lg transition-all"
      >
        View Project
      </Link>
    </div>
  );
}
