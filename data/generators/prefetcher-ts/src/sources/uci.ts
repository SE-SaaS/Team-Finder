import { BasePrefetcher, FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";

const UCI_AREAS: Record<string, string> = {
  DS: "data science",
  AI: "classification",
  CIS: "business",
  BI: "business",
  CYS: "computer",
};

export class UCIPrefetcher extends BasePrefetcher {
  readonly sourceName = "uci";
  readonly strategy   = "api";
  readonly baseUrl    = "https://archive.ics.uci.edu/api/public/dataset";

  async fetchResources(_major: string, _opts?: FetchOptions): Promise<PrefetchResult[]> {
    return [];
  }

  async fetchProjects(_major: string, _opts?: FetchOptions): Promise<PrefetchResult[]> {
    return [];
  }

  async fetchDatasets(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const area = UCI_AREAS[major] ?? "";
    const data = await this.get<{ data: { ucimlrepo: Record<string, unknown>[] } }>(
      this.baseUrl,
      { search: area, numRows: opts.limit ?? 10 }
    );

    return (data?.data?.ucimlrepo ?? []).map(d => this.makeResult(major, "dataset", {
      title:       String(d.Name ?? ""),
      url:         `https://archive.ics.uci.edu/dataset/${d.ID}`,
      description: String(d.Abstract ?? "").slice(0, 200),
      tags:        [String(d.Area ?? "").toLowerCase()],
      extra:       {
        instances: d.NumInstances,
        features: d.NumFeatures,
        year: d.Year,
      },
    }));
  }
}
