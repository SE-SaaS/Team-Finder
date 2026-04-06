import { BasePrefetcher, FetchOptions } from "../core/basePrefetcher";
import { PrefetchResult } from "../core/types";

// ─────────────────────────────────────────────────────────────────
// HackerRank
// ─────────────────────────────────────────────────────────────────
const HR_TRACKS: Record<string, string> = {
  CS: "algorithms", AI: "artificial-intelligence",
  DS: "sql", SWE: "java", CIS: "databases", CYS: "security",
};

export class HackerRankPrefetcher extends BasePrefetcher {
  readonly sourceName = "hackerrank";
  readonly strategy   = "api";
  readonly baseUrl    = "https://www.hackerrank.com/rest/contests/master";

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const track = HR_TRACKS[major] ?? "algorithms";
    const data  = await this.get<{ models: Record<string, unknown>[] }>(
      `${this.baseUrl}/challenges`,
      { track, limit: opts.limit ?? 10, offset: 0 }
    );
    return (data?.models ?? []).map(item => this.makeResult(major, "resource", {
      title:       String(item.name ?? item.slug ?? ""),
      url:         `https://www.hackerrank.com/challenges/${item.slug}`,
      description: String(item.preview ?? ""),
      tags:        [String(item.track ?? "")],
      extra:       { difficulty: item.difficulty_name, score: item.max_score },
    }));
  }

  async fetchProjects(major: string): Promise<PrefetchResult[]> { return []; }
  async fetchDatasets(major: string): Promise<PrefetchResult[]> { return []; }
}

// ─────────────────────────────────────────────────────────────────
// VulnHub (scraping)
// ─────────────────────────────────────────────────────────────────
export class VulnHubPrefetcher extends BasePrefetcher {
  readonly sourceName = "vulnhub";
  readonly strategy   = "scrape";
  readonly baseUrl    = "https://www.vulnhub.com";

  async fetchResources(major: string): Promise<PrefetchResult[]> {
    const $     = await this.getHtml(this.baseUrl);
    if (!$) return [];
    const results: PrefetchResult[] = [];
    $(".vm-entry").slice(0, 10).each((_, el) => {
      const a    = $(el).find("a[href]").first();
      const name = $(el).find(".vm-title").text().trim();
      const href = a.attr("href") ?? "";
      if (!href) return;
      results.push(this.makeResult(major, "resource", {
        title:       name || a.text().trim(),
        url:         href.startsWith("/") ? `${this.baseUrl}${href}` : href,
        description: "",
        tags:        ["vm", "lab", "ctf-style"],
        extra:       {},
      }));
    });
    return results;
  }

  async fetchProjects(major: string): Promise<PrefetchResult[]> { return []; }
  async fetchDatasets(major: string): Promise<PrefetchResult[]> { return []; }
}

// ─────────────────────────────────────────────────────────────────
// CTFtime
// ─────────────────────────────────────────────────────────────────
export class CTFtimePrefetcher extends BasePrefetcher {
  readonly sourceName = "ctftime";
  readonly strategy   = "api";
  readonly baseUrl    = "https://ctftime.org/api/v1";

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const now    = Math.floor(Date.now() / 1000);
    const future = now + 60 * 60 * 24 * 90;
    const data   = await this.get<Record<string, unknown>[]>(
      `${this.baseUrl}/events/`,
      { limit: opts.limit ?? 10, start: now, finish: future }
    );
    return (data ?? []).map(e => this.makeResult(major, "resource", {
      title:       String(e.title ?? ""),
      url:         String(e.url ?? ""),
      description: `Format: ${e.format} | Weight: ${e.weight}`,
      tags:        Array.isArray(e.tags) ? e.tags as string[] : [],
      extra:       { start: e.start, finish: e.finish, onsite: e.onsite },
    }));
  }

  async fetchProjects(major: string): Promise<PrefetchResult[]> { return []; }
  async fetchDatasets(major: string): Promise<PrefetchResult[]> { return []; }
}

// ─────────────────────────────────────────────────────────────────
// GitLab
// ─────────────────────────────────────────────────────────────────
const GL_TOPICS: Record<string, string> = {
  SWE: "devops", AI: "machine-learning", CYS: "security",
};

export class GitLabPrefetcher extends BasePrefetcher {
  readonly sourceName = "gitlab";
  readonly strategy   = "api";
  readonly baseUrl    = "https://gitlab.com/api/v4";

  protected buildHeaders() {
    const h: Record<string, string> = { "User-Agent": "PrefetcherBot/1.0" };
    if (this.apiKey) h["PRIVATE-TOKEN"] = this.apiKey;
    return h;
  }

  async fetchResources(major: string): Promise<PrefetchResult[]> { return []; }
  async fetchDatasets(major: string):  Promise<PrefetchResult[]> { return []; }

  async fetchProjects(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const topic = GL_TOPICS[major] ?? "software";
    const data  = await this.get<Record<string, unknown>[]>(
      `${this.baseUrl}/projects`,
      { topic, order_by: "star_count", sort: "desc", per_page: opts.limit ?? 10, visibility: "public" }
    );
    return (data ?? []).map(p => this.makeResult(major, "project", {
      title:       String(p.name_with_namespace ?? ""),
      url:         String(p.web_url ?? ""),
      description: String(p.description ?? ""),
      tags:        Array.isArray(p.tag_list) ? p.tag_list as string[] : [],
      language:    p.language as string | undefined,
      stars:       p.star_count as number | undefined,
      extra:       { forks: p.forks_count, license: (p.license as { name?: string } | null)?.name },
    }));
  }
}

// ─────────────────────────────────────────────────────────────────
// OpenHub
// ─────────────────────────────────────────────────────────────────
const OH_QUERIES: Record<string, string> = {
  SWE: "software engineering framework", AI: "machine learning",
  CS: "algorithms library", CIS: "enterprise information system", CYS: "security scanner",
};

export class OpenHubPrefetcher extends BasePrefetcher {
  readonly sourceName = "openhub";
  readonly strategy   = "api";
  readonly baseUrl    = "https://www.openhub.net";

  async fetchResources(major: string): Promise<PrefetchResult[]> { return []; }
  async fetchDatasets(major: string):  Promise<PrefetchResult[]> { return []; }

  async fetchProjects(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const q    = OH_QUERIES[major] ?? major;
    const data = await this.get<{ results: { project: Record<string, unknown> | Record<string, unknown>[] } }>(
      `${this.baseUrl}/projects.json`,
      { query: q, api_key: this.apiKey, per_page: opts.limit ?? 10 }
    );
    let items = data?.results?.project ?? [];
    if (!Array.isArray(items)) items = [items];
    return (items as Record<string, unknown>[]).map(p => {
      const analysis = p.analysis as Record<string, unknown> | undefined;
      return this.makeResult(major, "project", {
        title:       String(p.name ?? ""),
        url:         String(p.html_url ?? ""),
        description: String(p.description ?? "").slice(0, 200),
        tags:        [major.toLowerCase(), "open-source"],
        extra:       { users_count: p.user_count, twelve_month_commits: analysis?.twelve_month_commit_count },
      });
    });
  }
}

// ─────────────────────────────────────────────────────────────────
// SAP Discovery Center
// ─────────────────────────────────────────────────────────────────
export class SAPPrefetcher extends BasePrefetcher {
  readonly sourceName = "sap";
  readonly strategy   = "api";
  readonly baseUrl    = "https://discovery-center.cloud.sap/api";

  async fetchResources(major: string, opts: FetchOptions = {}): Promise<PrefetchResult[]> {
    const data = await this.get<{ items: Record<string, unknown>[] }>(
      `${this.baseUrl}/content`, { limit: opts.limit ?? 10 }
    );
    return (data?.items ?? []).map(i => this.makeResult(major, "resource", {
      title:       String(i.title ?? ""),
      url:         String(i.url ?? `https://discovery-center.cloud.sap/missiondetail/${i.id}`),
      description: String(i.shortDescription ?? ""),
      tags:        Array.isArray(i.tags) ? i.tags as string[] : [],
      extra:       {},
    }));
  }

  async fetchProjects(major: string): Promise<PrefetchResult[]> { return []; }
  async fetchDatasets(major: string): Promise<PrefetchResult[]> { return []; }
}

// ─────────────────────────────────────────────────────────────────
// Tableau Public (scraping)
// ─────────────────────────────────────────────────────────────────
const TABLEAU_TOPICS: Record<string, string> = {
  BI: "business+intelligence", DS: "data+science",
  AI: "machine+learning",      CIS: "enterprise",
};

export class TableauPublicPrefetcher extends BasePrefetcher {
  readonly sourceName = "tableau_public";
  readonly strategy   = "scrape";
  readonly baseUrl    = "https://public.tableau.com";

  async fetchResources(major: string): Promise<PrefetchResult[]> {
    const topic = TABLEAU_TOPICS[major] ?? major.toLowerCase();
    const $     = await this.getHtml(`${this.baseUrl}/en-us/gallery?topic=${topic}`);
    if (!$) return [];
    const results: PrefetchResult[] = [];
    $(".gallery-card").slice(0, 10).each((_, el) => {
      const a     = $(el).find("a[href]").first();
      const title = $(el).find(".gallery-card-title").text().trim();
      const href  = a.attr("href") ?? "";
      if (!href) return;
      results.push(this.makeResult(major, "resource", {
        title:       title || href,
        url:         href.startsWith("/") ? `${this.baseUrl}${href}` : href,
        description: "",
        tags:        ["visualization", "dashboard", major.toLowerCase()],
        extra:       {},
      }));
    });
    return results;
  }

  async fetchProjects(major: string): Promise<PrefetchResult[]> { return []; }
  async fetchDatasets(major: string): Promise<PrefetchResult[]> { return []; }
}

// ─────────────────────────────────────────────────────────────────
// Power BI Gallery (scraping)
// ─────────────────────────────────────────────────────────────────
export class PowerBIPrefetcher extends BasePrefetcher {
  readonly sourceName = "power_bi";
  readonly strategy   = "scrape";
  readonly baseUrl    = "https://community.powerbi.com/t5/Data-Stories-Gallery/bg-p/DataStoriesGallery";

  async fetchResources(major: string): Promise<PrefetchResult[]> {
    const $ = await this.getHtml(this.baseUrl);
    if (!$) return [];
    const results: PrefetchResult[] = [];
    $(".lia-message-subject a").slice(0, 10).each((_, el) => {
      const href  = $(el).attr("href") ?? "";
      const title = $(el).text().trim();
      if (!href) return;
      results.push(this.makeResult(major, "resource", {
        title,
        url:         href.startsWith("/") ? `https://community.powerbi.com${href}` : href,
        description: "",
        tags:        ["power-bi", "dashboard", major.toLowerCase()],
        extra:       {},
      }));
    });
    return results;
  }

  async fetchProjects(major: string): Promise<PrefetchResult[]> { return []; }
  async fetchDatasets(major: string): Promise<PrefetchResult[]> { return []; }
}

// ─────────────────────────────────────────────────────────────────
// AI Generator (internal seed data)
// ─────────────────────────────────────────────────────────────────
const SEEDS: Record<string, { title: string; url: string; tags: string[] }[]> = {
  AI:  [
    { title: "fast.ai Practical Deep Learning",          url: "https://course.fast.ai",                      tags: ["deep-learning", "course"] },
    { title: "Andrej Karpathy Neural Nets Zero to Hero", url: "https://karpathy.ai/zero-to-hero.html",       tags: ["llm", "tutorial"] },
  ],
  CS:  [
    { title: "MIT OCW 6.006 Algorithms",                 url: "https://ocw.mit.edu/6-006",                   tags: ["algorithms", "course"] },
    { title: "CLRS Book Companion",                      url: "https://mitpress.mit.edu/9780262046305/",     tags: ["algorithms", "book"] },
  ],
  CIS: [
    { title: "SAP Learning Hub",                         url: "https://learninghub.sap.com",                 tags: ["sap", "erp", "course"] },
  ],
  BI:  [
    { title: "Tableau eLearning",                        url: "https://www.tableau.com/learn/training",      tags: ["tableau", "course"] },
    { title: "Microsoft Power BI Guided Learning",       url: "https://learn.microsoft.com/en-us/power-bi/", tags: ["power-bi", "course"] },
  ],
  CYS: [
    { title: "TryHackMe Free Learning Paths",            url: "https://tryhackme.com/paths",                 tags: ["ctf", "labs"] },
    { title: "PortSwigger Web Security Academy",         url: "https://portswigger.net/web-security",        tags: ["web", "pentest"] },
  ],
  DS:  [
    { title: "Kaggle Learn Free Courses",                url: "https://www.kaggle.com/learn",                tags: ["data-science", "course"] },
    { title: "StatQuest with Josh Starmer",              url: "https://statquest.org",                       tags: ["statistics", "ml"] },
  ],
  SWE: [
    { title: "Refactoring Guru Design Patterns",         url: "https://refactoring.guru/design-patterns",   tags: ["design-patterns"] },
    { title: "roadmap.sh Software Engineering",          url: "https://roadmap.sh",                         tags: ["roadmap", "career"] },
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

  async fetchProjects(major: string): Promise<PrefetchResult[]> { return []; }
  async fetchDatasets(major: string): Promise<PrefetchResult[]> { return []; }
}
