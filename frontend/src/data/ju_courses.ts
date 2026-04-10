import { UniversityCourse } from '@/types';

/**
 * University of Jordan (JU) Course Catalog
 * Organized by Year & Semester
 */

export const juCourses: UniversityCourse[] = [
  // ─── Year 1, Semester 1 ───────────────────────────
  {
    id: 'ju-cs-101',
    university: 'JU',
    year: 1,
    semester: 1,
    name: 'Introduction to Computer Science',
    description: 'Fundamentals of programming, algorithms, and problem-solving using Python.',
    difficulty: 'Beginner',
    book: {
      title: 'Python Crash Course',
      url: 'https://nostarch.com/pythoncrashcourse2e',
      type: 'paid',
    },
    resources: [
      { type: 'youtube', label: 'Python for Beginners', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw' },
      { type: 'docs', label: 'Python Official Docs', url: 'https://docs.python.org/3/' },
    ],
    skills: ['Python', 'Algorithms', 'Problem Solving'],
    status: 'available',
  },
  {
    id: 'ju-math-101',
    university: 'JU',
    year: 1,
    semester: 1,
    name: 'Calculus I',
    description: 'Limits, derivatives, and integrals.',
    difficulty: 'Intermediate',
    book: {
      title: 'Calculus: Early Transcendentals',
      url: 'https://www.stewartcalculus.com/',
      type: 'paid',
    },
    resources: [
      { type: 'youtube', label: '3Blue1Brown Calculus', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr' },
    ],
    skills: ['Mathematics', 'Calculus'],
    status: 'available',
  },

  // ─── Year 1, Semester 2 ───────────────────────────
  {
    id: 'ju-cs-102',
    university: 'JU',
    year: 1,
    semester: 2,
    name: 'Data Structures',
    description: 'Arrays, linked lists, stacks, queues, trees, and graphs.',
    difficulty: 'Intermediate',
    book: {
      title: 'Introduction to Algorithms (CLRS)',
      url: 'https://mitpress.mit.edu/books/introduction-algorithms',
      type: 'paid',
    },
    resources: [
      { type: 'youtube', label: 'Data Structures Course', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM' },
      { type: 'docs', label: 'GeeksforGeeks DS', url: 'https://www.geeksforgeeks.org/data-structures/' },
    ],
    skills: ['Data Structures', 'C++', 'Algorithms'],
    status: 'locked',
  },

  // ─── Year 2, Semester 1 ───────────────────────────
  {
    id: 'ju-cs-201',
    university: 'JU',
    year: 2,
    semester: 1,
    name: 'Database Systems',
    description: 'Relational databases, SQL, normalization, and ER diagrams.',
    difficulty: 'Intermediate',
    book: {
      title: 'Database System Concepts',
      url: 'https://www.db-book.com/',
      type: 'paid',
    },
    resources: [
      { type: 'youtube', label: 'SQL Tutorial', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      { type: 'docs', label: 'PostgreSQL Docs', url: 'https://www.postgresql.org/docs/' },
    ],
    skills: ['SQL', 'Database Design', 'PostgreSQL'],
    status: 'locked',
  },

  // ─── Year 3, Semester 1 ───────────────────────────
  {
    id: 'ju-cs-301',
    university: 'JU',
    year: 3,
    semester: 1,
    name: 'Web Development',
    description: 'HTML, CSS, JavaScript, React, and full-stack development.',
    difficulty: 'Advanced',
    book: {
      title: 'Eloquent JavaScript',
      url: 'https://eloquentjavascript.net/',
      type: 'free-pdf',
    },
    resources: [
      { type: 'youtube', label: 'React Course', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8' },
      { type: 'docs', label: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
    ],
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js'],
    status: 'locked',
  },
];
