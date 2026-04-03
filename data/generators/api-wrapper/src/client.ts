import { APIError, AuthError, RateLimitError, NotFoundError, NetworkError } from "./errors";
import type { RequestOptions, ClientConfig } from "./types";

/**
 * Token Bucket rate limiter
 */
class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly ratePerMs: number;

  constructor(requestsPerSecond: number) {
    this.tokens = requestsPerSecond;
    this.lastRefill = Date.now();
    this.ratePerMs = requestsPerSecond / 1000;
  }

  async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    this.tokens = Math.min(this.tokens + elapsed * this.ratePerMs, 10);
    this.lastRefill = now;

    if (this.tokens < 1) {
      const waitMs = (1 - this.tokens) / this.ratePerMs;
      await new Promise((r) => setTimeout(r, waitMs));
      this.tokens = 0;
    } else {
      this.tokens -= 1;
    }
  }
}

/**
 * Base HTTP client with retry, rate limiting, and error normalization.
 */
export abstract class BaseClient {
  protected readonly baseURL: string;
  protected readonly serviceName: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private readonly timeout: number;
  private readonly rateLimiter: RateLimiter;

  constructor(
    baseURL: string,
    serviceName: string,
    defaultHeaders: Record<string, string> = {},
    config: ClientConfig = {}
  ) {
    this.baseURL = baseURL;
    this.serviceName = serviceName;
    this.defaultHeaders = { "Content-Type": "application/json", ...defaultHeaders };
    this.maxRetries = config.maxRetries ?? 3;
    this.retryDelay = config.retryDelay ?? 500;
    this.timeout = config.timeout ?? 10_000;
    this.rateLimiter = new RateLimiter(config.rateLimit ?? 10);
  }

  private buildURL(path: string, params?: RequestOptions["params"]): string {
    const url = `${this.baseURL}${path}`;
    if (!params) return url;
    const filtered = Object.entries(params).filter(([, v]) => v !== undefined) as [string, string | number | boolean][];
    if (filtered.length === 0) return url;
    const qs = new URLSearchParams(filtered.map(([k, v]) => [k, String(v)])).toString();
    return `${url}?${qs}`;
  }

  private async executeRequest(
    method: string,
    url: string,
    options: RequestOptions = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      return await fetch(url, {
        method,
        headers: { ...this.defaultHeaders, ...(options.headers ?? {}) },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  }

  private isRetryable(status: number): boolean {
    return [408, 429, 500, 502, 503, 504].includes(status);
  }

  /**
   * Core request method with retry logic and error normalization.
   */
  protected async request<T>(
    method: string,
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = this.buildURL(path, options.params);
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      await this.rateLimiter.throttle();

      try {
        const response = await this.executeRequest(method, url, options);

        if (response.ok) {
          return (await response.json()) as T;
        }

        // Normalize HTTP errors
        if (response.status === 401 || response.status === 403) {
          throw new AuthError(this.serviceName, url);
        }
        if (response.status === 404) {
          throw new NotFoundError(path, this.serviceName, url);
        }
        if (response.status === 429) {
          const retryAfter = Number(response.headers.get("Retry-After")) || undefined;
          const err = new RateLimitError(this.serviceName, url, retryAfter);
          if (attempt < this.maxRetries) {
            await new Promise((r) => setTimeout(r, (retryAfter ?? 1) * 1000));
            lastError = err;
            continue;
          }
          throw err;
        }

        const body = await response.text();
        const err = new APIError(body, response.status, url, this.serviceName);

        if (this.isRetryable(response.status) && attempt < this.maxRetries) {
          lastError = err;
          await new Promise((r) =>
            setTimeout(r, this.retryDelay * Math.pow(2, attempt))
          );
          continue;
        }

        throw err;
      } catch (error) {
        if (
          error instanceof APIError ||
          error instanceof AuthError ||
          error instanceof RateLimitError ||
          error instanceof NotFoundError
        ) {
          throw error;
        }

        const networkErr = new NetworkError(this.serviceName, error as Error);
        if (attempt < this.maxRetries) {
          lastError = networkErr;
          await new Promise((r) =>
            setTimeout(r, this.retryDelay * Math.pow(2, attempt))
          );
          continue;
        }
        throw networkErr;
      }
    }

    throw lastError!;
  }

  protected get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, options);
  }

  protected post<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("POST", path, options);
  }

  protected put<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("PUT", path, options);
  }

  protected delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", path, options);
  }
}
