import { GitHubPrefetcher }         from "../sources/github";
import { KagglePrefetcher }         from "../sources/kaggle";
import { HuggingFacePrefetcher }    from "../sources/huggingface";
import { LeetCodePrefetcher }       from "../sources/leetcode";
import { HackerRankPrefetcher }     from "../sources/hackerrank";
import { HackTheBoxPrefetcher }     from "../sources/hackthebox";
import { VulnHubPrefetcher }        from "../sources/vulnhub";
import { CTFtimePrefetcher }        from "../sources/ctftime";
import { PapersWithCodePrefetcher } from "../sources/paperswithcode";
import { UCIPrefetcher }            from "../sources/uci";
import { GitLabPrefetcher }         from "../sources/gitlab";
import { OpenHubPrefetcher }        from "../sources/openhub";
import { SAPPrefetcher }            from "../sources/sap";
import { TableauPrefetcher }        from "../sources/tableau";
import { PowerBIPrefetcher }        from "../sources/powerbi";
import { AIGeneratorPrefetcher }    from "../sources/aigenerator";

interface Prefetcher {
  readonly sourceName: string;
  readonly strategy: string;
  fetchResources(major: string, opts?: any): Promise<any[]>;
  fetchProjects(major: string, opts?: any): Promise<any[]>;
  fetchDatasets(major: string, opts?: any): Promise<any[]>;
  fetchAll(major: string, opts?: any): Promise<any[]>;
}

type PrefetcherCtor = new (apiKey?: string, timeout?: number) => Prefetcher;

export const REGISTRY: Record<string, PrefetcherCtor> = {
  github:         GitHubPrefetcher as any,
  kaggle:         KagglePrefetcher as any,
  huggingface:    HuggingFacePrefetcher as any,
  leetcode:       LeetCodePrefetcher as any,
  hackerrank:     HackerRankPrefetcher as any,
  hackthebox:     HackTheBoxPrefetcher as any,
  vulnhub:        VulnHubPrefetcher as any,
  ctftime:        CTFtimePrefetcher as any,
  paperswithcode: PapersWithCodePrefetcher as any,
  uci:            UCIPrefetcher as any,
  gitlab:         GitLabPrefetcher as any,
  openhub:        OpenHubPrefetcher as any,
  sap:            SAPPrefetcher as any,
  tableau_public: TableauPrefetcher as any,
  power_bi:       PowerBIPrefetcher as any,
  ai_generator:   AIGeneratorPrefetcher as any,
};

export function getPrefetcher(source: string, apiKey?: string): Prefetcher {
  const Cls = REGISTRY[source];
  if (!Cls) throw new Error(`Unknown source: "${source}". Available: ${Object.keys(REGISTRY).join(", ")}`);
  return new Cls(apiKey);
}
