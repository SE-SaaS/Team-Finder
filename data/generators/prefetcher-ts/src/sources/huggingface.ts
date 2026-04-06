import { BasePrefetcher, FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";

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

export class HuggingFacePrefetcher extends BasePrefetcher {
  readonly sourceName = "huggingface";
  readonly strategy   = "api";
  readonly baseUrl    = "https://huggingface.co/api";

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const tasks   = (MAJOR_TASKS[major] ?? ["text-generation"]).slice(0, 2);
    const results: PrefetchResult[] = [];
    for (const task of tasks) {
      const data = await this.get<Record<string, unknown>[]>(
        `${this.baseUrl}/models`,
        { pipeline_tag: task, sort: "downloads", limit: opts.limit ?? 10 }
      );
      (data ?? []).forEach(item =>
        results.push(this.makeResult(major, "resource", {
          title:       String(item.id ?? ""),
          url:         `https://huggingface.co/${item.id}`,
          description: "",
          tags:        Array.isArray(item.tags) ? item.tags as string[] : [],
          extra:       { downloads: item.downloads, likes: item.likes, pipeline: task },
        }))
      );
    }
    return results;
  }

  async fetchProjects(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const data = await this.get<Record<string, unknown>[]>(
      `${this.baseUrl}/spaces`,
      { sort: "likes", limit: opts.limit ?? 10 }
    );
    return (data ?? []).map(item => this.makeResult(major, "project", {
      title:       String(item.id ?? ""),
      url:         `https://huggingface.co/spaces/${item.id}`,
      description: "",
      tags:        Array.isArray(item.tags) ? item.tags as string[] : [],
      extra:       { likes: item.likes, sdk: item.sdk },
    }));
  }

  async fetchDatasets(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const tag  = MAJOR_DATASET_TAGS[major] ?? "nlp";
    const data = await this.get<Record<string, unknown>[]>(
      `${this.baseUrl}/datasets`,
      { tags: tag, sort: "downloads", limit: opts.limit ?? 10 }
    );
    return (data ?? []).map(item => this.makeResult(major, "dataset", {
      title:       String(item.id ?? ""),
      url:         `https://huggingface.co/datasets/${item.id}`,
      description: "",
      tags:        Array.isArray(item.tags) ? item.tags as string[] : [],
      extra:       { downloads: item.downloads, likes: item.likes },
    }));
  }
}
