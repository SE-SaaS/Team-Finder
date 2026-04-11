'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  owner_id: string;
  created_at: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  major: string;
  year: string;
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const projectId = params.id as string;

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Fetch project details and team members
  useEffect(() => {
    if (!user || !projectId) return;

    async function fetchProjectData() {
      try {
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;
        setProject(projectData);

        // Fetch team members (this would need a project_members table)
        // For now, just fetch the owner
        const { data: ownerData, error: ownerError } = await supabase
          .from('profiles')
          .select('id, name, email, major, year')
          .eq('id', projectData.owner_id)
          .single();

        if (!ownerError && ownerData) {
          setTeamMembers([ownerData]);
        }

        // Check if current user is a member
        setIsMember(projectData.owner_id === user.id);

      } catch (error) {
        console.error('Error fetching project:', error);
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
      // This would insert into a project_members table
      // For now, just show a success message
      alert('Join project functionality coming soon! This will be integrated with the team matching system.');
      setIsMember(true);
    } catch (error) {
      console.error('Error joining project:', error);
      alert('Failed to join project. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-[#8b949e]">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8b949e] mb-4">Project not found</p>
          <Link href="/projects" className="text-[#58a6ff] hover:underline">
            ← Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = project.owner_id === user.id;
  const spotsRemaining = project.team_size - project.current_members;

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <h1 className="text-3xl font-bold text-[#f0f6fc] flex-1">{project.title}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                    project.type === 'university'
                      ? 'bg-[#1f6feb]/10 text-[#58a6ff]'
                      : 'bg-[#58a6ff]/10 text-[#58a6ff]'
                  }`}
                >
                  {project.type === 'university' ? '🎓 University' : '🌐 External'}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-[#8b949e]">
                <div
                  className={`px-3 py-1 rounded-full ${
                    project.status === 'open'
                      ? 'bg-[#238636]/10 text-[#3fb950]'
                      : project.status === 'in-progress'
                      ? 'bg-[#9e6a03]/10 text-[#d29922]'
                      : 'bg-[#8b949e]/10 text-[#8b949e]'
                  }`}
                >
                  {project.status === 'open' ? '🟢 Open for Members' : project.status === 'in-progress' ? '🟡 In Progress' : '✅ Completed'}
                </div>
                <span>
                  Created {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#f0f6fc] mb-3">About This Project</h2>
              <p className="text-[#c9d1d9] leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </div>

            {/* Required Skills */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#f0f6fc] mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {project.required_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-md text-sm font-medium bg-[#238636]/10 text-[#3fb950] border border-[#238636]/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#f0f6fc] mb-4">
                Team Members ({project.current_members}/{project.team_size})
              </h2>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                    <div className="w-10 h-10 bg-[#58a6ff] rounded-full flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[#f0f6fc]">{member.name}</div>
                      <div className="text-sm text-[#8b949e]">
                        {member.major} · Year {member.year}
                      </div>
                    </div>
                    {member.id === project.owner_id && (
                      <span className="px-2 py-1 text-xs rounded bg-[#9e6a03]/10 text-[#d29922]">
                        Owner
                      </span>
                    )}
                  </div>
                ))}
                {spotsRemaining > 0 && (
                  <div className="text-sm text-[#8b949e] text-center py-2">
                    {spotsRemaining} spot{spotsRemaining !== 1 ? 's' : ''} remaining
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-4">
            {/* Join Button */}
            {!isMember && project.status === 'open' && spotsRemaining > 0 && (
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
                ✓ You're a member
              </div>
            )}

            {project.status !== 'open' && (
              <div className="w-full bg-[#8b949e]/10 border border-[#8b949e]/30 text-[#8b949e] font-medium py-3 rounded-lg text-center">
                {project.status === 'in-progress' ? 'Project in progress' : 'Project completed'}
              </div>
            )}

            {/* Project Stats */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h3 className="text-sm font-semibold text-[#f0f6fc] mb-4">Project Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[#8b949e]">Team Size</span>
                  <span className="text-sm font-medium text-[#f0f6fc]">{project.team_size} members</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#8b949e]">Current Members</span>
                  <span className="text-sm font-medium text-[#f0f6fc]">{project.current_members}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#8b949e]">Spots Remaining</span>
                  <span className="text-sm font-medium text-[#3fb950]">{spotsRemaining}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#8b949e]">Required Skills</span>
                  <span className="text-sm font-medium text-[#f0f6fc]">{project.required_skills.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
