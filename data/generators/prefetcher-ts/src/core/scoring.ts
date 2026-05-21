import { PrefetchResult } from "./types";

export type DifficultyLabel = "beginner" | "intermediate" | "advanced";

export interface ScoreResult {
  difficulty_score: number | null;  // 0-100, null when no native signal
  popularity_score: number;         // 0-100, normalized per source
}

// -- Language complexity (GitHub / GitLab) --
const LANGUAGE_WEIGHT: Record<string, number> = {
  "Assembly":   100,
  "C":          90,
  "C++":        85,
  "Rust":       80,
  "Go":         65,
  "Java":       60,
  "Kotlin":     55,
  "Swift":      55,
  "TypeScript": 45,
  "JavaScript": 40,
  "Python":     35,
  "Ruby":       30,
  "PHP":        30,
  "HTML":       10,
};

// -- Topic complexity --
const HARD_TOPICS = new Set<string>([
  "cuda", "compiler", "compilers", "distributed-systems", "operating-system",
  "machine-learning", "deep-learning", "cryptography", "blockchain",
  "kernel", "embedded", "real-time", "computer-vision", "reinforcement-learning",
  "neural-network", "transformer", "llm", "rag",
]);

const EASY_TOPICS = new Set<string>([
  "beginner-friendly", "tutorial", "starter", "boilerplate",
  "todo-app", "portfolio", "static-site", "demo", "hello-world",
  "awesome", "awesome-list",
]);

function languageScore(language?: string): number {
  if (!language) return 40;
  return LANGUAGE_WEIGHT[language] ?? 40;
}

function topicScore(topics: string[]): number {
  let s = 50;
  for (const t of topics) {
    if (HARD_TOPICS.has(t)) s += 10;
    if (EASY_TOPICS.has(t)) s -= 10;
  }
  return Math.max(0, Math.min(100, s));
}

function sizeScoreRepo(extra: Record<string, unknown>): number {
  let s = 0;
  const size   = Number(extra.size_kb ?? 0);
  const issues = Number(extra.open_issues ?? 0);
  const forks  = Number(extra.forks ?? 0);
  if (size > 100_000) s += 30;
  else if (size > 10_000) s += 20;
  else if (size > 1_000) s += 10;
  if (issues > 500) s += 20;
  else if (issues > 100) s += 10;
  else if (issues > 20) s += 5;
  if (forks > 1_000) s += 10;
  else if (forks > 100) s += 5;
  return Math.min(100, s);
}

function docsScoreRepo(extra: Record<string, unknown>, description?: string): number {
  // 0 = no docs (harder onboarding), 100 = full docs (easier onboarding)
  let s = 0;
  if (description && description.length > 10) s += 30;
  if (extra.has_wiki === true || extra.wiki_enabled === true) s += 30;
  if (extra.homepage) s += 40;
  return s;
}

function logNormalize(n: number, factor: number): number {
  return Math.min(100, Math.round(Math.log10(Math.max(0, n) + 1) * factor));
}

function scoreRepo(r: PrefetchResult): ScoreResult {
  const extra        = r.extra ?? {};
  const lang         = languageScore(r.language);
  const topic        = topicScore(r.tags ?? []);
  const size         = sizeScoreRepo(extra);
  const docsInv      = 100 - docsScoreRepo(extra, r.description);
  const difficulty   = Math.round(lang * 0.35 + topic * 0.30 + size * 0.20 + docsInv * 0.15);
  const popularity   = logNormalize(r.stars ?? 0, 25);
  return { difficulty_score: clamp(difficulty), popularity_score: popularity };
}

function scoreLeetCode(r: PrefetchResult): ScoreResult {
  const extra = r.extra ?? {};
  const dr    = String(extra.difficulty_rating ?? "Medium");
  const base  = dr === "Easy" ? 25 : dr === "Hard" ? 85 : 55;
  const ac    = Number(extra.acceptance_rate ?? 50);
  const acAdj = Math.max(0, (50 - ac) / 2);
  const popularity = clamp(Math.round(100 - ac));
  return { difficulty_score: clamp(base + acAdj), popularity_score: popularity };
}

function scoreHackerRank(r: PrefetchResult): ScoreResult {
  const extra = r.extra ?? {};
  const dn    = String(extra.difficulty_name ?? "Medium").toLowerCase();
  const base  = dn === "easy" ? 25 : dn === "hard" ? 75 : dn === "expert" ? 90 : 50;
  const attempts   = Number(extra.attempts ?? 0);
  const popularity = logNormalize(attempts, 25);
  return { difficulty_score: base, popularity_score: popularity };
}

function scoreKaggleDataset(r: PrefetchResult): ScoreResult {
  const extra     = r.extra ?? {};
  const usability = Number(extra.usability ?? 5);
  const difficulty = clamp(100 - usability * 10);
  const votes     = Number(extra.vote_count ?? 0);
  const downloads = Number(extra.download_count ?? 0);
  const popularity = logNormalize(votes + downloads / 100, 20);
  return { difficulty_score: difficulty, popularity_score: popularity };
}

function scoreKaggleKernel(r: PrefetchResult): ScoreResult {
  const extra      = r.extra ?? {};
  const lang       = String(extra.language ?? "");
  const langScore  = languageScore(lang);
  const votes      = Number(extra.votes ?? 0);
  const popularity = logNormalize(votes, 25);
  return { difficulty_score: langScore, popularity_score: popularity };
}

function scoreHuggingFace(r: PrefetchResult): ScoreResult {
  const extra = r.extra ?? {};
  if (r.url.includes("/papers/")) {
    const upvotes = Number(extra.upvotes ?? 0);
    const diff = upvotes < 5 ? 30 : upvotes < 20 ? 50 : upvotes < 100 ? 70 : 90;
    const popularity = logNormalize(upvotes, 30);
    return { difficulty_score: diff, popularity_score: popularity };
  }
  const downloads  = Number(extra.downloads ?? 0);
  const likes      = Number(extra.likes ?? 0);
  const popularity = logNormalize(downloads / 100 + likes, 20);
  return { difficulty_score: null, popularity_score: popularity };
}

function scoreCtftime(_r: PrefetchResult): ScoreResult {
  return { difficulty_score: 60, popularity_score: 50 };
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function scoreProject(result: PrefetchResult): ScoreResult {
  switch (result.source) {
    case "github":
    case "gitlab":
      return scoreRepo(result);
    case "leetcode":
      return scoreLeetCode(result);
    case "hackerrank":
      return scoreHackerRank(result);
    case "kaggle":
      return result.category === "dataset" ? scoreKaggleDataset(result) : scoreKaggleKernel(result);
    case "huggingface":
      return scoreHuggingFace(result);
    case "ctftime":
      return scoreCtftime(result);
    default:
      return { difficulty_score: null, popularity_score: 50 };
  }
}

export function bucketDifficulty(score: number | null): DifficultyLabel | null {
  if (score === null) return null;
  if (score < 35) return "beginner";
  if (score < 65) return "intermediate";
  return "advanced";
}

export function normalizeDifficulty(input: string | null | undefined): DifficultyLabel | null {
  if (!input) return null;
  const lc = input.toLowerCase().trim();
  if (lc === "beginner" || lc === "easy") return "beginner";
  if (lc === "intermediate" || lc === "medium" || lc === "moderate") return "intermediate";
  if (lc === "advanced" || lc === "hard" || lc === "expert") return "advanced";
  return null;
}
