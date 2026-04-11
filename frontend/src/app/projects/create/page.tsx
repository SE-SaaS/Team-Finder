'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ALL_SKILLS } from '@/lib/skills';

export default function CreateProjectPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'university' as 'university' | 'external',
    required_skills: [] as string[],
    team_size: 3,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.includes(skill)
        ? prev.required_skills.filter(s => s !== skill)
        : [...prev.required_skills, skill]
    }));
    if (errors.required_skills) {
      setErrors({ ...errors, required_skills: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (formData.required_skills.length === 0) {
      newErrors.required_skills = 'Select at least one required skill';
    }

    if (formData.team_size < 2 || formData.team_size > 10) {
      newErrors.team_size = 'Team size must be between 2 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !user) return;

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          type: formData.type,
          required_skills: formData.required_skills,
          team_size: formData.team_size,
          current_members: 1, // Creator is first member
          status: 'open',
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Redirect to the new project page
      router.push(`/projects/${data.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      setErrors({ submit: 'Failed to create project. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

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
      <header className="border-b border-[#30363d] bg-[#161b22]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#dc2626] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-[#f0f6fc] font-semibold">TeamFinder</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#f0f6fc] mb-2">Create New Project</h1>
          <p className="text-[#8b949e]">Fill in the details to create a new project and find teammates</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#161b22] border border-[#30363d] rounded-lg p-8">
          {/* Project Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
              Project Title <span className="text-[#f85149]">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., AI-Powered Study Buddy App"
              className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-[#f85149]">{errors.title}</p>
            )}
          </div>

          {/* Project Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
              Description <span className="text-[#f85149]">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your project, goals, and what you're building..."
              rows={6}
              className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent resize-none"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-[#f85149]">{errors.description}</p>
            )}
          </div>

          {/* Project Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
              Project Type <span className="text-[#f85149]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'university' })}
                className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${
                  formData.type === 'university'
                    ? 'border-[#58a6ff] bg-[#58a6ff]/10 text-[#f0f6fc]'
                    : 'border-[#30363d] bg-[#0d1117] text-[#8b949e] hover:border-[#58a6ff]/50'
                }`}
              >
                <div className="font-semibold mb-1">🎓 University Project</div>
                <div className="text-xs">Course assignments, capstone projects</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'external' })}
                className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${
                  formData.type === 'external'
                    ? 'border-[#58a6ff] bg-[#58a6ff]/10 text-[#f0f6fc]'
                    : 'border-[#30363d] bg-[#0d1117] text-[#8b949e] hover:border-[#58a6ff]/50'
                }`}
              >
                <div className="font-semibold mb-1">🌐 External Project</div>
                <div className="text-xs">Personal projects, hackathons, startups</div>
              </button>
            </div>
          </div>

          {/* Team Size */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
              Team Size <span className="text-[#f85149]">*</span>
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={formData.team_size}
              onChange={(e) => setFormData({ ...formData, team_size: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent"
            />
            <p className="mt-1 text-xs text-[#8b949e]">Total team members including you (2-10)</p>
            {errors.team_size && (
              <p className="mt-2 text-sm text-[#f85149]">{errors.team_size}</p>
            )}
          </div>

          {/* Required Skills */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
              Required Skills <span className="text-[#f85149]">*</span>
            </label>
            <p className="text-sm text-[#8b949e] mb-3">Select skills needed for this project</p>
            <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto p-4 bg-[#0d1117] border border-[#30363d] rounded-lg">
              {ALL_SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    formData.required_skills.includes(skill)
                      ? 'bg-[#238636] text-white border-2 border-[#2ea043]'
                      : 'bg-[#21262d] text-[#c9d1d9] border-2 border-[#30363d] hover:border-[#58a6ff]'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {errors.required_skills && (
              <p className="mt-2 text-sm text-[#f85149]">{errors.required_skills}</p>
            )}
            <p className="mt-2 text-xs text-[#8b949e]">
              {formData.required_skills.length} skill{formData.required_skills.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-[#f85149]/10 border border-[#f85149] rounded-lg text-[#f85149]">
              {errors.submit}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-md font-medium text-[#c9d1d9] bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2.5 rounded-md font-medium text-white bg-[#238636] hover:bg-[#2ea043] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
