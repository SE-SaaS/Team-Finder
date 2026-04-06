import { BasePrefetcher, FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";

const MAJOR_KEYWORDS: Record<string, string[]> = {
  AI:  ["deep learning", "neural network", "generative ai", "llm"],
  CS:  ["algorithms", "data structures", "computer science"],
  CIS: ["information systems", "erp", "business process"],
  BI:  ["business intelligence", "dashboard", "visualization"],
  CYS: ["cybersecurity", "network security", "intrusion detection"],
  DS:  ["data science", "exploratory analysis", "feature engineering"],
  SWE: ["software engineering", "code quality", "devops"],
};

export class KagglePrefetcher extends BasePrefetcher {
  readonly sourceName = "kaggle";
  readonly strategy   = "api";
  readonly baseUrl    = "https://www.kaggle.com/api/v1";

  protected buildHeaders() {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (this.apiKey) {
      // apiKey format: "username:key"
      const encoded = Buffer.from(this.apiKey).toString("base64");
      h["Authorization"] = `Basic ${encoded}`;
    }
    return h;
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const kw   = (MAJOR_KEYWORDS[major] ?? [major])[0];
    const data = await this.get<Record<string, unknown>[]>(
      `${this.baseUrl}/kernels/list`,
      { search: kw, pageSize: opts.limit ?? 10, sortBy: "voteCount" }
    );
    return (data ?? []).map(item => this.makeResult(major, "resource", {
      title:       String(item.ref ?? ""),
      url:         `https://www.kaggle.com/code/${item.ref}`,
      description: "",
      tags:        [],
      extra:       { votes: item.totalVotes, language: item.language },
    }));
  }

  async fetchProjects(major: string): Promise<PrefetchResult[]> { return []; }

  async fetchDatasets(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const kw   = (MAJOR_KEYWORDS[major] ?? [major])[0];
    const data = await this.get<Record<string, unknown>[]>(
      `${this.baseUrl}/datasets/list`,
      { search: kw, pageSize: opts.limit ?? 10, sortBy: "usability" }
    );
    return (data ?? []).map(item => {
      const tags = Array.isArray(item.tags)
        ? (item.tags as Record<string, unknown>[]).map(t => String(t.name ?? ""))
        : [];
      return this.makeResult(major, "dataset", {
        title:       String(item.title ?? item.ref ?? ""),
        url:         `https://www.kaggle.com/datasets/${item.ref}`,
        description: String(item.subtitle ?? ""),
        tags,
        extra: {
          usability:      item.usabilityRating,
          vote_count:     item.voteCount,
          download_count: item.downloadCount,
          size_bytes:     item.totalBytes,
        },
      });
    });
  }
}
