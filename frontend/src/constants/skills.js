export const ALL_SKILLS = [
  // Frontend (10)
  'HTML/CSS', 'JavaScript', 'TypeScript', 'React', 'Vue',
  'Angular', 'Next.js', 'Tailwind', 'Sass', 'Webpack',

  // Backend (15)
  'Node.js', 'Express', 'Python', 'Django', 'Flask',
  'Java', 'Spring Boot', 'C#', '.NET', 'PHP',
  'C', 'C++', 'Rust', 'R', 'Prolog',

  // Database (6)
  'SQL', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase',

  // DevOps (6)
  'Git', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure',

  // Mobile (3)
  'React Native', 'Flutter', 'Swift',

  // Security (3)
  'Cryptography', 'Decryption', 'Assembly',

  // Other (3)
  'REST APIs', 'GraphQL', 'Testing'
];

// Total: 46 skills

// Create a mapping between skill IDs (numbers) and names
const SKILL_ID_TO_NAME = {};
const SKILL_NAME_TO_ID = {};

ALL_SKILLS.forEach((skillName, index) => {
  const skillId = index + 1; // Numeric ID: 1, 2, 3, etc.
  SKILL_ID_TO_NAME[skillId] = skillName;
  SKILL_NAME_TO_ID[skillName.toLowerCase()] = skillId;
});

// Helper function to check if a skill exists
export function isValidSkill(skillName) {
  return ALL_SKILLS.includes(skillName);
}

// Get skill name from ID (number)
export function getSkillName(skillId) {
  return SKILL_ID_TO_NAME[skillId] || null;
}

// Get skill ID (number) from name
export function getSkillId(skillName) {
  return SKILL_NAME_TO_ID[skillName.toLowerCase()] || null;
}
