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
    requiredYear: 1, // Unlocked for 1st year+
    unlockableByExam: true,
    description: 'Basic web development skill',
  },
  {
    skill: 'JavaScript',
    category: 'Frontend',
    requiredYear: 1,
    unlockableByExam: true,
    description: 'Core programming language',
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

  // ============================================
  // DATABASE SKILLS
  // ============================================
  {
    skill: 'SQL',
    category: 'Database',
    requiredYear: 1,
    unlockableByCourses: ['cs103'],
    unlockableByExam: true,
    description: 'Database query language',
  },
  {
    skill: 'PostgreSQL',
    category: 'Database',
    requiredYear: 2,
    unlockableByCourses: ['db201'],
    unlockableByExam: true,
    description: 'Advanced relational database',
  },
  {
    skill: 'MongoDB',
    category: 'Database',
    requiredYear: 2,
    unlockableByCourses: ['db201'],
    unlockableByExam: true,
    description: 'NoSQL document database',
  },
  {
    skill: 'MySQL',
    category: 'Database',
    requiredYear: 1,
    unlockableByCourses: ['cs103'],
    unlockableByExam: true,
    description: 'Popular relational database',
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
    requiredYear: 1,
    unlockableByCourses: ['it101', 'cs301', 'devops301'],
    unlockableByExam: true,
    description: 'Version control system',
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
 */
export function getUnlockedSkills(
  year: number,
  completedCourses: string[]
): string[] {
  return SKILL_LOCKS.filter(lock => {
    // Unlocked by year
    if (year >= lock.requiredYear) return true;

    // Unlocked by completing a course
    if (canUnlockWithCourses(lock.skill, completedCourses)) return true;

    return false;
  }).map(lock => lock.skill);
}

/**
 * Get all locked skills for a given year and completed courses
 */
export function getLockedSkills(
  year: number,
  completedCourses: string[]
): string[] {
  return SKILL_LOCKS.filter(lock => {
    // Locked by year
    if (year < lock.requiredYear) {
      // NOT unlocked by courses
      if (!canUnlockWithCourses(lock.skill, completedCourses)) {
        return true;
      }
    }
    return false;
  }).map(lock => lock.skill);
}

