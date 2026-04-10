/**
 * Result of comparing project skills with student skills
 */
export interface SkillMatchExplanation {
  /** Skills that both project and student have */
  matched: string[];
  /** Skills project needs but student doesn't have */
  missing: string[];
  /** Skills student has but project doesn't need */
  extra: string[];
}

/**
 * Pure set logic - compares project requirements with student skills
 * @param projectSkills - Skills required by the project
 * @param studentSkills - Skills the student has
 * @returns Breakdown of matched, missing, and extra skills
 */
export function explainMatch(
  projectSkills: string[],
  studentSkills: string[]
): SkillMatchExplanation {
  const matched = projectSkills.filter(s => studentSkills.includes(s));
  const missing = projectSkills.filter(s => !studentSkills.includes(s));
  const extra = studentSkills.filter(s => !projectSkills.includes(s));

  return { matched, missing, extra };
}
