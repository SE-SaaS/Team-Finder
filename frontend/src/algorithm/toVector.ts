import { ALL_SKILLS } from '../lib/skills';

/**
 * Converts skill array to binary vector
 * Each position represents a skill from ALL_SKILLS
 * @param skills - Array of skill names (e.g. ["React", "Git", "Docker"])
 * @returns Binary vector where 1 = has skill, 0 = doesn't have skill
 */
export function toVector(skills: string[]): number[] {
  return ALL_SKILLS.map(skill => skills.includes(skill) ? 1 : 0);
}
