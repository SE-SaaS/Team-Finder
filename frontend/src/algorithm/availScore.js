/**
 * Maps availability string to numeric score
 * @param {string} av - "Full-time" | "Flexible" | "Evenings" | "Weekends"
 * @returns {number} 0.0-1.0
 */
export function availScore(av) {
  const scores = {
    'Full-time': 1.0,
    'Flexible': 0.85,
    'Evenings': 0.65,
    'Weekends': 0.50
  };
  return scores[av] || 0;
}
