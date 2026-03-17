/**
 * Computes cosine similarity between two vectors
 * @param {number[]} vA - binary array[38]
 * @param {number[]} vB - binary array[38]
 * @returns {number} 0.0-1.0
 */
export function cosineSimilarity(vA, vB) {
  // Edge case: all zeros
  if (vA.every(v => v === 0) || vB.every(v => v === 0)) {
    return 0;
  }

  // Dot product
  const dot = vA.reduce((sum, a, i) => sum + a * vB[i], 0);

  // Magnitudes
  const magA = Math.sqrt(vA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vB.reduce((sum, b) => sum + b * b, 0));

  return dot / (magA * magB);
}
