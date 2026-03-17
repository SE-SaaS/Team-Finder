/**
 * Pure set logic - no math
 * @param {string[]} projectSkills
 * @param {string[]} studentSkills
 * @returns {object} { matched[], missing[], extra[] }
 */
export function explainMatch(projectSkills, studentSkills) {
  const matched = projectSkills.filter(s => studentSkills.includes(s));
  const missing = projectSkills.filter(s => !studentSkills.includes(s));
  const extra = studentSkills.filter(s => !projectSkills.includes(s));

  return { matched, missing, extra };
}
