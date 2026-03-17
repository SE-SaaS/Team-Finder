import { toVector } from './toVector';
import { cosineSimilarity } from './cosineSimilarity';
import { availScore } from './availScore';
import { W } from '../constants/weights';
import { PENALTY_THRESHOLD, PENALTY_MULTIPLIER } from '../constants/penalties';

/**
 * Runs the full 3-step penalty floor engine
 * @param {string[]} projectSkills
 * @param {object} student - { skills, rating, availability }
 * @returns {object} { total, base, penaltyActive, breakdown }
 */
export function finalScore(projectSkills, student) {
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
