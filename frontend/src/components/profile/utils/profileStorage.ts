/**
 * localStorage utilities for Profile Wizard draft persistence
 * Auto-saves progress with 7-day expiration
 */

import type { ProfileData, ProfileDraft } from '@/types/profile';

const STORAGE_KEY = 'teamfinder_profile_draft';
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const SCHEMA_VERSION = '1.0.0';

// ============================================
// SAVE DRAFT
// ============================================

/**
 * Save profile draft to localStorage
 * @param data - Partial profile data
 * @param step - Current wizard step (1-7)
 */
export function saveDraft(
  data: Partial<ProfileData>,
  step: number,
  userId: string
): void {
  try {
    const draft: ProfileDraft = {
      data,
      lastSaved: Date.now(),
      currentStep: step,
      version: SCHEMA_VERSION,
      userId,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error('Failed to save profile draft:', error);
    // Silently fail - don't block user workflow
  }
}

// ============================================
// LOAD DRAFT
// ============================================

/**
 * Load profile draft from localStorage
 * Returns null if no draft exists or draft has expired
 */
export function loadDraft(userId: string): ProfileDraft | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return null;

    const draft: ProfileDraft = JSON.parse(stored);

    // Reject drafts belonging to a different user
    if (draft.userId !== userId) {
      clearDraft();
      return null;
    }

    // Check expiration (7 days)
    const age = Date.now() - draft.lastSaved;
    if (age > EXPIRY_MS) {
      clearDraft();
      return null;
    }

    return draft;
  } catch (error) {
    console.error('Failed to load profile draft:', error);
    clearDraft();
    return null;
  }
}

// ============================================
// CLEAR DRAFT
// ============================================

/**
 * Clear profile draft from localStorage
 * Called after successful profile submission or manual reset
 */
export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear profile draft:', error);
  }
}

// ============================================
// DRAFT EXISTS CHECK
// ============================================

/**
 * Check if valid draft exists (not expired)
 */
export function hasDraft(userId: string): boolean {
  return loadDraft(userId) !== null;
}


// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Get next incomplete step
 * Returns step number (1-7) or null if all complete
 */
export function getNextIncompleteStep(data: Partial<ProfileData>): number | null {
  // Step 1: Basic Info
  if (!data.name || !data.university || !data.major) return 1;

  // Step 2: Year & Courses
  if (!data.year) return 2;

  // Step 3: Skill Selector
  if (!data.skills || data.skills.length < 3) return 3;

  // Step 4: Roadmap.sh (auto-skip for now)
  // (future feature)

  // Step 5: Skill Exams (optional - can skip)
  // No validation needed

  // Step 6: Availability
  if (!data.availability) return 6;

  // Step 7: Bio (optional)
  // All required steps complete
  return null;
}
