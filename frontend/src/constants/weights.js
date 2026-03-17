export const W = {
  skill: 0.60,
  rating: 0.25,
  availability: 0.15
};

// Weights must sum to 1.0
if (W.skill + W.rating + W.availability !== 1.0) {
  console.warn('Weights do not sum to 1.0');
}
