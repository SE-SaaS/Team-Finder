import { PrefetchResult, SOURCE_MAP, Major } from "./core/types";
import { getPrefetcher } from "./core/registry";
import { FetchOptions } from "./core/basePrefetcher";

export interface PrefetchSummary {
  total:       number;
  bySource:    Record<string, number>;
  byCategory:  Record<string, number>;
  languages:   Record<string, number>;
}

export class MajorPrefetcher {
  constructor(
    private readonly apiKeys:    Record<string, string> = {},
    private readonly limitPerSource: number = 10
  ) {}

  private async runSource(source: string, major: string): Promise<PrefetchResult[]> {
    try {
      const p    = getPrefetcher(source, this.apiKeys[source]);
      const opts: FetchOptions = { limit: this.limitPerSource, perPage: this.limitPerSource, pageSize: this.limitPerSource };
      return await p.fetchAll(major, opts);
    } catch (err) {
      console.error(`[${major}][${source}] Error:`, (err as Error).message);
      return [];
    }
  }

  async prefetch(major: Major | string): Promise<PrefetchResult[]> {
    const key     = typeof major === "string" ? major : major;
    const sources = SOURCE_MAP[key as Major] ?? [];
    if (!sources.length) { console.warn(`No sources for major: ${key}`); return []; }

    console.info(`[${key}] Fetching from: ${sources.join(", ")}`);
    const batches = await Promise.allSettled(sources.map(s => this.runSource(s, key)));
    const results: PrefetchResult[] = [];
    for (const b of batches) {
      if (b.status === "fulfilled") results.push(...b.value);
    }
    console.info(`[${key}] Total results: ${results.length}`);
    return results;
  }

  async prefetchAll(): Promise<Record<string, PrefetchResult[]>> {
    const majors  = Object.values(Major);
    const batches = await Promise.allSettled(majors.map(m => this.prefetch(m)));
    return Object.fromEntries(
      majors.map((m, i) => [m, batches[i].status === "fulfilled" ? (batches[i] as PromiseFulfilledResult<PrefetchResult[]>).value : []])
    );
  }

  summarize(results: PrefetchResult[]): PrefetchSummary {
    const count = (key: keyof PrefetchResult) =>
      results.reduce((acc, r) => {
        const val = String(r[key] ?? "");
        if (val) acc[val] = (acc[val] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      total:      results.length,
      bySource:   count("source"),
      byCategory: count("category"),
      languages:  results
        .filter(r => r.language)
        .reduce((acc, r) => { acc[r.language!] = (acc[r.language!] ?? 0) + 1; return acc; }, {} as Record<string, number>),
    };
  }
}

// ── Re-exports for consumers ──────────────────────────────────────
export { Major, PrefetchResult, SOURCE_MAP } from "./core/types";
export { getPrefetcher }                      from "./core/registry";
