import { Roadmap } from '@/types';

/**
 * Learning Roadmaps
 * Visual node-based learning paths for different career tracks
 */

export const roadmaps: Roadmap[] = [
  // ─── Full-Stack Developer ───────────────────────────
  {
    id: 'fullstack',
    title: 'Full-Stack Developer',
    icon: '🚀',
    description: 'Complete path from HTML to deploying full-stack applications',
    nodes: [
      // HTML Basics
      {
        id: 'html-basics',
        label: 'HTML Basics',
        description: 'Learn the foundation of web development with semantic HTML',
        type: 'skill',
        x: 100,
        y: 100,
        dependsOn: [],
        skills: ['HTML'],
        courses: [
          {
            title: 'HTML Full Course',
            platform: 'freeCodeCamp',
            url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
            type: 'free',
            durationHours: 2,
          },
        ],
        lab: {
          title: 'Build a Personal Bio Page',
          description: 'Create a simple personal bio page using semantic HTML tags.',
          difficulty: 'Beginner',
          skills: ['HTML'],
          estimatedHours: 2,
        },
      },

      // CSS Basics
      {
        id: 'css-basics',
        label: 'CSS Basics',
        description: 'Style your pages with colors, fonts, and layouts',
        type: 'skill',
        x: 100,
        y: 200,
        dependsOn: ['html-basics'],
        skills: ['CSS'],
        courses: [
          {
            title: 'CSS Tutorial for Beginners',
            platform: 'freeCodeCamp',
            url: 'https://www.youtube.com/watch?v=OXGznpKZ_sA',
            type: 'free',
            durationHours: 11,
          },
        ],
        lab: {
          title: 'Style a Landing Page',
          description: 'Apply CSS styling to create a visually appealing landing page.',
          difficulty: 'Beginner',
          skills: ['CSS'],
          estimatedHours: 3,
        },
      },

      // CSS Flexbox
      {
        id: 'css-flexbox',
        label: 'CSS Flexbox',
        description: 'Master flexible box layout for responsive UI.',
        type: 'skill',
        x: 200,
        y: 340,
        dependsOn: ['html-basics', 'css-basics'],
        skills: ['HTML/CSS'],
        courses: [
          {
            title: 'CSS - The Complete Guide',
            platform: 'Udemy',
            url: 'https://www.udemy.com/course/css-the-complete-guide-incl-flexbox-grid-sass/',
            type: 'paid',
            price: '$14.99',
            durationHours: 22,
          },
          {
            title: 'HTML, CSS & JS for Web Developers',
            platform: 'Coursera',
            url: 'https://www.coursera.org/learn/html-css-javascript-for-web-developers',
            type: 'free',
            durationHours: 40,
          },
        ],
        lab: {
          title: 'Build a Responsive Dashboard Layout',
          description: 'Using only Flexbox, recreate a 3-column admin dashboard with a sticky sidebar and responsive collapse behavior.',
          difficulty: 'Intermediate',
          skills: ['HTML/CSS'],
          estimatedHours: 3,
        },
      },

      // CSS Grid
      {
        id: 'css-grid',
        label: 'CSS Grid',
        description: 'Create complex layouts with CSS Grid',
        type: 'skill',
        x: 200,
        y: 460,
        dependsOn: ['css-flexbox'],
        skills: ['CSS'],
        courses: [
          {
            title: 'CSS Grid Layout Crash Course',
            platform: 'freeCodeCamp',
            url: 'https://www.youtube.com/watch?v=0-DY8J_skZ0',
            type: 'free',
            durationHours: 1,
          },
        ],
        lab: {
          title: 'Photo Gallery Grid',
          description: 'Build a responsive photo gallery using CSS Grid with auto-fit columns.',
          difficulty: 'Intermediate',
          skills: ['CSS'],
          estimatedHours: 2,
        },
      },

      // JavaScript Fundamentals
      {
        id: 'javascript-fundamentals',
        label: 'JavaScript Fundamentals',
        description: 'Learn programming with JavaScript ES6+',
        type: 'skill',
        x: 100,
        y: 300,
        dependsOn: ['css-basics'],
        skills: ['JavaScript'],
        courses: [
          {
            title: 'JavaScript Programming - Full Course',
            platform: 'freeCodeCamp',
            url: 'https://www.youtube.com/watch?v=jS4aFq5-91M',
            type: 'free',
            durationHours: 8,
          },
          {
            title: 'The Complete JavaScript Course',
            platform: 'Udemy',
            url: 'https://www.udemy.com/course/the-complete-javascript-course/',
            type: 'paid',
            price: '$14.99',
            durationHours: 69,
          },
        ],
        lab: {
          title: 'Interactive Quiz App',
          description: 'Build a quiz app with score tracking and timer functionality.',
          difficulty: 'Intermediate',
          skills: ['JavaScript'],
          estimatedHours: 4,
        },
      },

      // DOM Manipulation
      {
        id: 'dom-manipulation',
        label: 'DOM Manipulation',
        description: 'Interact with HTML elements using JavaScript',
        type: 'skill',
        x: 100,
        y: 400,
        dependsOn: ['javascript-fundamentals'],
        skills: ['JavaScript'],
        courses: [
          {
            title: 'JavaScript DOM Crash Course',
            platform: 'freeCodeCamp',
            url: 'https://www.youtube.com/watch?v=0ik6X4DJKCc',
            type: 'free',
            durationHours: 1,
          },
        ],
        lab: {
          title: 'To-Do List with Local Storage',
          description: 'Create a fully functional to-do list that persists data in local storage.',
          difficulty: 'Intermediate',
          skills: ['JavaScript'],
          estimatedHours: 3,
        },
      },

      // React
      {
        id: 'react',
        label: 'React',
        description: 'Build modern UIs with React components and hooks',
        type: 'tool',
        x: 100,
        y: 500,
        dependsOn: ['dom-manipulation'],
        skills: ['React'],
        courses: [
          {
            title: 'React - The Complete Guide',
            platform: 'Udemy',
            url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
            type: 'paid',
            price: '$14.99',
            durationHours: 49,
          },
          {
            title: 'Full React Course',
            platform: 'freeCodeCamp',
            url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            type: 'free',
            durationHours: 12,
          },
        ],
        lab: {
          title: 'Movie Database App',
          description: 'Build a movie search app using React and TMDB API with hooks and context.',
          difficulty: 'Advanced',
          skills: ['React'],
          estimatedHours: 8,
        },
      },

      // Node.js
      {
        id: 'nodejs',
        label: 'Node.js',
        description: 'Build server-side applications with Node.js',
        type: 'tool',
        x: 300,
        y: 500,
        dependsOn: ['javascript-fundamentals'],
        skills: ['Node.js'],
        courses: [
          {
            title: 'Node.js and Express.js - Full Course',
            platform: 'freeCodeCamp',
            url: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
            type: 'free',
            durationHours: 8,
          },
        ],
        lab: {
          title: 'REST API for Blog',
          description: 'Create a RESTful API with CRUD operations for a blog application.',
          difficulty: 'Advanced',
          skills: ['Node.js'],
          estimatedHours: 6,
        },
      },

      // Database (SQL)
      {
        id: 'sql-database',
        label: 'SQL Database',
        description: 'Store and query data with PostgreSQL',
        type: 'skill',
        x: 400,
        y: 500,
        dependsOn: ['nodejs'],
        skills: ['SQL', 'PostgreSQL'],
        courses: [
          {
            title: 'PostgreSQL Tutorial',
            platform: 'freeCodeCamp',
            url: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
            type: 'free',
            durationHours: 4,
          },
        ],
        lab: {
          title: 'E-commerce Database Schema',
          description: 'Design and implement a relational database for an e-commerce platform.',
          difficulty: 'Advanced',
          skills: ['SQL', 'PostgreSQL'],
          estimatedHours: 5,
        },
      },

      // Git & GitHub
      {
        id: 'git-github',
        label: 'Git & GitHub',
        description: 'Version control and collaboration',
        type: 'tool',
        x: 500,
        y: 300,
        dependsOn: [],
        skills: ['Git'],
        courses: [
          {
            title: 'Git and GitHub for Beginners',
            platform: 'freeCodeCamp',
            url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
            type: 'free',
            durationHours: 1,
          },
        ],
        lab: {
          title: 'Collaborate on Open Source',
          description: 'Fork a repository, make changes, and submit a pull request.',
          difficulty: 'Beginner',
          skills: ['Git'],
          estimatedHours: 2,
        },
      },

      // TypeScript
      {
        id: 'typescript',
        label: 'TypeScript',
        description: 'Add type safety to JavaScript projects',
        type: 'tool',
        x: 300,
        y: 400,
        dependsOn: ['javascript-fundamentals'],
        skills: ['TypeScript'],
        courses: [
          {
            title: 'TypeScript Course for Beginners',
            platform: 'freeCodeCamp',
            url: 'https://www.youtube.com/watch?v=gp5H0Vw39yw',
            type: 'free',
            durationHours: 8,
          },
        ],
        lab: {
          title: 'Type-Safe API Client',
          description: 'Build a fully typed REST API client with interfaces and generics.',
          difficulty: 'Advanced',
          skills: ['TypeScript'],
          estimatedHours: 4,
        },
      },
    ],
    edges: [
      { from: 'html-basics', to: 'css-basics' },
      { from: 'css-basics', to: 'javascript-fundamentals' },
      { from: 'html-basics', to: 'css-flexbox' },
      { from: 'css-basics', to: 'css-flexbox' },
      { from: 'css-flexbox', to: 'css-grid' },
      { from: 'javascript-fundamentals', to: 'dom-manipulation' },
      { from: 'javascript-fundamentals', to: 'typescript' },
      { from: 'dom-manipulation', to: 'react' },
      { from: 'javascript-fundamentals', to: 'nodejs' },
      { from: 'nodejs', to: 'sql-database' },
    ],
  },

  // ─── Frontend Developer ───────────────────────────
  {
    id: 'frontend',
    title: 'Frontend Developer',
    icon: '🎨',
    description: 'Master modern frontend development with React',
    nodes: [
      {
        id: 'html-css',
        label: 'HTML & CSS',
        description: 'Foundation of web development',
        type: 'skill',
        x: 100,
        y: 100,
        dependsOn: [],
        skills: ['HTML', 'CSS'],
        courses: [
          {
            title: 'Responsive Web Design',
            platform: 'freeCodeCamp',
            url: 'https://www.freecodecamp.org/learn/responsive-web-design/',
            type: 'free',
            durationHours: 300,
          },
        ],
        lab: {
          title: 'Portfolio Website',
          description: 'Build a fully responsive portfolio website from scratch.',
          difficulty: 'Beginner',
          skills: ['HTML', 'CSS'],
          estimatedHours: 6,
        },
      },
      {
        id: 'javascript-modern',
        label: 'Modern JavaScript',
        description: 'ES6+, async/await, modules',
        type: 'skill',
        x: 100,
        y: 200,
        dependsOn: ['html-css'],
        skills: ['JavaScript'],
        courses: [
          {
            title: 'JavaScript Algorithms and Data Structures',
            platform: 'freeCodeCamp',
            url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
            type: 'free',
            durationHours: 300,
          },
        ],
        lab: {
          title: 'Weather App',
          description: 'Fetch data from a weather API and display it dynamically.',
          difficulty: 'Intermediate',
          skills: ['JavaScript'],
          estimatedHours: 4,
        },
      },
      {
        id: 'react-frontend',
        label: 'React',
        description: 'Component-based UI development',
        type: 'tool',
        x: 100,
        y: 300,
        dependsOn: ['javascript-modern'],
        skills: ['React'],
        courses: [
          {
            title: 'Front End Development Libraries',
            platform: 'freeCodeCamp',
            url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
            type: 'free',
            durationHours: 300,
          },
        ],
        lab: {
          title: 'E-commerce Product Page',
          description: 'Build a product listing page with cart functionality using React.',
          difficulty: 'Advanced',
          skills: ['React'],
          estimatedHours: 10,
        },
      },
    ],
    edges: [
      { from: 'html-css', to: 'javascript-modern' },
      { from: 'javascript-modern', to: 'react-frontend' },
    ],
  },

  // ─── Backend Developer ───────────────────────────
  {
    id: 'backend',
    title: 'Backend Developer',
    icon: '⚙️',
    description: 'Build scalable server-side applications',
    nodes: [
      {
        id: 'backend-js',
        label: 'JavaScript Basics',
        description: 'Core programming fundamentals',
        type: 'skill',
        x: 100,
        y: 100,
        dependsOn: [],
        skills: ['JavaScript'],
        courses: [
          {
            title: 'JavaScript Programming',
            platform: 'freeCodeCamp',
            url: 'https://www.youtube.com/watch?v=jS4aFq5-91M',
            type: 'free',
            durationHours: 8,
          },
        ],
        lab: {
          title: 'CLI Calculator',
          description: 'Build a command-line calculator with basic operations.',
          difficulty: 'Beginner',
          skills: ['JavaScript'],
          estimatedHours: 2,
        },
      },
      {
        id: 'backend-node',
        label: 'Node.js & Express',
        description: 'Server-side JavaScript runtime',
        type: 'tool',
        x: 100,
        y: 200,
        dependsOn: ['backend-js'],
        skills: ['Node.js'],
        courses: [
          {
            title: 'Back End Development and APIs',
            platform: 'freeCodeCamp',
            url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
            type: 'free',
            durationHours: 300,
          },
        ],
        lab: {
          title: 'User Authentication API',
          description: 'Create a secure authentication system with JWT tokens.',
          difficulty: 'Advanced',
          skills: ['Node.js'],
          estimatedHours: 8,
        },
      },
      {
        id: 'backend-database',
        label: 'Databases',
        description: 'SQL and NoSQL databases',
        type: 'skill',
        x: 100,
        y: 300,
        dependsOn: ['backend-node'],
        skills: ['SQL', 'MongoDB'],
        courses: [
          {
            title: 'MongoDB Course',
            platform: 'freeCodeCamp',
            url: 'https://www.youtube.com/watch?v=-56x56UppqQ',
            type: 'free',
            durationHours: 14,
          },
        ],
        lab: {
          title: 'Social Media Backend',
          description: 'Design and build a complete backend for a social media platform.',
          difficulty: 'Advanced',
          skills: ['SQL', 'MongoDB'],
          estimatedHours: 12,
        },
      },
    ],
    edges: [
      { from: 'backend-js', to: 'backend-node' },
      { from: 'backend-node', to: 'backend-database' },
    ],
  },
];
