import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import * as cheerio from "cheerio";
import { PrefetchResult, Category } from "./types";

export interface FetchOptions {
  limit?:     number;
  perPage?:   number;
  pageSize?:  number;
  [key: string]: unknown;
}

export abstract class BasePrefetcher {
  abstract readonly sourceName: string;
  abstract readonly strategy:   string;
  abstract readonly baseUrl:    string;

  protected readonly apiKey?:  string;
  protected readonly timeout:  number;
  protected readonly client:   AxiosInstance;

  constructor(apiKey?: string, timeout = 15_000) {
    this.apiKey  = apiKey;
    this.timeout = timeout;
    this.client  = axios.create({
      timeout,
      headers: this.buildHeaders(),
    });
  }

  protected buildHeaders(): Record<string, string> {
    const h: Record<string, string> = { "User-Agent": "PrefetcherBot/1.0" };
    if (this.apiKey) h["Authorization"] = `Bearer ${this.apiKey}`;
    return h;
  }

  // ── HTTP helpers ────────────────────────────────────────────────
  protected async get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T | null> {
    try {
      const res = await this.client.get<T>(url, { params });
      return res.data;
    } catch (err) {
      console.warn(`[${this.sourceName}] GET ${url} failed:`, (err as Error).message);
      return null;
    }
  }

  protected async post<T = unknown>(url: string, payload: unknown): Promise<T | null> {
    try {
      const res = await this.client.post<T>(url, payload);
      return res.data;
    } catch (err) {
      console.warn(`[${this.sourceName}] POST ${url} failed:`, (err as Error).message);
      return null;
    }
  }

  protected async getHtml(url: string): Promise<cheerio.CheerioAPI | null> {
    try {
      const res = await this.client.get<string>(url, {
        responseType: "text",
        headers: { ...this.buildHeaders(), Accept: "text/html" },
      });
      return cheerio.load(res.data);
    } catch (err) {
      console.warn(`[${this.sourceName}] HTML GET ${url} failed:`, (err as Error).message);
      return null;
    }
  }

  // ── Interface ───────────────────────────────────────────────────
  abstract fetchResources(major: string, opts?: FetchOptions): Promise<PrefetchResult[]>;
  abstract fetchProjects (major: string, opts?: FetchOptions): Promise<PrefetchResult[]>;
  abstract fetchDatasets (major: string, opts?: FetchOptions): Promise<PrefetchResult[]>;

  async fetchAll(major: string, opts?: FetchOptions): Promise<PrefetchResult[]> {
    const [resources, projects, datasets] = await Promise.allSettled([
      this.fetchResources(major, opts),
      this.fetchProjects (major, opts),
      this.fetchDatasets (major, opts),
    ]);

    const combined: PrefetchResult[] = [];
    for (const r of [resources, projects, datasets]) {
      if (r.status === "fulfilled") combined.push(...r.value);
      else console.error(`[${this.sourceName}] fetchAll error:`, r.reason);
    }
    return combined;
  }

  protected makeResult(
    major: string,
    category: Category,
    partial: Omit<PrefetchResult, "source" | "major" | "category">
  ): PrefetchResult {
    return { source: this.sourceName, major, category, ...partial };
  }
}
