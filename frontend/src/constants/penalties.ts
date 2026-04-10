/**
 * Penalty configuration for low-rated students
 *
 * Students below the rating threshold get their match score
 * multiplied by the penalty multiplier
 */

/** Rating threshold below which penalty applies (40% = 2/5 stars) */
export const PENALTY_THRESHOLD = 0.40;

/** Multiplier applied when penalty is active (0.50 = cuts score in half) */
export const PENALTY_MULTIPLIER = 0.50;
