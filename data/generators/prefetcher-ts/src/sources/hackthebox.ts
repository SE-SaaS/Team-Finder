import { BasePrefetcher, FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";

export class HackTheBoxPrefetcher extends BasePrefetcher {
  readonly sourceName = "hackthebox";
  readonly strategy   = "api";
  readonly baseUrl    = "https://www.hackthebox.com/api/v4";

  protected buildHeaders() {
    const h: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (compatible; PrefetcherBot/1.0)",
      "Accept":     "application/json",
    };
    if (this.apiKey) h["Authorization"] = `Bearer ${this.apiKey}`;
    return h;
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const data = await this.get<{ data: Record<string, unknown>[] }>(
      `${this.baseUrl}/machine/paginated`,
      { per_page: opts.limit ?? 10, retired: 1 }
    );
    return (data?.data ?? []).map(m => this.makeResult(major, "resource", {
      title:       String(m.name ?? ""),
      url:         `https://app.hackthebox.com/machines/${m.name}`,
      description: `OS: ${m.os} | Difficulty: ${m.difficultyText ?? m.difficulty}`,
      tags:        ["retired", String(m.os ?? "").toLowerCase()],
      extra:       { points: m.points, user_owns: m.user_owns_count, rating: m.star },
    }));
  }

  async fetchProjects(major: string): Promise<PrefetchResult[]> { return []; }
  async fetchDatasets(major: string): Promise<PrefetchResult[]> { return []; }
}