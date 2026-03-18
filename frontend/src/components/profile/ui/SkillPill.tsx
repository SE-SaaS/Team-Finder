'use client';

/**
 * SkillPill Component
 * Displays a skill with 3 states: unlocked/selected/locked
 */

import { useState } from 'react';
import type { SkillCategory } from '@/types/profile';

interface SkillPillProps {
  skill: string;
  category: SkillCategory;
  isLocked: boolean;
  isSelected: boolean;
  isVerified?: boolean; // Has passed exam
  onClick: () => void;
  lockReason?: string; // Tooltip message for locked skills
}

export default function SkillPill({
  skill,
  category,
  isLocked,
  isSelected,
  isVerified = false,
  onClick,
  lockReason,
}: SkillPillProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const categoryColors = {
    Frontend: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Backend: 'bg-green-500/10 text-green-400 border-green-500/20',
    Database: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    DevOps: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Mobile: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    Other: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  const handleClick = () => {
    if (isLocked) {
      // Show tooltip briefly
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } else {
      onClick();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => isLocked && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={isLocked && !lockReason}
        className={`
          group relative px-4 py-2.5 rounded-lg font-medium text-sm
          transition-all duration-200 flex items-center gap-2
          ${
            isLocked
              ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
              : isSelected
              ? 'bg-[#4455ff] text-white border-2 border-[#4455ff] shadow-[0_0_15px_rgba(68,85,255,0.3)] scale-105'
              : 'bg-[#0f0f18] text-white/70 border border-white/20 hover:border-[#4455ff] hover:text-white hover:scale-105 cursor-pointer'
          }
        `}
      >
        {/* Lock Icon */}
        {isLocked && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        )}

        {/* Skill Name */}
        <span>{skill}</span>

        {/* Category Tag */}
        <span className={`text-xs px-2 py-0.5 rounded border ${categoryColors[category]}`}>
          {category}
        </span>

        {/* Verified Badge */}
        {isVerified && !isLocked && (
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* Tooltip for Locked Skills */}
      {isLocked && showTooltip && lockReason && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 whitespace-nowrap">
          <div className="bg-[#16161f] border border-white/20 rounded-lg px-3 py-2 shadow-xl">
            <p className="text-xs text-white/70">{lockReason}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="border-4 border-transparent border-t-[#16161f]"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
