import { BasePrefetcher, FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";

const SEEDS: Record<string, { title: string; url: string; tags: string[] }[]> = {
  AI: [
    { title: "fast.ai Practical Deep Learning", url: "https://course.fast.ai", tags: ["deep-learning", "course"] },
    { title: "Andrej Karpathy Neural Nets Zero to Hero", url: "https://karpathy.ai/zero-to-hero.html", tags: ["llm", "tutorial"] },
  ],
  CS: [
    { title: "MIT OCW 6.006 Algorithms", url: "https://ocw.mit.edu/6-006", tags: ["algorithms", "course"] },
    { title: "CLRS Book Companion", url: "https://mitpress.mit.edu/9780262046305/", tags: ["algorithms", "book"] },
  ],
  CIS: [
    { title: "SAP Learning Hub", url: "https://learninghub.sap.com", tags: ["sap", "erp", "course"] },
  ],
  BI: [
    { title: "Tableau eLearning", url: "https://www.tableau.com/learn/training", tags: ["tableau", "course"] },
    { title: "Microsoft Power BI Guided Learning", url: "https://learn.microsoft.com/en-us/power-bi/", tags: ["power-bi", "course"] },
  ],
  CYS: [
    { title: "TryHackMe Free Learning Paths", url: "https://tryhackme.com/paths", tags: ["ctf", "labs"] },
    { title: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security", tags: ["web", "pentest"] },
  ],
  DS: [
    { title: "Kaggle Learn Free Courses", url: "https://www.kaggle.com/learn", tags: ["data-science", "course"] },
    { title: "StatQuest with Josh Starmer", url: "https://statquest.org", tags: ["statistics", "ml"] },
  ],
  SWE: [
    { title: "Refactoring Guru Design Patterns", url: "https://refactoring.guru/design-patterns", tags: ["design-patterns"] },
    { title: "roadmap.sh Software Engineering", url: "https://roadmap.sh", tags: ["roadmap", "career"] },
  ],
};

export class AIGeneratorPrefetcher extends BasePrefetcher {
  readonly sourceName = "ai_generator";
  readonly strategy   = "internal";
  readonly baseUrl    = "";

  async fetchResources(major: string): Promise<PrefetchResult[]> {
    return (SEEDS[major] ?? []).map(s => this.makeResult(major, "resource", {
      title:       s.title,
      url:         s.url,
      description: "AI-curated seed resource",
      tags:        s.tags,
      extra:       {},
    }));
  }

  async fetchProjects(_major: string, _opts?: FetchOptions): Promise<PrefetchResult[]> {
    return [];
  }

  async fetchDatasets(_major: string, _opts?: FetchOptions): Promise<PrefetchResult[]> {
    return [];
  }
}
