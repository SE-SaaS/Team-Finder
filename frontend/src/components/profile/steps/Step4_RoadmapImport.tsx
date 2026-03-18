'use client';

/**
 * Step 4: Roadmap.sh Import
 * Placeholder - OAuth integration (future feature)
 */

import type { ProfileData } from '@/types/profile';
import { useEffect } from 'react';

interface Step4Props {
  data: Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step4_RoadmapImport({ data, onChange, onNext, onBack }: Step4Props) {
  // Auto-skip to next step after 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="space-y-6 text-center py-12">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Roadmap.sh Integration</h2>
        <p className="text-white/60">Auto-verify skills from roadmap.sh</p>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-[#0f0f18] border border-white/10 rounded-xl p-12">
        <div className="text-6xl mb-4">🚀</div>
        <h3 className="text-2xl font-bold text-white mb-3">Coming Soon</h3>
        <p className="text-white/60 max-w-md mx-auto mb-6">
          OAuth integration with roadmap.sh will allow automatic verification of your completed skills.
        </p>
        <p className="text-sm text-white/40">Skipping to next step...</p>
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
          className="px-8 py-3 rounded-lg font-semibold bg-[#4455ff] text-white hover:bg-[#5566ff] shadow-[0_0_20px_rgba(68,85,255,0.3)] transition-all"
        >
          Skip →
        </button>
      </div>
    </div>
  );
}
