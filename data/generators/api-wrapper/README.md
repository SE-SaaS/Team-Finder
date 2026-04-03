# Unified API Wrapper

A production-ready TypeScript wrapper for 13 developer and data platforms — GitHub, Kaggle, HuggingFace, LeetCode, HackerRank, HackTheBox, CTFtime, PapersWithCode, GitLab, OpenHub, SAP, Tableau, and Power BI.

## Features

- **Type-safe** — full TypeScript with interfaces for every request and response
- **Retry logic** — automatic exponential backoff on transient failures
- **Rate limiting** — built-in token bucket throttling per service
- **Timeout control** — configurable per-request timeouts
- **Normalized errors** — `AuthError`, `RateLimitError`, `NotFoundError`, `NetworkError`
- **Tree-shakeable** — import only what you need
- **Zero dependencies** — uses native `fetch`

---

## Installation

```bash
npm install
npm run build
```

---

## Quick Start

```ts
import { APIManager } from "./dist";

const api = new APIManager({
  github:      { token: "ghp_..." },
  leetcode:    {},
  ctftime:     {},
});

const user  = await api.github!.getUser("torvalds");
const daily = await api.leetcode!.getDailyChallenge();
const events = await api.ctftime!.getEvents({ limit: 5 });
```

---

## Configuration

Pass a global `ClientConfig` as the second argument to `APIManager` or any individual client:

```ts
const config = {
  maxRetries: 3,       // retries on 5xx / network errors (default: 3)
  retryDelay: 500,     // base delay in ms, doubles each retry (default: 500)
  timeout:    10_000,  // request timeout in ms (default: 10000)
  rateLimit:  10,      // max requests per second (default: 10)
};

const api = new APIManager({ github: { token: "..." } }, config);
```

---

## Services

### GitHub
```ts
const gh = api.github!;

await gh.getUser("torvalds");
await gh.getRepo("torvalds", "linux");
await gh.listRepos("torvalds", { sort: "updated", per_page: 10 });
await gh.searchRepos("typescript", { per_page: 5 });
await gh.listIssues("owner", "repo", { state: "open" });
await gh.createIssue("owner", "repo", { title: "Bug", body: "Details..." });
await gh.getAuthenticatedUser();
```

### Kaggle
```ts
const kg = api.kaggle!;

await kg.listDatasets({ search: "nlp" });
await kg.getDataset("username", "dataset-name");
await kg.listCompetitions({ search: "vision" });
await kg.listKernels();
```

### HuggingFace
```ts
const hf = api.huggingface!;

await hf.listModels({ filter: "text-generation", limit: 20 });
await hf.getModel("meta-llama/Llama-3-8B");
await hf.listDatasets({ search: "squad" });
await hf.listSpaces();
```

### LeetCode
```ts
const lc = api.leetcode!;

await lc.getDailyChallenge();
await lc.getUserProfile("username");
await lc.getProblemList({ limit: 20, skip: 0, filters: { difficulty: "EASY" } });
```

### HackerRank
```ts
const hr = api.hackerrank!;

await hr.getContests({ limit: 10 });
await hr.getContest("contest-slug");
await hr.getChallenges("contest-slug");
await hr.getLeaderboard("contest-slug");
```

### HackTheBox
```ts
const htb = api.hackthebox!;

await htb.getProfile(12345);
await htb.getActiveMachines();
await htb.getMachineList({ difficulty: "easy", os: "linux" });
await htb.getRanking({ page: 1 });
```

### CTFtime
```ts
const ctf = api.ctftime!;

await ctf.getEvents({ limit: 10 });
await ctf.getEvent(1234);
await ctf.getTeam(5678);
await ctf.getTopTeams(2024);
```

### PapersWithCode
```ts
const pwc = api.paperswithcode!;

await pwc.listPapers({ q: "transformers" });
await pwc.getPaper("paper-id");
await pwc.listDatasets({ q: "imagenet" });
await pwc.listMethods();
await pwc.getSOTAResults("image-classification");
```

### GitLab
```ts
const gl = api.gitlab!;

await gl.getCurrentUser();
await gl.listProjects({ search: "api" });
await gl.getProject("group/project");
await gl.listIssues("group/project", { state: "opened" });
await gl.createIssue("group/project", { title: "Bug", description: "..." });
```

> Supports self-hosted instances — pass `baseURL` in credentials:
> ```ts
> gitlab: { token: "glpat-...", baseURL: "https://gitlab.mycompany.com/api/v4" }
> ```

### OpenHub
```ts
const oh = api.openhub!;

await oh.searchProjects("kubernetes");
await oh.getProject("linux");
await oh.getAccount("username");
```

### SAP
```ts
await api.sap!.listAPIs({ type: "rest" });
await api.sap!.getAPI("api-id");
```

### Tableau
```ts
const tb = api.tableau!;

await tb.getViews({ pageSize: 20 });
await tb.getWorkbooks();
await tb.getWorkbook("workbook-id");
```

### Power BI
```ts
const pbi = api.powerbi!;

await pbi.getDatasets();
await pbi.getReports();
await pbi.getDashboards();
await pbi.refreshDataset("group-id", "dataset-id");
```

---

## Error Handling

All errors extend the base `APIError` class:

```ts
import { APIError, AuthError, RateLimitError, NotFoundError, NetworkError } from "./dist";

try {
  await api.github!.getUser("unknown-user");
} catch (err) {
  if (err instanceof AuthError) {
    console.error("Bad credentials:", err.service);
  } else if (err instanceof RateLimitError) {
    console.error(`Rate limited. Retry after ${err.retryAfter}s`);
  } else if (err instanceof NotFoundError) {
    console.error("Not found:", err.endpoint);
  } else if (err instanceof NetworkError) {
    console.error("Network failure:", err.message);
  } else if (err instanceof APIError) {
    console.error(`API error ${err.statusCode}:`, err.message);
  }
}
```

| Error | Status | When |
|---|---|---|
| `AuthError` | 401 / 403 | Invalid or missing credentials |
| `RateLimitError` | 429 | Too many requests |
| `NotFoundError` | 404 | Resource doesn't exist |
| `NetworkError` | — | Request failed to send |
| `APIError` | any | Base class for all API errors |

---

## Individual Clients

You can use any client standalone without `APIManager`:

```ts
import { GitHubAPI, CTFtimeAPI } from "./dist";

const github = new GitHubAPI({ token: "ghp_..." }, { rateLimit: 5 });
const ctf    = new CTFtimeAPI({ timeout: 5000 });
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run dev` | Watch mode |
| `npm run test` | Run test suite (Vitest) |
| `npm run docs` | Generate TypeDoc documentation |
| `npm run lint` | Lint source files |

---

## Credentials Reference

| Service | Required |
|---|---|
| GitHub | `token` (optional for public endpoints) |
| Kaggle | `username`, `key` |
| HuggingFace | `token` (optional for public endpoints) |
| LeetCode | None |
| HackerRank | `token` |
| HackTheBox | `token` |
| CTFtime | None |
| PapersWithCode | `token` (optional) |
| GitLab | `token`, `baseURL` (optional) |
| OpenHub | `apiKey` |
| SAP | `token` |
| Tableau | `token`, `siteId` (optional) |
| Power BI | `token` |

---

## License

MIT
