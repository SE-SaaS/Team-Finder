import { BasePrefetcher, FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";

const MAJOR_TAGS: Record<string, string[]> = {
  CS:  ["dynamic-programming", "graph", "tree", "sorting", "recursion"],
  AI:  ["math", "probability", "simulation"],
  DS:  ["statistics", "math", "array"],
  SWE: ["design", "concurrency", "database"],
  CYS: ["bit-manipulation", "string"],
};

const PROBLEMS_QUERY = `
query problemsetQuestionList($filters: QuestionListFilterInput, $limit: Int) {
  problemsetQuestionList: questionList(
    categorySlug: ""
    filters: $filters
    limit: $limit
  ) {
    questions: data {
      frontendQuestionId: questionFrontendId
      title
      titleSlug
      difficulty
      topicTags { name slug }
      acRate
    }
  }
}`;

export class LeetCodePrefetcher extends BasePrefetcher {
  readonly sourceName = "leetcode";
  readonly strategy   = "graphql";
  readonly baseUrl    = "https://leetcode.com/graphql";

  // LeetCode requires Origin + Referer + csrf cookie to accept GraphQL POSTs
  protected buildHeaders() {
    return {
      "Content-Type": "application/json",
      "User-Agent":   "Mozilla/5.0 (compatible; PrefetcherBot/1.0)",
      "Referer":      "https://leetcode.com/problemset/all/",
      "Origin":       "https://leetcode.com",
      "x-csrftoken":  "dummy",
      "Cookie":       "csrftoken=dummy; LEETCODE_SESSION=",
    };
  }

  private async fetchProblems(tag: string, limit = 10): Promise<Record<string, unknown>[]> {
    const data = await this.post<{
      data: { problemsetQuestionList: { questions: Record<string, unknown>[] } };
    }>(this.baseUrl, {
      query:     PROBLEMS_QUERY,
      variables: { filters: { tags: [tag] }, limit },
    });
    return data?.data?.problemsetQuestionList?.questions ?? [];
  }

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const tags  = MAJOR_TAGS[major] ?? ["algorithms"];
    const items = await this.fetchProblems(tags[0], opts.limit ?? 10);
    return items.map(item => {
      const topicTags = Array.isArray(item.topicTags)
        ? (item.topicTags as { name: string }[]).map(t => t.name)
        : [];
      return this.makeResult(major, "resource", {
        title:       String(item.title ?? ""),
        url:         `https://leetcode.com/problems/${item.titleSlug}/`,
        description: `Difficulty: ${item.difficulty} | Acceptance: ${Number(item.acRate ?? 0).toFixed(1)}%`,
        tags:        topicTags,
        extra:       { difficulty: item.difficulty, ac_rate: item.acRate, question_id: item.frontendQuestionId },
      });
    });
  }

  async fetchProjects(major: string): Promise<PrefetchResult[]> { return []; }
  async fetchDatasets(major: string): Promise<PrefetchResult[]> { return []; }
}
