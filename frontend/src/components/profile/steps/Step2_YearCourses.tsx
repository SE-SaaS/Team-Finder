'use client';

import { useMemo } from 'react';
import type { CompletedCourse, Course, ProfileData } from '@/types/profile';

interface Step2Props {
  data:             Partial<ProfileData>;
  availableCourses: Course[];
  onChange:         (data: Partial<ProfileData>) => void;
  onNext:           () => void;
  onBack:           () => void;
}

const YEARS: ProfileData['year'][] = ['1st', '2nd', '3rd', '4th'];
const SEMESTERS: Array<1 | 2>      = [1, 2];

type YearPhase = 'past' | 'current' | 'future' | 'unknown';

export default function Step2_YearCourses({
  data,
  availableCourses,
  onChange,
  onNext,
  onBack,
}: Step2Props) {
  const year     = data.year;
  const semester = data.semester;
  const yearNum  = year ? parseInt(year.charAt(0), 10) : null;

  const selectedByCode = useMemo(() => {
    const m = new Map<string, CompletedCourse>();
    for (const c of data.completedCourses ?? []) m.set(c.code, c);
    return m;
  }, [data.completedCourses]);

  // Group by Y/S, sorted ascending (Y1S1 -> Y4S2).
  const grouped = useMemo(() => {
    const m = new Map<string, Course[]>();
    for (const c of availableCourses) {
      const key = `Y${c.year}S${c.semester}`;
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(c);
    }
    return Array.from(m.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [availableCourses]);

  function phaseOf(courseYear: number, courseSemester: number): YearPhase {
    if (!yearNum || !semester) return 'unknown';
    if (courseYear < yearNum) return 'past';
    if (courseYear === yearNum && courseSemester < semester) return 'past';
    if (courseYear === yearNum && courseSemester === semester) return 'current';
    return 'future';
  }

  function toggleCourse(course: Course): void {
    const phase = phaseOf(course.year, course.semester);
    if (phase === 'future' || phase === 'unknown') return;

    const existing = selectedByCode.get(course.code);
    const all      = data.completedCourses ?? [];

    if (existing) {
      onChange({
        ...data,
        completedCourses: all.filter(c => c.code !== course.code),
      });
    } else {
      const status: CompletedCourse['status'] =
        phase === 'current' ? 'in_progress' : 'completed';
      onChange({
        ...data,
        completedCourses: [...all, { code: course.code, name: course.name, status }],
      });
    }
  }

  function setStatus(course: Course, status: CompletedCourse['status']): void {
    const all = data.completedCourses ?? [];
    onChange({
      ...data,
      completedCourses: all.map(c =>
        c.code === course.code ? { ...c, status } : c
      ),
    });
  }

  const canAdvance       = !!year && !!semester;
  const selectedCount    = (data.completedCourses ?? []).length;

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-white font-bold text-xl mb-1">Year &amp; Courses</h2>
        <p className="text-gray-500 text-sm">
          Pick your current year and semester, then mark the courses you have done or are taking now.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">Academic Year</label>
        <div className="grid grid-cols-4 gap-3">
          {YEARS.map(y => (
            <button
              key={y}
              type="button"
              onClick={() => onChange({ ...data, year: y })}
              className={`py-3 rounded-lg font-semibold text-sm transition-all
                ${year === y
                  ? 'bg-[#dc2626] text-white'
                  : 'bg-[#1a1a1a] border border-gray-700 text-gray-400 hover:border-[#dc2626] hover:text-white'
                }`}
            >
              {y} Year
            </button>
          ))}
        </div>
      </div>

      {year && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Semester</label>
          <div className="grid grid-cols-2 gap-3">
            {SEMESTERS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ ...data, semester: s })}
                className={`py-3 rounded-lg font-semibold text-sm transition-all
                  ${semester === s
                    ? 'bg-[#dc2626] text-white'
                    : 'bg-[#1a1a1a] border border-gray-700 text-gray-400 hover:border-[#dc2626] hover:text-white'
                  }`}
              >
                Semester {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {year && semester && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Courses through {year} year, semester {semester}
          </label>
          {grouped.length === 0 ? (
            <p className="text-sm text-gray-500">
              No courses found for this major. Try again once your major is set.
            </p>
          ) : (
            <div className="space-y-5">
              {grouped.map(([key, courses]) => {
                const phase = phaseOf(courses[0].year, courses[0].semester);
                if (phase === 'future') return null;

                return (
                  <div key={key}>
                    <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                      <span>{key}</span>
                      {phase === 'current' && (
                        <span className="text-[#dc2626]">CURRENT  -  in-progress only</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {courses.map(c => {
                        const sel        = selectedByCode.get(c.code);
                        const isSelected = !!sel;
                        const isCurrent  = phase === 'current';
                        return (
                          <div
                            key={c.code}
                            className={`rounded-lg border-2 transition-all
                              ${isSelected
                                ? 'bg-[#dc2626]/15 border-[#dc2626]'
                                : 'bg-[#1a1a1a] border-gray-700 hover:border-[#dc2626]'
                              }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggleCourse(c)}
                              className="w-full text-left px-4 py-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                    {c.code}  -  {c.name}
                                  </div>
                                  {c.unlocks_skills && c.unlocks_skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                      {c.unlocks_skills.map(s => (
                                        <span
                                          key={s}
                                          className="text-[10px] px-2 py-0.5 rounded bg-[#dc2626]/10 text-[#dc2626] border border-[#dc2626]/20"
                                        >
                                          {s}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {isSelected && (
                                  <span className="shrink-0 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#dc2626]/30 text-white">
                                    {sel.status === 'completed' ? 'Done' : 'In Progress'}
                                  </span>
                                )}
                              </div>
                            </button>
                            {isSelected && !isCurrent && (
                              <div className="border-t border-gray-700 px-4 py-2 flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setStatus(c, 'completed')}
                                  className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded transition-colors
                                    ${sel.status === 'completed'
                                      ? 'bg-[#dc2626] text-white'
                                      : 'bg-transparent border border-gray-700 text-gray-400 hover:border-[#dc2626]'
                                    }`}
                                >
                                  Completed
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setStatus(c, 'in_progress')}
                                  className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded transition-colors
                                    ${sel.status === 'in_progress'
                                      ? 'bg-[#dc2626] text-white'
                                      : 'bg-transparent border border-gray-700 text-gray-400 hover:border-[#dc2626]'
                                    }`}
                                >
                                  In Progress
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <p className="mt-3 text-xs text-gray-500">
            {selectedCount} course{selectedCount !== 1 ? 's' : ''} marked
          </p>
        </div>
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
