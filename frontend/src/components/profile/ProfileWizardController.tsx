'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthenticatedUser } from '@/contexts/AuthenticatedUserContext';
import { supabase } from '@/lib/supabase';
import type { Course, ProfileData } from '@/types/profile';

import Step1_BasicInfo     from './steps/Step1_BasicInfo';
import Step2_YearCourses   from './steps/Step2_YearCourses';
import Step3_SkillSelector from './steps/Step3_SkillSelector';
import Step5_SkillExams    from './steps/Step5_SkillExams';
import Step6_Availability  from './steps/Step6_Availability';
import Step7_Bio           from './steps/Step7_Bio';

// Separate from the monolith's 'teamfinder_wizard_draft' key so Phase 1/2 work
// on /profile-v2 (or wherever the controller eventually mounts) doesn't trample
// a user's in-progress draft on the live /profile route.
const DRAFT_KEY     = 'teamfinder_wizard_draft_v2';
const DRAFT_TTL_MS  = 7 * 24 * 60 * 60 * 1000;
const STEP_SEQUENCE = [1, 2, 3, 5, 6, 7] as const;
type StepNumber     = typeof STEP_SEQUENCE[number];

interface ControllerDraft {
  userId:     string;
  lastSaved:  number;
  activeStep: number;
  data:       Partial<ProfileData>;
}

interface ProfileWizardControllerProps {
  initialStep?: number;
}

function loadDraft(userId: string): ControllerDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as ControllerDraft;
    if (draft.userId !== userId) return null;
    if (Date.now() - draft.lastSaved > DRAFT_TTL_MS) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

function saveDraft(draft: Omit<ControllerDraft, 'lastSaved'>): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, lastSaved: Date.now() }));
  } catch {
    // best-effort; quota/disabled is non-fatal
  }
}

function clearDraft(): void {
  try { localStorage.removeItem(DRAFT_KEY); } catch { /* noop */ }
}

// ProfileData.year is '1st'/'2nd'/'3rd'/'4th'; route.ts expects integer 1-4.
function yearToInt(year: ProfileData['year'] | undefined): number | null {
  if (!year) return null;
  const n = parseInt(year.charAt(0), 10);
  return Number.isNaN(n) ? null : n;
}

const YEAR_BY_INT: Record<number, ProfileData['year']> = {
  1: '1st',
  2: '2nd',
  3: '3rd',
  4: '4th',
};

function intToYear(n: number | null | undefined): ProfileData['year'] | undefined {
  return n != null ? YEAR_BY_INT[n] : undefined;
}

export default function ProfileWizardController({ initialStep = 1 }: ProfileWizardControllerProps) {
  const router = useRouter();
  const { user } = useAuthenticatedUser();

  const [activeStep,       setActiveStep]       = useState(initialStep);
  const [data,             setData]             = useState<Partial<ProfileData>>({});
  const [saving,           setSaving]           = useState(false);
  const [loading,          setLoading]          = useState(true);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

  // Hydrate from DB on mount, then overlay newer localStorage draft if present.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [profileRes, skillsRes, coursesRes] = await Promise.all([
          supabase
            .from('profiles')
            .select('major, year, semester, availability, specialization, bio, avatar, avatar_color')
            .eq('id', user.id)
            .maybeSingle(),
          supabase
            .from('user_skills')
            .select('skill_name')
            .eq('user_id', user.id),
          supabase
            .from('user_courses')
            .select('course_code, course_name, status')
            .eq('user_id', user.id),
        ]);
        if (cancelled) return;

        const p = profileRes.data;
        const fromDb: Partial<ProfileData> = {
          major:          p?.major ?? undefined,
          year:           intToYear(p?.year ?? null),
          semester:       (p?.semester as 1 | 2 | null) ?? undefined,
          availability:   p?.availability as ProfileData['availability'] | undefined,
          specialization: p?.specialization ?? undefined,
          bio:            p?.bio ?? undefined,
          avatar:         p?.avatar ?? undefined,
          avatarColor:    p?.avatar_color ?? undefined,
          skills:         (skillsRes.data ?? []).map(r => r.skill_name),
          completedCourses: (coursesRes.data ?? [])
            .filter(r => r.status === 'completed' || r.status === 'in_progress')
            .map(r => ({
              code:   r.course_code,
              name:   r.course_name,
              status: r.status as 'completed' | 'in_progress',
            })),
        };

        const draft = loadDraft(user.id);
        if (draft) {
          setData({ ...fromDb, ...draft.data });
          setActiveStep(draft.activeStep);
        } else {
          setData(fromDb);
        }
      } catch (err) {
        console.error('[ProfileWizardController] hydration failed:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  // Autosave on every state change (only after hydration completes, so the
  // empty initial state never overwrites a real saved draft).
  useEffect(() => {
    if (loading) return;
    saveDraft({ userId: user.id, activeStep, data });
  }, [user, loading, activeStep, data]);

  // Pattern B: controller owns the course catalog for the user's
  // university+major and feeds it as a prop to Step2 (course picker) and
  // Step3 (skill-unlock lookup via course.unlocks_skills). Filter year <=
  // current so future-year courses aren't even loaded; Step2's year-gate UX
  // hides them regardless.
  useEffect(() => {
    const university = user.user_metadata?.university as string | undefined;
    const major      = data.major;
    const year       = data.year;
    if (!university || !major || !year) return;

    const yearNum = parseInt(year.charAt(0), 10);
    if (Number.isNaN(yearNum)) return;

    const uniCode = university === 'University of Jordan' ? 'JU' : 'HU';

    let cancelled = false;
    (async () => {
      const { data: rows, error } = await supabase
        .from('courses')
        .select('*')
        .eq('university', uniCode)
        .eq('major', major)
        .lte('year', yearNum)
        .order('year', { ascending: true })
        .order('semester', { ascending: true })
        .limit(1000);
      if (cancelled) return;
      if (error) {
        console.error('[ProfileWizardController] courses load failed:', error);
        return;
      }
      setAvailableCourses((rows ?? []) as Course[]);
    })();

    return () => { cancelled = true; };
  }, [user, data.major, data.year]);

  const onChange = useCallback((patch: Partial<ProfileData>) => {
    setData(prev => ({ ...prev, ...patch }));
  }, []);

  const onNext = useCallback(() => {
    setActiveStep(s => {
      const idx = STEP_SEQUENCE.indexOf(s as StepNumber);
      if (idx === -1 || idx >= STEP_SEQUENCE.length - 1) return s;
      return STEP_SEQUENCE[idx + 1];
    });
  }, []);

  const onBack = useCallback(() => {
    setActiveStep(s => {
      const idx = STEP_SEQUENCE.indexOf(s as StepNumber);
      if (idx <= 0) return s;
      return STEP_SEQUENCE[idx - 1];
    });
  }, []);

  const onSubmit = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const payload = {
        major:          data.major,
        year:           yearToInt(data.year),
        semester:       data.semester,
        availability:   data.availability,
        specialization: data.specialization || null,
        bio:            data.bio || null,
        avatar:         data.avatar || null,
        avatarColor:    data.avatarColor || null,
        skills:         data.skills || [],
        courses:        (data.completedCourses ?? []).map(c => ({
          code: c.code,
          name: c.name,
        })),
      };

      const res = await fetch('/api/profile/complete', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) {
        let detail = `Save failed (${res.status})`;
        try {
          const body = await res.json();
          if (body?.error) detail = body.error;
          if (Array.isArray(body?.issues) && body.issues.length > 0) {
            detail += ': ' + body.issues
              .map((i: { field: string; message: string }) => `${i.field} - ${i.message}`)
              .join('; ');
          }
        } catch {
          // ignore parse errors; keep the status-only message
        }
        throw new Error(detail);
      }

      clearDraft();
      router.push('/dashboard');
    } catch (err) {
      console.error('[ProfileWizardController] save failed:', err);
      alert(`Save failed: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  }, [user, saving, data, router]);

  if (loading) {
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        Loading your profile...
      </div>
    );
  }

  switch (activeStep) {
    case 1:
      return (
        <Step1_BasicInfo
          data={data}
          onChange={onChange}
          onNext={onNext}
          onBack={onBack}
        />
      );

    case 2:
      return (
        <Step2_YearCourses
          data={data}
          availableCourses={availableCourses}
          onChange={onChange}
          onNext={onNext}
          onBack={onBack}
        />
      );

    case 3:
      return (
        <Step3_SkillSelector
          data={data}
          availableCourses={availableCourses}
          onChange={onChange}
          onNext={onNext}
          onBack={onBack}
        />
      );

    case 5:
      return (
        <Step5_SkillExams
          data={data}
          onChange={onChange}
          onNext={onNext}
          onBack={onBack}
        />
      );

    case 6:
      return (
        <Step6_Availability
          data={data}
          onChange={onChange}
          onNext={onNext}
          onBack={onBack}
        />
      );

    case 7:
      return (
        <Step7_Bio
          data={data}
          onChange={onChange}
          onBack={onBack}
          onSubmit={onSubmit}
        />
      );

    default:
      return (
        <div className="p-6 text-center text-sm text-gray-500">
          <p>Step {activeStep} is not part of the active sequence.</p>
        </div>
      );
  }
}
