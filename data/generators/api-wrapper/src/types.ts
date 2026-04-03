/**
 * Shared types and interfaces for the API Wrapper
 */

// ─── Base ─────────────────────────────────────────────────────────────────────

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface ClientConfig {
  /** Max retries on transient failures (default: 3) */
  maxRetries?: number;
  /** Initial retry delay in ms (default: 500) */
  retryDelay?: number;
  /** Request timeout in ms (default: 10000) */
  timeout?: number;
  /** Requests per second limit (default: 10) */
  rateLimit?: number;
}

// ─── GitHub ───────────────────────────────────────────────────────────────────

export interface GitHubCredentials {
  token?: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: "open" | "closed";
  user: { login: string };
  created_at: string;
}

export interface CreateIssueBody {
  title: string;
  body?: string;
  labels?: string[];
  assignees?: string[];
}

export interface ListReposParams {
  [key: string]: string | number | boolean | undefined;
  type?: "all" | "owner" | "member";
  sort?: "created" | "updated" | "pushed" | "full_name";
  per_page?: number;
  page?: number;
}

// ─── Kaggle ───────────────────────────────────────────────────────────────────

export interface KaggleCredentials {
  username: string;
  key: string;
}

export interface KaggleDataset {
  id: string;
  title: string;
  subtitle: string;
  totalBytes: number;
  url: string;
  lastUpdated: string;
  downloadCount: number;
  voteCount: number;
}

export interface KaggleCompetition {
  id: string;
  title: string;
  deadline: string;
  reward: string;
  teamCount: number;
  evaluationMetric: string;
}

// ─── HuggingFace ──────────────────────────────────────────────────────────────

export interface HuggingFaceCredentials {
  token?: string;
}

export interface HFModel {
  id: string;
  modelId: string;
  pipeline_tag: string;
  downloads: number;
  likes: number;
  lastModified: string;
  tags: string[];
}

export interface HFDataset {
  id: string;
  downloads: number;
  likes: number;
  tags: string[];
}

export interface ListModelsParams {
  [key: string]: string | number | boolean | undefined;
  search?: string;
  filter?: string;
  sort?: string;
  direction?: "asc" | "desc";
  limit?: number;
}

// ─── LeetCode ─────────────────────────────────────────────────────────────────

export interface LeetCodeDailyChallenge {
  date: string;
  link: string;
  question: {
    title: string;
    difficulty: string;
    topicTags: { name: string }[];
  };
}

export interface LeetCodeUserProfile {
  username: string;
  submitStats: {
    acSubmissionNum: { difficulty: string; count: number }[];
  };
  profile: {
    ranking: number;
    reputation: number;
  };
}

// ─── HackerRank ───────────────────────────────────────────────────────────────

export interface HackerRankCredentials {
  token: string;
}

export interface HackerRankContest {
  id: number;
  slug: string;
  name: string;
  startTime: number;
  endTime: number;
}

// ─── HackTheBox ───────────────────────────────────────────────────────────────

export interface HackTheBoxCredentials {
  token: string;
}

export interface HTBMachine {
  id: number;
  name: string;
  os: string;
  difficulty: string;
  points: number;
  release: string;
}

export interface HTBUserProfile {
  id: number;
  name: string;
  rank: string;
  points: number;
  owns: { user: number; system: number };
}

// ─── CTFtime ──────────────────────────────────────────────────────────────────

export interface CTFEvent {
  id: number;
  title: string;
  start: string;
  finish: string;
  url: string;
  format: string;
  weight: number;
  onsite: boolean;
}

export interface CTFTeam {
  id: number;
  name: string;
  country: string;
  rating: number;
}

// ─── PapersWithCode ───────────────────────────────────────────────────────────

export interface PapersWithCodeCredentials {
  token?: string;
}

export interface PWCPaper {
  id: string;
  arxiv_id: string;
  title: string;
  abstract: string;
  authors: string[];
  published: string;
  github_links: { url: string; stars: number }[];
}

// ─── GitLab ───────────────────────────────────────────────────────────────────

export interface GitLabCredentials {
  token: string;
  /** Default: https://gitlab.com/api/v4 */
  baseURL?: string;
}

export interface GitLabProject {
  id: number;
  name: string;
  description: string;
  web_url: string;
  star_count: number;
  forks_count: number;
  created_at: string;
}

// ─── OpenHub ──────────────────────────────────────────────────────────────────

export interface OpenHubCredentials {
  apiKey: string;
}

// ─── SAP ──────────────────────────────────────────────────────────────────────

export interface SAPCredentials {
  token: string;
}

// ─── Tableau ──────────────────────────────────────────────────────────────────

export interface TableauCredentials {
  token: string;
  siteId?: string;
}

export interface TableauView {
  id: string;
  name: string;
  viewUrlName: string;
  contentUrl: string;
  totalViewCount: number;
}

// ─── Power BI ─────────────────────────────────────────────────────────────────

export interface PowerBICredentials {
  token: string;
}

export interface PowerBIDataset {
  id: string;
  name: string;
  configuredBy: string;
  isRefreshable: boolean;
  webUrl: string;
}

export interface PowerBIReport {
  id: string;
  name: string;
  webUrl: string;
  embedUrl: string;
  datasetId: string;
}

// ─── Manager ──────────────────────────────────────────────────────────────────

export interface ManagerCredentials {
  github?: GitHubCredentials;
  kaggle?: KaggleCredentials;
  huggingface?: HuggingFaceCredentials;
  leetcode?: Record<string, never>;
  hackerrank?: HackerRankCredentials;
  hackthebox?: HackTheBoxCredentials;
  ctftime?: Record<string, never>;
  paperswithcode?: PapersWithCodeCredentials;
  gitlab?: GitLabCredentials;
  openhub?: OpenHubCredentials;
  sap?: SAPCredentials;
  tableau?: TableauCredentials;
  powerbi?: PowerBICredentials;
}
