import { BasePrefetcher } from "../core/basePrefetcher";
import { GitHubPrefetcher }      from "../sources/github";
import { KagglePrefetcher }      from "../sources/kaggle";
import { HuggingFacePrefetcher } from "../sources/huggingface";
import { LeetCodePrefetcher }    from "../sources/leetcode";
import {
  HackerRankPrefetcher,
  CTFtimePrefetcher,
  GitLabPrefetcher,
} from "../sources/others";

type PrefetcherCtor = new (apiKey?: string, timeout?: number) => BasePrefetcher;

export const REGISTRY: Record<string, PrefetcherCtor> = {
  github:      GitHubPrefetcher,
  kaggle:      KagglePrefetcher,
  huggingface: HuggingFacePrefetcher,
  leetcode:    LeetCodePrefetcher,
  hackerrank:  HackerRankPrefetcher,
  ctftime:     CTFtimePrefetcher,
  gitlab:      GitLabPrefetcher,
};

export function getPrefetcher(source: string, apiKey?: string): BasePrefetcher {
  const Cls = REGISTRY[source];
  if (!Cls) throw new Error(`Unknown source: "${source}". Available: ${Object.keys(REGISTRY).join(", ")}`);
  return new Cls(apiKey);
}
