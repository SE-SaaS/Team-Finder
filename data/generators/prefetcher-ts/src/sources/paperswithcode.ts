import { BasePrefetcher, FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";

const PWC_QUERIES: Record<string, string> = {
  AI:  "large language models",
  DS:  "time series forecasting",
  CIS: "anomaly detection",
  CYS: "intrusion detection",
  CS:  "algorithms",
  SWE: "software engineering",
  BI:  "data visualization",
};

export class PapersWithCodePrefetcher extends BasePrefetcher {
  readonly sourceName = "paperswithcode";
  readonly strategy   = "api";
  readonly baseUrl    = "https://paperswithcode.com/api/v1";

  // Must explicitly request JSON — otherwise returns HTML
  protected buildHeaders() {
    return {
      "Accept":     "application/json",
      "User-Agent": "PrefetcherBot/1.0",
    };
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const q    = PWC_QUERIES[major] ?? major;
    const data = await this.get<{ results: Record<string, unknown>[] }>(
      `${this.baseUrl}/papers/`,
      { q, items_per_page: opts.limit ?? 10 }
    );
    return (data?.results ?? []).map(p => {
      const tasks = Array.isArray(p.tasks)
        ? (p.tasks as { name: string }[]).map(t => t.name)
        : [];
      return this.makeResult(major, "resource", {
        title:       String(p.title ?? ""),
        url:         String(p.url_abs ?? `https://paperswithcode.com/paper/${p.id}`),
        description: String(p.abstract ?? "").slice(0, 200),
        tags:        tasks,
        extra:       { stars: p.github_stars, published: p.published },
      });
    });
  }

  async fetchProjects(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const q    = PWC_QUERIES[major] ?? major;
    const data = await this.get<{ results: Record<string, unknown>[] }>(
      `${this.baseUrl}/repositories/`,
      { q, items_per_page: opts.limit ?? 10 }
    );
    return (data?.results ?? []).map(r => this.makeResult(major, "project", {
      title:       String(r.name ?? ""),
      url:         String(r.url ?? ""),
      description: String(r.description ?? ""),
      tags:        [major.toLowerCase(), "research"],
      stars:       r.stars as number | undefined,
      extra:       {},
    }));
  }

  async fetchDatasets(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const q    = PWC_QUERIES[major] ?? major;
    const data = await this.get<{ results: Record<string, unknown>[] }>(
      `${this.baseUrl}/datasets/`,
      { q, items_per_page: opts.limit ?? 10 }
    );
    return (data?.results ?? []).map(d => this.makeResult(major, "dataset", {
      title:       String(d.name ?? ""),
      url:         `https://paperswithcode.com/dataset/${d.id}`,
      description: String(d.full_name ?? ""),
      tags:        [major.toLowerCase()],
      extra:       {},
    }));
  }
}
