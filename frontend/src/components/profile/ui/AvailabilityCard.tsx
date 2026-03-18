'use client';

/**
 * AvailabilityCard Component
 * Selectable card for schedule preferences
 */

import type { AvailabilityType } from '@/types/profile';

interface AvailabilityCardProps {
  label: string;
  description: string;
  value: AvailabilityType;
  selected: boolean;
  onClick: () => void;
  icon: string;
}

export default function AvailabilityCard({
  label,
  description,
  value,
  selected,
  onClick,
  icon,
}: AvailabilityCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative p-6 rounded-xl text-left transition-all duration-300
        ${
          selected
            ? 'bg-[#4455ff]/20 border-2 border-[#4455ff] shadow-[0_0_25px_rgba(68,85,255,0.4)] scale-105'
            : 'bg-[#0f0f18] border-2 border-white/10 hover:border-[#4455ff]/50 hover:bg-[#4455ff]/5'
        }
      `}
    >
      {/* Icon */}
      <div className="text-4xl mb-3">{icon}</div>

      {/* Label */}
      <h3
        className={`text-xl font-bold mb-2 transition-colors ${
          selected ? 'text-white' : 'text-white/80'
        }`}
      >
        {label}
      </h3>

      {/* Description */}
      <p
        className={`text-sm transition-colors ${
          selected ? 'text-white/80' : 'text-white/50'
        }`}
      >
        {description}
      </p>

      {/* Selected Indicator */}
      {selected && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 rounded-full bg-[#4455ff] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
}
