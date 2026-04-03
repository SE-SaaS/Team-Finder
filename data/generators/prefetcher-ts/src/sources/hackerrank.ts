import { FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";
import { HackerRankAPI } from "unified-api-wrapper";

const HR_TRACKS: Record<string, string> = {
  CS: "algorithms",
  AI: "artificial-intelligence",
  DS: "sql",
  SWE: "java",
  CIS: "databases",
  CYS: "security",
};

export class HackerRankPrefetcher {
  readonly sourceName = "hackerrank";
  readonly strategy   = "api";
  private api: HackerRankAPI;

  constructor(apiKey?: string) {
    if (!apiKey) throw new Error("HackerRank requires an API token");
    this.api = new HackerRankAPI(
      { token: apiKey },
      { timeout: 15000, maxRetries: 3 }
    );
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    try {
      const data = await this.api.getContests({ limit: opts.limit ?? 10, offset: 0 });
      return (data?.models ?? []).map((item: any) => ({
        source:      this.sourceName,
        major,
        category:    "resource" as const,
        title:       String(item.name ?? item.slug ?? ""),
        url:         `https://www.hackerrank.com/contests/${item.slug}`,
        description: String(item.description ?? ""),
        tags:        [],
        extra:       { started: item.started, ended: item.ended },
      }));
    } catch (err) {
      console.warn(`[hackerrank] fetchResources failed:`, (err as Error).message);
      return [];
    }
  }

  async fetchProjects(_major: string, _opts?: FetchOptions): Promise<PrefetchResult[]> {
    return [];
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
