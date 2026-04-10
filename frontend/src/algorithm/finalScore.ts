import { toVector } from './toVector';
import { cosineSimilarity } from './cosineSimilarity';
import { availScore } from './availScore';
import { W } from '../constants/weights';
import { PENALTY_THRESHOLD, PENALTY_MULTIPLIER } from '../constants/penalties';

/**
 * Student data for matching algorithm
 */
export interface Student {
  /** Skills the student has */
  skills: string[];
  /** Student's rating (1-5 scale) */
  rating: number;
  /** Student's availability */
  availability: string;
}

/**
 * Breakdown of score components
 */
export interface ScoreBreakdown {
  /** Skill similarity component (0-100) */
  skill: number;
  /** Rating component (0-100) */
  rating: number;
  /** Availability component (0-100) */
  availability: number;
}

/**
 * Complete matching score result
 */
export interface MatchScore {
  /** Final score (0-100) */
  total: number;
  /** Base score before penalties (0-100) */
  base: number;
  /** Whether penalty was applied */
  penaltyActive: boolean;
  /** Component breakdown */
  breakdown: ScoreBreakdown;
}

/**
 * Runs the full 3-step penalty floor matching engine
 *
 * Algorithm:
 * 1. Compute base score from skill similarity, rating, and availability
 * 2. Apply penalty if rating is below threshold
 * 3. Convert to 0-100 integer scale
 *
 * @param projectSkills - Skills required by the project
 * @param student - Student data including skills, rating, and availability
 * @returns Complete match score with breakdown
 */
export function finalScore(projectSkills: string[], student: Student): MatchScore {
  // Step 1: Compute base score
  const vProject = toVector(projectSkills);
  const vStudent = toVector(student.skills);

  const skillSim = cosineSimilarity(vProject, vStudent);
  const ratingNorm = student.rating / 5; // Normalize to 0-1
  const availNorm = availScore(student.availability);

  const base = (
    skillSim * W.skill +
    ratingNorm * W.rating +
    availNorm * W.availability
  );

  // Step 2: Apply penalty if rating too low
  const penaltyActive = ratingNorm < PENALTY_THRESHOLD;
  const final = penaltyActive ? base * PENALTY_MULTIPLIER : base;

  // Step 3: Convert to 0-100 integer
  const total = Math.round(final * 100);

  return {
    total,
    base: Math.round(base * 100),
    penaltyActive,
    breakdown: {
      skill: Math.round(skillSim * W.skill * 100),
      rating: Math.round(ratingNorm * W.rating * 100),
      availability: Math.round(availNorm * W.availability * 100)
    }
  };
}
