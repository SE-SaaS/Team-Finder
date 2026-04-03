import { BasePrefetcher, FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";

export class VulnHubPrefetcher extends BasePrefetcher {
  readonly sourceName = "vulnhub";
  readonly strategy   = "scrape";
  readonly baseUrl    = "https://www.vulnhub.com";

  async fetchResources(major: string): Promise<PrefetchResult[]> {
    const $ = await this.getHtml(this.baseUrl);
    if (!$) return [];

    const results: PrefetchResult[] = [];
    $(".vm-entry").slice(0, 10).each((_, el) => {
      const a = $(el).find("a[href]").first();
      const name = $(el).find(".vm-title").text().trim();
      const href = a.attr("href") ?? "";
      if (!href) return;

      results.push(this.makeResult(major, "resource", {
        title:       name || a.text().trim(),
        url:         href.startsWith("/") ? `${this.baseUrl}${href}` : href,
        description: "",
        tags:        ["vm", "lab", "ctf-style"],
        extra:       {},
      }));
    });
    return results;
  }

  async fetchProjects(_major: string, _opts?: FetchOptions): Promise<PrefetchResult[]> {
    return [];
  }

  async fetchDatasets(_major: string, _opts?: FetchOptions): Promise<PrefetchResult[]> {
    return [];
  }
}
