/**
 * Skill Lock Rules
 * Defines which skills are locked based on student's year
 * Used in Step 3 (Skill Selector) for soft-lock UI
 */

import type { SkillLock } from '@/types/profile';

export const SKILL_LOCKS: SkillLock[] = [
  // ============================================
  // FRONTEND SKILLS
  // ============================================
  {
    skill: 'HTML/CSS',
    category: 'Frontend',
    requiredYear: 1, // Unlocked after Web Applications Development (Y1 S2)
    unlockableByCourses: ['ju-cs-1904120', 'ju-ai-1904120', 'ju-ds-1902120', 'ju-bit-1904120'],
    unlockableByExam: true,
    description: 'Web development fundamentals - unlocked in Y1 S2',
  },
  {
    skill: 'JavaScript',
    category: 'Frontend',
    requiredYear: 1, // Unlocked after Web Applications Development (Y1 S2)
    unlockableByCourses: ['ju-cs-1904120', 'ju-ai-1904120', 'ju-ds-1902120', 'ju-bit-1904120'],
    unlockableByExam: true,
    description: 'Web programming - unlocked in Y1 S2',
  },
  {
    skill: 'TypeScript',
    category: 'Frontend',
    requiredYear: 2, // Locked for 1st year
    unlockableByCourses: ['web201'],
    unlockableByExam: true,
    description: 'Advanced JavaScript',
  },
  {
    skill: 'React',
    category: 'Frontend',
    requiredYear: 2,
    unlockableByCourses: ['web201', 'web302'],
    unlockableByExam: true,
    description: 'Modern frontend framework',
  },
  {
    skill: 'Vue',
    category: 'Frontend',
    requiredYear: 3,
    unlockableByCourses: ['web301', 'web302'],
    unlockableByExam: true,
    description: 'Progressive frontend framework',
  },
  {
    skill: 'Angular',
    category: 'Frontend',
    requiredYear: 3,
    unlockableByCourses: ['web302'],
    unlockableByExam: true,
    description: 'Enterprise frontend framework',
  },
  {
    skill: 'Next.js',
    category: 'Frontend',
    requiredYear: 3,
    unlockableByCourses: ['web301', 'web401'],
    unlockableByExam: true,
    description: 'React framework for production',
  },
  {
    skill: 'Tailwind',
    category: 'Frontend',
    requiredYear: 2,
    unlockableByCourses: ['web201'],
    unlockableByExam: true,
    description: 'Utility-first CSS framework',
  },
  {
    skill: 'Sass',
    category: 'Frontend',
    requiredYear: 2,
    unlockableByCourses: ['web201'],
    unlockableByExam: true,
    description: 'CSS preprocessor',
  },
  {
    skill: 'Webpack',
    category: 'Frontend',
    requiredYear: 3,
    unlockableByCourses: ['web302', 'web401'],
    unlockableByExam: true,
    description: 'Module bundler',
  },

  // ============================================
  // BACKEND SKILLS
  // ============================================
  {
    skill: 'Node.js',
    category: 'Backend',
    requiredYear: 2,
    unlockableByCourses: ['web202'],
    unlockableByExam: true,
    description: 'JavaScript runtime',
  },
  {
    skill: 'Express',
    category: 'Backend',
    requiredYear: 2,
    unlockableByCourses: ['web202'],
    unlockableByExam: true,
    description: 'Node.js web framework',
  },
  {
    skill: 'Python',
    category: 'Backend',
    requiredYear: 2,
    unlockableByCourses: ['cs201', 'cs202', 'cs302'],
    unlockableByExam: true,
    description: 'Versatile programming language',
  },
  {
    skill: 'Django',
    category: 'Backend',
    requiredYear: 3,
    unlockableByCourses: ['cs302'],
    unlockableByExam: true,
    description: 'Python web framework',
  },
  {
    skill: 'Flask',
    category: 'Backend',
    requiredYear: 3,
    unlockableByCourses: ['cs302'],
    unlockableByExam: true,
    description: 'Lightweight Python framework',
  },
  {
    skill: 'Java',
    category: 'Backend',
    requiredYear: 2,
    unlockableByCourses: ['cs201', 'cs202', 'cs303'],
    unlockableByExam: true,
    description: 'Enterprise programming language',
  },
  {
    skill: 'Spring Boot',
    category: 'Backend',
    requiredYear: 3,
    unlockableByCourses: ['cs303'],
    unlockableByExam: true,
    description: 'Java framework for microservices',
  },
  {
    skill: 'C#',
    category: 'Backend',
    requiredYear: 2,
    unlockableByCourses: ['cs202', 'cs304'],
    unlockableByExam: true,
    description: 'Microsoft programming language',
  },
  {
    skill: '.NET',
    category: 'Backend',
    requiredYear: 3,
    unlockableByCourses: ['cs304'],
    unlockableByExam: true,
    description: 'Microsoft development framework',
  },
  {
    skill: 'PHP',
    category: 'Backend',
    requiredYear: 3,
    unlockableByCourses: ['web303'],
    unlockableByExam: true,
    description: 'Server-side scripting language',
  },
  {
    skill: 'C',
    category: 'Backend',
    requiredYear: 3,
    unlockableByCourses: ['ju-cs-1901476', 'ju-cs-1901473'],
    unlockableByExam: true,
    description: 'Low-level systems programming',
  },
  {
    skill: 'C++',
    category: 'Backend',
    requiredYear: 2,
    unlockableByCourses: ['ju-cs-1902110', 'ju-ai-1932110', 'ju-ds-1902110', 'ju-bit-1902110', 'hu-cs-1910011214'],
    unlockableByExam: true,
    description: 'Object-oriented systems programming',
  },
  {
    skill: 'Rust',
    category: 'Backend',
    requiredYear: 4,
    unlockableByCourses: [],
    unlockableByExam: true,
    description: 'Modern systems programming language',
  },
  {
    skill: 'R',
    category: 'Backend',
    requiredYear: 2,
    unlockableByCourses: ['MATH003', 'ju-ds-1914351', 'hu-cs-0110108103', 'hu-dsai-0110108103'],
    unlockableByExam: true,
    description: 'Statistical computing language',
  },
  {
    skill: 'Prolog',
    category: 'Backend',
    requiredYear: 4,
    unlockableByCourses: ['ju-cs-1901471', 'hu-cs-1910011416'],
    unlockableByExam: true,
    description: 'Logic programming language',
  },

  // ============================================
  // DATABASE SKILLS
  // ============================================
  {
    skill: 'SQL',
    category: 'Database',
    requiredYear: 2, // Unlocked after Database Management (Year 2)
    unlockableByCourses: ['ju-cs-1902224', 'ju-ai-1902242', 'ju-ds-1902242'],
    unlockableByExam: true,
    description: 'Database query language - taught in Y2',
  },
  {
    skill: 'PostgreSQL',
    category: 'Database',
    requiredYear: 3,
    unlockableByCourses: [],
    unlockableByExam: true,
    description: 'Advanced relational database - Y3+',
  },
  {
    skill: 'MongoDB',
    category: 'Database',
    requiredYear: 3, // NoSQL taught in Year 3
    unlockableByCourses: ['ju-ds-1933321'],
    unlockableByExam: true,
    description: 'NoSQL database - taught in Y3',
  },
  {
    skill: 'MySQL',
    category: 'Database',
    requiredYear: 2, // Unlocked with SQL in Year 2
    unlockableByCourses: ['ju-cs-1902224', 'ju-ai-1902242', 'ju-ds-1902242'],
    unlockableByExam: true,
    description: 'Relational database - taught in Y2',
  },
  {
    skill: 'Redis',
    category: 'Database',
    requiredYear: 2,
    unlockableByCourses: ['db201'],
    unlockableByExam: true,
    description: 'In-memory data store',
  },
  {
    skill: 'Firebase',
    category: 'Database',
    requiredYear: 3,
    unlockableByCourses: ['web301'],
    unlockableByExam: true,
    description: 'Google cloud database',
  },

  // ============================================
  // DEVOPS SKILLS
  // ============================================
  {
    skill: 'Git',
    category: 'DevOps',
    requiredYear: 3, // Unlocked in Software Engineering (Year 3)
    unlockableByCourses: ['ju-cs-1902372', 'ju-ai-1902322', 'ju-ds-1902322'],
    unlockableByExam: true,
    description: 'Version control - taught in Software Engineering Y3',
  },
  {
    skill: 'Docker',
    category: 'DevOps',
    requiredYear: 3,
    unlockableByCourses: ['devops301', 'devops401'],
    unlockableByExam: true,
    description: 'Containerization platform',
  },
  {
    skill: 'Kubernetes',
    category: 'DevOps',
    requiredYear: 4,
    unlockableByCourses: ['devops401', 'devops402'],
    unlockableByExam: true,
    description: 'Container orchestration',
  },
  {
    skill: 'CI/CD',
    category: 'DevOps',
    requiredYear: 3,
    unlockableByCourses: ['cs301', 'devops301', 'devops402'],
    unlockableByExam: true,
    description: 'Continuous integration/deployment',
  },
  {
    skill: 'AWS',
    category: 'DevOps',
    requiredYear: 4,
    unlockableByCourses: ['devops401'],
    unlockableByExam: true,
    description: 'Amazon cloud platform',
  },
  {
    skill: 'Azure',
    category: 'DevOps',
    requiredYear: 4,
    unlockableByCourses: ['devops401'],
    unlockableByExam: true,
    description: 'Microsoft cloud platform',
  },

  // ============================================
  // MOBILE SKILLS
  // ============================================
  {
    skill: 'React Native',
    category: 'Mobile',
    requiredYear: 4,
    unlockableByCourses: ['mobile401'],
    unlockableByExam: true,
    description: 'Cross-platform mobile framework',
  },
  {
    skill: 'Flutter',
    category: 'Mobile',
    requiredYear: 4,
    unlockableByCourses: ['mobile401'],
    unlockableByExam: true,
    description: 'Google mobile framework',
  },
  {
    skill: 'Swift',
    category: 'Mobile',
    requiredYear: 4,
    unlockableByCourses: ['mobile402'],
    unlockableByExam: true,
    description: 'iOS development language',
  },

  // ============================================
  // SECURITY SKILLS
  // ============================================
  {
    skill: 'Cryptography',
    category: 'Security',
    requiredYear: 3,
    unlockableByCourses: ['ju-cys-1911251', 'hu-cys-2010043251', 'ju-cys-1911131'],
    unlockableByExam: true,
    description: 'Encryption and security protocols',
  },
  {
    skill: 'Decryption',
    category: 'Security',
    requiredYear: 3,
    unlockableByCourses: ['ju-cys-1911251', 'hu-cys-2010043251', 'ju-cys-1911131'],
    unlockableByExam: true,
    description: 'Decryption and cryptanalysis',
  },
  {
    skill: 'Assembly',
    category: 'Security',
    requiredYear: 3,
    unlockableByCourses: ['ju-cs-1901322', 'ju-cs-1901476', 'hu-swe-2010031272'],
    unlockableByExam: true,
    description: 'Low-level assembly programming',
  },

  // ============================================
  // OTHER SKILLS
  // ============================================
  {
    skill: 'REST APIs',
    category: 'Other',
    requiredYear: 2,
    unlockableByCourses: ['web202', 'web303'],
    unlockableByExam: true,
    description: 'API design and implementation',
  },
  {
    skill: 'GraphQL',
    category: 'Other',
    requiredYear: 3,
    unlockableByCourses: ['web301', 'web401'],
    unlockableByExam: true,
    description: 'Query language for APIs',
  },
  {
    skill: 'Testing',
    category: 'Other',
    requiredYear: 3,
    unlockableByCourses: ['cs301', 'web401'],
    unlockableByExam: true,
    description: 'Software testing practices',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get skill lock info by skill name
 */
export function getSkillLock(skill: string): SkillLock | undefined {
  return SKILL_LOCKS.find(lock => lock.skill === skill);
}

/**
 * Check if skill is locked for a given year
 */
export function isSkillLocked(skill: string, year: number): boolean {
  const lock = getSkillLock(skill);
  if (!lock) return false; // Skill not in lock list = always unlocked

  return year < lock.requiredYear;
}

/**
 * Check if skill can be unlocked by completing courses
 */
export function canUnlockWithCourses(
  skill: string,
  completedCourses: string[]
): boolean {
  const lock = getSkillLock(skill);
  if (!lock || !lock.unlockableByCourses) return false;

  // Check if any completed course unlocks this skill
  return lock.unlockableByCourses.some(courseId =>
    completedCourses.includes(courseId)
  );
}

/**
 * Get all skills unlocked for a given year and completed courses
 * Skills ONLY unlock by completing courses or passing exams
 *
 * SPECIAL CASE: Year 1 students get C++ by default (locked to Beginner level)
 */
export function getUnlockedSkills(
  year: number,
  completedCourses: string[]
): string[] {
  return SKILL_LOCKS.filter(lock => {
    // SPECIAL CASE: Year 1 students get C++ by default (Beginner level only)
    if (year === 1 && lock.skill === 'C++') return true;

    // Skills are ONLY unlocked by completing courses
    if (canUnlockWithCourses(lock.skill, completedCourses)) return true;

    // Year only affects VISIBILITY (if skill can be unlocked via exam)
    // Not automatic unlocking
    return false;
  }).map(lock => lock.skill);
}

/**
 * Get all locked skills for a given year and completed courses
 * Skills are locked if:
 * 1. Below required year (can't even take exam)
 * 2. At/above required year but haven't completed courses (can take exam to unlock)
 */
export function getLockedSkills(
  year: number,
  completedCourses: string[]
): string[] {
  return SKILL_LOCKS.filter(lock => {
    // SPECIAL CASE: Year 1 students have C++ unlocked by default
    if (year === 1 && lock.skill === 'C++') {
      return false;
    }

    // If already unlocked by course, not locked
    if (canUnlockWithCourses(lock.skill, completedCourses)) {
      return false;
    }

    // If below required year, locked (can't even exam)
    if (year < lock.requiredYear) {
      return true;
    }

    // At/above required year but no course completed = "soft locked" (can unlock via exam)
    return true;
  }).map(lock => lock.skill);
}

/**
 * Check if a skill is level-locked (can only select specific level)
 *
 * SPECIAL CASE: Year 1 students can only select "Beginner" for C++
 */
export function isSkillLevelLocked(skill: string, year: number): boolean {
  // C++ for Year 1 students is locked to Beginner level
  if (year === 1 && skill === 'C++') {
    return true;
  }

  return false;
}

/**
 * Get the locked level for a skill (if level-locked)
 * Returns the level name that the skill is locked to, or null if not level-locked
 */
export function getLockedLevel(skill: string, year: number): 'Beginner' | 'Intermediate' | 'Advanced' | null {
  // C++ for Year 1 students is locked to Beginner
  if (year === 1 && skill === 'C++') {
    return 'Beginner';
  }

  return null;
}

/**
 * Check if Year 1 Semester 1 student can skip Step 3 (Skill Selector)
 * Y1S1 students with 0-1 skills can skip this step
 */
export function canSkipSkillSelector(year: number, semester: number, skillCount: number): boolean {
  // Only Year 1 Semester 1 students can skip
  if (year !== 1 || semester !== 1) {
    return false;
  }

  // Can skip if 0-1 skills selected
  return skillCount <= 1;
}

