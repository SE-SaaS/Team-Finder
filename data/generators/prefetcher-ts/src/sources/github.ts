import { FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";
import { GitHubAPI } from "unified-api-wrapper";
import type { GitHubRepo } from "unified-api-wrapper";

const MAJOR_TOPICS: Record<string, string[]> = {
  AI:  ["machine-learning", "deep-learning", "neural-network", "llm", "generative-ai"],
  CS:  ["algorithms", "data-structures", "computer-science", "competitive-programming"],
  CIS: ["information-systems", "erp", "sap", "cybersecurity", "enterprise"],
  BI:  ["business-intelligence", "data-visualization", "etl", "tableau", "power-bi"],
  CYS: ["cybersecurity", "penetration-testing", "ctf", "exploit", "security-tools"],
  DS:  ["data-science", "data-analysis", "pandas", "scikit-learn", "jupyter"],
  SWE: ["software-engineering", "design-patterns", "devops", "clean-code", "api"],
};

export class GitHubPrefetcher {
  readonly sourceName = "github";
  readonly strategy   = "api";
  private api: GitHubAPI;

  constructor(apiKey?: string) {
    this.api = new GitHubAPI(
      { token: apiKey },
      { timeout: 15000, maxRetries: 3, rateLimit: 10 }
    );
  }

  private makeItem(item: GitHubRepo, major: string, category: "resource" | "project" | "dataset"): PrefetchResult {
    return {
      source:      this.sourceName,
      major,
      category,
      title:       item.full_name,
      url:         item.html_url,
      description: item.description || "",
      tags:        [], // GitHub v3 doesn't return topics in search, would need separate call
      language:    item.language,
      stars:       item.stargazers_count,
      extra: {
        forks:   item.forks_count,
        updated: item.updated_at,
      },
    };
  }

  private async searchRepos(query: string, perPage = 10): Promise<GitHubRepo[]> {
    try {
      const data = await this.api.searchRepos(query, { sort: "stars", per_page: perPage });
      return data.items;
    } catch (err) {
      console.warn(`[github] Search failed:`, (err as Error).message);
      return [];
    }
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const topics = MAJOR_TOPICS[major] ?? [major.toLowerCase()];
    const items  = await this.searchRepos(`awesome ${topics[0]} in:name,description stars:>500`, opts.limit ?? 10);
    return items.map(i => this.makeItem(i, major, "resource"));
  }

  async fetchProjects(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const topics = MAJOR_TOPICS[major] ?? [major.toLowerCase()];
    // Use only first 2 topics to avoid GitHub query complexity errors
    const query = topics.slice(0, 2).map(t => `topic:${t}`).join("+");
    const items = await this.searchRepos(query, opts.limit ?? 10);
    return items.map(i => this.makeItem(i, major, "project"));
  }

  async fetchDatasets(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const kw    = (MAJOR_TOPICS[major] ?? [major.toLowerCase()])[0];
    const items = await this.searchRepos(`${kw} dataset in:name,description`, opts.limit ?? 10);
    return items.map(i => this.makeItem(i, major, "dataset"));
  }

  async fetchAll(major: string, opts?: FetchOptions): Promise<PrefetchResult[]> {
    const [resources, projects, datasets] = await Promise.allSettled([
      this.fetchResources(major, opts),
      this.fetchProjects(major, opts),
      this.fetchDatasets(major, opts),
    ]);

    const combined: PrefetchResult[] = [];
    for (const r of [resources, projects, datasets]) {
      if (r.status === "fulfilled") combined.push(...r.value);
    }
    return combined;
  }
}
