import { UniversityCourse } from '@/types';

/**
 * Hashemite University (HU) Course Catalog
 * Organized by Year & Semester
 */

export const huCourses: UniversityCourse[] = [
  // ─── Year 1, Semester 1 ───────────────────────────
  {
    id: 'hu-cs-101',
    university: 'HU',
    year: 1,
    semester: 1,
    name: 'Programming Fundamentals',
    description: 'Introduction to programming concepts using C++.',
    difficulty: 'Beginner',
    book: {
      title: 'C++ Primer',
      url: 'https://www.informit.com/store/c-plus-plus-primer-9780321714114',
      type: 'paid',
    },
    resources: [
      { type: 'youtube', label: 'C++ Tutorial', url: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y' },
      { type: 'docs', label: 'C++ Reference', url: 'https://en.cppreference.com/' },
    ],
    skills: ['C++', 'Programming', 'OOP'],
    status: 'available',
  },
  {
    id: 'hu-math-101',
    university: 'HU',
    year: 1,
    semester: 1,
    name: 'Discrete Mathematics',
    description: 'Logic, sets, functions, relations, and graph theory.',
    difficulty: 'Intermediate',
    book: {
      title: 'Discrete Mathematics and Its Applications',
      url: 'https://www.mheducation.com/highered/product/discrete-mathematics-applications-rosen/M9780073383095.html',
      type: 'paid',
    },
    resources: [
      { type: 'youtube', label: 'Discrete Math', url: 'https://www.youtube.com/playlist?list=PLl-gb0E4MII28GykmtuBXNUNoej-vY5Rz' },
    ],
    skills: ['Logic', 'Graph Theory', 'Mathematics'],
    status: 'available',
  },

  // ─── Year 2, Semester 1 ───────────────────────────
  {
    id: 'hu-cs-201',
    university: 'HU',
    year: 2,
    semester: 1,
    name: 'Object-Oriented Programming',
    description: 'Advanced OOP concepts, design patterns, and Java.',
    difficulty: 'Intermediate',
    book: {
      title: 'Head First Design Patterns',
      url: 'https://www.oreilly.com/library/view/head-first-design/0596007124/',
      type: 'paid',
    },
    resources: [
      { type: 'youtube', label: 'Java OOP', url: 'https://www.youtube.com/watch?v=xk4_1vDrzzo' },
      { type: 'docs', label: 'Java Docs', url: 'https://docs.oracle.com/en/java/' },
    ],
    skills: ['Java', 'OOP', 'Design Patterns'],
    status: 'locked',
  },

  // ─── Year 3, Semester 1 ───────────────────────────
  {
    id: 'hu-cs-301',
    university: 'HU',
    year: 3,
    semester: 1,
    name: 'Software Engineering',
    description: 'SDLC, Agile, version control, and team collaboration.',
    difficulty: 'Advanced',
    book: {
      title: 'Software Engineering: A Practitioner\'s Approach',
      url: 'https://www.mheducation.com/highered/product/software-engineering-practitioner-s-approach-pressman-maxim/M9780078022128.html',
      type: 'paid',
    },
    resources: [
      { type: 'youtube', label: 'Git & GitHub', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
      { type: 'docs', label: 'GitHub Docs', url: 'https://docs.github.com/' },
    ],
    skills: ['Git', 'Agile', 'Software Engineering'],
    status: 'locked',
  },
];
