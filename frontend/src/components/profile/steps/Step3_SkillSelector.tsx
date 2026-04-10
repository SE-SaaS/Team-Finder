'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import type { ProfileData, Course } from '@/types/profile';
import { SKILL_LOCKS } from '@/data/skillLocks';
import { ALL_SKILLS, getSkillCategory } from '@/lib/skills';
import SkillPill from '@/lib/SkillPill';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

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

  // Stable refs to avoid stale closures
  const dataRef = useRef(data);
  const onChangeRef = useRef(onChange);
  dataRef.current = data;
  onChangeRef.current = onChange;

  useEffect(() => {
    async function fetchCourses() {
      const university = user?.user_metadata?.university || data.university;
      const major = data.major;
      if (!university || !major) { setLoading(false); return; }

      try {
        const response = await fetch(`/api/courses/${university}/${major}`);
        if (response.ok) setCourses(await response.json());
      } catch (error) {
        logger.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [user, data.university, data.major]);

  const unlockedSkillNames = useMemo(() => {
    const completedCourseIds = data.completedCourses || [];
    const skillNames = new Set<string>();

    completedCourseIds.forEach(courseId => {
      const course = courses.find(c => c.id === courseId);
      course?.unlocks_skills?.forEach(skillName => skillNames.add(skillName));
    });

    // Year 1 students get C++ Beginner by default
    if (yearNum === 1) skillNames.add('C++');

    return Array.from(skillNames);
  }, [courses, data.completedCourses, yearNum]);

  // Auto-select unlocked skills — uses refs to avoid stale closure
  // Track if we've already auto-selected to prevent race conditions
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  useEffect(() => {
    if (unlockedSkillNames.length === 0 || hasAutoSelected) return;

    const currentSkills = dataRef.current.skills || [];
    const merged = Array.from(new Set([...currentSkills, ...unlockedSkillNames]));
    const isDifferent =
      JSON.stringify([...currentSkills].sort()) !== JSON.stringify([...merged].sort());

    if (isDifferent) {
      onChangeRef.current({ ...dataRef.current, skills: merged });
      setHasAutoSelected(true);
    }
  }, [unlockedSkillNames, hasAutoSelected]);

  const lockedSkillNames = useMemo((): string[] => {
    return ALL_SKILLS.filter(skill => !unlockedSkillNames.includes(skill));
  }, [unlockedSkillNames]);

  const handleSkillToggle = (skillName: string) => {
    const currentSkills = data.skills || [];
    const isSelected = currentSkills.includes(skillName);
    const newSkills = isSelected
      ? currentSkills.filter(name => name !== skillName)
      : [...currentSkills, skillName];

    onChange({ ...data, skills: newSkills });
    if (errors.skills) setErrors({ ...errors, skills: '' });
  };

  const validate = (): boolean => {
    const minimumSkills = yearNum === 1 ? 0 : 3;
    if ((data.skills?.length ?? 0) < minimumSkills) {
      setErrors({ skills: 'Please select at least 3 skills' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const canProceed = yearNum === 1 || (data.skills?.length ?? 0) >= 3;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Select Your Skills</h2>
        <p className="text-white/60">
          {yearNum === 1
            ? 'Skills unlock by completing courses. Year 1 has mostly theoretical courses — few skills available.'
            : "Skills unlock by completing courses. Select at least 3 skills you're comfortable with."}
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

      {/* Skills Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-white/40">Loading skills...</div>
      ) : (
        <div className="flex flex-wrap gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
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
                lockReason={isLocked ? 'Complete the required course to unlock' : undefined}
              />
            );
          })}
        </div>
      )}

      {/* Error */}
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
          disabled={!canProceed}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${
            canProceed
              ? 'bg-[#4455ff] text-white hover:bg-[#5566ff] shadow-[0_0_20px_rgba(68,85,255,0.3)] hover:shadow-[0_0_30px_rgba(68,85,255,0.5)]'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          Next Step →
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(68,85,255,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(68,85,255,0.5); }
      `}</style>
    </div>
  );
}