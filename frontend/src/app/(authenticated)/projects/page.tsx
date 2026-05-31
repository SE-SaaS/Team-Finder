'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthenticatedUser } from '@/contexts/AuthenticatedUserContext';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import BackgroundCanvas from '@/components/dashboard/background/BackgroundCanvas';
import { logger } from '@/lib/logger';

interface Project {
  id: string;
  title: string;
  description: string;
  type: 'university' | 'external';
  status: 'open' | 'in_progress' | 'completed';
  tech_stack: string[];
  created_at: string;
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-[#8b949e]">Loading...</div></div>}>
      <ProjectsContent />
    </Suspense>
  );
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const { user } = useAuthenticatedUser();
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

  // Fetch projects
  useEffect(() => {
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
        logger.error('[projects] Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [user, activeFilter]);

  return (
    <div className="min-h-screen">
      <BackgroundCanvas />
      {/* Header */}
      <header className="border-b border-[#30363d] bg-[#161b22] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-[#8b949e] hover:text-[#f0f6fc] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Dashboard</span>
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

                {/* Skills Needed */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.slice(0, 3).map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded bg-[#238636]/10 text-[#3fb950] border border-[#238636]/30"
                        >
                          {skill}
                        </span>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <span className="text-xs px-2 py-1 text-[#8b949e]">
                          +{project.tech_stack.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Project Stats */}
                <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>{project.tech_stack?.length ?? 0} skills needed</span>
                  </div>
                  <div
                    className={`px-2 py-0.5 rounded text-xs ${
                      project.status === 'open'
                        ? 'bg-[#238636]/10 text-[#3fb950]'
                        : project.status === 'in_progress'
                        ? 'bg-[#9e6a03]/10 text-[#d29922]'
                        : 'bg-[#8b949e]/10 text-[#8b949e]'
                    }`}
                  >
                    {project.status === 'open' ? 'Open' : project.status === 'in_progress' ? 'In Progress' : 'Completed'}
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
