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

// Skill ID mapping (for database compatibility)
export const SKILL_ID_MAP = ALL_SKILLS.reduce((acc, skill, index) => {
  acc[skill] = index + 1; // IDs start from 1
  return acc;
}, {});

// Reverse mapping: ID to skill name
export const ID_TO_SKILL_MAP = ALL_SKILLS.reduce((acc, skill, index) => {
  acc[index + 1] = skill;
  return acc;
}, {});

// Helper functions
export function getSkillId(skillName) {
  return SKILL_ID_MAP[skillName];
}

export function getSkillName(skillId) {
  return ID_TO_SKILL_MAP[skillId];
}
