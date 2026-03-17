import { ALL_SKILLS } from '../constants/skills';

/**
 * Converts skill array to binary vector
 * @param {string[]} skills - e.g. ["React", "Git", "Docker"]
 * @returns {number[]} - binary array[38]
 */
export function toVector(skills) {
  return ALL_SKILLS.map(skill => skills.includes(skill) ? 1 : 0);
}
