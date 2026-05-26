'use client';

import type { ProfileData, AvailabilityType } from '@/types/profile';

interface Step6Props {
  data:     Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  onNext:   () => void;
  onBack:   () => void;
}

const OPTIONS: Array<{ value: AvailabilityType; label: string; description: string }> = [
  { value: 'Full-time', label: 'Full-time', description: 'I can dedicate full days to a project.' },
  { value: 'Flexible',  label: 'Flexible',  description: 'Lots of free time, easy to schedule.' },
  { value: 'Evenings',  label: 'Evenings',  description: 'Busy with classes by day, evenings are mine.' },
  { value: 'Weekends',  label: 'Weekends',  description: 'Only weekends.' },
];

export default function Step6_Availability({ data, onChange, onNext, onBack }: Step6Props) {
  const selected = data.availability;
  const canAdvance = !!selected;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-white font-bold text-xl mb-1">Availability</h2>
        <p className="text-gray-500 text-sm">
          When are you free to work on projects? Pick the one that fits best.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange({ ...data, availability: opt.value })}
            className={`text-left p-4 rounded-lg border-2 transition-all
              ${selected === opt.value
                ? 'bg-[#dc2626]/15 border-[#dc2626] text-white'
                : 'bg-[#1a1a1a] border-gray-700 text-gray-400 hover:border-[#dc2626] hover:text-white'
              }`}
          >
            <div className="font-semibold text-sm mb-1">{opt.label}</div>
            <div className="text-xs opacity-70">{opt.description}</div>
          </button>
        ))}
      </div>

      {!canAdvance && (
        <p className="text-xs text-[#dc2626]">Pick the one that best matches your schedule.</p>
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
