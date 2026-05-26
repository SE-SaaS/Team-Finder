'use client';

import { useState } from 'react';

interface SkillPillProps {
  skill: string;
  isLocked: boolean;
  isSelected: boolean;
  isVerified?: boolean;
  isProvisional?: boolean;
  onClick: () => void;
  lockReason?: string;
}

export default function SkillPill({
  skill,
  isLocked,
  isSelected,
  isVerified = false,
  isProvisional = false,
  onClick,
  lockReason,
}: SkillPillProps) {
  const [showTooltip, setShowTooltip] = useState(false);

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
          group relative px-3 py-1.5 rounded-md font-medium text-xs
          transition-colors duration-150 flex items-center gap-1.5
          ${
            isLocked
              ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
              : isSelected
              ? 'bg-[#dc2626] text-white border-2 border-[#b91c1c]'
              : isProvisional
              ? 'bg-[#0f0f18] text-white/70 border-2 border-dashed border-amber-500/60 hover:border-[#dc2626] hover:text-white cursor-pointer'
              : 'bg-[#0f0f18] text-white/70 border border-white/20 hover:border-[#dc2626] hover:text-white cursor-pointer'
          }
        `}
      >
        {isLocked && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        )}

        <span>{skill}</span>

        {isProvisional && !isLocked && (
          <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Learning
          </span>
        )}

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
