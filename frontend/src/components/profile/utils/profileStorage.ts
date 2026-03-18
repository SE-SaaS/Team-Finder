/**
 * localStorage utilities for Profile Wizard draft persistence
 * Auto-saves progress with 7-day expiration
 */

import type {
  ProfileData,
  ProfileDraft,
  PROFILE_DRAFT_KEY,
  DRAFT_EXPIRY_DAYS,
} from '@/types/profile';

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
  step: number
): void {
  try {
    const draft: ProfileDraft = {
      data,
      lastSaved: Date.now(),
      currentStep: step,
      version: SCHEMA_VERSION,
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
export function loadDraft(): ProfileDraft | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const draft: ProfileDraft = JSON.parse(stored);

    // Check expiration (7 days)
    const age = Date.now() - draft.lastSaved;
    if (age > EXPIRY_MS) {
      clearDraft(); // Auto-cleanup expired draft
      return null;
    }

    // Schema version migration (future-proof)
    if (draft.version !== SCHEMA_VERSION) {
      console.warn(
        `Draft schema version mismatch: ${draft.version} vs ${SCHEMA_VERSION}`
      );
      // In future: add migration logic here
    }

    return draft;
  } catch (error) {
    console.error('Failed to load profile draft:', error);
    clearDraft(); // Cleanup corrupted data
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
export function hasDraft(): boolean {
  return loadDraft() !== null;
}

// ============================================
// DRAFT AGE
// ============================================

/**
 * Get draft age in milliseconds
 * Returns null if no draft exists
 */
export function getDraftAge(): number | null {
  const draft = loadDraft();
  if (!draft) return null;

  return Date.now() - draft.lastSaved;
}

/**
 * Get draft age in human-readable format
 * @returns e.g., "2 hours ago", "3 days ago"
 */
export function getDraftAgeFormatted(): string | null {
  const age = getDraftAge();
  if (age === null) return null;

  const seconds = Math.floor(age / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

// ============================================
// AUTO-SAVE HOOK (for React components)
// ============================================

/**
 * Debounced auto-save for form fields
 * Use this for onBlur or onChange handlers
 */
let autoSaveTimeout: NodeJS.Timeout | null = null;

export function autoSaveDraft(
  data: Partial<ProfileData>,
  step: number,
  delayMs: number = 500
): void {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }

  autoSaveTimeout = setTimeout(() => {
    saveDraft(data, step);
  }, delayMs);
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Check if draft data is valid for a given step
 * Returns true if user can navigate to the step
 */
export function canNavigateToStep(
  draft: ProfileDraft | null,
  targetStep: number
): boolean {
  if (!draft) return targetStep === 1; // Can only go to step 1 if no draft

  // Can navigate to current step or any previous step
  return targetStep <= draft.currentStep;
}

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
