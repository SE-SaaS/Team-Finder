import { MAJOR_CODES, getSpecializations } from '@/data/majors'

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateMajor(majorCode: string): ValidationResult {
  if (!majorCode) return { isValid: false, error: 'Please select your major' }
  if (!MAJOR_CODES.includes(majorCode as any)) return { isValid: false, error: 'Invalid major selected' }
  return { isValid: true }
}

export function validateSpecialization(majorCode: string, specialization: string): ValidationResult {
  if (!specialization) return { isValid: false, error: 'Please select a specialization' }
  const valid = getSpecializations(majorCode)
  if (!valid.includes(specialization)) return { isValid: false, error: 'Invalid specialization for selected major' }
  return { isValid: true }
}

export function validateYear(year: string): ValidationResult {
  const allowed = ['1st', '2nd', '3rd', '4th']
  if (!year) return { isValid: false, error: 'Please select your year' }
  if (!allowed.includes(year)) return { isValid: false, error: 'Invalid year selected' }
  return { isValid: true }
}

export function validateStep1(data: {
  major: string
  specialization: string
  year: string
}): Record<string, string> {
  const errors: Record<string, string> = {}

  const majorResult = validateMajor(data.major)
  if (!majorResult.isValid) errors.major = majorResult.error!

  if (data.major) {
    const specResult = validateSpecialization(data.major, data.specialization)
    if (!specResult.isValid) errors.specialization = specResult.error!
  }

  const yearResult = validateYear(data.year)
  if (!yearResult.isValid) errors.year = yearResult.error!

  return errors
}

// ============================================================================
// Profile Completion Validation
// ============================================================================

export interface ProfileCompletionCheck {
  major?: string | null;
  year?: number | null;
  skillsCount: number;
  coursesCount?: number;
}

/**
 * Check if a user's profile is complete
 *
 * A profile is considered complete when:
 * - User has selected a major
 * - User has selected their year
 * - User has at least 3 skills
 * - User has at least 1 completed course
 *
 * @param profile - Profile data to validate
 * @returns true if profile is complete, false otherwise
 */
export function isProfileComplete(profile: ProfileCompletionCheck): boolean {
  return !!(
    profile.major &&
    profile.year &&
    profile.skillsCount >= 3 &&
    (profile.coursesCount ?? 0) > 0
  );
}

/**
 * Get profile completion percentage
 *
 * @param profile - Profile data to check
 * @returns Percentage (0-100) of profile completion
 */
export function getProfileCompletionPercentage(profile: ProfileCompletionCheck): number {
  let completed = 0;
  const total = 4;

  if (profile.major) completed++;
  if (profile.year) completed++;
  if (profile.skillsCount >= 3) completed++;
  if ((profile.coursesCount ?? 0) > 0) completed++;

  return Math.round((completed / total) * 100);
}

/**
 * Get missing profile requirements
 *
 * @param profile - Profile data to check
 * @returns Array of missing requirements
 */
export function getMissingRequirements(profile: ProfileCompletionCheck): string[] {
  const missing: string[] = [];

  if (!profile.major) missing.push('Select your major');
  if (!profile.year) missing.push('Set your year');
  if (profile.skillsCount < 3) missing.push(`Add ${3 - profile.skillsCount} more skill${3 - profile.skillsCount === 1 ? '' : 's'}`);
  if ((profile.coursesCount ?? 0) === 0) missing.push('Add at least 1 completed course');

  return missing;
}
