/**
 * Skill Tag Matcher
 * Matches project tags (from APIs) to our defined skills
 */

import { SKILL_LOCKS } from '@/data/skillLocks';
import type { SkillLock } from '@/types/profile';

/**
 * Match a single tag to a skill name
 * @param tag - Raw tag from API (e.g., 'reactjs', 'python3')
 * @param skillLocks - Array of skill definitions (defaults to SKILL_LOCKS)
 * @returns Skill name if matched, null otherwise
 */
export function matchTagToSkill(
  tag: string,
  skillLocks: SkillLock[] = SKILL_LOCKS
): string | null {
  if (!tag) return null;

  const normalized = tag.toLowerCase().trim();

  for (const skillLock of skillLocks) {
    // Check exact skill name match
    if (skillLock.skill.toLowerCase() === normalized) {
      return skillLock.skill;
    }

    // Check aliases
    if (skillLock.aliases?.some(alias => alias.toLowerCase() === normalized)) {
      return skillLock.skill;
    }
  }

  return null; // No match found
}

/**
 * Match multiple tags to skill names
 * @param tags - Array of raw tags from API
 * @returns Array of matched skill names (duplicates removed)
 */
export function matchTagsToSkills(tags: string[]): string[] {
  if (!tags || tags.length === 0) return [];

  const matched = tags
    .map(tag => matchTagToSkill(tag))
    .filter((skill): skill is string => skill !== null);

  // Remove duplicates
  return Array.from(new Set(matched));
}

/**
 * Get skill year requirement by name
 * @param skillName - Skill name (e.g., 'React')
 * @returns Required year (1-4) or 1 if not found
 */
export function getSkillYear(skillName: string): number {
  const skill = SKILL_LOCKS.find(s => s.skill === skillName);
  return skill?.requiredYear ?? 1;
}

/**
 * Calculate minimum year for a project based on its skills
 * @param skills - Array of skill names
 * @returns Minimum year required (1-4)
 */
export function calculateMinYear(skills: string[]): number {
  if (!skills || skills.length === 0) return 1;

  const years = skills.map(skill => getSkillYear(skill));
  return Math.max(...years, 1);
}

/**
 * Classify difficulty based on year requirement
 * @param minYear - Minimum year required (1-4)
 * @returns Difficulty level
 */
export function classifyDifficulty(minYear: number): 'beginner' | 'intermediate' | 'advanced' {
  if (minYear <= 1) return 'beginner';
  if (minYear <= 2) return 'intermediate';
  return 'advanced';
}
