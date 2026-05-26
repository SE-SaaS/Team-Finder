'use client';

import type { ProfileData } from '@/types/profile';

interface Step5Props {
  data:     Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  onNext:   () => void;
  onBack:   () => void;
}

export default function Step5_SkillExams({ onNext, onBack }: Step5Props) {
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-white font-bold text-xl mb-1">Skill verification</h2>
        <p className="text-gray-500 text-sm">
          Coming soon. You will be able to verify your skills with short exams
          later from your profile page.
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-gray-700 bg-[#0f0f18] p-6 text-center">
        <p className="text-gray-400 text-sm">
          For now, the skills you picked stand on the courses you have completed.
        </p>
        <p className="text-gray-600 text-xs mt-2">
          Self-claimed and provisional skills can be verified later.
        </p>
      </div>

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
          className="bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
