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
  [Major.AI]:  ["github", "kaggle", "huggingface", "ai_generator"],
  [Major.CS]:  ["github", "leetcode", "hackerrank"],
  [Major.CIS]: ["github", "kaggle", "sap"],
  [Major.BI]:  ["github", "kaggle", "tableau_public", "power_bi"],
  [Major.CYS]: ["github", "hackthebox", "vulnhub", "ctftime"],
  [Major.DS]:  ["github", "kaggle", "huggingface", "paperswithcode", "uci"],
  [Major.SWE]: ["github", "gitlab", "openhub"],
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
