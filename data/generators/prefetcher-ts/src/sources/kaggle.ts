import { FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";
import { KaggleAPI } from "unified-api-wrapper";
import type { KaggleDataset } from "unified-api-wrapper";

const MAJOR_KEYWORDS: Record<string, string[]> = {
  AI:  ["deep learning", "neural network", "generative ai", "llm"],
  CS:  ["algorithms", "data structures", "computer science"],
  CIS: ["information systems", "erp", "business process"],
  BI:  ["business intelligence", "dashboard", "visualization"],
  CYS: ["cybersecurity", "network security", "intrusion detection"],
  DS:  ["data science", "exploratory analysis", "feature engineering"],
  SWE: ["software engineering", "code quality", "devops"],
};

export class KagglePrefetcher {
  readonly sourceName = "kaggle";
  readonly strategy   = "api";
  private api: KaggleAPI;

  constructor(apiKey?: string) {
    if (!apiKey) throw new Error("Kaggle requires credentials (username:key)");
    const [username, key] = apiKey.split(":");
    this.api = new KaggleAPI(
      { username, key },
      { timeout: 15000, maxRetries: 3 }
    );
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const kw = (MAJOR_KEYWORDS[major] ?? [major])[0];
    try {
      const data = await this.api.listKernels({ search: kw, page: 1 });
      return (data ?? []).map((item: any) => ({
        source:      this.sourceName,
        major,
        category:    "resource" as const,
        title:       String(item.ref ?? ""),
        url:         `https://www.kaggle.com/code/${item.ref}`,
        description: "",
        tags:        [],
        extra:       { votes: item.totalVotes, language: item.language },
      }));
    } catch (err) {
      console.warn(`[kaggle] fetchResources failed:`, (err as Error).message);
      return [];
    }
  }

  async fetchProjects(_major: string, _opts?: FetchOptions): Promise<PrefetchResult[]> {
    return [];
  }

  async fetchDatasets(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const kw = (MAJOR_KEYWORDS[major] ?? [major])[0];
    try {
      const data = await this.api.listDatasets({ search: kw, pageSize: opts.limit ?? 10 });
      return (data ?? []).map((item: KaggleDataset) => ({
        source:      this.sourceName,
        major,
        category:    "dataset" as const,
        title:       item.title || String(item.id),
        url:         item.url,
        description: item.subtitle || "",
        tags:        [],
        extra: {
          vote_count:     item.voteCount,
          download_count: item.downloadCount,
          size_bytes:     item.totalBytes,
        },
      }));
    } catch (err) {
      console.warn(`[kaggle] fetchDatasets failed:`, (err as Error).message);
      return [];
    }
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
