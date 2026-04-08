'use client';

import { useState } from 'react';
import type { ProfileData, AvailabilityType } from '@/types/profile';
import AvailabilityCard from '@/components/profile/ui/AvailabilityCard';

interface Step6Props {
  data: Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step6_Availability({ data, onChange, onNext, onBack }: Step6Props) {
  const availabilityOptions: Array<{
    value: AvailabilityType;
    label: string;
    description: string;
    icon: string;
  }> = [
    { value: 'Full-time', label: 'Full-time', description: 'Available 40+ hours/week for projects', icon: '⏰' },
    { value: 'Flexible',  label: 'Flexible',  description: 'Can adjust schedule as needed',        icon: '🔄' },
    { value: 'Evenings',  label: 'Evenings',  description: 'Primarily evenings after 5pm',         icon: '🌙' },
    { value: 'Weekends',  label: 'Weekends',  description: 'Weekends only',                        icon: '📅' },
  ];

  const handleSelect = (availability: AvailabilityType) => {
    onChange({ ...data, availability });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Your Availability</h2>
        <p className="text-white/60">How much time can you dedicate to projects?</p>
      </div>

      {/* Availability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availabilityOptions.map((option) => (
          <AvailabilityCard
            key={option.value}
            label={option.label}
            description={option.description}
            value={option.value}
            selected={data.availability === option.value}
            onClick={() => handleSelect(option.value)}
            icon={option.icon}
          />
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-sm text-blue-200">
          💡 <strong>Note:</strong> This affects your match score (20% weight). You can update this anytime.
        </p>
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
          onClick={onNext}
          disabled={!data.availability}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all
            ${
              data.availability
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