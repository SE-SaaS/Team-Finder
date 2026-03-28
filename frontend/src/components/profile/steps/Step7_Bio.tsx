'use client';

/**
 * Step 7: Bio & Profile Summary
 * Final step with avatar generation and complete profile review
 */

import { useState, useEffect } from 'react';
import type { ProfileData } from '@/types/profile';
import { AVATAR_COLORS } from '@/types/profile';
import { getMajorInfo } from '@/data/majors';
import { getSkillName } from '@/constants/skills';

interface Step7Props {
  data: Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function Step7_Bio({ data, onChange, onSubmit, onBack }: Step7Props) {
  const [charCount, setCharCount] = useState(data.bio?.length || 0);
  const maxChars = 500;

  // Generate avatar on mount if not already set
  useEffect(() => {
    if (!data.avatar && data.name) {
      const initials = data.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');

      const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

      onChange({
        ...data,
        avatar: initials,
        avatarColor: randomColor,
      });
    }
  }, [data.name]);

  const handleBioChange = (bio: string) => {
    if (bio.length <= maxChars) {
      setCharCount(bio.length);
      onChange({ ...data, bio });
    }
  };

  const verifiedSkillsCount = Object.values(data.examResults || {}).filter(
    (result) => result.passed
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Bio & Profile Summary</h2>
        <p className="text-white/60">Almost done! Add a bio and review your profile</p>
      </div>

      {/* Avatar Preview */}
      <div className="flex items-center gap-4 p-6 bg-[#0f0f18] rounded-xl border border-white/10">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg"
          style={{ backgroundColor: data.avatarColor }}
        >
          {data.avatar}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{data.name}</h3>
          <p className="text-white/60">{data.university}</p>
          <p className="text-sm text-white/50">
            {data.major ? getMajorInfo(data.major)?.name || data.major : ''} • {data.year} Year
          </p>
        </div>
      </div>

      {/* Bio Field */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Bio <span className="text-white/40">(Optional)</span>
        </label>
        <textarea
          value={data.bio || ''}
          onChange={(e) => handleBioChange(e.target.value)}
          placeholder="Tell us a bit about yourself, your interests, and what you're looking for in a team..."
          rows={5}
          className="w-full px-4 py-3 rounded-lg bg-[#0f0f18] border border-white/10 text-white placeholder:text-white/30 transition-all focus:outline-none focus:ring-2 focus:border-[#4455ff] focus:ring-[#4455ff]/50 resize-none"
        />
        <div className="flex justify-between mt-2">
          <p className="text-xs text-white/40">Optional - helps teams get to know you better</p>
          <p
            className={`text-xs ${
              charCount >= maxChars ? 'text-[#e8294a]' : 'text-white/40'
            }`}
          >
            {charCount}/{maxChars}
          </p>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="bg-[#0f0f18] rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Profile Summary</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Skills */}
          <div className="text-center p-4 bg-[#16161f] rounded-lg">
            <div className="text-3xl font-bold text-[#4455ff]">{data.skills?.length || 0}</div>
            <div className="text-xs text-white/60 mt-1">Skills Selected</div>
          </div>

          {/* Verified */}
          <div className="text-center p-4 bg-[#16161f] rounded-lg">
            <div className="text-3xl font-bold text-green-400">{verifiedSkillsCount}</div>
            <div className="text-xs text-white/60 mt-1">Verified</div>
          </div>

          {/* Courses */}
          <div className="text-center p-4 bg-[#16161f] rounded-lg">
            <div className="text-3xl font-bold text-purple-400">
              {data.completedCourses?.length || 0}
            </div>
            <div className="text-xs text-white/60 mt-1">Courses Completed</div>
          </div>

          {/* Availability */}
          <div className="text-center p-4 bg-[#16161f] rounded-lg">
            <div className="text-lg font-bold text-orange-400">{data.availability}</div>
            <div className="text-xs text-white/60 mt-1">Availability</div>
          </div>
        </div>

        {/* Selected Skills Preview */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-white/70 mb-3">Your Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {data.skills?.slice(0, 10).map((skillId) => {
              const skillName = getSkillName(skillId) || `Unknown skill ID: ${skillId}`;
              const isVerified = data.examResults?.[skillName]?.passed || false;
              return (
                <span
                  key={skillId}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm
                    ${
                      isVerified
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-[#4455ff]/20 text-[#4455ff] border border-[#4455ff]/30'
                    }
                  `}
                >
                  {skillName} {isVerified && '✓'}
                </span>
              );
            })}
            {(data.skills?.length || 0) > 10 && (
              <span className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-white/50">
                +{(data.skills?.length || 0) - 10} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-lg font-semibold text-white/70 hover:text-white transition-all"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          className="px-10 py-4 rounded-lg font-bold text-lg bg-[#e8294a] text-white hover:bg-[#ff3b5d] shadow-[0_0_30px_rgba(232,41,74,0.4)] hover:shadow-[0_0_40px_rgba(232,41,74,0.6)] transition-all hover:scale-105 active:scale-95"
        >
          Complete Profile 🚀
        </button>
      </div>
    </div>
  );
}
