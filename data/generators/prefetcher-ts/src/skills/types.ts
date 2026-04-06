import { Major } from "../core/types";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface StudentProfile {
  major:       Major;
  skills:      string[];          // e.g. ["python", "react", "sql", "docker"]
  level:       ExperienceLevel;
}

// ── Skill taxonomy per major ──────────────────────────────────────
// Maps each major to its expected skill sets per level
export const MAJOR_SKILL_MAP: Record<Major, Record<ExperienceLevel, string[]>> = {
  [Major.AI]: {
    beginner:     ["python", "numpy", "pandas", "jupyter", "matplotlib"],
    intermediate: ["scikit-learn", "tensorflow", "pytorch", "keras", "nlp", "cv"],
    advanced:     ["llm", "transformer", "diffusion", "rlhf", "cuda", "mlops"],
  },
  [Major.CS]: {
    beginner:     ["python", "java", "c++", "algorithms", "data-structures"],
    intermediate: ["dynamic-programming", "graph", "system-design", "os", "networking"],
    advanced:     ["compilers", "distributed-systems", "concurrency", "cryptography"],
  },
  [Major.CIS]: {
    beginner:     ["sql", "excel", "erp", "sap", "business-process"],
    intermediate: ["sap-fiori", "btp", "data-modeling", "etl", "api"],
    advanced:     ["sap-s4hana", "enterprise-architecture", "integration", "bpmn"],
  },
  [Major.BI]: {
    beginner:     ["excel", "sql", "tableau", "power-bi", "data-visualization"],
    intermediate: ["dax", "etl", "data-warehouse", "python", "looker"],
    advanced:     ["spark", "dbt", "airflow", "data-lakehouse", "semantic-layer"],
  },
  [Major.CYS]: {
    beginner:     ["networking", "linux", "wireshark", "nmap", "ctf"],
    intermediate: ["penetration-testing", "metasploit", "burpsuite", "exploit", "malware-analysis"],
    advanced:     ["reverse-engineering", "zero-day", "forensics", "red-team", "threat-intelligence"],
  },
  [Major.DS]: {
    beginner:     ["python", "pandas", "numpy", "sql", "statistics"],
    intermediate: ["scikit-learn", "feature-engineering", "visualization", "r", "hypothesis-testing"],
    advanced:     ["deep-learning", "spark", "mlflow", "causal-inference", "time-series"],
  },
  [Major.SWE]: {
    beginner:     ["git", "javascript", "html", "css", "rest-api"],
    intermediate: ["react", "node", "docker", "ci-cd", "testing", "typescript"],
    advanced:     ["kubernetes", "microservices", "system-design", "devops", "cloud"],
  },
};

// ── Project difficulty signals ────────────────────────────────────
// Keywords in tags/title/description that hint at difficulty
export const DIFFICULTY_SIGNALS: Record<ExperienceLevel, string[]> = {
  beginner:     ["tutorial", "intro", "beginner", "starter", "learn", "101", "basic", "guide", "course", "awesome"],
  intermediate: ["intermediate", "project", "framework", "library", "tool", "api", "dataset", "analysis"],
  advanced:     ["advanced", "research", "paper", "production", "architecture", "distributed", "optimization", "state-of-the-art"],
};
