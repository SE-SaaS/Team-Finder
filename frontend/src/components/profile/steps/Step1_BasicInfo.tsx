'use client';

import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MAJORS, MAJOR_CODES } from '@/data/majors';
import type { ProfileData } from '@/types/profile';

interface Step1Props {
  data:     Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  onNext:   () => void;
  onBack:   () => void;
}

const UNKNOWN_SPEC = '__unknown__';

export default function Step1_BasicInfo({ data, onChange, onNext }: Step1Props) {
  const { user } = useAuth();
  const university = (user?.user_metadata?.university as string | undefined) ?? '';

  const majorInfo       = data.major ? MAJORS[data.major] : null;
  const specializations = useMemo(() => majorInfo?.specializations ?? [], [majorInfo]);

  // Reset specialization if user changes major (old value may not apply)
  function pickMajor(code: string): void {
    if (code === data.major) return;
    onChange({ ...data, major: code, specialization: '' });
  }

  function pickSpec(spec: string): void {
    // Toggle off if same value clicked twice
    const next = data.specialization === spec ? '' : spec;
    onChange({ ...data, specialization: next });
  }

  const canAdvance = !!data.major;

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-white font-bold text-xl mb-1">Basic info</h2>
        <p className="text-gray-500 text-sm">
          Your university comes from your verified email. Pick your major
          (required) and optionally a specialization.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">University</label>
        <div className="px-4 py-3 rounded-lg bg-[#0f0f18] border border-gray-800 text-gray-400 text-sm">
          {university || 'Unverified - check your account.'}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Major <span className="text-[#dc2626]">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MAJOR_CODES.map(code => {
            const info       = MAJORS[code];
            const isSelected = data.major === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => pickMajor(code)}
                className={`text-left p-4 rounded-lg border-2 transition-all
                  ${isSelected
                    ? 'bg-[#dc2626] border-[#b91c1c] text-white'
                    : 'bg-[#1a1a1a] border-gray-700 text-gray-400 hover:border-[#dc2626] hover:text-white'
                  }`}
              >
                <div className="font-semibold text-sm">{info.name}</div>
                <div className="text-xs opacity-70 mt-0.5">{code}</div>
              </button>
            );
          })}
        </div>
        {!data.major && (
          <p className="mt-2 text-xs text-[#dc2626]">Pick a major to continue.</p>
        )}
      </div>

      {data.major && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Specialization <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          {specializations.length === 0 ? (
            <p className="text-sm text-gray-500">No specializations defined for {data.major}.</p>
          ) : (
            <div className="space-y-2">
              {specializations.map(spec => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => pickSpec(spec)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all border-2
                    ${data.specialization === spec
                      ? 'bg-[#dc2626] text-white border-[#b91c1c]'
                      : 'bg-[#1a1a1a] border-gray-700 text-gray-400 hover:border-[#dc2626] hover:text-white'
                    }`}
                >
                  {spec}
                </button>
              ))}
              <button
                type="button"
                onClick={() => pickSpec(UNKNOWN_SPEC)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 border-dashed
                  ${data.specialization === UNKNOWN_SPEC
                    ? 'bg-gray-800 text-white border-gray-500'
                    : 'bg-[#1a1a1a] border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
                  }`}
              >
                I don&apos;t know yet
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center justify-end">
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
