import { FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";
import { GitLabAPI } from "unified-api-wrapper";

const GL_TOPICS: Record<string, string> = {
  SWE: "devops",
  AI: "machine-learning",
  CYS: "security",
};

export class GitLabPrefetcher {
  readonly sourceName = "gitlab";
  readonly strategy   = "api";
  private api: GitLabAPI;

  constructor(apiKey?: string) {
    if (!apiKey) throw new Error("GitLab requires an API token");
    this.api = new GitLabAPI(
      { token: apiKey },
      { timeout: 15000, maxRetries: 3 }
    );
  }

  async fetchResources(_major: string, _opts?: FetchOptions): Promise<PrefetchResult[]> {
    return [];
  }

  async fetchProjects(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const topic = GL_TOPICS[major] ?? "software";
    try {
      const data = await this.api.listProjects({
        search: topic,
        per_page: opts.limit ?? 10,
        page: 1,
      });

      return (data ?? []).map((p: any) => ({
        source:      this.sourceName,
        major,
        category:    "project" as const,
        title:       String(p.name_with_namespace ?? p.name ?? ""),
        url:         String(p.web_url ?? ""),
        description: String(p.description ?? ""),
        tags:        Array.isArray(p.tag_list) ? p.tag_list : [],
        language:    p.language,
        stars:       p.star_count,
        extra:       { forks: p.forks_count },
      }));
    } catch (err) {
      console.warn(`[gitlab] fetchProjects failed:`, (err as Error).message);
      return [];
    }
  }

  async fetchDatasets(_major: string, _opts?: FetchOptions): Promise<PrefetchResult[]> {
    return [];
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
