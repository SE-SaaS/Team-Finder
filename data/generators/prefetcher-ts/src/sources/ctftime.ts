import { FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";
import { CTFtimeAPI } from "unified-api-wrapper";
import type { CTFEvent } from "unified-api-wrapper";

export class CTFtimePrefetcher {
  readonly sourceName = "ctftime";
  readonly strategy   = "api";
  private api: CTFtimeAPI;

  constructor() {
    this.api = new CTFtimeAPI({ timeout: 15000, maxRetries: 3 });
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const future = now + 60 * 60 * 24 * 90; // 90 days ahead

      const data = await this.api.getEvents({
        limit: opts.limit ?? 10,
        start: now,
        finish: future,
      });

      return (data ?? []).map((e: CTFEvent) => ({
        source:      this.sourceName,
        major,
        category:    "resource" as const,
        title:       String(e.title ?? ""),
        url:         String(e.url ?? ""),
        description: `Format: ${e.format} | Weight: ${e.weight}`,
        tags:        [],
        extra:       {
          start: e.start,
          finish: e.finish,
          onsite: e.onsite,
          weight: e.weight,
        },
      }));
    } catch (err) {
      console.warn(`[ctftime] fetchResources failed:`, (err as Error).message);
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
