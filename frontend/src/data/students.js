export const STUDENTS = [
  {
    id: 1,
    name: 'Aws Hassan',
    email: 'aws.hassan@university.edu',
    major: 'Computer Science',
    year: 'Junior',
    avatar: 'AH',
    skills: ['React', 'Node.js', 'MongoDB', 'Git', 'Docker', 'TypeScript'],
    skillRatings: {
      'React': 4,
      'Node.js': 5,
      'MongoDB': 3,
      'Git': 4,
      'Docker': 3,
      'TypeScript': 4
    },
    verified: ['React', 'Git'], // Exam-verified skills
    availability: 'Full-time',
    rating: 4.5, // Peer rating 0-5
    bio: 'Full-stack developer passionate about building scalable applications. Love working with modern JavaScript frameworks and cloud technologies.'
  },
  {
    id: 2,
    name: 'Sarah Kim',
    email: 'sarah.kim@university.edu',
    major: 'Software Engineering',
    year: 'Senior',
    avatar: 'SK',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS', 'REST APIs'],
    skillRatings: {
      'Python': 5,
      'Django': 4,
      'PostgreSQL': 4,
      'Docker': 3,
      'AWS': 3,
      'REST APIs': 5
    },
    verified: ['Python', 'Django', 'PostgreSQL'],
    availability: 'Flexible',
    rating: 4.8,
    bio: 'Backend specialist with experience in building RESTful APIs and microservices architecture.'
  },
  {
    id: 3,
    name: 'Mike Rodriguez',
    email: 'mike.r@university.edu',
    major: 'Computer Science',
    year: 'Sophomore',
    avatar: 'MR',
    skills: ['React', 'Vue', 'HTML/CSS', 'JavaScript', 'Tailwind'],
    skillRatings: {
      'React': 3,
      'Vue': 4,
      'HTML/CSS': 5,
      'JavaScript': 4,
      'Tailwind': 5
    },
    verified: ['HTML/CSS'],
    availability: 'Evenings',
    rating: 4.2,
    bio: 'Frontend developer focused on creating beautiful, responsive user interfaces.'
  },
  {
    id: 4,
    name: 'Emily Chen',
    email: 'emily.chen@university.edu',
    major: 'Information Technology',
    year: 'Junior',
    avatar: 'EC',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Git', 'Testing'],
    skillRatings: {
      'Java': 5,
      'Spring Boot': 4,
      'MySQL': 4,
      'Git': 5,
      'Testing': 4
    },
    verified: ['Java', 'Spring Boot'],
    availability: 'Full-time',
    rating: 4.6,
    bio: 'Java developer with strong testing practices and clean code principles.'
  },
  {
    id: 5,
    name: 'David Park',
    email: 'david.park@university.edu',
    major: 'Computer Science',
    year: 'Freshman',
    avatar: 'DP',
    skills: ['HTML/CSS', 'JavaScript', 'Git'],
    skillRatings: {
      'HTML/CSS': 3,
      'JavaScript': 2,
      'Git': 3
    },
    verified: [],
    availability: 'Weekends',
    rating: 3.2,
    bio: 'Beginner developer eager to learn and contribute to team projects.'
  },
  {
    id: 6,
    name: 'Jessica Martinez',
    email: 'jessica.m@university.edu',
    major: 'Software Engineering',
    year: 'Senior',
    avatar: 'JM',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'MongoDB', 'Docker', 'AWS'],
    skillRatings: {
      'React': 5,
      'TypeScript': 5,
      'Node.js': 4,
      'GraphQL': 4,
      'MongoDB': 4,
      'Docker': 3,
      'AWS': 3
    },
    verified: ['React', 'TypeScript', 'Node.js'],
    availability: 'Full-time',
    rating: 4.9,
    bio: 'Full-stack engineer with expertise in modern web technologies and GraphQL APIs.'
  },
  {
    id: 7,
    name: 'Alex Thompson',
    email: 'alex.t@university.edu',
    major: 'Computer Science',
    year: 'Junior',
    avatar: 'AT',
    skills: ['Python', 'Flask', 'PostgreSQL', 'Docker', 'Git'],
    skillRatings: {
      'Python': 4,
      'Flask': 4,
      'PostgreSQL': 3,
      'Docker': 2,
      'Git': 4
    },
    verified: ['Python'],
    availability: 'Flexible',
    rating: 4.1,
    bio: 'Python developer interested in data-driven applications and API development.'
  },
  {
    id: 8,
    name: 'Lisa Wang',
    email: 'lisa.wang@university.edu',
    major: 'Information Technology',
    year: 'Sophomore',
    avatar: 'LW',
    skills: ['React Native', 'JavaScript', 'Firebase', 'Git'],
    skillRatings: {
      'React Native': 4,
      'JavaScript': 4,
      'Firebase': 3,
      'Git': 4
    },
    verified: ['React Native'],
    availability: 'Evenings',
    rating: 4.3,
    bio: 'Mobile developer specializing in cross-platform React Native applications.'
  },
  {
    id: 9,
    name: 'Ryan Johnson',
    email: 'ryan.j@university.edu',
    major: 'Software Engineering',
    year: 'Senior',
    avatar: 'RJ',
    skills: ['C#', '.NET', 'SQL', 'Azure', 'Git', 'Testing'],
    skillRatings: {
      'C#': 5,
      '.NET': 5,
      'SQL': 4,
      'Azure': 3,
      'Git': 5,
      'Testing': 4
    },
    verified: ['C#', '.NET', 'SQL'],
    availability: 'Full-time',
    rating: 4.7,
    bio: 'Enterprise application developer with strong background in .NET ecosystem.'
  },
  {
    id: 10,
    name: 'Maya Patel',
    email: 'maya.patel@university.edu',
    major: 'Computer Science',
    year: 'Junior',
    avatar: 'MP',
    skills: ['Vue', 'Node.js', 'MongoDB', 'Tailwind', 'Git'],
    skillRatings: {
      'Vue': 5,
      'Node.js': 4,
      'MongoDB': 4,
      'Tailwind': 5,
      'Git': 4
    },
    verified: ['Vue'],
    availability: 'Flexible',
    rating: 4.4,
    bio: 'Full-stack developer with a passion for Vue.js and modern CSS frameworks.'
  },
  {
    id: 11,
    name: 'Chris Lee',
    email: 'chris.lee@university.edu',
    major: 'Information Technology',
    year: 'Freshman',
    avatar: 'CL',
    skills: ['HTML/CSS', 'JavaScript', 'React'],
    skillRatings: {
      'HTML/CSS': 3,
      'JavaScript': 3,
      'React': 2
    },
    verified: [],
    availability: 'Weekends',
    rating: 3.5,
    bio: 'New to web development, excited to learn React and build real projects.'
  },
  {
    id: 12,
    name: 'Sophia Anderson',
    email: 'sophia.a@university.edu',
    major: 'Software Engineering',
    year: 'Senior',
    avatar: 'SA',
    skills: ['Angular', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes'],
    skillRatings: {
      'Angular': 5,
      'TypeScript': 5,
      'Node.js': 4,
      'PostgreSQL': 4,
      'Docker': 4,
      'Kubernetes': 3
    },
    verified: ['Angular', 'TypeScript'],
    availability: 'Full-time',
    rating: 4.8,
    bio: 'Enterprise web developer with DevOps experience and Angular expertise.'
  },
  {
    id: 13,
    name: 'James Wilson',
    email: 'james.w@university.edu',
    major: 'Computer Science',
    year: 'Junior',
    avatar: 'JW',
    skills: ['Flutter', 'Firebase', 'Git'],
    skillRatings: {
      'Flutter': 4,
      'Firebase': 4,
      'Git': 3
    },
    verified: ['Flutter'],
    availability: 'Evenings',
    rating: 4.0,
    bio: 'Mobile developer focused on building beautiful Flutter applications.'
  },
  {
    id: 14,
    name: 'Olivia Brown',
    email: 'olivia.b@university.edu',
    major: 'Information Technology',
    year: 'Sophomore',
    avatar: 'OB',
    skills: ['PHP', 'MySQL', 'HTML/CSS', 'JavaScript'],
    skillRatings: {
      'PHP': 3,
      'MySQL': 3,
      'HTML/CSS': 4,
      'JavaScript': 3
    },
    verified: [],
    availability: 'Flexible',
    rating: 3.8,
    bio: 'Web developer learning full-stack development with PHP and MySQL.'
  },
  {
    id: 15,
    name: 'Daniel Garcia',
    email: 'daniel.g@university.edu',
    major: 'Software Engineering',
    year: 'Senior',
    avatar: 'DG',
    skills: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Tailwind', 'Vercel'],
    skillRatings: {
      'Next.js': 5,
      'React': 5,
      'TypeScript': 4,
      'PostgreSQL': 4,
      'Tailwind': 5,
      'Vercel': 4
    },
    verified: ['Next.js', 'React'],
    availability: 'Full-time',
    rating: 4.9,
    bio: 'Modern web developer specializing in Next.js and serverless architectures.'
  }
];
