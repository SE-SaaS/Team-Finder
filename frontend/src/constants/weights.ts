/**
 * Matching algorithm weights
 * These determine how much each factor contributes to the final match score
 *
 * IMPORTANT: Weights must sum to 1.0 (100%)
 */
export const W = {
  /** Weight for skill similarity (60%) */
  skill: 0.60,
  /** Weight for student rating (25%) */
  rating: 0.25,
  /** Weight for availability (15%) */
  availability: 0.15
} as const;

// Validate weights sum to 1.0
if (typeof window !== 'undefined') {
  // Only validate in browser (not during SSR)
  if (Math.abs(W.skill + W.rating + W.availability - 1.0) > 0.001) {
    console.warn('⚠️ Weights do not sum to 1.0:', W.skill + W.rating + W.availability);
  }
}
