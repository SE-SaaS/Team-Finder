'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  title: string;
  description: string;
  type: 'university' | 'external';
  status: 'open' | 'in-progress' | 'completed';
  required_skills: string[];
  team_size: number;
  current_members: number;
  created_at: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'university' | 'external'>('all');

  // Get filter from URL query param
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'university' || type === 'external') {
      setActiveFilter(type);
    }
  }, [searchParams]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Fetch projects
  useEffect(() => {
    if (!user) return;

    async function fetchProjects() {
      try {
        let query = supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (activeFilter !== 'all') {
          query = query.eq('type', activeFilter);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [user, activeFilter]);

  if (authLoading || !user) {
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#dc2626] rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-[#f0f6fc] font-semibold">TeamFinder</span>
            </Link>

            <Link
              href="/projects/create"
              className="bg-[#238636] hover:bg-[#2ea043] text-white font-medium px-4 py-2 rounded-md transition-colors"
            >
              + Create Project
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#f0f6fc] mb-2">Browse Projects</h1>
          <p className="text-[#8b949e]">Find and join projects that match your skills</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#30363d]">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeFilter === 'all'
                ? 'text-[#f0f6fc] border-[#fd8c73]'
                : 'text-[#8b949e] border-transparent hover:text-[#f0f6fc]'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setActiveFilter('university')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeFilter === 'university'
                ? 'text-[#f0f6fc] border-[#fd8c73]'
                : 'text-[#8b949e] border-transparent hover:text-[#f0f6fc]'
            }`}
          >
            University
          </button>
          <button
            onClick={() => setActiveFilter('external')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeFilter === 'external'
                ? 'text-[#f0f6fc] border-[#fd8c73]'
                : 'text-[#8b949e] border-transparent hover:text-[#f0f6fc]'
            }`}
          >
            External
          </button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12 text-[#8b949e]">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#8b949e] mb-4">No projects found</p>
            <Link
              href="/projects/create"
              className="inline-block bg-[#238636] hover:bg-[#2ea043] text-white font-medium px-6 py-2 rounded-md transition-colors"
            >
              Create the first project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 hover:border-[#58a6ff] transition-colors"
              >
                {/* Project Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-[#f0f6fc] line-clamp-2">
                      {project.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                        project.type === 'university'
                          ? 'bg-[#1f6feb]/10 text-[#58a6ff]'
                          : 'bg-[#58a6ff]/10 text-[#58a6ff]'
                      }`}
                    >
                      {project.type === 'university' ? '🎓 University' : '🌐 External'}
                    </span>
                  </div>
                  <p className="text-sm text-[#8b949e] line-clamp-3">{project.description}</p>
                </div>

                {/* Required Skills */}
                {project.required_skills && project.required_skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {project.required_skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded bg-[#238636]/10 text-[#3fb950] border border-[#238636]/30"
                        >
                          {skill}
                        </span>
                      ))}
                      {project.required_skills.length > 3 && (
                        <span className="text-xs px-2 py-1 text-[#8b949e]">
                          +{project.required_skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Project Stats */}
                <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>
                      {project.current_members}/{project.team_size} members
                    </span>
                  </div>
                  <div
                    className={`px-2 py-0.5 rounded text-xs ${
                      project.status === 'open'
                        ? 'bg-[#238636]/10 text-[#3fb950]'
                        : project.status === 'in-progress'
                        ? 'bg-[#9e6a03]/10 text-[#d29922]'
                        : 'bg-[#8b949e]/10 text-[#8b949e]'
                    }`}
                  >
                    {project.status === 'open' ? '🟢 Open' : project.status === 'in-progress' ? '🟡 In Progress' : '✅ Completed'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
