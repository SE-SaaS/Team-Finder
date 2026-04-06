/**
 * Project Filtering Utilities
 *
 * KEY PRINCIPLE:
 * Projects are shown to help students LEARN, not just apply existing skills.
 * We filter by year (complexity) and major (relevance), NOT by skills.
 */

export interface ProjectFilterParams {
  studentYear: 1 | 2 | 3 | 4;
  studentMajor: string;  // 'CS', 'AI', 'DS', 'CIS', 'BI', 'CYS', 'SWE'
  projectType?: 'university' | 'external' | 'all';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  status?: 'open' | 'in_progress' | 'completed' | 'closed';
}

/**
 * Build Supabase query for filtering projects
 *
 * @example
 * ```typescript
 * const query = supabase
 *   .from('projects')
 *   .select('*')
 *   .lte('min_year', studentYear)                    // Not too advanced
 *   .or(`suitable_majors.cs.{},suitable_majors.cs.{${studentMajor}}`) // Relevant major
 *   .eq('status', 'open')
 *   .order('min_year', { ascending: true });
 * ```
 */
export function buildProjectQuery(params: ProjectFilterParams) {
  const {
    studentYear,
    studentMajor,
    projectType = 'all',
    difficulty,
    status = 'open',
  } = params;

  return {
    // Show projects at or below student's year level
    minYear: studentYear,

    // Show projects for student's major OR projects suitable for all majors (empty array)
    majorFilter: studentMajor,

    // Optional filters
    ...(projectType !== 'all' && { type: projectType }),
    ...(difficulty && { difficulty }),
    status,
  };
}

/**
 * Calculate project recommendation score
 * Higher score = better match for student
 *
 * Scoring:
 * - Year match: +10 points if exact year, +5 if one year below
 * - Major match: +20 points if exact match
 * - Skills overlap: +2 points per skill student already has
 * - Learning opportunity: +5 points per NEW skill student can learn
 */
export function calculateProjectScore(
  project: {
    min_year: number;
    suitable_majors: string[];
    skills_needed?: string[];
    difficulty: string;
  },
  student: {
    year: number;
    major: string;
    skills: string[];  // Skills student already has
  }
): number {
  let score = 0;

  // Year relevance
  if (project.min_year === student.year) {
    score += 10; // Perfect match
  } else if (project.min_year === student.year - 1) {
    score += 5; // Slightly easier, still good
  }

  // Major relevance
  if (
    project.suitable_majors.length === 0 || // Universal project
    project.suitable_majors.includes(student.major)
  ) {
    score += 20;
  }

  // Skills analysis (if skills_needed is available)
  if (project.skills_needed && project.skills_needed.length > 0) {
    const studentSkillsSet = new Set(student.skills);

    project.skills_needed.forEach(skill => {
      if (studentSkillsSet.has(skill)) {
        score += 2; // Student already knows this skill
      } else {
        score += 5; // NEW skill to learn (more valuable!)
      }
    });
  }

  return score;
}

/**
 * Sort projects by recommendation score
 */
export function rankProjects<T extends {
  min_year: number;
  suitable_majors: string[];
  skills_needed?: string[];
  difficulty: string;
}>(
  projects: T[],
  student: {
    year: number;
    major: string;
    skills: string[];
  }
): T[] {
  return projects
    .map(project => ({
      project,
      score: calculateProjectScore(project, student),
    }))
    .sort((a, b) => b.score - a.score) // Highest score first
    .map(({ project }) => project);
}

/**
 * Check if a project is suitable for a student
 * (Used for filtering before showing)
 */
export function isProjectSuitable(
  project: {
    min_year: number;
    suitable_majors: string[];
  },
  student: {
    year: number;
    major: string;
  }
): boolean {
  // Too advanced for student's year?
  if (project.min_year > student.year) {
    return false;
  }

  // Not relevant to student's major?
  if (
    project.suitable_majors.length > 0 &&
    !project.suitable_majors.includes(student.major)
  ) {
    return false;
  }

  return true;
}
