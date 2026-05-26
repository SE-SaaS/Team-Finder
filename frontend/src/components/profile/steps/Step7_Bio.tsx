'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AVATAR_COLORS } from '@/types/profile';
import type { ProfileData } from '@/types/profile';
import { MAJORS } from '@/data/majors';

interface Step7Props {
  data:     Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  onBack:   () => void;
  onSubmit: () => Promise<void> | void;
}

const BIO_MAX = 500;

function deriveInitials(source: string): string {
  const cleaned = source.trim().split(/[\s@.]+/).filter(Boolean);
  const joined  = cleaned.slice(0, 2).map(w => w.charAt(0).toUpperCase()).join('');
  return joined || 'U';
}

function pickAvatarColor(source: string): string {
  const code = source.charCodeAt(0) || 0;
  return AVATAR_COLORS[Math.abs(code) % AVATAR_COLORS.length];
}

export default function Step7_Bio({ data, onChange, onBack, onSubmit }: Step7Props) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const dataRef     = useRef(data);
  const onChangeRef = useRef(onChange);
  dataRef.current     = data;
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!user || dataRef.current.avatar) return;
    const source = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? '';
    onChangeRef.current({
      ...dataRef.current,
      avatar:      deriveInitials(source),
      avatarColor: pickAvatarColor(source),
    });
  }, [user]);

  const displayName = (user?.user_metadata?.full_name as string | undefined)
    ?? user?.email?.split('@')[0]
    ?? 'User';
  const majorName     = data.major ? (MAJORS[data.major]?.name ?? data.major) : '';
  const university    = (user?.user_metadata?.university as string | undefined) ?? '';
  const completedSet  = data.completedCourses ?? [];
  const doneCount     = completedSet.filter(c => c.status === 'completed').length;
  const inProgCount   = completedSet.filter(c => c.status === 'in_progress').length;
  const skillCount    = data.skills?.length ?? 0;
  const charCount     = data.bio?.length ?? 0;

  function changeBio(next: string): void {
    if (next.length > BIO_MAX) return;
    onChange({ ...data, bio: next });
  }

  async function handleSubmit(): Promise<void> {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-white font-bold text-xl mb-1">Bio &amp; review</h2>
        <p className="text-gray-500 text-sm">
          A short bio helps teammates understand your interests. Review the summary and complete your profile.
        </p>
      </div>

      <div className="flex items-center gap-4 p-5 rounded-lg bg-[#0f0f18] border border-gray-800">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow"
          style={{ backgroundColor: data.avatarColor ?? '#1a1a1a' }}
        >
          {data.avatar ?? '...'}
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold truncate">{displayName}</p>
          <p className="text-gray-400 text-xs truncate">{university}</p>
          <p className="text-gray-500 text-xs truncate">
            {majorName}{data.year ? ` - ${data.year} year, S${data.semester ?? '?'}` : ''}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Bio <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <textarea
          value={data.bio ?? ''}
          onChange={e => changeBio(e.target.value)}
          placeholder="Tell teammates what you are interested in, what you want to build, anything that helps a match."
          rows={5}
          className="w-full px-4 py-3 rounded-lg bg-[#0f0f18] border border-gray-800 text-white placeholder:text-gray-600 transition-all focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/30 resize-none"
        />
        <div className="flex justify-between mt-2">
          <p className="text-xs text-gray-500">Optional. Skipped is fine.</p>
          <p className={`text-xs ${charCount >= BIO_MAX ? 'text-[#dc2626]' : 'text-gray-500'}`}>
            {charCount}/{BIO_MAX}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg bg-[#0f0f18] border border-gray-800 p-3 text-center">
          <div className="text-2xl font-bold text-[#dc2626]">{skillCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">Skills</div>
        </div>
        <div className="rounded-lg bg-[#0f0f18] border border-gray-800 p-3 text-center">
          <div className="text-2xl font-bold text-emerald-400">{doneCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">Courses done</div>
        </div>
        <div className="rounded-lg bg-[#0f0f18] border border-gray-800 p-3 text-center">
          <div className="text-2xl font-bold text-amber-400">{inProgCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">In progress</div>
        </div>
        <div className="rounded-lg bg-[#0f0f18] border border-gray-800 p-3 text-center">
          <div className="text-sm font-bold text-white mt-1">{data.availability ?? '-'}</div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">Availability</div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : 'Complete profile'}
        </button>
      </div>
    </div>
  );
}
