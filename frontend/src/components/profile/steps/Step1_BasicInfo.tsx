'use client';

/**
 * Step 1: Basic Info
 * Name, University, Major
 */

import { useState } from 'react';
import type { ProfileData } from '@/types/profile';
import { IT_MAJORS } from '@/data/majors';

interface Step1Props {
  data: Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  onNext: () => void;
}

export default function Step1_BasicInfo({ data, onChange, onNext }: Step1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ProfileData, value: string) => {
    onChange({ ...data, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.name || data.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!data.university || data.university.trim().length < 2) {
      newErrors.university = 'University name is required';
    }

    if (!data.major) {
      newErrors.major = 'Please select your major';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Basic Information</h2>
        <p className="text-white/60">Let's start with the basics</p>
      </div>

      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Full Name <span className="text-[#e8294a]">*</span>
        </label>
        <input
          type="text"
          value={data.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your full name"
          className={`
            w-full px-4 py-3 rounded-lg bg-[#0f0f18] border text-white
            placeholder:text-white/30 transition-all
            focus:outline-none focus:ring-2
            ${
              errors.name
                ? 'border-[#e8294a] focus:ring-[#e8294a]/50'
                : 'border-white/10 focus:border-[#4455ff] focus:ring-[#4455ff]/50'
            }
          `}
        />
        {errors.name && (
          <p className="mt-2 text-sm text-[#e8294a] flex items-center gap-1">
            <span>⚠</span> {errors.name}
          </p>
        )}
      </div>

      {/* University Field */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          University <span className="text-[#e8294a]">*</span>
        </label>
        <input
          type="text"
          value={data.university || ''}
          onChange={(e) => handleChange('university', e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your university name"
          className={`
            w-full px-4 py-3 rounded-lg bg-[#0f0f18] border text-white
            placeholder:text-white/30 transition-all
            focus:outline-none focus:ring-2
            ${
              errors.university
                ? 'border-[#e8294a] focus:ring-[#e8294a]/50'
                : 'border-white/10 focus:border-[#4455ff] focus:ring-[#4455ff]/50'
            }
          `}
        />
        {errors.university && (
          <p className="mt-2 text-sm text-[#e8294a] flex items-center gap-1">
            <span>⚠</span> {errors.university}
          </p>
        )}
      </div>

      {/* Major Dropdown */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Major <span className="text-[#e8294a]">*</span>
        </label>
        <select
          value={data.major || ''}
          onChange={(e) => handleChange('major', e.target.value)}
          className={`
            w-full px-4 py-3 rounded-lg bg-[#0f0f18] border text-white
            transition-all cursor-pointer
            focus:outline-none focus:ring-2
            ${
              errors.major
                ? 'border-[#e8294a] focus:ring-[#e8294a]/50'
                : 'border-white/10 focus:border-[#4455ff] focus:ring-[#4455ff]/50'
            }
          `}
        >
          <option value="" className="bg-[#16161f]">Select your major</option>
          {IT_MAJORS.map((major) => (
            <option key={major} value={major} className="bg-[#16161f]">
              {major}
            </option>
          ))}
        </select>
        {errors.major && (
          <p className="mt-2 text-sm text-[#e8294a] flex items-center gap-1">
            <span>⚠</span> {errors.major}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleNext}
          disabled={!data.name || !data.university || !data.major}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all
            ${
              data.name && data.university && data.major
                ? 'bg-[#4455ff] text-white hover:bg-[#5566ff] shadow-[0_0_20px_rgba(68,85,255,0.3)] hover:shadow-[0_0_30px_rgba(68,85,255,0.5)]'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }
          `}
        >
          Next Step →
        </button>
      </div>
    </div>
  );
}
