// lib/skills.ts

export type SkillCategory = 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Mobile' | 'Security' | 'Other';

export const ALL_SKILLS = [
  // Frontend (0–9)
  'HTML/CSS', 'JavaScript', 'TypeScript', 'React', 'Vue',
  'Angular', 'Next.js', 'Tailwind', 'Sass', 'Webpack',

  // Backend (10–24)
  'Node.js', 'Express', 'Python', 'Django', 'Flask',
  'Java', 'Spring Boot', 'C#', '.NET', 'PHP',
  'C', 'C++', 'Rust', 'R', 'Prolog',

  // Database (25–30)
  'SQL', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase',

  // DevOps (31–36)
  'Git', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure',

  // Mobile (37–39)
  'React Native', 'Flutter', 'Swift',

  // Security (40–42)
  'Cryptography', 'Decryption', 'Assembly',

  // Other (43–45)
  'REST APIs', 'GraphQL', 'Testing',
] as const;

export type Skill = (typeof ALL_SKILLS)[number];

// Mutable string array for runtime use
export const ALL_SKILLS_ARRAY: string[] = [...ALL_SKILLS];

export const SKILL_CATEGORIES: Record<string, SkillCategory> = {
  'HTML/CSS': 'Frontend', 'JavaScript': 'Frontend', 'TypeScript': 'Frontend',
  'React': 'Frontend', 'Vue': 'Frontend', 'Angular': 'Frontend',
  'Next.js': 'Frontend', 'Tailwind': 'Frontend', 'Sass': 'Frontend', 'Webpack': 'Frontend',

  'Node.js': 'Backend', 'Express': 'Backend', 'Python': 'Backend', 'Django': 'Backend',
  'Flask': 'Backend', 'Java': 'Backend', 'Spring Boot': 'Backend', 'C#': 'Backend',
  '.NET': 'Backend', 'PHP': 'Backend', 'C': 'Backend', 'C++': 'Backend',
  'Rust': 'Backend', 'R': 'Backend', 'Prolog': 'Backend',

  'SQL': 'Database', 'PostgreSQL': 'Database', 'MongoDB': 'Database',
  'MySQL': 'Database', 'Redis': 'Database', 'Firebase': 'Database',

  'Git': 'DevOps', 'Docker': 'DevOps', 'Kubernetes': 'DevOps',
  'CI/CD': 'DevOps', 'AWS': 'DevOps', 'Azure': 'DevOps',

  'React Native': 'Mobile', 'Flutter': 'Mobile', 'Swift': 'Mobile',

  'Cryptography': 'Security', 'Decryption': 'Security', 'Assembly': 'Security',

  'REST APIs': 'Other', 'GraphQL': 'Other', 'Testing': 'Other',
};

export const getSkillCategory = (skill: string): SkillCategory =>
  SKILL_CATEGORIES[skill] ?? 'Other';

export const SKILL_TO_INDEX = new Map<string, number>(
  ALL_SKILLS.map((skill, i) => [skill, i])
);

const ALL_SKILLS_SET = new Set<string>(ALL_SKILLS);

export const isValidSkill = (name: string): name is Skill =>
  ALL_SKILLS_SET.has(name);

export const validateSkills = (skills: string[]): Skill[] =>
  skills.filter(isValidSkill);

export const skillsToVector = (skills: string[]): number[] => {
  const vector = new Array(ALL_SKILLS.length).fill(0);
  for (const skill of skills) {
    const idx = SKILL_TO_INDEX.get(skill);
    if (idx !== undefined) vector[idx] = 1;
  }
  return vector;
};