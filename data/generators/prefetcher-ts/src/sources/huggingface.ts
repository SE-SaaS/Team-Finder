import { FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";
import { HuggingFaceAPI } from "unified-api-wrapper";
import type { HFModel, HFDataset } from "unified-api-wrapper";

const MAJOR_TASKS: Record<string, string[]> = {
  AI:  ["text-generation", "image-classification", "object-detection"],
  DS:  ["tabular-classification", "tabular-regression", "feature-extraction"],
  CIS: ["text-classification", "token-classification"],
  CYS: ["text-classification"],
};

const MAJOR_DATASET_TAGS: Record<string, string> = {
  AI:  "nlp",
  DS:  "tabular",
  CIS: "business",
  CYS: "security",
};

export class HuggingFacePrefetcher {
  readonly sourceName = "huggingface";
  readonly strategy   = "api";
  private api: HuggingFaceAPI;

  constructor(apiKey?: string) {
    this.api = new HuggingFaceAPI(
      { token: apiKey },
      { timeout: 15000, maxRetries: 3 }
    );
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const tasks = (MAJOR_TASKS[major] ?? ["text-generation"]).slice(0, 2);
    const results: PrefetchResult[] = [];

    for (const task of tasks) {
      try {
        const data = await this.api.listModels({
          filter: task,
          sort: "downloads",
          limit: opts.limit ?? 10,
        });
        (data ?? []).forEach((item: HFModel) =>
          results.push({
            source:      this.sourceName,
            major,
            category:    "resource" as const,
            title:       item.id,
            url:         `https://huggingface.co/${item.id}`,
            description: "",
            tags:        item.tags || [],
            extra:       { pipeline: task },
          })
        );
      } catch (err) {
        console.warn(`[huggingface] fetchResources failed for ${task}:`, (err as Error).message);
      }
    }
    return results;
  }

  async fetchProjects(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    try {
      const data = await this.api.listSpaces({ limit: opts.limit ?? 10 });
      return (data ?? []).map((item: any) => ({
        source:      this.sourceName,
        major,
        category:    "project" as const,
        title:       String(item.id ?? ""),
        url:         `https://huggingface.co/spaces/${item.id}`,
        description: "",
        tags:        [],
        extra:       { likes: item.likes, sdk: item.sdk },
      }));
    } catch (err) {
      console.warn(`[huggingface] fetchProjects failed:`, (err as Error).message);
      return [];
    }
  }

  async fetchDatasets(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    try {
      const tag = MAJOR_DATASET_TAGS[major] ?? "nlp";
      const data = await this.api.listDatasets({ search: tag, limit: opts.limit ?? 10 });
      return (data ?? []).map((item: HFDataset) => ({
        source:      this.sourceName,
        major,
        category:    "dataset" as const,
        title:       item.id,
        url:         `https://huggingface.co/datasets/${item.id}`,
        description: "",
        tags:        item.tags || [],
        extra:       {},
      }));
    } catch (err) {
      console.warn(`[huggingface] fetchDatasets failed:`, (err as Error).message);
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
