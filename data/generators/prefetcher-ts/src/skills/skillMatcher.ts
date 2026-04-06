import { PrefetchResult, Major } from "../core/types";
import { SKILL_TAXONOMY } from "./taxonomy";

export interface ProjectSkillMeta {
  matchedSkills:   string[];   // skills resolved from project tags/title/description
  minYear:         number;     // highest year requirement across matched skills (1–4)
  suitableMajors:  Major[];    // deduplicated list of relevant majors
}

// ── Alias normalizer ──────────────────────────────────────────────
// Maps common tag variants → canonical taxonomy key
const ALIASES: Record<string, string> = {
  "react":          "react",
  "reactjs":        "react",
  "react.js":       "react",
  "node":           "nodejs",
  "node.js":        "nodejs",
  "nodejs":         "nodejs",
  "ts":             "typescript",
  "js":             "javascript",
  "es6":            "javascript",
  "postgres":       "postgresql",
  "psql":           "postgresql",
  "mongo":          "mongodb",
  "sk-learn":       "scikit-learn",
  "sklearn":        "scikit-learn",
  "hf":             "huggingface",
  "tf":             "tensorflow",
  "k8s":            "kubernetes",
  "kube":           "kubernetes",
  "gh-actions":     "ci-cd",
  "github-actions": "ci-cd",
  "jenkins":        "ci-cd",
  "gitlab-ci":      "ci-cd",
  "s4hana":         "sap-s4hana",
  "fiori":          "sap-fiori",
  "powerbi":        "power-bi",
  "power_bi":       "power-bi",
  "pbi":            "power-bi",
  "ml":             "scikit-learn",
  "machine-learning": "scikit-learn",
  "deep-learning":  "pytorch",
  "dl":             "pytorch",
  "ai":             "scikit-learn",
  "vuejs":          "vue",
  "vue.js":         "vue",
  "next":           "nextjs",
  "next.js":        "nextjs",
  "netsec":         "networking",
  "infosec":        "networking",
  "appsec":         "penetration-testing",
  "pentest":        "penetration-testing",
  "pen-test":       "penetration-testing",
  "rev-eng":        "reverse-engineering",
  "malware":        "malware-analysis",
  "dp":             "dynamic-programming",
  "dsa":            "data-structures",
  "ds":             "data-structures",
};

function normalize(token: string): string {
  return token.toLowerCase().replace(/[\s_./]/g, "-").replace(/[^a-z0-9-]/g, "");
}

function extractTokens(result: PrefetchResult): string[] {
  return [
    ...(result.tags ?? []),
    result.title,
    result.description ?? "",
    result.language ?? "",
  ]
    .join(" ")
    .split(/[\s,|/+]+/)
    .map(normalize)
    .filter(Boolean);
}

function resolveSkill(token: string): string | null {
  const aliased = ALIASES[token] ?? token;
  return SKILL_TAXONOMY[aliased] ? aliased : null;
}

// ── Main export ───────────────────────────────────────────────────
export function calcProjectSkillMeta(result: PrefetchResult): ProjectSkillMeta {
  const tokens  = extractTokens(result);
  const seen    = new Set<string>();

  for (const token of tokens) {
    const resolved = resolveSkill(token);
    if (resolved) seen.add(resolved);
  }

  const matchedSkills = [...seen];

  if (!matchedSkills.length) {
    // No skills matched → assume year 1, use the project's own major
    return {
      matchedSkills:  [],
      minYear:        1,
      suitableMajors: [result.major as Major],
    };
  }

  let minYear = 1;
  const majorSet = new Set<Major>();

  for (const skill of matchedSkills) {
    const meta = SKILL_TAXONOMY[skill];
    if (meta.year > minYear) minYear = meta.year;
    meta.majors.forEach(m => majorSet.add(m));
  }

  return {
    matchedSkills,
    minYear,
    suitableMajors: [...majorSet],
  };
}

// ── Batch helper ──────────────────────────────────────────────────
export function enrichResults(
  results: PrefetchResult[]
): (PrefetchResult & { skillMeta: ProjectSkillMeta })[] {
  return results.map(r => ({ ...r, skillMeta: calcProjectSkillMeta(r) }));
}
