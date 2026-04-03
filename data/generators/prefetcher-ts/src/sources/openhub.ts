import { FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";
import { OpenHubAPI } from "unified-api-wrapper";

const OH_QUERIES: Record<string, string> = {
  SWE: "software engineering framework",
  AI: "machine learning",
  CS: "algorithms library",
  CIS: "enterprise information system",
  CYS: "security scanner",
};

export class OpenHubPrefetcher {
  readonly sourceName = "openhub";
  readonly strategy   = "api";
  private api: OpenHubAPI;

  constructor(apiKey?: string) {
    if (!apiKey) throw new Error("OpenHub requires an API key");
    this.api = new OpenHubAPI(
      { apiKey },
      { timeout: 15000, maxRetries: 3 }
    );
  }

  async fetchResources(_major: string, _opts?: FetchOptions): Promise<PrefetchResult[]> {
    return [];
  }

  async fetchProjects(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const q = OH_QUERIES[major] ?? major;
    try {
      const data = await this.api.searchProjects(q);
      let items = (data as any)?.result?.project ?? [];
      if (!Array.isArray(items)) items = [items];

      return items.slice(0, opts.limit ?? 10).map((p: any) => {
        const analysis = p.analysis ?? {};
        return {
          source:      this.sourceName,
          major,
          category:    "project" as const,
          title:       String(p.name ?? ""),
          url:         String(p.html_url ?? ""),
          description: String(p.description ?? "").slice(0, 200),
          tags:        [major.toLowerCase(), "open-source"],
          extra:       {
            users_count: p.user_count,
            twelve_month_commits: analysis.twelve_month_commit_count,
          },
        };
      });
    } catch (err) {
      console.warn(`[openhub] fetchProjects failed:`, (err as Error).message);
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
