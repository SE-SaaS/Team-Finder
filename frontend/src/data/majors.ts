/**
 * IT & Computer Science Majors with Specializations
 * Based on Jordanian university curriculum tracks (8 main majors)
 */

export interface MajorInfo {
  code: string;
  name: string;
  nameAr: string;
  specializations: string[];
}

export const MAJORS: Record<string, MajorInfo> = {
  AI: {
    code: 'AI',
    name: 'Artificial Intelligence',
    nameAr: 'الذكاء الاصطناعي',
    specializations: [
      'Machine Learning Engineering',
      'Deep Learning & Neural Networks',
      'Natural Language Processing',
      'Computer Vision',
      'Reinforcement Learning',
      'AI Ethics & Safety',
      'Robotics & Autonomous Systems',
      'Generative AI',
      'AI for Healthcare',
      'Edge AI & Embedded Systems',
    ],
  },

  DS: {
    code: 'DS',
    name: 'Data Science',
    nameAr: 'علم البيانات',
    specializations: [
      'Data Engineering',
      'Business Intelligence',
      'Predictive Analytics',
      'Big Data Engineering',
      'Data Visualization',
      'Statistical Analysis',
      'MLOps',
      'Healthcare Analytics',
      'Financial Data Science',
      'Real-time Analytics',
    ],
  },

  CS: {
    code: 'CS',
    name: 'Computer Science',
    nameAr: 'علم الحاسوب',
    specializations: [
      'Software Engineering',
      'Algorithms & Theory',
      'Systems & OS',
      'Human-Computer Interaction',
      'Distributed Systems',
      'Database Systems',
      'Programming Languages',
      'Computer Graphics',
      'Quantum Computing',
      'High-Performance Computing',
    ],
  },

  CYB: {
    code: 'CYB',
    name: 'Cybersecurity',
    nameAr: 'الأمن السيبراني',
    specializations: [
      'Penetration Testing',
      'Digital Forensics',
      'Security Operations (SOC)',
      'Cloud Security',
      'Malware Analysis',
      'Application Security',
      'Network Security',
      'Cryptography',
      'Threat Intelligence',
      'IoT Security',
    ],
  },

  BIT: {
    code: 'BIT',
    name: 'Business Information Technology',
    nameAr: 'تكنولوجيا معلومات الأعمال',
    specializations: [
      'Enterprise Systems (ERP)',
      'IT Project Management',
      'E-Commerce & Digital Business',
      'IT Governance & Compliance',
      'Business Analytics',
      'Digital Transformation',
      'CRM & Customer Systems',
      'Supply Chain IT',
      'IT Consulting',
      'FinTech',
    ],
  },

  CIS: {
    code: 'CIS',
    name: 'Computer Information Systems',
    nameAr: 'أنظمة المعلومات الحاسوبية',
    specializations: [
      'Systems Analysis & Design',
      'Database Administration',
      'Network Administration',
      'Web & Application Development',
      'IT Infrastructure Management',
      'Healthcare Information Systems',
      'Cloud Computing',
      'Information Systems Security',
      'Geographic Information Systems',
      'IT Support & Service Management',
    ],
  },

  SE: {
    code: 'SE',
    name: 'Software Engineering',
    nameAr: 'هندسة البرمجيات',
    specializations: [
      'Full-Stack Web Development',
      'DevOps & CI/CD',
      'Mobile App Development',
      'Software Architecture',
      'Agile & Scrum Engineering',
      'Cloud-Native Development',
      'Quality Assurance & Testing',
      'Embedded Software',
      'Game Development',
      'Open Source & Developer Tooling',
    ],
  },

  CE: {
    code: 'CE',
    name: 'Computer Engineering',
    nameAr: 'هندسة الحاسوب',
    specializations: [
      'VLSI & Chip Design',
      'Embedded Systems',
      'Computer Architecture',
      'Digital Signal Processing',
      'IoT Systems Design',
      'Robotics Engineering',
      'FPGA & Reconfigurable Computing',
      'Power Electronics & Low Power Design',
      'Hardware Security',
      'Autonomous Systems & Drones',
    ],
  },
};

// Helper to get all major codes
export const MAJOR_CODES = Object.keys(MAJORS) as Array<keyof typeof MAJORS>;

// Helper to get major by code
export function getMajorInfo(code: string): MajorInfo | undefined {
  return MAJORS[code];
}

// Helper to get all specializations for a major
export function getSpecializations(majorCode: string): string[] {
  return MAJORS[majorCode]?.specializations || [];
}

// Type for major codes
export type MajorCode = keyof typeof MAJORS;
