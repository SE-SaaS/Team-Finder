import { FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";
import { LeetCodeAPI } from "unified-api-wrapper";

const MAJOR_TAGS: Record<string, string[]> = {
  CS:  ["dynamic-programming", "graph", "tree", "sorting", "recursion"],
  AI:  ["math", "probability", "simulation"],
  DS:  ["statistics", "math", "array"],
  SWE: ["design", "concurrency", "database"],
  CYS: ["bit-manipulation", "string"],
};

export class LeetCodePrefetcher {
  readonly sourceName = "leetcode";
  readonly strategy   = "graphql";
  private api: LeetCodeAPI;

  constructor() {
    this.api = new LeetCodeAPI({ timeout: 15000 });
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const tags = MAJOR_TAGS[major] ?? ["algorithms"];
    try {
      const data = await this.api.getProblemList({
        categorySlug: "",
        limit: opts.limit ?? 10,
        filters: { tags: [tags[0]] },
      });

      const questions = (data as any)?.problemsetQuestionList?.questions ?? [];
      return questions.map((item: any) => ({
        source:      this.sourceName,
        major,
        category:    "resource" as const,
        title:       item.title,
        url:         `https://leetcode.com/problems/${item.titleSlug}/`,
        description: `Difficulty: ${item.difficulty} | Acceptance: ${Number(item.acRate ?? 0).toFixed(1)}%`,
        tags:        [],
        extra:       {
          difficulty: item.difficulty,
          ac_rate: item.acRate,
          question_id: item.frontendQuestionId
        },
      }));
    } catch (err) {
      console.warn(`[leetcode] fetchResources failed:`, (err as Error).message);
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
