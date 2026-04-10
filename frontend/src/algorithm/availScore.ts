/**
 * Availability types supported by the matching algorithm
 */
export type Availability = 'Full-time' | 'Flexible' | 'Evenings' | 'Weekends';

/**
 * Maps availability string to numeric score
 * @param av - Availability type
 * @returns Score between 0.0 and 1.0
 */
export function availScore(av: string): number {
  const scores: Record<Availability, number> = {
    'Full-time': 1.0,
    'Flexible': 0.85,
    'Evenings': 0.65,
    'Weekends': 0.50
  };
  return scores[av as Availability] || 0;
}
