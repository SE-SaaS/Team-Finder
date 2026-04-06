import { Major } from "../core/types";

export interface SkillMeta {
  year:    number;   // minimum year student should be to tackle this skill
  majors:  Major[];  // which majors this skill is relevant to
}

// Central skill taxonomy
// year 1 = foundational, year 2 = core, year 3 = advanced, year 4 = specialized
export const SKILL_TAXONOMY: Record<string, SkillMeta> = {

  // ── Languages ─────────────────────────────────────────────────
  "python":       { year: 1, majors: [Major.AI, Major.CS, Major.DS, Major.CIS, Major.SWE] },
  "javascript":   { year: 1, majors: [Major.CS, Major.SWE, Major.BI] },
  "typescript":   { year: 2, majors: [Major.CS, Major.SWE] },
  "java":         { year: 1, majors: [Major.CS, Major.SWE, Major.CIS] },
  "c++":          { year: 2, majors: [Major.CS, Major.AI] },
  "r":            { year: 2, majors: [Major.DS, Major.AI] },
  "sql":          { year: 1, majors: [Major.DS, Major.BI, Major.CIS, Major.SWE, Major.CS] },
  "bash":         { year: 2, majors: [Major.CS, Major.SWE, Major.CYS] },
  "go":           { year: 3, majors: [Major.SWE, Major.CS] },
  "rust":         { year: 4, majors: [Major.CS, Major.SWE] },

  // ── Frontend ──────────────────────────────────────────────────
  "html":         { year: 1, majors: [Major.SWE, Major.CS] },
  "css":          { year: 1, majors: [Major.SWE, Major.CS] },
  "react":        { year: 2, majors: [Major.SWE, Major.CS] },
  "vue":          { year: 2, majors: [Major.SWE, Major.CS] },
  "angular":      { year: 2, majors: [Major.SWE, Major.CS] },
  "nextjs":       { year: 3, majors: [Major.SWE, Major.CS] },

  // ── Backend ───────────────────────────────────────────────────
  "nodejs":       { year: 2, majors: [Major.SWE, Major.CS] },
  "express":      { year: 2, majors: [Major.SWE, Major.CS] },
  "fastapi":      { year: 2, majors: [Major.SWE, Major.DS, Major.AI] },
  "django":       { year: 2, majors: [Major.SWE, Major.CS] },
  "rest-api":     { year: 2, majors: [Major.SWE, Major.CS, Major.CIS] },
  "graphql":      { year: 3, majors: [Major.SWE, Major.CS] },

  // ── Databases ─────────────────────────────────────────────────
  "mongodb":      { year: 2, majors: [Major.SWE, Major.CS, Major.DS] },
  "postgresql":   { year: 2, majors: [Major.SWE, Major.CS, Major.DS, Major.BI] },
  "mysql":        { year: 1, majors: [Major.SWE, Major.CS, Major.CIS, Major.DS] },
  "redis":        { year: 3, majors: [Major.SWE, Major.CS] },
  "elasticsearch":{ year: 3, majors: [Major.SWE, Major.DS, Major.CS] },
  "data-warehouse":{ year: 3, majors: [Major.BI, Major.DS] },

  // ── DevOps / Infra ────────────────────────────────────────────
  "git":          { year: 1, majors: [Major.CS, Major.SWE, Major.AI, Major.DS] },
  "docker":       { year: 2, majors: [Major.SWE, Major.CS, Major.CYS, Major.DS] },
  "kubernetes":   { year: 3, majors: [Major.SWE, Major.CS] },
  "ci-cd":        { year: 3, majors: [Major.SWE, Major.CS] },
  "terraform":    { year: 4, majors: [Major.SWE, Major.CS] },
  "aws":          { year: 3, majors: [Major.SWE, Major.CS, Major.DS] },
  "azure":        { year: 3, majors: [Major.SWE, Major.CS, Major.CIS, Major.BI] },
  "gcp":          { year: 3, majors: [Major.SWE, Major.CS, Major.DS] },
  "mlops":        { year: 4, majors: [Major.AI, Major.DS] },

  // ── AI / ML ───────────────────────────────────────────────────
  "numpy":        { year: 1, majors: [Major.AI, Major.DS, Major.CS] },
  "pandas":       { year: 1, majors: [Major.AI, Major.DS, Major.BI, Major.CS] },
  "matplotlib":   { year: 1, majors: [Major.AI, Major.DS, Major.BI] },
  "scikit-learn": { year: 2, majors: [Major.AI, Major.DS] },
  "tensorflow":   { year: 3, majors: [Major.AI, Major.DS] },
  "pytorch":      { year: 3, majors: [Major.AI, Major.DS] },
  "keras":        { year: 2, majors: [Major.AI, Major.DS] },
  "nlp":          { year: 3, majors: [Major.AI, Major.DS, Major.CS] },
  "llm":          { year: 4, majors: [Major.AI, Major.DS] },
  "transformer":  { year: 4, majors: [Major.AI, Major.DS] },
  "cuda":         { year: 4, majors: [Major.AI, Major.CS] },
  "huggingface":  { year: 3, majors: [Major.AI, Major.DS] },
  "langchain":    { year: 3, majors: [Major.AI, Major.DS, Major.SWE] },

  // ── Data / BI ─────────────────────────────────────────────────
  "tableau":      { year: 1, majors: [Major.BI, Major.DS] },
  "power-bi":     { year: 1, majors: [Major.BI, Major.CIS] },
  "dax":          { year: 2, majors: [Major.BI] },
  "etl":          { year: 2, majors: [Major.BI, Major.DS, Major.CIS] },
  "spark":        { year: 3, majors: [Major.DS, Major.BI, Major.CS] },
  "airflow":      { year: 3, majors: [Major.DS, Major.BI] },
  "dbt":          { year: 3, majors: [Major.BI, Major.DS] },
  "looker":       { year: 2, majors: [Major.BI] },

  // ── CIS / ERP ─────────────────────────────────────────────────
  "sap":          { year: 2, majors: [Major.CIS] },
  "sap-fiori":    { year: 3, majors: [Major.CIS] },
  "sap-s4hana":   { year: 4, majors: [Major.CIS] },
  "btp":          { year: 3, majors: [Major.CIS] },
  "erp":          { year: 2, majors: [Major.CIS, Major.BI] },
  "bpmn":         { year: 3, majors: [Major.CIS] },

  // ── Cybersecurity ─────────────────────────────────────────────
  "networking":       { year: 1, majors: [Major.CYS, Major.CS] },
  "linux":            { year: 1, majors: [Major.CYS, Major.CS, Major.SWE] },
  "wireshark":        { year: 2, majors: [Major.CYS] },
  "nmap":             { year: 2, majors: [Major.CYS] },
  "ctf":              { year: 2, majors: [Major.CYS] },
  "penetration-testing": { year: 3, majors: [Major.CYS] },
  "metasploit":       { year: 3, majors: [Major.CYS] },
  "burpsuite":        { year: 3, majors: [Major.CYS] },
  "reverse-engineering": { year: 4, majors: [Major.CYS, Major.CS] },
  "malware-analysis": { year: 4, majors: [Major.CYS] },
  "cryptography":     { year: 3, majors: [Major.CYS, Major.CS] },
  "forensics":        { year: 4, majors: [Major.CYS] },

  // ── CS Core ───────────────────────────────────────────────────
  "algorithms":           { year: 1, majors: [Major.CS, Major.SWE, Major.AI] },
  "data-structures":      { year: 1, majors: [Major.CS, Major.SWE, Major.AI] },
  "dynamic-programming":  { year: 2, majors: [Major.CS, Major.SWE] },
  "system-design":        { year: 3, majors: [Major.CS, Major.SWE] },
  "distributed-systems":  { year: 4, majors: [Major.CS, Major.SWE] },
  "concurrency":          { year: 3, majors: [Major.CS, Major.SWE] },
  "compilers":            { year: 4, majors: [Major.CS] },
};
