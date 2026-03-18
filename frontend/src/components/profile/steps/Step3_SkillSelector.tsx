'use client';

/**
 * Step 3: Skill Selector
 * Flat list with soft-locks based on year + courses
 */

import { useState, useMemo } from 'react';
import type { ProfileData } from '@/types/profile';
import { SKILL_LOCKS, getLockedSkills, getUnlockedSkills } from '@/data/skillLocks';
import SkillPill from '@/components/profile/ui/SkillPill';

interface Step3Props {
  data: Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3_SkillSelector({ data, onChange, onNext, onBack }: Step3Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const yearNum = data.year ? parseInt(data.year.charAt(0)) : 1;

  // Determine which skills are locked/unlocked
  const { lockedSkills, unlockedSkills } = useMemo(() => {
    const locked = getLockedSkills(yearNum, data.completedCourses || []);
    const unlocked = getUnlockedSkills(yearNum, data.completedCourses || []);

    return { lockedSkills: locked, unlockedSkills: unlocked };
  }, [yearNum, data.completedCourses]);

  const handleSkillToggle = (skill: string) => {
    const currentSkills = data.skills || [];
    const isSelected = currentSkills.includes(skill);

    const newSkills = isSelected
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];

    onChange({ ...data, skills: newSkills });

    // Clear error when user selects skills
    if (errors.skills) {
      setErrors({ ...errors, skills: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if ((data.skills?.length ?? 0) < 3) {
      newErrors.skills = 'Please select at least 3 skills';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Select Your Skills</h2>
        <p className="text-white/60">
          Choose technologies you're comfortable with. Locked skills can be unlocked by passing an exam.
        </p>
      </div>

      {/* Skills Counter */}
      <div className="flex items-center justify-between p-4 bg-[#0f0f18] rounded-lg border border-white/10">
        <span className="text-white/70">
          <span className="text-[#4455ff] font-bold text-2xl">{data.skills?.length || 0}</span> skills selected
        </span>
        <span className="text-xs text-white/50">
          {lockedSkills.length} locked • {unlockedSkills.length} unlocked
        </span>
      </div>

      {/* Skills Grid - Flat List */}
      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {/* All Skills in Flat List */}
        <div className="flex flex-wrap gap-3">
          {SKILL_LOCKS.map((skillLock) => {
            const isLocked = lockedSkills.includes(skillLock.skill);
            const isSelected = data.skills?.includes(skillLock.skill) || false;
            const isVerified = data.examResults?.[skillLock.skill]?.passed || false;

            return (
              <SkillPill
                key={skillLock.skill}
                skill={skillLock.skill}
                category={skillLock.category}
                isLocked={isLocked}
                isSelected={isSelected}
                isVerified={isVerified}
                onClick={() => handleSkillToggle(skillLock.skill)}
                lockReason={
                  isLocked
                    ? `Requires ${skillLock.requiredYear}${
                        skillLock.requiredYear === 1
                          ? 'st'
                          : skillLock.requiredYear === 2
                          ? 'nd'
                          : skillLock.requiredYear === 3
                          ? 'rd'
                          : 'th'
                      } year or pass exam to unlock`
                    : undefined
                }
              />
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {errors.skills && (
        <p className="mt-2 text-sm text-[#e8294a] flex items-center gap-1">
          <span>⚠</span> {errors.skills}
        </p>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-lg font-semibold text-white/70 hover:text-white transition-all"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={(data.skills?.length ?? 0) < 3}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all
            ${
              (data.skills?.length ?? 0) >= 3
                ? 'bg-[#4455ff] text-white hover:bg-[#5566ff] shadow-[0_0_20px_rgba(68,85,255,0.3)] hover:shadow-[0_0_30px_rgba(68,85,255,0.5)]'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }
          `}
        >
          Next Step →
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(68, 85, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(68, 85, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
