/**
 * IT Courses Database
 * Maps courses to skills they unlock in the Profile Wizard
 * Used in Step 2 (Year & Courses)
 */

import type { Course } from '@/types/profile';

export const COURSES: Course[] = [
  // ============================================
  // 1ST YEAR COURSES
  // ============================================
  {
    id: 'cs101',
    code: 'CS 101',
    name: 'Introduction to Programming',
    unlocksSkills: ['C++'], // FIXED: Changed from HTML/CSS, JavaScript
    recommendedYear: 1,
    description: 'Basic programming concepts using C++',
  },
  {
    id: 'cs102',
    code: 'CS 102',
    name: 'Web Applications Development',
    unlocksSkills: ['HTML/CSS', 'JavaScript'],
    recommendedYear: 1,
    description: 'HTML, CSS, and basic JavaScript',
  },
  {
    id: 'it101',
    code: 'IT 101',
    name: 'IT Fundamentals',
    unlocksSkills: ['Git'],
    recommendedYear: 1,
    description: 'Version control and collaboration tools',
  },

  // ============================================
  // 2ND YEAR COURSES
  // ============================================
  {
    id: 'cs201',
    code: 'CS 201',
    name: 'Data Structures',
    unlocksSkills: ['C++'], // FIXED: Changed from Python, Java
    recommendedYear: 2,
    description: 'Core data structures and algorithm design using C++',
  },
  {
    id: 'cs202',
    code: 'CS 202',
    name: 'Object-Oriented Programming',
    unlocksSkills: ['Java', 'C#', 'Python'],
    recommendedYear: 2,
    description: 'OOP principles and design patterns',
  },
  {
    id: 'db201',
    code: 'DB 201',
    name: 'Database Management',
    unlocksSkills: ['SQL', 'MySQL'], // FIXED: Added this course
    recommendedYear: 2,
    description: 'Database design, SQL, and relational database management',
  },
  {
    id: 'web201',
    code: 'WEB 201',
    name: 'Frontend Development',
    unlocksSkills: ['React', 'TypeScript', 'Tailwind', 'Sass'],
    recommendedYear: 2,
    description: 'Modern frontend frameworks',
  },
  {
    id: 'web202',
    code: 'WEB 202',
    name: 'Backend Development',
    unlocksSkills: ['Node.js', 'Express', 'REST APIs'],
    recommendedYear: 2,
    description: 'Server-side programming with Node.js',
  },
  {
    id: 'db202',
    code: 'DB 202',
    name: 'Advanced Databases',
    unlocksSkills: ['PostgreSQL', 'MongoDB', 'Redis'],
    recommendedYear: 2,
    description: 'SQL and NoSQL databases',
  },

  // ============================================
  // 3RD YEAR COURSES
  // ============================================
  {
    id: 'cs301',
    code: 'CS 301',
    name: 'Software Engineering',
    unlocksSkills: ['Testing', 'CI/CD', 'Git'],
    recommendedYear: 3,
    description: 'Software development lifecycle and testing',
  },
  {
    id: 'web301',
    code: 'WEB 301',
    name: 'Full Stack Development',
    unlocksSkills: ['Next.js', 'Vue', 'GraphQL', 'Firebase'],
    recommendedYear: 3,
    description: 'Building complete web applications',
  },
  {
    id: 'web302',
    code: 'WEB 302',
    name: 'Advanced Frontend',
    unlocksSkills: ['React', 'Vue', 'Angular', 'Webpack'],
    recommendedYear: 3,
    description: 'Modern frontend architecture',
  },
  {
    id: 'cs302',
    code: 'CS 302',
    name: 'Python Programming',
    unlocksSkills: ['Python', 'Django', 'Flask'],
    recommendedYear: 3,
    description: 'Python for web development',
  },
  {
    id: 'cs303',
    code: 'CS 303',
    name: 'Java Enterprise',
    unlocksSkills: ['Java', 'Spring Boot'],
    recommendedYear: 3,
    description: 'Enterprise Java development',
  },
  {
    id: 'cs304',
    code: 'CS 304',
    name: '.NET Development',
    unlocksSkills: ['C#', '.NET'],
    recommendedYear: 3,
    description: 'Microsoft .NET framework',
  },
  {
    id: 'web303',
    code: 'WEB 303',
    name: 'PHP & Web Services',
    unlocksSkills: ['PHP', 'REST APIs'],
    recommendedYear: 3,
    description: 'Server-side scripting with PHP',
  },
  {
    id: 'devops301',
    code: 'DEVOPS 301',
    name: 'DevOps Fundamentals',
    unlocksSkills: ['Docker', 'CI/CD', 'Git'],
    recommendedYear: 3,
    description: 'Containerization and deployment pipelines',
  },

  // ============================================
  // 4TH YEAR COURSES
  // ============================================
  {
    id: 'devops401',
    code: 'DEVOPS 401',
    name: 'Cloud Computing',
    unlocksSkills: ['AWS', 'Azure', 'Docker', 'Kubernetes'],
    recommendedYear: 4,
    description: 'Cloud platforms and orchestration',
  },
  {
    id: 'devops402',
    code: 'DEVOPS 402',
    name: 'Advanced DevOps',
    unlocksSkills: ['Kubernetes', 'CI/CD', 'Docker'],
    recommendedYear: 4,
    description: 'Container orchestration and automation',
  },
  {
    id: 'mobile401',
    code: 'MOBILE 401',
    name: 'Mobile Development',
    unlocksSkills: ['React Native', 'Flutter'],
    recommendedYear: 4,
    description: 'Cross-platform mobile apps',
  },
  {
    id: 'mobile402',
    code: 'MOBILE 402',
    name: 'iOS Development',
    unlocksSkills: ['Swift'],
    recommendedYear: 4,
    description: 'Native iOS app development',
  },
  {
    id: 'web401',
    code: 'WEB 401',
    name: 'Modern Web Architecture',
    unlocksSkills: ['Next.js', 'GraphQL', 'Webpack', 'Testing'],
    recommendedYear: 4,
    description: 'Advanced web application architecture',
  },
  {
    id: 'cs401',
    code: 'CS 401',
    name: 'Capstone Project',
    unlocksSkills: [], // No specific skills - depends on project
    recommendedYear: 4,
    description: 'Final year project',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get courses by recommended year
 */
export function getCoursesByYear(year: number): Course[] {
  return COURSES.filter(course => course.recommendedYear === year);
}

/**
 * Get course by ID
 */
export function getCourseById(id: string): Course | undefined {
  return COURSES.find(course => course.id === id);
}

/**
 * Get all skills unlocked by a list of course IDs
 */
export function getUnlockedSkills(courseIds: string[]): string[] {
  const skills = new Set<string>();

  courseIds.forEach(courseId => {
    const course = getCourseById(courseId);
    if (course) {
      course.unlocksSkills.forEach(skill => skills.add(skill));
    }
  });

  return Array.from(skills);
}

/**
 * Search courses by name or code
 */
export function searchCourses(query: string): Course[] {
  if (!query) return COURSES;

  const lowerQuery = query.toLowerCase();
  return COURSES.filter(
    course =>
      course.name.toLowerCase().includes(lowerQuery) ||
      course.code.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get course count by year
 */
export function getCourseCountByYear(): Record<number, number> {
  return COURSES.reduce((acc, course) => {
    acc[course.recommendedYear] = (acc[course.recommendedYear] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
}
