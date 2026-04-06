import { BasePrefetcher, FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";

const MAJOR_TOPICS: Record<string, string[]> = {
  AI:  ["machine-learning", "deep-learning", "neural-network", "llm", "generative-ai"],
  CS:  ["algorithms", "data-structures", "computer-science", "competitive-programming"],
  CIS: ["information-systems", "erp", "sap", "cybersecurity", "enterprise"],
  BI:  ["business-intelligence", "data-visualization", "etl", "tableau", "power-bi"],
  CYS: ["cybersecurity", "penetration-testing", "ctf", "exploit", "security-tools"],
  DS:  ["data-science", "data-analysis", "pandas", "scikit-learn", "jupyter"],
  SWE: ["software-engineering", "design-patterns", "devops", "clean-code", "api"],
};

const TIMEOUT_MS  = 30_000; // increased from 15s
const MAX_RETRIES = 3;
const RETRY_DELAY = 2_000;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export class GitHubPrefetcher extends BasePrefetcher {
  readonly sourceName = "github";
  readonly strategy   = "api";
  readonly baseUrl    = "https://api.github.com";

  protected buildHeaders() {
    const h: Record<string, string> = {
      Accept:                 "application/vnd.github+json",
      "User-Agent":           "PrefetcherBot/1.0",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (this.apiKey) h["Authorization"] = `Bearer ${this.apiKey}`;
    return h;
  }

  private makeItem(
    item: Record<string, unknown>,
    major: string,
    category: "resource" | "project" | "dataset"
  ): PrefetchResult {
    return this.makeResult(major, category, {
      title:       String(item.full_name ?? ""),
      url:         String(item.html_url ?? ""),
      description: String(item.description ?? ""),
      tags:        Array.isArray(item.topics) ? (item.topics as string[]) : [],
      language:    item.language as string | undefined,
      stars:       item.stargazers_count as number | undefined,
      extra: {
        forks:   item.forks_count,
        license: (item.license as Record<string, unknown> | null)?.spdx_id,
        updated: item.updated_at,
      },
    });
  }

  private async searchRepos(
    query: string,
    perPage = 10,
    attempt = 1
  ): Promise<Record<string, unknown>[]> {
    const safePerPage = Math.min(perPage, 10);
    try {
      const data = await this.get<{ items: Record<string, unknown>[]; message?: string }>(
        `${this.baseUrl}/search/repositories`,
        { q: query, sort: "stars", per_page: safePerPage },
        { timeout: TIMEOUT_MS }
      );

      if (data?.message?.toLowerCase().includes("rate limit")) {
        console.warn(`[github] Rate limit hit — waiting 60s...`);
        await sleep(60_000);
        return this.searchRepos(query, perPage, attempt);
      }

      return data?.items ?? [];

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const isTimeout = msg.includes("timeout") || msg.includes("ECONNRESET");

      if (isTimeout && attempt < MAX_RETRIES) {
        console.warn(`[github] Timeout on attempt ${attempt}/${MAX_RETRIES} — retrying in ${RETRY_DELAY}ms...`);
        await sleep(RETRY_DELAY * attempt);
        return this.searchRepos(query, perPage, attempt + 1);
      }

      console.error(`[github] Search failed after ${attempt} attempt(s): ${msg}`);
      return [];
    }
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const topics = MAJOR_TOPICS[major] ?? [major.toLowerCase()];
    const items  = await this.searchRepos(
      `awesome ${topics[0]} in:name,description stars:>500`,
      opts.limit ?? 10
    );
    return items.map(i => this.makeItem(i, major, "resource"));
  }

  async fetchProjects(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const topic = (MAJOR_TOPICS[major] ?? [major.toLowerCase()])[0];
    const items = await this.searchRepos(`topic:${topic}`, opts.limit ?? 10);
    return items.map(i => this.makeItem(i, major, "project"));
  }

  async fetchDatasets(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const kw    = (MAJOR_TOPICS[major] ?? [major.toLowerCase()])[0];
    const items = await this.searchRepos(`${kw} dataset in:name,description`, opts.limit ?? 10);
    return items.map(i => this.makeItem(i, major, "dataset"));
  }
}