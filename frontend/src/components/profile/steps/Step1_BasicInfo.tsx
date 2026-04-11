'use client';

/**
 * Step 1: Basic Info
 * University (read-only from session), Major, Specialization, Year
 */

import { useState, useEffect } from 'react';
import type { ProfileData } from '@/types/profile';
import { MAJOR_CODES, getMajorInfo } from '@/data/majors';
import { validateStep1 } from '@/lib/validation/profileValidation';
import { useAuth } from '@/contexts/AuthContext';

interface Step1Props {
  data: Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  onNext: () => void;
}

export default function Step1_BasicInfo({ data, onChange, onNext }: Step1Props) {
  const { session } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableSpecializations, setAvailableSpecializations] = useState<string[]>([]);

  // Load university from session on mount
  useEffect(() => {
    const university = session?.user?.user_metadata?.university;
    if (university) {
      onChange({ ...data, university });
    }
  }, [session]);

  // Load specializations when major changes
  useEffect(() => {
    if (data.major) {
      const majorInfo = getMajorInfo(data.major);
      setAvailableSpecializations(majorInfo?.specializations || []);
    } else {
      setAvailableSpecializations([]);
    }
  }, [data.major]);

  const handleChange = (field: keyof ProfileData, value: string) => {
    const newData: Partial<ProfileData> = { ...data, [field]: value };

    // Reset specialization when major changes
    if (field === 'major' && value !== data.major) {
      newData.specialization = '';
      const majorInfo = getMajorInfo(value);
      setAvailableSpecializations(majorInfo?.specializations || []);
    }

    onChange(newData);

    // Clear error when user makes a selection
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors = validateStep1({
      major: data.major || '',
      specialization: data.specialization || '',
    });
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
        <h2 className="text-3xl font-bold text-white mb-2">Basic Information</h2>
        <p className="text-white/60">Let's start with the basics</p>
      </div>

      {/* University Field (Read-only) */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          University
        </label>
        <input
          type="text"
          value={data.university || 'Loading...'}
          disabled
          className="w-full px-4 py-3 rounded-lg bg-[#0f0f18] border border-white/10 text-white/50 cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-white/40">Pulled from your account settings</p>
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
          {MAJOR_CODES.map((code) => (
            <option key={code} value={code} className="bg-[#16161f]">
              {getMajorInfo(code)?.name} ({code})
            </option>
          ))}
        </select>
        {errors.major && (
          <p className="mt-2 text-sm text-[#e8294a] flex items-center gap-1">
            <span>⚠</span> {errors.major}
          </p>
        )}
      </div>

      {/* Specialization Dropdown */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Specialization <span className="text-[#e8294a]">*</span>
        </label>
        <select
          value={data.specialization || ''}
          onChange={(e) => handleChange('specialization', e.target.value)}
          disabled={!data.major}
          className={`
            w-full px-4 py-3 rounded-lg bg-[#0f0f18] border text-white
            transition-all cursor-pointer
            focus:outline-none focus:ring-2
            ${
              !data.major
                ? 'border-white/10 text-white/30 cursor-not-allowed'
                : errors.specialization
                ? 'border-[#e8294a] focus:ring-[#e8294a]/50'
                : 'border-white/10 focus:border-[#4455ff] focus:ring-[#4455ff]/50'
            }
          `}
        >
          <option value="" className="bg-[#16161f]">
            {!data.major ? 'Select a major first' : 'Select your specialization'}
          </option>
          {availableSpecializations.map((spec) => (
            <option key={spec} value={spec} className="bg-[#16161f]">
              {spec}
            </option>
          ))}
        </select>
        {errors.specialization && (
          <p className="mt-2 text-sm text-[#e8294a] flex items-center gap-1">
            <span>⚠</span> {errors.specialization}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleNext}
          disabled={!data.major || !data.specialization}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all
            ${
              data.major && data.specialization
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
