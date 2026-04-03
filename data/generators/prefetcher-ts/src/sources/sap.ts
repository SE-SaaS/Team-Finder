import { FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";
import { SAPAPI } from "unified-api-wrapper";

export class SAPPrefetcher {
  readonly sourceName = "sap";
  readonly strategy   = "api";
  private api: SAPAPI;

  constructor(apiKey?: string) {
    if (!apiKey) throw new Error("SAP requires an API token");
    this.api = new SAPAPI(
      { token: apiKey },
      { timeout: 15000, maxRetries: 3 }
    );
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    try {
      const data = await this.api.listAPIs({ search: "business", type: "odata" });
      const items = (data as any)?.items ?? (data as any)?.results ?? [];

      return items.slice(0, opts.limit ?? 10).map((i: any) => ({
        source:      this.sourceName,
        major,
        category:    "resource" as const,
        title:       String(i.title ?? i.name ?? ""),
        url:         String(i.url ?? `https://api.sap.com/${i.id}`),
        description: String(i.shortDescription ?? i.description ?? ""),
        tags:        Array.isArray(i.tags) ? i.tags : [],
        extra:       {},
      }));
    } catch (err) {
      console.warn(`[sap] fetchResources failed:`, (err as Error).message);
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
