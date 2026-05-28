'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthenticatedUser } from '@/contexts/AuthenticatedUserContext';
import { supabase } from '@/lib/supabase';
import { ALL_SKILLS } from '@/lib/skills';

interface CreateProjectModalProps {
  onClose: () => void;
}

export default function CreateProjectModal({ onClose }: CreateProjectModalProps) {
  const router = useRouter();
  const { user } = useAuthenticatedUser();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'external' as 'university' | 'external',
    skills_needed: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills_needed: prev.skills_needed.includes(skill)
        ? prev.skills_needed.filter(s => s !== skill)
        : [...prev.skills_needed, skill],
    }));
    if (errors.skills_needed) setErrors({ ...errors, skills_needed: '' });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    else if (formData.title.trim().length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!formData.description.trim()) newErrors.description = 'Project description is required';
    else if (formData.description.trim().length < 20) newErrors.description = 'Description must be at least 20 characters';
    if (formData.skills_needed.length === 0) newErrors.skills_needed = 'Select at least one skill';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          type: formData.type,
          skills_needed: formData.skills_needed,
          creator_id: user.id,
          status: 'open',
        })
        .select()
        .single();
      if (error) throw error;
      onClose();
      router.push(`/projects/${data.id}`);
    } catch {
      setErrors({ submit: 'Failed to create project. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#161b22] border border-[#30363d] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d] sticky top-0 bg-[#161b22] z-10">
          <h2 className="text-lg font-semibold text-[#f0f6fc]">Create New Project</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-1.5">
              Project Title <span className="text-[#f85149]">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., AI-Powered Study Buddy App"
              className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent text-sm"
            />
            {errors.title && <p className="mt-1.5 text-xs text-[#f85149]">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-1.5">
              Description <span className="text-[#f85149]">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your project, goals, and what you're building..."
              rows={4}
              className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent resize-none text-sm"
            />
            {errors.description && <p className="mt-1.5 text-xs text-[#f85149]">{errors.description}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-1.5">
              Project Type <span className="text-[#f85149]">*</span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'external' })}
                className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all text-left text-sm ${
                  formData.type === 'external'
                    ? 'border-[#58a6ff] bg-[#58a6ff]/10 text-[#f0f6fc]'
                    : 'border-[#30363d] bg-[#0d1117] text-[#8b949e] hover:border-[#58a6ff]/50'
                }`}
              >
                External
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'university' })}
                className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all text-left text-sm ${
                  formData.type === 'university'
                    ? 'border-[#58a6ff] bg-[#58a6ff]/10 text-[#f0f6fc]'
                    : 'border-[#30363d] bg-[#0d1117] text-[#8b949e] hover:border-[#58a6ff]/50'
                }`}
              >
                University
              </button>
            </div>
          </div>

          {/* Skills Needed */}
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-1.5">
              Skills Needed <span className="text-[#f85149]">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
              {ALL_SKILLS.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    formData.skills_needed.includes(skill)
                      ? 'bg-[#238636] text-white border border-[#2ea043]'
                      : 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d] hover:border-[#58a6ff]'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {errors.skills_needed && <p className="mt-1.5 text-xs text-[#f85149]">{errors.skills_needed}</p>}
            <p className="mt-1.5 text-xs text-[#8b949e]">
              {formData.skills_needed.length} skill{formData.skills_needed.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          {errors.submit && (
            <div className="p-3 bg-[#f85149]/10 border border-[#f85149] rounded-lg text-[#f85149] text-sm">
              {errors.submit}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md font-medium text-sm text-[#c9d1d9] bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-md font-medium text-sm text-white bg-[#238636] hover:bg-[#2ea043] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
