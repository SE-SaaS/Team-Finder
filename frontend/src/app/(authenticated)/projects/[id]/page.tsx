'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthenticatedUser } from '@/contexts/AuthenticatedUserContext';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import BackgroundCanvas from '@/components/dashboard/background/BackgroundCanvas';
import { logger } from '@/lib/logger';

type ProjectType = 'code' | 'research' | 'theory' | 'design' | 'data' | 'other';

interface Project {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  tech_stack: string[];
  skills_needed?: string[];
  creator_id: string;
  created_at: string;
}

interface TeamMember {
  id: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  avatar_color: string | null;
  major: string | null;
  year: number | null;
  role: 'owner' | 'member';
  joined_at: string;
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthenticatedUser();
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const projectId = params.id as string;

  useEffect(() => {
    if (!projectId) return;

    async function fetchProjectData() {
      try {
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;
        setProject(projectData);

        const { data: membersData } = await supabase
          .from('project_members')
          .select(`
            role,
            joined_at,
            profiles (
              id, name, username, avatar, avatar_color, major, year
            )
          `)
          .eq('project_id', projectId)
          .order('joined_at', { ascending: true });

        const rows = (membersData ?? []) as any[];
        const members: TeamMember[] = rows
          .filter((row) => row.profiles)
          .map((row): TeamMember => ({
            id: row.profiles.id,
            name: row.profiles.name,
            username: row.profiles.username,
            avatar: row.profiles.avatar,
            avatar_color: row.profiles.avatar_color,
            major: row.profiles.major,
            year: row.profiles.year,
            role: row.role,
            joined_at: row.joined_at,
          }));
        setTeamMembers(members);

        setIsMember(members.some((m) => m.id === user!.id));

      } catch (error) {
        logger.error('[project-detail] Error fetching project:', error);
        router.push('/projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjectData();
  }, [user, projectId, router]);

  const handleJoinProject = async () => {
    if (!user || !project) return;
    setJoining(true);
    try {
      alert('Join project functionality coming soon!');
      setIsMember(true);
    } catch (error) {
      logger.error('[project-detail] Error joining project:', error);
      alert('Failed to join project. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundCanvas />
        <div className="text-[#8b949e]">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundCanvas />
        <div className="text-center">
          <p className="text-[#8b949e] mb-4">Project not found</p>
          <Link href="/projects" className="text-[#58a6ff] hover:underline">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = project.creator_id === user!.id;

  return (
    <div className="min-h-screen">
      <BackgroundCanvas />
      <header className="border-b border-[#30363d] bg-[#161b22]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/projects" className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#8b949e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-[#f0f6fc] font-medium">Back to Projects</span>
            </Link>
            {isOwner && (
              <Link
                href={`/projects/${projectId}/edit`}
                className="px-4 py-2 text-sm font-medium text-[#c9d1d9] bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] rounded-md transition-colors"
              >
                Edit Project
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start gap-3 mb-4">
                <h1 className="text-3xl font-bold text-[#f0f6fc] flex-1">{project.title}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-medium shrink-0 bg-[#58a6ff]/10 text-[#58a6ff]">
                  {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#8b949e]">
                <div className={`px-3 py-1 rounded-full ${
                  project.status === 'open'
                    ? 'bg-[#238636]/10 text-[#3fb950]'
                    : project.status === 'in_progress'
                    ? 'bg-[#9e6a03]/10 text-[#d29922]'
                    : 'bg-[#8b949e]/10 text-[#8b949e]'
                }`}>
                  {project.status === 'open' ? 'Open for Members' : project.status === 'in_progress' ? 'In Progress' : 'Completed'}
                </div>
                <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#f0f6fc] mb-3">About This Project</h2>
              <p className="text-[#c9d1d9] leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#f0f6fc] mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {(project.tech_stack ?? []).map((skill: string, idx: number) => (
                  <span key={idx} className="px-3 py-1.5 rounded-md text-sm font-medium bg-[#238636]/10 text-[#3fb950] border border-[#238636]/30">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#f0f6fc] mb-4">
                Team Members ({teamMembers.length})
              </h2>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                    <div className="w-10 h-10 bg-[#58a6ff] rounded-full flex items-center justify-center text-white font-bold uppercase">
                      {(member.name || member.username)?.charAt(0) ?? '?'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[#f0f6fc]">
                        {member.name || member.username || 'Unknown'}
                      </div>
                      <div className="text-sm text-[#8b949e]">
                        {member.major} - Year {member.year}
                      </div>
                    </div>
                    {member.role === 'owner' && (
                      <span className="px-2 py-1 text-xs rounded bg-[#9e6a03]/10 text-[#d29922]">Owner</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {!isMember && project.status === 'open' && (
              <button
                onClick={handleJoinProject}
                disabled={joining}
                className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joining ? 'Joining...' : 'Request to Join'}
              </button>
            )}
            {isMember && !isOwner && (
              <div className="w-full bg-[#3fb950]/10 border border-[#3fb950]/30 text-[#3fb950] font-medium py-3 rounded-lg text-center">
                You are a member
              </div>
            )}
            {project.status !== 'open' && (
              <div className="w-full bg-[#8b949e]/10 border border-[#8b949e]/30 text-[#8b949e] font-medium py-3 rounded-lg text-center">
                {project.status === 'in_progress' ? 'Project in progress' : 'Project completed'}
              </div>
            )}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h3 className="text-sm font-semibold text-[#f0f6fc] mb-4">Project Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[#8b949e]">Required Skills</span>
                  <span className="text-sm font-medium text-[#f0f6fc]">{project.tech_stack?.length ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#8b949e]">Members</span>
                  <span className="text-sm font-medium text-[#f0f6fc]">{teamMembers.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
