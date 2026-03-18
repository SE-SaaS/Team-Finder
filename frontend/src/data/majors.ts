/**
 * IT & Computer Science Majors List
 * Used in Step 1 (Basic Info) major selection dropdown
 */

export const IT_MAJORS = [
  'Computer Science',
  'Software Engineering',
  'Information Technology',
  'Computer Engineering',
  'Data Science',
  'Cybersecurity',
  'Information Systems',
  'Network Engineering',
  'Web Development',
  'Game Development',
  'Artificial Intelligence',
  'Machine Learning',
  'Cloud Computing',
  'Database Administration',
  'Systems Administration',
  'IT Management',
  'Digital Forensics',
  'Mobile App Development',
  'Full Stack Development',
  'DevOps Engineering',
  'Computer Information Systems',
  'Software Development',
  'IT Security',
  'Computer Programming',
  'Data Engineering',
  'Business Information Systems',
  'Management Information Systems (MIS)',
  'Health Informatics',
  'Bioinformatics',
  'Other IT Field',
];

/**
 * Get major display name (same as value for now)
 */
export function getMajorDisplayName(major: string): string {
  return major;
}

/**
 * Search majors by query string
 * @param query - Search term
 * @returns Filtered majors list
 */
export function searchMajors(query: string): string[] {
  if (!query) return IT_MAJORS;

  const lowerQuery = query.toLowerCase();
  return IT_MAJORS.filter(major =>
    major.toLowerCase().includes(lowerQuery)
  );
}
