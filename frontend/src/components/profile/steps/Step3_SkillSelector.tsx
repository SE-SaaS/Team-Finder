'use client';

import { useMemo } from 'react';
import type { Course, ProfileData } from '@/types/profile';
import { SKILL_LOCKS } from '@/data/skillLocks';
import SkillPill from '@/lib/SkillPill';

interface Step3Props {
  data:             Partial<ProfileData>;
  availableCourses: Course[];
  onChange:         (data: Partial<ProfileData>) => void;
  onNext:           () => void;
  onBack:           () => void;
}

interface UnlockSets {
  fullyUnlocked: Set<string>;
  provisional:   Set<string>;
}

/**
 * Skill maturity ladder (per design notes):
 *   0 locked       no path
 *   1 provisional  in_progress course unlocks it
 *   2 unlocked     completed   course unlocks it
 *   3 verified     exam pass / project completion (future)
 *
 * Source of truth for what each course unlocks is course.unlocks_skills in
 * the DB (not SKILL_LOCKS.unlockableByCourses, which has stale fake IDs).
 *
 * Prereq gate is structurally in place but a no-op today because
 * courses.prerequisite_ids is empty for all 458 seeded rows. When B.3 seeds
 * real prereqs, this just starts respecting them with no code change.
 */
function deriveUnlocks(
  completed: NonNullable<ProfileData['completedCourses']>,
  catalog:   Course[],
  year:      ProfileData['year'] | undefined,
): UnlockSets {
  const fullyUnlocked = new Set<string>();
  const provisional   = new Set<string>();

  // First pass: which course codes count as "completed" for prereq checks?
  const completedCodes = new Set<string>();
  for (const c of completed) {
    if (c.status === 'completed') completedCodes.add(c.code);
  }

  for (const c of completed) {
    const course = catalog.find(x => x.code === c.code);
    if (!course?.unlocks_skills?.length) continue;

    const prereqs = course.prerequisite_ids ?? [];
    if (prereqs.length > 0 && !prereqs.every(p => completedCodes.has(p))) continue;

    for (const s of course.unlocks_skills) {
      if (c.status === 'completed')        fullyUnlocked.add(s);
      else if (c.status === 'in_progress') provisional.add(s);
    }
  }

  // Promotion: anything in both sets is fully unlocked, not provisional.
  for (const s of Array.from(provisional)) {
    if (fullyUnlocked.has(s)) provisional.delete(s);
  }

  // Year-1 C++ freebie (the one hardcoded exception we carry from the
  // orphan Step3). Documented; revisit if/when curriculum changes.
  if (year === '1st') fullyUnlocked.add('C++');

  return { fullyUnlocked, provisional };
}

export default function Step3_SkillSelector({
  data,
  availableCourses,
  onChange,
  onNext,
  onBack,
}: Step3Props) {
  const yearNum = data.year ? parseInt(data.year.charAt(0), 10) : null;

  const { fullyUnlocked, provisional } = useMemo(
    () => deriveUnlocks(data.completedCourses ?? [], availableCourses, data.year),
    [data.completedCourses, availableCourses, data.year],
  );

  const selected = useMemo(() => new Set(data.skills ?? []), [data.skills]);

  function toggleSkill(name: string): void {
    const cur  = data.skills ?? [];
    const next = cur.includes(name)
      ? cur.filter(s => s !== name)
      : [...cur, name];
    onChange({ ...data, skills: next });
  }

  // Counter math
  const unlockedCount    = fullyUnlocked.size + provisional.size;
  const lockedCount      = SKILL_LOCKS.length - unlockedCount;
  const selectedCount    = selected.size;

  // Validation: year 1 students may have 0 skills; everyone else needs >= 1.
  const minRequired      = yearNum === 1 ? 0 : 1;
  const canAdvance       = selectedCount >= minRequired;

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-white font-bold text-xl mb-1">Skills</h2>
        <p className="text-gray-500 text-sm">
          Skills unlock as you complete courses. Courses you are taking right now grant a
          <span className="text-amber-300"> provisional </span>
          unlock so you can still apply to projects that need them.
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="text-white">
          <span className="text-[#dc2626] font-bold text-base">{selectedCount}</span> selected
        </span>
        <span className="text-gray-500">|</span>
        <span className="text-gray-400">
          <span className="text-emerald-400 font-semibold">{fullyUnlocked.size}</span> fully unlocked
        </span>
        <span className="text-gray-500">|</span>
        <span className="text-gray-400">
          <span className="text-amber-400 font-semibold">{provisional.size}</span> learning
        </span>
        <span className="text-gray-500">|</span>
        <span className="text-gray-600">{lockedCount} locked</span>
      </div>

      <div className="flex flex-wrap gap-2 p-1">
        {SKILL_LOCKS.map(lock => {
          const isFully = fullyUnlocked.has(lock.skill);
          const isProv  = provisional.has(lock.skill);
          const isUnlk  = isFully || isProv;
          return (
            <SkillPill
              key={lock.skill}
              skill={lock.skill}
              isLocked={!isUnlk}
              isSelected={selected.has(lock.skill)}
              isProvisional={isProv}
              onClick={() => toggleSkill(lock.skill)}
              lockReason={!isUnlk ? `Complete a course that teaches ${lock.skill} to unlock it.` : undefined}
            />
          );
        })}
      </div>

      {!canAdvance && (
        <p className="text-xs text-[#dc2626]">
          Select at least {minRequired} skill{minRequired === 1 ? '' : 's'} you have.
        </p>
      )}

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
          onClick={onNext}
          disabled={!canAdvance}
          className="bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
