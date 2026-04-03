import { FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";
import { HackTheBoxAPI } from "unified-api-wrapper";
import type { HTBMachine } from "unified-api-wrapper";

export class HackTheBoxPrefetcher {
  readonly sourceName = "hackthebox";
  readonly strategy   = "api";
  private api: HackTheBoxAPI;

  constructor(apiKey?: string) {
    if (!apiKey) throw new Error("HackTheBox requires an API token");
    this.api = new HackTheBoxAPI(
      { token: apiKey },
      { timeout: 15000, maxRetries: 3 }
    );
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    try {
      const data = await this.api.getMachineList({});
      const machines = (data?.data ?? []).slice(0, opts.limit ?? 10);

      return machines.map((m: HTBMachine) => ({
        source:      this.sourceName,
        major,
        category:    "resource" as const,
        title:       String(m.name ?? ""),
        url:         `https://www.hackthebox.com/machines/${m.name}`,
        description: `OS: ${m.os} | Difficulty: ${m.difficulty}`,
        tags:        ["retired", String(m.os ?? "").toLowerCase()],
        extra:       { points: m.points, difficulty: m.difficulty },
      }));
    } catch (err) {
      console.warn(`[hackthebox] fetchResources failed:`, (err as Error).message);
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
