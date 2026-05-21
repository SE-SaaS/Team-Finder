// ── Enums ────────────────────────────────────────────────────────
export enum Major {
  AI  = "AI",
  CS  = "CS",
  CIS = "CIS",
  BI  = "BI",
  CYS = "CYS",
  DS  = "DS",
  SWE = "SWE",
}

export type Strategy = "api" | "graphql" | "scrape" | "internal";
export type Category = "resource" | "project" | "dataset";

// ── Result shape ─────────────────────────────────────────────────
export interface PrefetchResult {
  source:      string;
  major:       string;
  category:    Category;
  title:       string;
  url:         string;
  description: string;
  tags:        string[];
  language?:   string;
  stars?:      number;
  extra:       Record<string, unknown>;
}

// ── Source map ───────────────────────────────────────────────────
export const SOURCE_MAP: Record<Major, string[]> = {
  [Major.AI]:  ["github", "kaggle", "huggingface"],
  [Major.CS]:  ["github", "leetcode", "hackerrank"],
  [Major.CIS]: ["github", "kaggle"],
  [Major.BI]:  ["github", "kaggle"],
  [Major.CYS]: ["github", "ctftime"],
  [Major.DS]:  ["github", "kaggle", "huggingface"],
  [Major.SWE]: ["github", "gitlab"],
};

export const SOURCE_STRATEGY: Record<string, Strategy> = {
  github:         "api",
  kaggle:         "api",
  huggingface:    "api",
  leetcode:       "graphql",
  hackerrank:     "api",
  sap:            "api",
  gitlab:         "api",
  paperswithcode: "api",
  uci:            "api",
  ctftime:        "api",
  hackthebox:     "api",
  vulnhub:        "scrape",
  tableau_public: "scrape",
  power_bi:       "scrape",
  openhub:        "api",
  ai_generator:   "internal",
};
