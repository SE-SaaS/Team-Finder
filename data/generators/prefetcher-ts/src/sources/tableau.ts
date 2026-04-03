import { FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";
import { TableauAPI } from "unified-api-wrapper";
import type { TableauView } from "unified-api-wrapper";

export class TableauPrefetcher {
  readonly sourceName = "tableau_public";
  readonly strategy   = "api";
  private api: TableauAPI;

  constructor(apiKey?: string, siteId?: string) {
    if (!apiKey) throw new Error("Tableau requires an access token");
    this.api = new TableauAPI(
      { token: apiKey, siteId: siteId ?? "default" },
      { timeout: 15000, maxRetries: 3 }
    );
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    try {
      const data = await this.api.getViews({ pageSize: opts.limit ?? 10, pageNumber: 1 });
      const views = data?.views?.view ?? [];

      return views.map((v: TableauView) => ({
        source:      this.sourceName,
        major,
        category:    "resource" as const,
        title:       String(v.name ?? ""),
        url:         String(v.contentUrl ?? ""),
        description: "",
        tags:        ["visualization", "dashboard", major.toLowerCase()],
        extra:       { id: v.id, workbookId: v.workbook?.id },
      }));
    } catch (err) {
      console.warn(`[tableau_public] fetchResources failed:`, (err as Error).message);
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
