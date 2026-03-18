'use client';

/**
 * Step 2: Year & Courses
 * Academic year selection + completed courses
 */

import { useState, useMemo } from 'react';
import type { ProfileData, YearLevel } from '@/types/profile';
import { COURSES, getCoursesByYear } from '@/data/courses';

interface Step2Props {
  data: Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2_YearCourses({ data, onChange, onNext, onBack }: Step2Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleYearChange = (year: YearLevel) => {
    onChange({ ...data, year });
    if (errors.year) {
      setErrors({ ...errors, year: '' });
    }
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  // Get courses for selected year and nearby years
  const relevantCourses = useMemo(() => {
    if (!data.year) return [];

    const yearNum = parseInt(data.year.charAt(0)); // Extract number from "1st", "2nd", etc.

    // Show courses from current year and previous years
    return COURSES.filter(course => course.recommendedYear <= yearNum);
  }, [data.year]);

  // Group courses by year
  const coursesByYear = useMemo(() => {
    return relevantCourses.reduce((acc, course) => {
      const year = course.recommendedYear;
      if (!acc[year]) acc[year] = [];
      acc[year].push(course);
      return acc;
    }, {} as Record<number, typeof COURSES>);
  }, [relevantCourses]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Academic Year & Courses</h2>
        <p className="text-white/60">Help us understand your skill level</p>
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

      {/* Courses Selection */}
      {data.year && (
        <div>
          <label className="block text-sm font-medium text-white/70 mb-3">
            Completed Courses <span className="text-white/40">(Optional)</span>
          </label>
          <p className="text-sm text-white/50 mb-4">
            Select courses you've completed. This helps unlock additional skills.
          </p>

          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {Object.entries(coursesByYear)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([yearNum, courses]) => (
                <div key={yearNum} className="space-y-2">
                  <h3 className="text-sm font-semibold text-white/70 sticky top-0 bg-[#16161f] py-2">
                    {yearNum}
                    {yearNum === '1' ? 'st' : yearNum === '2' ? 'nd' : yearNum === '3' ? 'rd' : 'th'} Year Courses
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {courses.map((course) => {
                      const isSelected = data.completedCourses?.includes(course.id) || false;
                      return (
                        <button
                          key={course.id}
                          onClick={() => handleCourseToggle(course.id)}
                          className={`
                            px-4 py-3 rounded-lg text-left transition-all
                            ${
                              isSelected
                                ? 'bg-[#4455ff]/20 border-2 border-[#4455ff] text-white'
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
                              <div className="font-medium">{course.code} - {course.name}</div>
                              {course.unlocksSkills.length > 0 && (
                                <div className="text-xs text-white/50 mt-1">
                                  Unlocks: {course.unlocksSkills.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>

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
          disabled={!data.year}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all
            ${
              data.year
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
