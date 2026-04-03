import { FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";
import { PowerBIAPI } from "unified-api-wrapper";
import type { PowerBIReport } from "unified-api-wrapper";

export class PowerBIPrefetcher {
  readonly sourceName = "power_bi";
  readonly strategy   = "api";
  private api: PowerBIAPI;

  constructor(apiKey?: string) {
    if (!apiKey) throw new Error("Power BI requires an access token");
    this.api = new PowerBIAPI(
      { token: apiKey },
      { timeout: 15000, maxRetries: 3 }
    );
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    try {
      const data = await this.api.getReports();
      const reports = (data?.value ?? []).slice(0, opts.limit ?? 10);

      return reports.map((r: PowerBIReport) => ({
        source:      this.sourceName,
        major,
        category:    "resource" as const,
        title:       String(r.name ?? ""),
        url:         String(r.webUrl ?? ""),
        description: "",
        tags:        ["power-bi", "dashboard", major.toLowerCase()],
        extra:       { id: r.id, datasetId: r.datasetId },
      }));
    } catch (err) {
      console.warn(`[power_bi] fetchResources failed:`, (err as Error).message);
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
