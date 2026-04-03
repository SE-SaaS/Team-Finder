import { FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";
import { PapersWithCodeAPI } from "unified-api-wrapper";
import type { PWCPaper } from "unified-api-wrapper";

const PWC_QUERIES: Record<string, string> = {
  AI: "large language models",
  DS: "time series forecasting",
  CIS: "anomaly detection",
  CYS: "intrusion detection",
};

export class PapersWithCodePrefetcher {
  readonly sourceName = "paperswithcode";
  readonly strategy   = "api";
  private api: PapersWithCodeAPI;

  constructor(apiKey?: string) {
    this.api = new PapersWithCodeAPI(
      { token: apiKey },
      { timeout: 15000, maxRetries: 3 }
    );
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const q = PWC_QUERIES[major] ?? major;
    try {
      const data = await this.api.listPapers({ q, items_per_page: opts.limit ?? 10 });
      return (data?.results ?? []).map((p: PWCPaper) => ({
        source:      this.sourceName,
        major,
        category:    "resource" as const,
        title:       String(p.title ?? ""),
        url:         String(p.url_abs ?? `https://paperswithcode.com/paper/${p.id}`),
        description: String(p.abstract ?? "").slice(0, 200),
        tags:        [],
        extra:       {
          stars: p.stars,
          published: p.published,
        },
      }));
    } catch (err) {
      console.warn(`[paperswithcode] fetchResources failed:`, (err as Error).message);
      return [];
    }
  }

  async fetchProjects(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const q = PWC_QUERIES[major] ?? major;
    try {
      const data = await this.api.listMethods({ q, page: 1 });
      const results = (data as any)?.results ?? [];
      return results.slice(0, opts.limit ?? 10).map((r: any) => ({
        source:      this.sourceName,
        major,
        category:    "project" as const,
        title:       String(r.name ?? ""),
        url:         `https://paperswithcode.com/method/${r.id}`,
        description: String(r.description ?? "").slice(0, 200),
        tags:        [major.toLowerCase(), "research"],
        extra:       {},
      }));
    } catch (err) {
      console.warn(`[paperswithcode] fetchProjects failed:`, (err as Error).message);
      return [];
    }
  }

  async fetchDatasets(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const q = PWC_QUERIES[major] ?? major;
    try {
      const data = await this.api.listDatasets({ q, page: 1 });
      const results = (data as any)?.results ?? [];
      return results.slice(0, opts.limit ?? 10).map((d: any) => ({
        source:      this.sourceName,
        major,
        category:    "dataset" as const,
        title:       String(d.name ?? ""),
        url:         `https://paperswithcode.com/dataset/${d.id}`,
        description: String(d.full_name ?? ""),
        tags:        [major.toLowerCase()],
        extra:       {},
      }));
    } catch (err) {
      console.warn(`[paperswithcode] fetchDatasets failed:`, (err as Error).message);
      return [];
    }
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
