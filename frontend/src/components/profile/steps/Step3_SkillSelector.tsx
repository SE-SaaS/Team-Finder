'use client';

/**
 * Step 3: Skill Selector
 * Flat list with soft-locks based on year + courses
 */

import { useState, useMemo, useEffect } from 'react';
import type { ProfileData, Course } from '@/types/profile';
import { SKILL_LOCKS, isSkillLevelLocked, getLockedLevel, canSkipSkillSelector } from '@/data/skillLocks';
import SkillPill from '@/components/profile/ui/SkillPill';
import { useAuth } from '@/contexts/AuthContext';

interface Step3Props {
  data: Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3_SkillSelector({ data, onChange, onNext, onBack }: Step3Props) {
  const { user } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const yearNum = data.year ? parseInt(data.year.charAt(0)) : 1;

  // Fetch courses to check what skills they unlock
  useEffect(() => {
    async function fetchCourses() {
      const university = user?.user_metadata?.university || data.university;
      const major = data.major;

      if (!university || !major) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/courses/${university}/${major}`);
        if (response.ok) {
          const coursesData = await response.json();
          setCourses(coursesData);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [user, data.university, data.major]);

  // Calculate unlocked skills from completed courses (from database)
  const unlockedSkillNames = useMemo(() => {
    const completedCourseIds = data.completedCourses || [];
    const skillNames = new Set<string>();

    // Add skills unlocked by completed courses
    completedCourseIds.forEach(courseId => {
      const course = courses.find(c => c.id === courseId);
      if (course && course.unlocks_skills) {
        course.unlocks_skills.forEach(skillName => skillNames.add(skillName));
      }
    });

    // SPECIAL CASE: Year 1 students get C++ by default (Beginner level only)
    if (yearNum === 1) {
      skillNames.add('C++');
    }

    return Array.from(skillNames);
  }, [courses, data.completedCourses, yearNum]);

  // All skills that are NOT unlocked by courses are locked
  const lockedSkillNames = useMemo(() => {
    return SKILL_LOCKS
      .map(lock => lock.skill)
      .filter(skill => !unlockedSkillNames.includes(skill));
  }, [unlockedSkillNames]);

  // Auto-select unlocked skills from completed courses
  useEffect(() => {
    if (unlockedSkillNames.length === 0) return;

    const currentSkills = data.skills || [];

    // Add all unlocked skill names to selected skills (avoid duplicates)
    const allSkills = Array.from(new Set([...currentSkills, ...unlockedSkillNames]));

    // Only update if there's a difference (avoid infinite loop)
    const isDifferent = JSON.stringify([...currentSkills].sort()) !== JSON.stringify([...allSkills].sort());

    if (isDifferent) {
      onChange({
        ...data,
        skills: allSkills
      });
    }
  }, [unlockedSkillNames]); // Run when unlocked skill names change

  const handleSkillToggle = (skillName: string) => {
    const currentSkills = data.skills || [];
    const isSelected = currentSkills.includes(skillName);

    const newSkills = isSelected
      ? currentSkills.filter(name => name !== skillName)
      : [...currentSkills, skillName];

    onChange({ ...data, skills: newSkills });

    // Clear error when user selects skills
    if (errors.skills) {
      setErrors({ ...errors, skills: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Year 1 students have mostly theoretical courses - no minimum
    // Year 2+ students need at least 3 skills for matching algorithm
    const minimumSkills = yearNum === 1 ? 0 : 3;

    if ((data.skills?.length ?? 0) < minimumSkills) {
      newErrors.skills = yearNum === 1
        ? 'Please select your skills (optional for Year 1)'
        : 'Please select at least 3 skills';
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
          {yearNum === 1
            ? 'Skills unlock by completing courses. Year 1 has mostly theoretical courses - few skills available.'
            : 'Skills unlock by completing courses or passing exams. Select at least 3 skills you\'re comfortable with.'}
        </p>
      </div>

      {/* Skills Counter */}
      <div className="flex items-center justify-between p-4 bg-[#0f0f18] rounded-lg border border-white/10">
        <span className="text-white/70">
          <span className="text-[#4455ff] font-bold text-2xl">{data.skills?.length || 0}</span> skills selected
        </span>
        <span className="text-xs text-white/50">
          {lockedSkillNames.length} locked • {unlockedSkillNames.length} unlocked
        </span>
      </div>

      {/* Skills Grid - Flat List */}
      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {/* All Skills in Flat List */}
        <div className="flex flex-wrap gap-3">
          {SKILL_LOCKS.map((skillLock) => {
            const isLocked = lockedSkillNames.includes(skillLock.skill);
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
          disabled={yearNum === 1 ? false : (data.skills?.length ?? 0) < 3}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all
            ${
              yearNum === 1 || (data.skills?.length ?? 0) >= 3
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
