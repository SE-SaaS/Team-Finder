/**
 * Profile System TypeScript Interfaces
 * 7-Step Wizard Data Structures
 */

// ============================================
// CORE PROFILE DATA
// ============================================

export interface ProfileData {
  // Step 1: Basic Info
  name: string;
  email: string;
  university: string;
  major: string;
  specialization: string;
  year: '1st' | '2nd' | '3rd' | '4th';

  // Step 2: Year & Courses
  semester: 1 | 2;
  completedCourses: string[]; // Course IDs

  // Step 3: Skill Selector
  skills: number[]; // Skill IDs from skills table

  // Step 4: Roadmap.sh (future)
  roadmapVerified: string[]; // Skills auto-verified via OAuth

  // Step 5: Skill Exams
  examResults: Record<string, ExamResult>; // { "React": { score: 80, ... } }

  // Step 6: Availability
  availability: 'Full-time' | 'Flexible' | 'Evenings' | 'Weekends';

  // Step 7: Bio
  bio: string;
  avatar: string; // Generated from initials (e.g., "AH")
  avatarColor: string; // Hex color from brand palette
}

// ============================================
// EXAM SYSTEM
// ============================================

export interface ExamResult {
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced'; // Claimed level
  score: number; // 0-100
  confidenceStars: number; // 1-5 based on score
  passed: boolean; // score >= 50%
  timestamp: number; // Unix timestamp when exam taken
  canRetake: boolean; // False if failed + within 7 days
  nextRetakeDate?: number; // Timestamp when retake allowed
}

export interface ExamQuestion {
  id: string;
  skill: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[]; // Array of 4 options
  correctAnswer: number; // Index of correct option (0-3)
  explanation?: string; // Optional explanation for correct answer
}

export interface ExamSubmission {
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  answers: number[]; // User's selected option indices
  startTime: number; // Timestamp when exam started
  endTime: number; // Timestamp when exam submitted
}

// ============================================
// SKILL UNLOCKING
// ============================================

export interface SkillLock {
  skill: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Mobile' | 'Security' | 'Other';
  requiredYear: number; // 1=1st year, 2=2nd year, 3=3rd year, 4=4th year
  unlockableByCourses?: string[]; // Course IDs that unlock this skill
  unlockableByExam: boolean; // Can unlock by passing exam
  description?: string; // Why skill is locked (for tooltip)
}

export interface SkillUnlockStatus {
  skill: string;
  isLocked: boolean;
  isSelected: boolean;
  isVerified: boolean; // Has passed exam or verified via roadmap.sh
  examResult?: ExamResult;
  unlockedBy?: 'year' | 'course' | 'exam'; // How skill was unlocked
}

// ============================================
// COURSE SYSTEM
// ============================================

export interface Course {
  id: string;
  code: string;
  name: string;
  university: string;
  major: string;
  year: number; // 1-4 (recommended: 33 credit hours per year)
  semester: 1 | 2;
  credit_hours?: number;
  prerequisite_ids?: string[];
  unlocks_skills?: number[]; // Skill IDs (matches DB schema: INTEGER[])
  description?: string;
}

// ============================================
// DRAFT PERSISTENCE
// ============================================

export interface ProfileDraft {
  data: Partial<ProfileData>;
  lastSaved: number; // Unix timestamp
  currentStep: number; // 1-7
  version: string; // Schema version for migration
  userId: string; // Scopes draft to a specific user
}

// ============================================
// VALIDATION
// ============================================

export interface ValidationErrors {
  [fieldName: string]: string; // e.g., { "name": "Name is required" }
}

export interface StepValidation {
  isValid: boolean;
  errors: ValidationErrors;
}

// ============================================
// WIZARD NAVIGATION
// ============================================

export interface WizardStep {
  number: number; // 1-7
  name: string;
  title: string;
  isRequired: boolean;
  isCompleted: boolean;
  canNavigate: boolean; // Can user jump to this step?
}

// ============================================
// CONSTANTS
// ============================================

export const PROFILE_DRAFT_KEY = 'teamfinder_profile_draft';
export const DRAFT_EXPIRY_DAYS = 7;

export const EXAM_TIME_LIMIT_MS = 4 * 60 * 1000; // 4 minutes
export const EXAM_RETAKE_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const EXAM_PASS_THRESHOLD = 50; // 50% to pass

export const CONFIDENCE_STAR_THRESHOLDS = {
  5: 90, // 90-100% = 5 stars (Expert)
  4: 70, // 70-89% = 4 stars (Proficient)
  3: 50, // 50-69% = 3 stars (Intermediate)
  2: 30, // 30-49% = 2 stars (Beginner)
  1: 0,  // 0-29% = 1 star (Needs Improvement)
};

export const AVATAR_COLORS = [
  '#4455ff', // Primary blue
  '#e8294a', // Accent red
  '#cc1144', // Dark red
  '#6b7fff', // Light blue
  '#ff3366', // Pink
  '#8899ff', // Periwinkle
];

// ============================================
// HELPER TYPES
// ============================================

export type YearLevel = '1st' | '2nd' | '3rd' | '4th';
export type AvailabilityType = 'Full-time' | 'Flexible' | 'Evenings' | 'Weekends';
export type ExamLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type SkillCategory = 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Mobile' | 'Other';
