'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ALL_SKILLS } from '@/lib/skills';
import { MAJORS } from '@/data/majors';

type StepId = 'year' | 'courses' | 'skills' | 'availability' | 'specialization';

interface ProfileRecord {
  university?: string;
  major?: string;
  year?: string;
  semester?: number;
  availability?: number;
  specialization?: string;
}

interface CourseRecord {
  id: string;
  code: string;
  name: string;
  year: number;
  semester: number;
  unlocks_skills?: string[];
}

const STEPS: { id: StepId; label: string; icon: string; required: boolean }[] = [
  { id: 'year',           label: 'Year & Semester', icon: '📅', required: true  },
  { id: 'courses',        label: 'Courses',         icon: '📚', required: true  },
  { id: 'skills',         label: 'Skills',          icon: '🎯', required: true  },
  { id: 'availability',   label: 'Availability',    icon: '⏰', required: true  },
  { id: 'specialization', label: 'Specialization',  icon: '🎓', required: false },
];

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  const [profile,          setProfile]          = useState<ProfileRecord | null>(null);
  const [year,             setYear]             = useState('');
  const [semester,         setSemester]         = useState(1);
  const [skills,           setSkills]           = useState<string[]>([]);
  const [courses,          setCourses]          = useState<string[]>([]);
  const [availability,     setAvailability]     = useState(20);
  const [specialization,   setSpecialization]   = useState('');
  const [availableCourses, setAvailableCourses] = useState<CourseRecord[]>([]);

  // First time = profile has never been completed (year not set in DB)
  const isFirstTime = !profile?.year;

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const { data: p, error } = await supabase
          .from('profiles').select('*').eq('id', user!.id).single();
        if (error) throw error;
        setProfile(p);
        setYear(p.year || '');
        setSemester(p.semester || 1);
        setAvailability(p.availability || 20);
        setSpecialization(p.specialization || '');

        const { data: sk } = await supabase
          .from('user_skills').select('skill_name').eq('user_id', user!.id);
        setSkills(sk?.map((s: { skill_name: string }) => s.skill_name) || []);

        const { data: co } = await supabase
          .from('user_courses').select('course_id').eq('user_id', user!.id);
        setCourses(co?.map((c: { course_id: string }) => c.course_id) || []);
      } catch (e) {
        console.error('Error loading profile:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  useEffect(() => {
    if (!profile || !year) return;
    const p = profile;
    async function loadCourses() {
      const yearNum = typeof year === 'string' ? parseInt(year.charAt(0)) : Number(year);
      const { data } = await supabase
        .from('courses').select('*')
        .eq('university', p.university === 'University of Jordan' ? 'JU' : 'HU')
        .eq('major', p.major)
        .lte('year', yearNum)
        .order('year', { ascending: true })
        .order('semester', { ascending: true })
        .limit(1000);
      setAvailableCourses(data || []);
    }
    loadCourses();
  }, [year, profile]);

  // ── Validation ──────────────────────────────────────────────────────────────
  const isStepValid = useCallback((id: StepId): boolean => {
    switch (id) {
      case 'year':           return !!year;
      case 'courses':        return true;
      case 'skills':         return skills.length > 0;
      case 'availability':   return availability > 0;
      case 'specialization': return true;
    }
  }, [year, skills, availability]);

  // In first-time mode a step is reachable only if every required step before it is valid
  const isStepReachable = useCallback((index: number): boolean => {
    if (!isFirstTime) return true;
    for (let i = 0; i < index; i++) {
      if (STEPS[i].required && !isStepValid(STEPS[i].id)) return false;
    }
    return true;
  }, [isFirstTime, isStepValid]);

  const isStepDone = useCallback((id: StepId): boolean => {
    if (id === 'specialization') return !!specialization;
    return isStepValid(id);
  }, [isStepValid, specialization]);

  // ── Navigation ───────────────────────────────────────────────────────────────
  const handleNext = () => {
    if (activeStep < STEPS.length - 1) setActiveStep(s => s + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(s => s - 1);
  };

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from('profiles').update({
        year, semester, availability,
        specialization: (specialization && specialization !== '__unknown__') ? specialization : null,
      }).eq('id', user.id);

      await supabase.from('user_skills').delete().eq('user_id', user.id);
      if (skills.length > 0)
        await supabase.from('user_skills').insert(
          skills.map(skill => ({ user_id: user.id, skill_name: skill }))
        );

      await supabase.from('user_courses').delete().eq('user_id', user.id);
      if (courses.length > 0)
        await supabase.from('user_courses').insert(
          courses.map(courseId => ({ user_id: user.id, course_id: courseId }))
        );

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.push('/dashboard');
      }, 800);
    } catch (e) {
      console.error('Error saving:', e);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const toggleSkill  = (s: string) => setSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleCourse = (id: string) => setCourses(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  // ── Loading state ─────────────────────────────────────────────────────────────
  if (authLoading || loading || !user) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-gray-500 text-sm">Loading...</div>
    </div>
  );

  const majorInfo  = profile?.major ? MAJORS[profile.major] : null;
  const currentId  = STEPS[activeStep].id;
  const canAdvance = isStepValid(currentId);
  const isLast     = activeStep === STEPS.length - 1;

  // How many required steps are done (for first-time progress)
  const requiredSteps    = STEPS.filter(s => s.required);
  const requiredDone     = requiredSteps.filter(s => isStepDone(s.id)).length;
  const allRequiredDone  = requiredDone === requiredSteps.length;

  return (
    <div className="min-h-screen bg-black">
      {/* Starfield */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars stars-blue" />
        <div className="stars stars-red" />
      </div>

      {/* Header */}
      <header className="border-b border-gray-800 bg-black/60 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          {isFirstTime ? (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Profile Setup</p>
              <h1 className="text-white font-bold text-lg leading-tight">Complete Your Profile</h1>
            </div>
          ) : (
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          )}

          {!isFirstTime && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save Changes'}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 relative z-10">

        {/* ── Chain Stepper ─────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center">
            {STEPS.map((step, i) => {
              const done      = isStepDone(step.id);
              const active    = i === activeStep;
              const reachable = isStepReachable(i);

              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">

                  {/* Circle — clickable only in edit mode */}
                  <button
                    onClick={() => !isFirstTime && reachable && setActiveStep(i)}
                    disabled={isFirstTime || !reachable}
                    title={!step.required ? `${step.label} (optional)` : step.label}
                    className={`
                      relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                      text-sm font-bold border-2 transition-all duration-200
                      ${active
                        ? 'bg-[#dc2626] border-[#dc2626] text-white shadow-[0_0_16px_#dc262655]'
                        : done
                          ? 'bg-[#1a3a1a] border-[#22c55e] text-[#22c55e]'
                          : !isFirstTime && reachable
                            ? 'bg-[#1a1a1a] border-gray-600 text-gray-400 hover:border-gray-400 cursor-pointer'
                            : 'bg-[#111] border-gray-800 text-gray-700 cursor-default'
                      }
                    `}
                  >
                    {done && !active ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{i + 1}</span>
                    )}

                    {/* Optional badge */}
                    {!step.required && (
                      <span className="absolute -top-2 -right-2 text-[9px] bg-gray-700 text-gray-400 px-1 rounded font-normal leading-tight">
                        opt
                      </span>
                    )}
                  </button>

                  {/* Label below circle (hidden on mobile for connector steps) */}
                  <div className="hidden sm:block absolute mt-14 w-10 text-center" style={{ marginLeft: 0 }} />

                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-px mx-1 transition-colors duration-300"
                      style={{ background: done ? '#22c55e55' : '#2a2a2a' }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step labels row */}
          <div className="flex mt-2">
            {STEPS.map((step, i) => {
              const active = i === activeStep;
              const done   = isStepDone(step.id);
              return (
                <div
                  key={step.id}
                  className={`flex-1 last:flex-none text-center text-[10px] font-medium px-1 truncate transition-colors
                    ${active ? 'text-[#dc2626]' : done ? 'text-[#22c55e]' : 'text-gray-600'}`}
                >
                  {step.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Section Content ───────────────────────────────────────────────── */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-6 min-h-[360px]">

          {/* Step header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{STEPS[activeStep].icon}</span>
              <h2 className="text-white font-bold text-xl">{STEPS[activeStep].label}</h2>
              {!STEPS[activeStep].required && (
                <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full border border-gray-700">
                  Optional
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              {currentId === 'year'           && 'Select your current academic year and semester.'}
              {currentId === 'courses'        && 'Mark the courses you have already completed.'}
              {currentId === 'skills'         && 'Select the skills you are confident in.'}
              {currentId === 'availability'   && 'How many hours per week can you give to projects?'}
              {currentId === 'specialization' && 'Choose your focus area — you can always update this later.'}
            </p>
          </div>

          {/* ── Year & Semester ── */}
          {currentId === 'year' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Academic Year <span className="text-[#dc2626]">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['1st', '2nd', '3rd', '4th'] as const).map(yr => (
                    <button key={yr} onClick={() => setYear(yr)}
                      className={`py-3 rounded-lg font-semibold text-sm transition-all
                        ${year === yr
                          ? 'bg-[#dc2626] text-white'
                          : 'bg-[#1a1a1a] border border-gray-700 text-gray-400 hover:border-[#dc2626] hover:text-white'
                        }`}>
                      {yr} Year
                    </button>
                  ))}
                </div>
              </div>

              {year && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Semester <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2].map(sem => (
                      <button key={sem} onClick={() => setSemester(sem)}
                        className={`py-3 rounded-lg font-semibold text-sm transition-all
                          ${semester === sem
                            ? 'bg-[#dc2626] text-white'
                            : 'bg-[#1a1a1a] border border-gray-700 text-gray-400 hover:border-[#dc2626] hover:text-white'
                          }`}>
                        Semester {sem}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {year && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300">
                  You're in <strong>{year} Year, Semester {semester}</strong>. Courses up to this point will appear in the next step.
                </div>
              )}
            </div>
          )}

          {/* ── Courses ── */}
          {currentId === 'courses' && (
            <div>
              {availableCourses.length === 0 ? (
                <div className="text-center py-16 text-gray-500 text-sm">
                  No courses found for your major. Make sure your major is set on your profile.
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {availableCourses.map(course => (
                      <button key={course.id} onClick={() => toggleCourse(course.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all
                          ${courses.includes(course.id)
                            ? 'bg-[#dc2626]/15 border-2 border-[#dc2626] text-white'
                            : 'bg-black border border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
                          }`}>
                        <div className="font-medium text-sm">{course.code} — {course.name}</div>
                        {course.unlocks_skills && course.unlocks_skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {course.unlocks_skills?.map((s: string) => (
                              <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-[#dc2626]/10 text-[#dc2626] border border-[#dc2626]/20">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-gray-500">{courses.length} course{courses.length !== 1 ? 's' : ''} marked</p>
                </>
              )}
            </div>
          )}

          {/* ── Skills ── */}
          {currentId === 'skills' && (
            <div>
              <div className="flex flex-wrap gap-2 max-h-[380px] overflow-y-auto p-1">
                {ALL_SKILLS.map(skill => (
                  <button key={skill} onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all
                      ${skills.includes(skill)
                        ? 'bg-[#dc2626] text-white border-2 border-[#b91c1c]'
                        : 'bg-[#1a1a1a] text-gray-400 border border-gray-700 hover:border-[#dc2626] hover:text-white'
                      }`}>
                    {skill}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">{skills.length} skill{skills.length !== 1 ? 's' : ''} selected</p>
              {skills.length === 0 && (
                <p className="mt-1 text-xs text-[#dc2626]">Select at least one skill to continue.</p>
              )}
            </div>
          )}

          {/* ── Availability ── */}
          {currentId === 'availability' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-4">
                  Hours per week: <span className="text-[#dc2626] font-bold text-lg">{availability}</span>
                </label>
                <input
                  type="range" min="5" max="40" step="5" value={availability}
                  onChange={e => setAvailability(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#dc2626]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>5 hrs</span><span>20 hrs</span><span>40 hrs</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[[5,10,'Light'],[15,25,'Moderate'],[30,40,'Heavy']].map(([lo, hi, label]) => (
                  <div key={label as string}
                    className={`p-3 rounded-lg border text-xs transition-colors
                      ${availability >= (lo as number) && availability <= (hi as number)
                        ? 'border-[#dc2626] bg-[#dc2626]/10 text-[#dc2626]'
                        : 'border-gray-800 text-gray-600'}`}>
                    <div className="font-bold mb-0.5">{label}</div>
                    <div>{lo}–{hi} hrs</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Specialization ── */}
          {currentId === 'specialization' && (
            <div>
              {majorInfo ? (
                <div className="space-y-2 max-h-[380px] overflow-y-auto">
                  {majorInfo.specializations.map((spec: string) => (
                    <button key={spec} onClick={() => setSpecialization(s => s === spec ? '' : spec)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all
                        ${specialization === spec
                          ? 'bg-[#dc2626] text-white border-2 border-[#b91c1c]'
                          : 'bg-black border border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
                        }`}>
                      {spec}
                    </button>
                  ))}

                  {/* "I don't know yet" option */}
                  <button
                    onClick={() => setSpecialization(s => s === '__unknown__' ? '' : '__unknown__')}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all border-dashed
                      ${specialization === '__unknown__'
                        ? 'bg-gray-800 text-white border-2 border-gray-500'
                        : 'bg-black border border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
                      }`}>
                    🤷 I don&apos;t know yet
                  </button>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500 text-sm">
                  Major not found. Please contact support.
                </div>
              )}
              {specialization && specialization !== '__unknown__' && (
                <p className="mt-3 text-xs text-gray-500">Selected: <span className="text-white">{specialization}</span></p>
              )}
              {specialization === '__unknown__' && (
                <p className="mt-3 text-xs text-gray-500">You can update this later from your profile.</p>
              )}
            </div>
          )}
        </div>

        {/* ── Navigation Footer ─────────────────────────────────────────────── */}
        <div className="mt-5 flex items-center justify-between">

          {/* Left button: Cancel (step 0, first time) or Back */}
          {isFirstTime && activeStep === 0 ? (
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg"
            >
              Cancel
            </Link>
          ) : (
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}

          {/* Step counter */}
          <span className="text-xs text-gray-700">
            {activeStep + 1} / {STEPS.length}
          </span>

          {/* Next / Complete */}
          {!isLast ? (
            <button
              onClick={handleNext}
              disabled={!canAdvance && STEPS[activeStep].required}
              className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            // Last step — show Complete (first time) or Save (edit mode)
            isFirstTime ? (
              <button
                onClick={handleSave}
                disabled={saving || !allRequiredDone}
                className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saved ? '✓ Done!' : saving ? 'Saving…' : '✅ Complete Profile'}
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-40"
              >
                {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save Changes'}
              </button>
            )
          )}
        </div>

        {/* Skip specialization hint (first time, on specialization step) */}
        {isFirstTime && currentId === 'specialization' && (
          <p className="text-center text-xs text-gray-600 mt-3">
            Not sure yet?{' '}
            <button onClick={handleSave} className="text-gray-400 underline hover:text-white transition-colors">
              Skip and complete profile
            </button>
          </p>
        )}
      </main>
    </div>
  );
}
