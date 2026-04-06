import { BasePrefetcher } from "../core/basePrefetcher";
import { GitHubPrefetcher }          from "../sources/github";
import { KagglePrefetcher }          from "../sources/kaggle";
import { HuggingFacePrefetcher }     from "../sources/huggingface";
import { LeetCodePrefetcher }        from "../sources/leetcode";
import { HackTheBoxPrefetcher }      from "../sources/hackthebox";
import { PapersWithCodePrefetcher }  from "../sources/paperswithcode";
import { UCIPrefetcher }             from "../sources/uci";
import {
  HackerRankPrefetcher,
  VulnHubPrefetcher,
  CTFtimePrefetcher,
  GitLabPrefetcher,
  OpenHubPrefetcher,
  SAPPrefetcher,
  TableauPublicPrefetcher,
  PowerBIPrefetcher,
  AIGeneratorPrefetcher,
} from "../sources/others";

type PrefetcherCtor = new (apiKey?: string, timeout?: number) => BasePrefetcher;

export const REGISTRY: Record<string, PrefetcherCtor> = {
  github:         GitHubPrefetcher,
  kaggle:         KagglePrefetcher,
  huggingface:    HuggingFacePrefetcher,
  leetcode:       LeetCodePrefetcher,
  hackerrank:     HackerRankPrefetcher,
  hackthebox:     HackTheBoxPrefetcher,
  vulnhub:        VulnHubPrefetcher,
  ctftime:        CTFtimePrefetcher,
  paperswithcode: PapersWithCodePrefetcher,
  uci:            UCIPrefetcher,
  gitlab:         GitLabPrefetcher,
  openhub:        OpenHubPrefetcher,
  sap:            SAPPrefetcher,
  tableau_public: TableauPublicPrefetcher,
  power_bi:       PowerBIPrefetcher,
  ai_generator:   AIGeneratorPrefetcher,
};

export function getPrefetcher(source: string, apiKey?: string): BasePrefetcher {
  const Cls = REGISTRY[source];
  if (!Cls) throw new Error(`Unknown source: "${source}". Available: ${Object.keys(REGISTRY).join(", ")}`);
  return new Cls(apiKey);
}
