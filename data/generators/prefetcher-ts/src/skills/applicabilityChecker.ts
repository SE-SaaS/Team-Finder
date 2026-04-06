import { PrefetchResult, Major } from "../core/types";
import { calcProjectSkillMeta, ProjectSkillMeta, enrichResults } from "./skillMatcher";

export interface StudentFilter {
  major: Major;
  year:  number;   // 1 | 2 | 3 | 4
}

export interface ApplicabilityResult {
  applicable:    boolean;
  reason:        string;           // human-readable explanation
  skillMeta:     ProjectSkillMeta; // minYear, suitableMajors, matchedSkills
}

// ── Core check ────────────────────────────────────────────────────
export function isApplicable(
  result: PrefetchResult,
  student: StudentFilter
): ApplicabilityResult {
  const skillMeta = calcProjectSkillMeta(result);
  const { minYear, suitableMajors } = skillMeta;

  const majorMatch = suitableMajors.includes(student.major);
  const yearMatch  = student.year >= minYear;

  if (!majorMatch) {
    return {
      applicable: false,
      reason:     `Major ${student.major} not in suitable majors [${suitableMajors.join(", ")}]`,
      skillMeta,
    };
  }

  if (!yearMatch) {
    return {
      applicable: false,
      reason:     `Student is Year ${student.year} but project requires Year ${minYear}+`,
      skillMeta,
    };
  }

  return {
    applicable: true,
    reason:     `Year ${student.year} ≥ minYear ${minYear} and major ${student.major} matches`,
    skillMeta,
  };
}

// ── Batch filter ──────────────────────────────────────────────────
export function filterApplicable(
  results: PrefetchResult[],
  student: StudentFilter
): (PrefetchResult & { applicability: ApplicabilityResult })[] {
  return results
    .map(r => ({ ...r, applicability: isApplicable(r, student) }))
    .filter(r => r.applicability.applicable);
}
