'use client';

/**
 * Step 5: Skill Exams
 * Take exams to verify skills (simplified version - full exam modal to be added)
 */

import type { ProfileData } from '@/types/profile';

interface Step5Props {
  data: Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step5_SkillExams({ data, onChange, onNext, onBack }: Step5Props) {
  const selectedSkills = data.skills || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Skill Verification Exams</h2>
        <p className="text-white/60">
          Take exams to verify your skills. You can skip and take them later from your dashboard.
        </p>
      </div>

      {/* Skills List */}
      <div className="bg-[#0f0f18] border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Your Selected Skills ({selectedSkills.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {selectedSkills.map((skill) => {
            const isVerified = data.examResults?.[skill]?.passed || false;
            return (
              <div
                key={skill}
                className={`
                  px-4 py-3 rounded-lg text-center
                  ${
                    isVerified
                      ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                      : 'bg-white/5 border border-white/10 text-white/70'
                  }
                `}
              >
                {skill}
                {isVerified && ' ✓'}
              </div>
            );
          })}
        </div>

        {/* Exam Placeholder */}
        <div className="bg-[#16161f] rounded-lg p-8 text-center border border-[#4455ff]/20">
          <div className="text-4xl mb-3">📝</div>
          <h4 className="text-xl font-bold text-white mb-2">Exam System</h4>
          <p className="text-white/60 mb-4">
            Full exam modal with HackerRank-style MCQ questions, timer, and scoring will be implemented here.
          </p>
          <p className="text-sm text-white/40">
            For now, you can skip this step and complete exams later from your dashboard.
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-sm text-blue-200">
          💡 <strong>Tip:</strong> Taking exams increases your match score. Higher scores = better team matches!
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
          className="px-8 py-3 rounded-lg font-semibold bg-[#4455ff] text-white hover:bg-[#5566ff] shadow-[0_0_20px_rgba(68,85,255,0.3)] transition-all"
        >
          Skip Exams (Take Later) →
        </button>
      </div>
    </div>
  );
}
