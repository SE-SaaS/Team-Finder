import { MAJOR_CODES, getSpecializations } from '@/data/majors'
import { UNIVERSITIES } from '@/data/universities'

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
