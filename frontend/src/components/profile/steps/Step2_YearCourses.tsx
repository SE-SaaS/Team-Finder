'use client';

/**
 * Step 2: Year & Courses
 * Academic year + semester selection + completed courses
 * Fetches courses dynamically from ISR API based on university and major
 */

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { ProfileData, YearLevel, Course } from '@/types/profile';
import { getSkillName } from '@/constants/skills';

interface Step2Props {
  data: Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2_YearCourses({ data, onChange, onNext, onBack }: Step2Props) {
  const { user } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch courses from ISR API when university and major are available
  useEffect(() => {
    async function fetchCourses() {
      // Need university from user metadata and major from Step 1
      const university = user?.user_metadata?.university || data.university;
      const major = data.major;

      if (!university || !major) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setFetchError(null);

        const response = await fetch(`/api/courses/${university}/${major}`, {
          next: { revalidate: 86400 }, // ISR: 24-hour cache
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const coursesData = await response.json();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setFetchError('Unable to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [user, data.university, data.major]);

  // Auto-select previous year courses when year or courses change (if year > 1)
  useEffect(() => {
    if (!data.year || courses.length === 0) return;

    const yearNum = parseInt(data.year.charAt(0));
    if (yearNum <= 1) return;

    // Auto-select all courses from previous years
    const previousYearCourses = courses.filter(course => course.year < yearNum);
    const previousCourseIds = previousYearCourses.map(c => c.id);

    if (previousCourseIds.length === 0) return;

    // Merge with existing completed courses (preserve manual selections in current year)
    const existingCompleted = data.completedCourses || [];

    // Keep courses from current year that user manually selected/deselected
    const currentYearManualSelections = existingCompleted.filter(id => {
      const course = courses.find(c => c.id === id);
      return course && course.year >= yearNum;
    });

    // Combine: all previous year courses + manual current year selections
    const allCompleted = Array.from(new Set([...previousCourseIds, ...currentYearManualSelections]));

    // Only update if there's a difference (avoid infinite loop)
    const isDifferent = JSON.stringify([...existingCompleted].sort()) !== JSON.stringify([...allCompleted].sort());

    if (isDifferent) {
      onChange({
        ...data,
        completedCourses: allCompleted
      });
    }
  }, [data.year, courses]); // Run when year or courses change

  const handleYearChange = (year: YearLevel) => {
    const yearNum = parseInt(year.charAt(0));

    // Auto-complete courses from previous years
    if (yearNum > 1) {
      const previousYearCourses = courses.filter(course => course.year < yearNum);
      const previousCourseIds = previousYearCourses.map(c => c.id);

      // Merge with existing completed courses (avoid duplicates)
      const existingCompleted = data.completedCourses || [];
      const allCompleted = Array.from(new Set([...existingCompleted, ...previousCourseIds]));

      onChange({
        ...data,
        year,
        completedCourses: allCompleted
      });
    } else {
      onChange({ ...data, year });
    }

    if (errors.year) {
      setErrors({ ...errors, year: '' });
    }
  };

  const handleSemesterChange = (semester: 1 | 2) => {
    onChange({ ...data, semester });
    if (errors.semester) {
      setErrors({ ...errors, semester: '' });
    }
  };

  // Get numeric year from YearLevel string (e.g., "1st" -> 1)
  const getCurrentYearNumber = (): number => {
    if (!data.year) return 1;
    return parseInt(data.year.charAt(0));
  };

  const getCurrentSemester = (): number => {
    return data.semester || 1;
  };

  // Clear all auto-completed courses (for students who failed courses)
  const handleClearAutoCompleted = () => {
    const currentYear = getCurrentYearNumber();
    const manuallySelectedCourses = (data.completedCourses || []).filter(courseId => {
      const course = courses.find(c => c.id === courseId);
      return course && course.year >= currentYear;
    });

    onChange({
      ...data,
      completedCourses: manuallySelectedCourses
    });
  };

  const handleCourseToggle = (courseId: string) => {
    const currentCourses = data.completedCourses || [];
    const newCourses = currentCourses.includes(courseId)
      ? currentCourses.filter(id => id !== courseId)
      : [...currentCourses, courseId];

    onChange({ ...data, completedCourses: newCourses });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.year) {
      newErrors.year = 'Please select your academic year';
    }
    if (!data.semester) {
      newErrors.semester = 'Please select your current semester';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  // Group courses by year and semester
  const coursesByYearAndSemester = useMemo(() => {
    const grouped: Record<string, Course[]> = {};
    courses.forEach((course) => {
      const key = `${course.year}-${course.semester}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(course);
    });
    return grouped;
  }, [courses]);

  // Get year label (1st, 2nd, 3rd, 4th)
  const getYearLabel = (year: number): string => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = year % 100;
    return year + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Academic Year & Courses</h2>
        <p className="text-white/60">Select your current semester and mark completed courses</p>
      </div>

      {/* Year Selection */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-3">
          Current Academic Year <span className="text-[#e8294a]">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['1st', '2nd', '3rd', '4th'] as YearLevel[]).map((year) => (
            <button
              key={year}
              onClick={() => handleYearChange(year)}
              className={`
                px-6 py-4 rounded-lg font-semibold transition-all
                ${
                  data.year === year
                    ? 'bg-[#4455ff] text-white shadow-[0_0_20px_rgba(68,85,255,0.4)]'
                    : 'bg-[#0f0f18] text-white/60 border border-white/10 hover:border-[#4455ff]/50 hover:text-white'
                }
              `}
            >
              {year} Year
            </button>
          ))}
        </div>
        {errors.year && (
          <p className="mt-2 text-sm text-[#e8294a] flex items-center gap-1">
            <span>⚠</span> {errors.year}
          </p>
        )}
      </div>

      {/* Semester Selection */}
      {data.year && (
        <div>
          <label className="block text-sm font-medium text-white/70 mb-3">
            Current Semester <span className="text-[#e8294a]">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((sem) => (
              <button
                key={sem}
                onClick={() => handleSemesterChange(sem as 1 | 2)}
                className={`
                  px-6 py-4 rounded-lg font-semibold transition-all
                  ${
                    data.semester === sem
                      ? 'bg-[#4455ff] text-white shadow-[0_0_20px_rgba(68,85,255,0.4)]'
                      : 'bg-[#0f0f18] text-white/60 border border-white/10 hover:border-[#4455ff]/50 hover:text-white'
                  }
                `}
              >
                Semester {sem}
              </button>
            ))}
          </div>
          {errors.semester && (
            <p className="mt-2 text-sm text-[#e8294a] flex items-center gap-1">
              <span>⚠</span> {errors.semester}
            </p>
          )}
        </div>
      )}

      {/* Courses Selection */}
      {data.year && data.semester && (
        <div>
          <label className="block text-sm font-medium text-white/70 mb-3">
            Completed Courses <span className="text-white/40">(Optional)</span>
          </label>
          <p className="text-sm text-white/50 mb-4">
            Select courses you've completed to unlock additional skills.
          </p>

          {/* Auto-completion Info */}
          {getCurrentYearNumber() > 1 && (
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-blue-400 text-lg">ℹ️</span>
                  <div className="flex-1">
                    <p className="text-sm text-blue-200 mb-2">
                      <strong>Auto-Selected:</strong> Courses from Year {getCurrentYearNumber() - 1} and below are pre-selected.
                    </p>
                    <p className="text-xs text-blue-300/70">
                      💡 <strong>Failed a course?</strong> Simply uncheck it below. Only select courses you actually passed.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClearAutoCompleted}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 transition-all whitespace-nowrap"
                  title="Clear all auto-selected courses from previous years"
                >
                  Clear All Previous
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-8 text-white/50">
              Loading courses...
            </div>
          )}

          {fetchError && (
            <div className="text-center py-8 text-[#e8294a]">
              {fetchError}
            </div>
          )}

          {!loading && !fetchError && courses.length === 0 && (
            <div className="text-center py-8 text-white/50">
              No courses found for {data.major} at {data.university}.
            </div>
          )}

          {!loading && !fetchError && courses.length > 0 && (
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {[1, 2, 3, 4].map((year) =>
                [1, 2].map((semester) => {
                  const currentYear = getCurrentYearNumber();
                  const currentSemester = getCurrentSemester();

                  // Only show courses up to current year/semester
                  // For past years: show all semesters
                  // For current year: only show up to current semester
                  if (year > currentYear) return null;
                  if (year === currentYear && semester > currentSemester) return null;

                  const key = `${year}-${semester}`;
                  const semesterCourses = coursesByYearAndSemester[key];

                  if (!semesterCourses || semesterCourses.length === 0) return null;

                  return (
                    <div key={key} className="space-y-2">
                      <h3 className="text-sm font-semibold text-white/70 sticky top-0 bg-[#16161f] py-2">
                        {getYearLabel(year)} Year - Semester {semester}
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {semesterCourses.map((course) => {
                          const isSelected = data.completedCourses?.includes(course.id) || false;
                          const currentYear = getCurrentYearNumber();
                          const isAutoCompleted = course.year < currentYear && isSelected;

                          return (
                            <button
                              key={course.id}
                              onClick={() => handleCourseToggle(course.id)}
                              className={`
                                px-4 py-3 rounded-lg text-left transition-all
                                ${
                                  isSelected
                                    ? isAutoCompleted
                                      ? 'bg-yellow-500/10 border-2 border-yellow-500/40 text-white'
                                      : 'bg-[#4455ff]/20 border-2 border-[#4455ff] text-white'
                                    : 'bg-[#0f0f18] border border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                                }
                              `}
                            >
                              <div className="flex items-start gap-3">
                                {/* Checkbox */}
                                <div
                                  className={`
                                    w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-all
                                    ${
                                      isSelected
                                        ? 'bg-[#4455ff] border-2 border-[#4455ff]'
                                        : 'bg-transparent border-2 border-white/30'
                                    }
                                  `}
                                >
                                  {isSelected && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>

                                {/* Course Info */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {course.code} - {course.name}
                                    </span>
                                    {isAutoCompleted && (
                                      <span className="px-2 py-0.5 text-xs rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                        ⚡ Auto-Selected
                                      </span>
                                    )}
                                  </div>
                                  {course.description && (
                                    <div className="text-xs text-white/40 mt-1">
                                      {course.description}
                                    </div>
                                  )}
                                  {course.unlocks_skills && course.unlocks_skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {course.unlocks_skills.map((skillId) => {
                                        const skillName = getSkillName(skillId);
                                        return skillName ? (
                                          <span
                                            key={skillId}
                                            className="px-2 py-0.5 text-xs rounded bg-[#4455ff]/20 text-[#4455ff] border border-[#4455ff]/30"
                                          >
                                            {skillName}
                                          </span>
                                        ) : null;
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          <p className="text-xs text-white/40 mt-3">
            Selected {data.completedCourses?.length || 0} course{data.completedCourses?.length !== 1 ? 's' : ''}
          </p>
        </div>
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
          disabled={!data.year || !data.semester}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all
            ${
              data.year && data.semester
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
