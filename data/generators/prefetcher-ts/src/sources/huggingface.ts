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

const MAJOR_PAPER_QUERIES: Record<string, string> = {
  AI:  "large language models",
  DS:  "time series forecasting",
  CS:  "algorithms",
  SWE: "software engineering",
  CYS: "security",
  CIS: "information systems",
  BI:  "data visualization",
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
        {
          pipeline_tag: task,
          library:      "transformers",
          sort:         "downloads",
          limit:        opts.limit ?? 10,
        }
      );
      (data ?? []).forEach(item =>
        results.push(this.makeResult(major, "resource", {
          title:       String(item.id ?? ""),
          url:         `https://huggingface.co/${item.id}`,
          description: "",
          tags:        Array.isArray(item.tags) ? item.tags as string[] : [],
          extra: {
            downloads:     item.downloads,
            likes:         item.likes,
            pipeline:      task,
            library_name:  item.library_name ?? "transformers",
            lastModified:  item.lastModified,
          },
        }))
      );
    }
    return results;
  }

  async fetchProjects(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const data = await this.get<Record<string, unknown>[]>(
      `${this.baseUrl}/spaces`,
      { sort: "lastModified", limit: opts.limit ?? 10 }
    );
    return (data ?? []).map(item => this.makeResult(major, "project", {
      title:       String(item.id ?? ""),
      url:         `https://huggingface.co/spaces/${item.id}`,
      description: "",
      tags:        Array.isArray(item.tags) ? item.tags as string[] : [],
      extra: {
        likes:        item.likes,
        sdk:          item.sdk,
        runtime:      item.runtime,
        lastModified: item.lastModified,
      },
    }));
  }

  async fetchDatasets(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const tag  = MAJOR_DATASET_TAGS[major] ?? "nlp";
    const data = await this.get<Record<string, unknown>[]>(
      `${this.baseUrl}/datasets`,
      {
        tags:     tag,
        language: "en",
        sort:     "downloads",
        limit:    opts.limit ?? 10,
      }
    );
    return (data ?? []).map(item => this.makeResult(major, "dataset", {
      title:       String(item.id ?? ""),
      url:         `https://huggingface.co/datasets/${item.id}`,
      description: "",
      tags:        Array.isArray(item.tags) ? item.tags as string[] : [],
      extra: {
        downloads:    item.downloads,
        likes:        item.likes,
        language:     item.language ?? "en",
        lastModified: item.lastModified,
      },
    }));
  }

  private async fetchPapers(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const q    = MAJOR_PAPER_QUERIES[major] ?? major;
    const data = await this.get<Array<{ paper: Record<string, unknown> }>>(
      `${this.baseUrl}/papers/search`,
      { q }
    );
    return (data ?? []).slice(0, opts.limit ?? 10).map(({ paper }) => {
      const authors      = Array.isArray(paper.authors) ? paper.authors as unknown[] : [];
      const authorCount  = authors.length;
      return this.makeResult(major, "resource", {
        title:       String(paper.title ?? ""),
        url:         `https://huggingface.co/papers/${paper.id}`,
        description: String(paper.summary ?? "").slice(0, 300),
        tags:        Array.isArray(paper.ai_keywords) ? paper.ai_keywords as string[] : [],
        extra: {
          github_repo:  paper.githubRepo,
          upvotes:      paper.upvotes,
          author_count: authorCount,
          published:    paper.publishedAt,
        },
      });
    });
  }

  async fetchAll(major: string, opts?: FetchOptions): Promise<PrefetchResult[]> {
    const [resources, projects, datasets, papers] = await Promise.allSettled([
      this.fetchResources(major, opts),
      this.fetchProjects(major, opts),
      this.fetchDatasets(major, opts),
      this.fetchPapers(major, opts),
    ]);
    const combined: PrefetchResult[] = [];
    for (const r of [resources, projects, datasets, papers]) {
      if (r.status === "fulfilled") combined.push(...r.value);
      else console.error(`[${this.sourceName}] fetchAll error:`, r.reason);
    }
    return combined;
  }
}
