import { describe, it, expect, vi, beforeEach } from "vitest";
import { GitHubAPI, LeetCodeAPI, CTFtimeAPI, HuggingFaceAPI } from "../src/apis";
import { APIError, AuthError, RateLimitError } from "../src/errors";
import { APIManager } from "../src/index";

// ─── Mock fetch globally ───────────────────────────────────────────────────────

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function mockResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (k: string) => headers[k] ?? null },
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

// ─── BaseClient / GitHubAPI ────────────────────────────────────────────────────

describe("GitHubAPI", () => {
  let api: GitHubAPI;

  beforeEach(() => {
    api = new GitHubAPI({ token: "test-token" }, { maxRetries: 0 });
    mockFetch.mockReset();
  });

  it("calls correct endpoint for getUser", async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ login: "torvalds", id: 1 }));
    const user = await api.getUser("torvalds");
    expect(user.login).toBe("torvalds");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/torvalds"),
      expect.objectContaining({ method: "GET" })
    );
  });

  it("passes auth header", async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({}));
    await api.getUser("torvalds");
    const [, opts] = mockFetch.mock.calls[0];
    expect(opts.headers.Authorization).toBe("Bearer test-token");
  });

  it("builds query params correctly", async () => {
    mockFetch.mockResolvedValueOnce(mockResponse([]));
    await api.listRepos("torvalds", { type: "owner", per_page: 10 });
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("type=owner");
    expect(url).toContain("per_page=10");
  });

  it("throws AuthError on 401", async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({}, 401));
    await expect(api.getUser("x")).rejects.toThrow(AuthError);
  });

  it("throws AuthError on 403", async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({}, 403));
    await expect(api.getUser("x")).rejects.toThrow(AuthError);
  });

  it("throws RateLimitError on 429", async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({}, 429));
    await expect(api.getUser("x")).rejects.toThrow(RateLimitError);
  });

  it("throws APIError on 500", async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({}, 500));
    await expect(api.getUser("x")).rejects.toThrow(APIError);
  });
});

// ─── LeetCodeAPI ──────────────────────────────────────────────────────────────

describe("LeetCodeAPI", () => {
  let api: LeetCodeAPI;

  beforeEach(() => {
    api = new LeetCodeAPI();
    mockFetch.mockReset();
  });

  it("sends POST to graphql endpoint", async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse({ data: { activeDailyCodingChallengeQuestion: { date: "2024-01-01", link: "/problems/two-sum", question: { title: "Two Sum", difficulty: "Easy", topicTags: [] } } } })
    );
    const result = await api.getDailyChallenge();
    expect(result.activeDailyCodingChallengeQuestion.question.title).toBe("Two Sum");
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain("leetcode.com/graphql");
    expect(opts.method).toBe("POST");
  });

  it("throws on graphql errors", async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse({ data: null, errors: [{ message: "User not found" }] })
    );
    await expect(api.getUserProfile("nobody")).rejects.toThrow("User not found");
  });
});

// ─── CTFtimeAPI ───────────────────────────────────────────────────────────────

describe("CTFtimeAPI", () => {
  let api: CTFtimeAPI;

  beforeEach(() => {
    api = new CTFtimeAPI({ maxRetries: 0 });
    mockFetch.mockReset();
  });

  it("fetches events with params", async () => {
    mockFetch.mockResolvedValueOnce(mockResponse([]));
    await api.getEvents({ limit: 5 });
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("/events/");
    expect(url).toContain("limit=5");
  });

  it("fetches a specific event", async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ id: 42, title: "Test CTF" }));
    const event = await api.getEvent(42);
    expect(event.id).toBe(42);
  });
});

// ─── HuggingFaceAPI ───────────────────────────────────────────────────────────

describe("HuggingFaceAPI", () => {
  let api: HuggingFaceAPI;

  beforeEach(() => {
    api = new HuggingFaceAPI({ token: "hf_test" }, { maxRetries: 0 });
    mockFetch.mockReset();
  });

  it("lists models with filter param", async () => {
    mockFetch.mockResolvedValueOnce(mockResponse([]));
    await api.listModels({ filter: "text-generation", limit: 5 });
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("filter=text-generation");
    expect(url).toContain("limit=5");
  });
});

// ─── Error classes ────────────────────────────────────────────────────────────

describe("Error classes", () => {
  it("APIError has correct properties", () => {
    const err = new APIError("oops", 500, "/api/test", "GitHub");
    expect(err.statusCode).toBe(500);
    expect(err.service).toBe("GitHub");
    expect(err instanceof APIError).toBe(true);
    expect(err instanceof Error).toBe(true);
  });

  it("AuthError is an APIError", () => {
    const err = new AuthError("GitHub", "/api");
    expect(err instanceof AuthError).toBe(true);
    expect(err instanceof APIError).toBe(true);
    expect(err.statusCode).toBe(401);
  });

  it("RateLimitError carries retryAfter", () => {
    const err = new RateLimitError("GitHub", "/api", 30);
    expect(err.retryAfter).toBe(30);
    expect(err.statusCode).toBe(429);
  });
});

// ─── APIManager ───────────────────────────────────────────────────────────────

describe("APIManager", () => {
  it("only initializes provided services", () => {
    const manager = new APIManager({ github: { token: "x" }, leetcode: {} });
    expect(manager.github).toBeInstanceOf(GitHubAPI);
    expect(manager.leetcode).toBeInstanceOf(LeetCodeAPI);
    expect(manager.kaggle).toBeUndefined();
    expect(manager.hackthebox).toBeUndefined();
  });

  it("initializes all services when all credentials provided", () => {
    const manager = new APIManager({
      github:         { token: "x" },
      kaggle:         { username: "u", key: "k" },
      huggingface:    { token: "x" },
      leetcode:       {},
      hackerrank:     { token: "x" },
      hackthebox:     { token: "x" },
      ctftime:        {},
      paperswithcode: {},
      gitlab:         { token: "x" },
      openhub:        { apiKey: "x" },
      sap:            { token: "x" },
      tableau:        { token: "x" },
      powerbi:        { token: "x" },
    });
    expect(manager.github).toBeDefined();
    expect(manager.kaggle).toBeDefined();
    expect(manager.huggingface).toBeDefined();
    expect(manager.leetcode).toBeDefined();
    expect(manager.hackerrank).toBeDefined();
    expect(manager.hackthebox).toBeDefined();
    expect(manager.ctftime).toBeDefined();
    expect(manager.paperswithcode).toBeDefined();
    expect(manager.gitlab).toBeDefined();
    expect(manager.openhub).toBeDefined();
    expect(manager.sap).toBeDefined();
    expect(manager.tableau).toBeDefined();
    expect(manager.powerbi).toBeDefined();
  });
});
