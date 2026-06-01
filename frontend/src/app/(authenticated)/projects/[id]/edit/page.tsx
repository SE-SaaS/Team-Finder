'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthenticatedUser } from '@/contexts/AuthenticatedUserContext';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ALL_SKILLS } from '@/lib/skills';
import BackgroundCanvas from '@/components/dashboard/background/BackgroundCanvas';

type ProjectType = 'code' | 'research' | 'theory' | 'design' | 'data' | 'other';

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: 'code',     label: 'Code / Software' },
  { value: 'research', label: 'Research'         },
  { value: 'theory',   label: 'Theory'           },
  { value: 'design',   label: 'Design'           },
  { value: 'data',     label: 'Data / ML'        },
  { value: 'other',    label: 'Other'            },
];

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthenticatedUser();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'code' as ProjectType,
    project_url: '',
    looking_for: '',
    tech_stack: [] as string[],
    status: 'open' as 'open' | 'in_progress' | 'completed' | 'closed',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!projectId) return;
    async function fetchProject() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        if (error || !data) { setNotFound(true); return; }
        if (data.creator_id !== user.id) { setForbidden(true); return; }
        setFormData({
          title: data.title,
          description: data.description,
          type: data.type as ProjectType,
          project_url: data.project_url ?? '',
          looking_for: data.looking_for ?? '',
          tech_stack: data.tech_stack || [],
          status: data.status,
        });
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [user, projectId]);

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      tech_stack: prev.tech_stack.includes(skill)
        ? prev.tech_stack.filter(s => s !== skill)
        : [...prev.tech_stack, skill],
    }));
    if (errors.tech_stack) setErrors({ ...errors, tech_stack: '' });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    else if (formData.title.trim().length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!formData.description.trim()) newErrors.description = 'Project description is required';
    else if (formData.description.trim().length < 20) newErrors.description = 'Description must be at least 20 characters';
    if (formData.tech_stack.length === 0) newErrors.tech_stack = 'Select at least one required skill';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setSuccessMsg('');
    setErrors({});
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim(),
          type: formData.type,
          project_url: formData.project_url.trim() || null,
          looking_for: formData.looking_for.trim() || null,
          tech_stack: formData.tech_stack,
          status: formData.status,
        })
        .eq('id', projectId)
        .eq('creator_id', user.id);
      if (error) throw error;
      setSuccessMsg('Project updated successfully.');
      setTimeout(() => router.push(`/projects/${projectId}`), 1200);
    } catch {
      setErrors({ submit: 'Failed to save changes. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !notFound && !forbidden) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundCanvas />
        <div className="text-[#8b949e]">Loading...</div>
      </div>
    );
  }
  if (forbidden) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundCanvas />
        <div className="text-center">
          <p className="text-[#f85149] font-medium mb-2">Access Denied</p>
          <p className="text-[#8b949e] text-sm mb-4">You are not the owner of this project.</p>
          <Link href="/projects" className="text-[#58a6ff] hover:underline text-sm">Back to Projects</Link>
        </div>
      </div>
    );
  }
  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundCanvas />
        <div className="text-center">
          <p className="text-[#8b949e] mb-4">Project not found</p>
          <Link href="/projects" className="text-[#58a6ff] hover:underline text-sm">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <BackgroundCanvas />
      <header className="border-b border-[#30363d] bg-[#161b22]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href={`/projects/${projectId}`} className="flex items-center gap-2 text-[#8b949e] hover:text-[#f0f6fc] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Project</span>
          </Link>
          <span className="text-[#30363d]">/</span>
          <span className="text-[#f0f6fc] text-sm font-medium">Edit</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#f0f6fc] mb-1">Edit Project</h1>
          <p className="text-[#8b949e] text-sm">Update the details for your project</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 space-y-6">
          {successMsg && (
            <div className="px-4 py-3 bg-[#238636]/10 border border-[#238636]/40 text-[#3fb950] text-sm rounded-lg">
              {successMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
              Project Title <span className="text-[#f85149]">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
            />
            {errors.title && <p className="mt-2 text-sm text-[#f85149]">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
              Description <span className="text-[#f85149]">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent resize-none"
            />
            {errors.description && <p className="mt-2 text-sm text-[#f85149]">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Project Type</label>
            <div className="grid grid-cols-3 gap-3">
              {PROJECT_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: value })}
                  className={`px-4 py-2.5 rounded-lg border-2 transition-all text-sm font-medium text-left ${
                    formData.type === value
                      ? 'border-[#58a6ff] bg-[#58a6ff]/10 text-[#f0f6fc]'
                      : 'border-[#30363d] bg-[#0d1117] text-[#8b949e] hover:border-[#58a6ff]/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Project URL</label>
            <input
              type="url"
              value={formData.project_url}
              onChange={e => setFormData({ ...formData, project_url: e.target.value })}
              placeholder="https://github.com/your-org/project"
              className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Looking For</label>
            <input
              type="text"
              value={formData.looking_for}
              onChange={e => setFormData({ ...formData, looking_for: e.target.value })}
              placeholder="e.g., Backend developer, UI/UX designer"
              className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
            />
            <p className="mt-1 text-xs text-[#8b949e]">What kind of collaborators are you looking for?</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Status</label>
            <div className="grid grid-cols-3 gap-3">
              {(['open', 'in_progress', 'completed'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: s })}
                  className={`px-4 py-2.5 rounded-lg border-2 transition-all text-sm font-medium capitalize ${
                    formData.status === s
                      ? s === 'open' ? 'border-[#238636] bg-[#238636]/10 text-[#3fb950]'
                        : s === 'in_progress' ? 'border-[#9e6a03] bg-[#9e6a03]/10 text-[#d29922]'
                        : 'border-[#8b949e] bg-[#8b949e]/10 text-[#8b949e]'
                      : 'border-[#30363d] bg-[#0d1117] text-[#8b949e] hover:border-[#8b949e]/50'
                  }`}
                >
                  {s === 'open' ? 'Open' : s === 'in_progress' ? 'In Progress' : 'Completed'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
              Required Skills <span className="text-[#f85149]">*</span>
            </label>
            <div className="flex flex-wrap gap-2 max-h-[280px] overflow-y-auto p-4 bg-[#0d1117] border border-[#30363d] rounded-lg">
              {ALL_SKILLS.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    formData.tech_stack.includes(skill)
                      ? 'bg-[#238636] text-white border-2 border-[#2ea043]'
                      : 'bg-[#21262d] text-[#c9d1d9] border-2 border-[#30363d] hover:border-[#58a6ff]'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {errors.tech_stack && <p className="mt-2 text-sm text-[#f85149]">{errors.tech_stack}</p>}
            <p className="mt-2 text-xs text-[#8b949e]">
              {formData.tech_stack.length} skill{formData.tech_stack.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          {errors.submit && (
            <div className="p-4 bg-[#f85149]/10 border border-[#f85149] rounded-lg text-[#f85149]">
              {errors.submit}
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <Link
              href={`/projects/${projectId}`}
              className="px-6 py-2.5 rounded-md font-medium text-[#c9d1d9] bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-2.5 rounded-md font-medium text-white bg-[#238636] hover:bg-[#2ea043] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
