'use client';

/**
 * Profile Wizard - Main Controller
 * 7-Step Onboarding Flow with localStorage Draft Persistence
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ProfileData } from '@/types/profile';
import { loadDraft, saveDraft, clearDraft, getDraftAgeFormatted } from '@/components/profile/utils/profileStorage';

// Step Components (to be created)
import Step1_BasicInfo from '@/components/profile/steps/Step1_BasicInfo';
import Step2_YearCourses from '@/components/profile/steps/Step2_YearCourses';
import Step3_SkillSelector from '@/components/profile/steps/Step3_SkillSelector';
import Step4_RoadmapImport from '@/components/profile/steps/Step4_RoadmapImport';
import Step5_SkillExams from '@/components/profile/steps/Step5_SkillExams';
import Step6_Availability from '@/components/profile/steps/Step6_Availability';
import Step7_Bio from '@/components/profile/steps/Step7_Bio';

export default function ProfileWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftAge, setDraftAge] = useState<string | null>(null);

  // Profile data state
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({
    name: '',
    university: '',
    major: '',
    year: undefined,
    completedCourses: [],
    skills: [],
    roadmapVerified: [],
    examResults: {},
    availability: undefined,
    bio: '',
    avatar: '',
    avatarColor: '',
  });

  // ============================================
  // DRAFT RECOVERY ON MOUNT
  // ============================================
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setDraftAge(getDraftAgeFormatted());
      setShowDraftModal(true);
    }
  }, []);

  const handleResumeDraft = () => {
    const draft = loadDraft();
    if (draft) {
      setProfileData(draft.data);
      setCurrentStep(draft.currentStep);
    }
    setShowDraftModal(false);
  };

  const handleStartFresh = () => {
    clearDraft();
    setShowDraftModal(false);
  };

  // ============================================
  // AUTO-SAVE ON DATA CHANGE
  // ============================================
  useEffect(() => {
    // Don't auto-save on initial render
    if (currentStep > 0) {
      saveDraft(profileData, currentStep);
    }
  }, [profileData, currentStep]);

  // ============================================
  // NAVIGATION
  // ============================================
  const goToStep = (step: number) => {
    if (step >= 1 && step <= 7) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ============================================
  // VALIDATION
  // ============================================
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: // Basic Info
        return !!(profileData.name && profileData.university && profileData.major);
      case 2: // Year & Courses
        return !!profileData.year;
      case 3: // Skill Selector
        return (profileData.skills?.length ?? 0) >= 3;
      case 4: // Roadmap.sh (auto-skip)
        return true;
      case 5: // Skill Exams (optional)
        return true;
      case 6: // Availability
        return !!profileData.availability;
      case 7: // Bio (optional)
        return true;
      default:
        return false;
    }
  };

  // ============================================
  // SUBMIT
  // ============================================
  const handleSubmit = () => {
    // TODO: Send to backend (future - Supabase integration)
    console.log('Profile Completed:', profileData);

    // Clear draft
    clearDraft();

    // Redirect to dashboard
    router.push('/dashboard');
  };

  // ============================================
  // PROGRESS BAR
  // ============================================
  const renderProgressBar = () => {
    const steps = [
      { num: 1, name: 'Basic Info' },
      { num: 2, name: 'Year & Courses' },
      { num: 3, name: 'Skills' },
      { num: 4, name: 'Roadmap.sh' },
      { num: 5, name: 'Exams' },
      { num: 6, name: 'Availability' },
      { num: 7, name: 'Bio' },
    ];

    return (
      <div className="flex items-center justify-center gap-2 mb-12">
        {steps.map((step, idx) => (
          <div key={step.num} className="flex items-center">
            {/* Circle */}
            <button
              onClick={() => goToStep(step.num)}
              disabled={step.num > currentStep}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                transition-all duration-300
                ${
                  step.num === currentStep
                    ? 'bg-[#4455ff] text-white scale-110 shadow-[0_0_20px_rgba(68,85,255,0.5)]'
                    : step.num < currentStep
                    ? 'bg-[#4455ff]/30 text-white cursor-pointer hover:bg-[#4455ff]/50'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }
              `}
            >
              {step.num}
            </button>

            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div
                className={`
                  w-8 h-[2px] mx-1 transition-all duration-300
                  ${step.num < currentStep ? 'bg-[#4455ff]/50' : 'bg-white/10'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // ============================================
  // RENDER CURRENT STEP
  // ============================================
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_BasicInfo
            data={profileData}
            onChange={setProfileData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <Step2_YearCourses
            data={profileData}
            onChange={setProfileData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <Step3_SkillSelector
            data={profileData}
            onChange={setProfileData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <Step4_RoadmapImport
            data={profileData}
            onChange={setProfileData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <Step5_SkillExams
            data={profileData}
            onChange={setProfileData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 6:
        return (
          <Step6_Availability
            data={profileData}
            onChange={setProfileData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 7:
        return (
          <Step7_Bio
            data={profileData}
            onChange={setProfileData}
            onSubmit={handleSubmit}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#08080e] to-[#0f0f18] relative overflow-hidden">
      {/* Starfield Background */}
      <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
        <div className="stars stars-blue"></div>
        <div className="stars stars-red"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Your Profile</h1>
          <p className="text-white/60">Complete your profile to start matching with teams</p>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Current Step */}
        <div className="bg-[#16161f] rounded-xl p-8 shadow-xl border border-white/10">
          {renderStep()}
        </div>
      </div>

      {/* Draft Recovery Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#16161f] rounded-xl p-8 max-w-md w-full mx-4 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Continue Where You Left Off?</h2>
            <p className="text-white/70 mb-6">
              We found a saved draft from <span className="text-[#4455ff]">{draftAge}</span>.
              Would you like to resume?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleStartFresh}
                className="flex-1 px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                Start Fresh
              </button>
              <button
                onClick={handleResumeDraft}
                className="flex-1 px-6 py-3 rounded-lg bg-[#4455ff] text-white hover:bg-[#5566ff] transition-all shadow-[0_0_20px_rgba(68,85,255,0.3)]"
              >
                Resume Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
