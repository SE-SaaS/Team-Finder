# Data Generators Documentation

> Comprehensive documentation for external data fetching and project prefetching systems

---

## Overview

The data generators system consists of two main packages:
1. **API Wrapper** - Unified interface for 13+ external APIs
2. **Prefetcher** - Multi-source project/resource aggregation system

---

## API Wrapper (`data/generators/api-wrapper/`)

### Core Classes

#### `APIManager` (`src/index.ts`)

Main entry point for all external API integrations.

```typescript
class APIManager {
  constructor(credentials: ManagerCredentials, config?: ClientConfig)
}
```

**Properties** (all readonly, conditionally instantiated):
- `github?: GitHubAPI`
- `kaggle?: KaggleAPI`
- `huggingface?: HuggingFaceAPI`
- `leetcode?: LeetCodeAPI`
- `hackerrank?: HackerRankAPI`
- `hackthebox?: HackTheBoxAPI`
- `ctftime?: CTFtimeAPI`
- `paperswithcode?: PapersWithCodeAPI`
- `gitlab?: GitLabAPI`
- `openhub?: OpenHubAPI`
- `sap?: SAPAPI`
- `tableau?: TableauAPI`
- `powerbi?: PowerBIAPI`

**Usage Example**:
```typescript
const api = new APIManager({
  github: { token: "ghp_..." },
  leetcode: {},
  ctftime: {},
});

const user = await api.github!.getUser("torvalds");
const daily = await api.leetcode!.getDailyChallenge();
```

---

### Base HTTP Client (`src/client.ts`)

#### `RateLimiter` Class

Token bucket rate limiter with exponential backoff.

##### `throttle(): Promise<void>`
- **Purpose**: Enforce rate limits before making requests
- **Algorithm**: Token bucket with configurable tokens per interval
- **Backoff**: Exponential backoff on rate limit hits
- **Called by**: All API request methods

#### `BaseClient` Abstract Class

Foundation for all API clients with retry logic and error handling.

##### `buildURL(path: string, params?: Record<string, any>): string`
- **Purpose**: Construct URL with query parameters
- **Parameters**:
  - `path`: API endpoint path
  - `params`: Optional query parameters
- **Returns**: Full URL string
- **Implementation**: URLSearchParams for encoding

##### `executeRequest<T>(method: string, url: string, options?: RequestOptions): Promise<T>`
- **Purpose**: Execute HTTP request with timeout
- **Parameters**:
  - `method`: HTTP method (GET, POST, etc.)
  - `url`: Full URL
  - `options`: Headers, body, timeout
- **Returns**: Parsed response
- **Timeout**: Configurable (default 30s)
- **Error Handling**: Throws APIError on failure

##### `isRetryable(status: number): boolean`
- **Purpose**: Determine if HTTP status code should trigger retry
- **Retryable codes**: 408, 429, 500-504
- **Returns**: Boolean
- **Called by**: `request()`

##### `request<T>(method: string, path: string, options?: RequestOptions): Promise<T>`
- **Purpose**: Core request method with retry logic
- **Retry Strategy**: 3 attempts with exponential backoff
- **Flow**:
  1. Check rate limiter
  2. Build URL
  3. Execute request
  4. On retryable error: wait and retry
  5. On non-retryable error: throw immediately
- **Error Types**: APIError, AuthError, RateLimitError, NotFoundError, NetworkError
- **Called by**: All HTTP verb wrappers

##### HTTP Verb Wrappers
- `get<T>(path, params?, options?): Promise<T>`
- `post<T>(path, body?, options?): Promise<T>`
- `put<T>(path, body?, options?): Promise<T>`
- `delete<T>(path, options?): Promise<T>`

All call `request()` with appropriate method.

---

### API Implementations (`src/apis.ts`)

#### `GitHubAPI` extends BaseClient

##### `getUser(username: string): Promise<GitHubUser>`
- **Endpoint**: `GET /users/{username}`
- **Returns**: User object with bio, repos, followers, etc.

##### `getRepo(owner: string, repo: string): Promise<GitHubRepo>`
- **Endpoint**: `GET /repos/{owner}/{repo}`
- **Returns**: Repository details

##### `listRepos(username: string, params?: RepoListParams): Promise<GitHubRepo[]>`
- **Endpoint**: `GET /users/{username}/repos`
- **Parameters**: sort, direction, per_page, page
- **Returns**: Array of repositories

##### `searchRepos(query: string, params?: SearchParams): Promise<GitHubSearchResult>`
- **Endpoint**: `GET /search/repositories`
- **Parameters**: q, sort, order, per_page
- **Returns**: Search results with total_count and items

##### `listIssues(owner: string, repo: string, params?: IssueParams): Promise<GitHubIssue[]>`
- **Endpoint**: `GET /repos/{owner}/{repo}/issues`
- **Parameters**: state, labels, sort, direction
- **Returns**: Array of issues

##### `createIssue(owner: string, repo: string, body: CreateIssueBody): Promise<GitHubIssue>`
- **Endpoint**: `POST /repos/{owner}/{repo}/issues`
- **Body**: title, body, labels, assignees
- **Returns**: Created issue object

##### `getAuthenticatedUser(): Promise<GitHubUser>`
- **Endpoint**: `GET /user`
- **Requires**: Authentication token
- **Returns**: Authenticated user's profile

---

#### `KaggleAPI` extends BaseClient

##### `listDatasets(params?: DatasetParams): Promise<KaggleDataset[]>`
- **Endpoint**: `GET /datasets/list`
- **Parameters**: page, search, sortBy
- **Returns**: Array of datasets

##### `getDataset(owner: string, dataset: string): Promise<KaggleDataset>`
- **Endpoint**: `GET /datasets/view/{owner}/{dataset}`
- **Returns**: Dataset details

##### `listCompetitions(params?: CompetitionParams): Promise<KaggleCompetition[]>`
- **Endpoint**: `GET /competitions/list`
- **Returns**: Array of competitions

##### `listKernels(params?: KernelParams): Promise<KaggleKernel[]>`
- **Endpoint**: `GET /kernels/list`
- **Returns**: Array of kernels/notebooks

---

#### `HuggingFaceAPI` extends BaseClient

##### `listModels(params?: ModelParams): Promise<HFModel[]>`
- **Endpoint**: `GET /api/models`
- **Parameters**: filter, sort, direction, limit
- **Returns**: Array of ML models

##### `getModel(modelId: string): Promise<HFModel>`
- **Endpoint**: `GET /api/models/{modelId}`
- **Returns**: Model details with downloads, likes, tags

##### `listDatasets(params?: DatasetParams): Promise<HFDataset[]>`
- **Endpoint**: `GET /api/datasets`
- **Returns**: Array of datasets

##### `listSpaces(params?: SpaceParams): Promise<HFSpace[]>`
- **Endpoint**: `GET /api/spaces`
- **Returns**: Array of Spaces (demos)

---

#### `LeetCodeAPI`

##### `query<T>(gql: string, variables?: any): Promise<T>`
- **Endpoint**: GraphQL endpoint
- **Method**: POST with GraphQL query
- **Returns**: Parsed GraphQL response

##### `getUserProfile(username: string): Promise<LeetCodeProfile>`
- **Implementation**: GraphQL query for user stats
- **Returns**: Problem counts, ranking, submissions

##### `getDailyChallenge(): Promise<LeetCodeProblem>`
- **Implementation**: GraphQL query for daily problem
- **Returns**: Today's challenge problem

---

#### Other API Classes

Similar patterns for:
- **HackerRankAPI** - Challenges, contests, certifications
- **HackTheBoxAPI** - Machines, challenges, walkthroughs
- **CTFtimeAPI** - CTF events, teams, writeups
- **PapersWithCodeAPI** - Research papers, benchmarks, datasets
- **GitLabAPI** - Projects, issues, merge requests
- **OpenHubAPI** - Open source project analytics
- **SAPAPI** - SAP resources
- **TableauAPI** - Tableau public visualizations
- **PowerBIAPI** - Power BI datasets and reports

---

### Error Handling (`src/errors.ts`)

#### Error Classes

- **`APIError`** - Base error class
  - Properties: message, statusCode, response
  
- **`AuthError extends APIError`** - Authentication failures
  - Status codes: 401, 403
  
- **`RateLimitError extends APIError`** - Rate limit exceeded
  - Status code: 429
  - Properties: retryAfter
  
- **`NotFoundError extends APIError`** - Resource not found
  - Status code: 404
  
- **`NetworkError extends APIError`** - Network failures
  - Status code: 0 (no response)

---

## Prefetcher System (`data/generators/prefetcher-ts/`)

### Architecture

```
CLI (main.ts)
  ↓
MajorPrefetcher
  ↓
REGISTRY (getPrefetcher factory)
  ↓
15+ Source Prefetchers (extend BasePrefetcher)
  ↓
External APIs
  ↓
Results Aggregation & Enrichment
  ↓
Save to Supabase or Generate SQL
```

---

### Core Types (`src/core/types.ts`)

#### `Major` Enum
```typescript
enum Major {
  AI = "AI",
  CS = "CS",
  CIS = "CIS",
  BI = "BI",
  CYS = "CYS",
  DS = "DS",
  SWE = "SWE"
}
```

#### `Strategy` Type
```typescript
type Strategy = "api" | "graphql" | "scrape" | "internal"
```

#### `Category` Type
```typescript
type Category = "resource" | "project" | "dataset"
```

#### `PrefetchResult` Interface
```typescript
interface PrefetchResult {
  source: string;
  major: Major;
  category: Category;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  language?: string;
  stars?: number;
  extra?: Record<string, any>;
}
```

#### `SOURCE_MAP: Record<Major, string[]>`
Maps each major to relevant data sources.

**Example**:
```typescript
{
  AI: ['github', 'kaggle', 'huggingface', 'paperswithcode', ...],
  CS: ['github', 'leetcode', 'hackerrank', ...],
  CYS: ['hackthebox', 'ctftime', 'vulnhub', ...]
}
```

#### `SOURCE_STRATEGY: Record<string, Strategy>`
Maps source names to their fetching strategy.

---

### Base Prefetcher (`src/core/basePrefetcher.ts`)

#### `BasePrefetcher` Abstract Class

##### Properties
- `sourceName: string` - Source identifier
- `strategy: Strategy` - Fetching strategy
- `baseUrl: string` - API base URL
- `apiKey?: string` - Optional API key
- `client: AxiosInstance` - HTTP client

##### `buildHeaders(): Record<string, string>`
- **Purpose**: Add authentication headers if API key provided
- **Returns**: Headers object
- **Called by**: All HTTP methods

##### `get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T>`
- **Purpose**: Wrapper around axios GET with auth
- **Returns**: Response data
- **Error Handling**: Wraps axios errors

##### `post<T>(url: string, payload: any): Promise<T>`
- **Purpose**: POST request wrapper
- **Returns**: Response data

##### `getHtml(url: string): Promise<CheerioAPI>`
- **Purpose**: Fetch HTML and parse with Cheerio
- **Returns**: Cheerio instance for scraping
- **Used by**: Scraper-based prefetchers

##### Abstract Methods (must implement in subclasses)
- `fetchResources(major: Major): Promise<PrefetchResult[]>`
- `fetchProjects(major: Major): Promise<PrefetchResult[]>`
- `fetchDatasets(major: Major): Promise<PrefetchResult[]>`

##### `fetchAll(major: Major): Promise<PrefetchResult[]>`
- **Purpose**: Fetch all categories using Promise.allSettled
- **Returns**: Aggregated results from all three methods
- **Error Handling**: Continues on partial failures

##### `makeResult(overrides: Partial<PrefetchResult>): PrefetchResult`
- **Purpose**: Factory for creating PrefetchResult objects
- **Fills in**: source, major, category defaults
- **Returns**: Complete PrefetchResult

---

### Prefetcher Registry (`src/core/registry.ts`)

#### `REGISTRY: Map<string, typeof BasePrefetcher>`

Maps source names to prefetcher class constructors.

**Registered Sources** (15+):
- github
- kaggle
- huggingface
- leetcode
- hackerrank
- hackthebox
- vulnhub
- ctftime
- paperswithcode
- uci (UCI ML Repository)
- gitlab
- openhub
- sap
- tableau_public
- power_bi
- ai_generator (internal)

#### `getPrefetcher(source: string, apiKey?: string): BasePrefetcher`
- **Purpose**: Factory function to instantiate prefetcher
- **Parameters**:
  - `source`: Source name (must be in REGISTRY)
  - `apiKey`: Optional API key
- **Returns**: Instantiated prefetcher instance
- **Throws**: Error if source not found in REGISTRY
- **Called by**: MajorPrefetcher

---

### Major Prefetcher (`src/majorPrefetcher.ts`)

#### `MajorPrefetcher` Class

Orchestrates fetching from multiple sources for a given major.

##### `constructor(apiKeys: Record<string, string>, limitPerSource: number)`
- **Parameters**:
  - `apiKeys`: Dictionary of source → API key
  - `limitPerSource`: Max results per source (default 10)

##### `runSource(source: string, major: Major): Promise<PrefetchResult[]>`
- **Purpose**: Fetch from a single source
- **Implementation**:
  1. Get prefetcher from REGISTRY
  2. Call fetchAll()
  3. Limit results to limitPerSource
  4. Log stats
- **Error Handling**: Logs errors but doesn't throw
- **Returns**: Results array (empty on error)

##### `prefetch(major: Major): Promise<PrefetchResult[]>`
- **Purpose**: Fetch from all sources for a major
- **Implementation**:
  1. Get source list from SOURCE_MAP[major]
  2. Run all sources in parallel using Promise.allSettled
  3. Aggregate results
- **Returns**: Combined results from all sources
- **Called by**: CLI main() function

##### `prefetchAll(): Promise<Record<Major, PrefetchResult[]>>`
- **Purpose**: Fetch for ALL majors
- **Implementation**: Calls prefetch() for each major in Major enum
- **Returns**: Dictionary of major → results
- **Called by**: CLI with --all flag

##### `summarize(results: PrefetchResult[]): Summary`
- **Purpose**: Generate statistics from results
- **Returns**: Object with:
  - `total`: Total count
  - `bySource`: Count per source
  - `byCategory`: Count per category (resource/project/dataset)
  - `languages`: Unique languages used
- **Called by**: CLI for printing stats

---

### Skill Matching (`src/skills/skillMatcher.ts`)

#### `ALIASES: Record<string, string>`

Maps tag variants to canonical skill names.

**Examples**:
- `'reactjs'` → `'react'`
- `'ts'` → `'typescript'`
- `'node'` → `'nodejs'`
- `'py'` → `'python'`

#### `normalize(token: string): string`
- **Purpose**: Normalize tag for matching
- **Algorithm**:
  1. Lowercase
  2. Replace whitespace/underscores with empty string
  3. Strip non-alphanumeric
- **Returns**: Normalized string
- **Called by**: `extractTokens()`, `resolveSkill()`

#### `extractTokens(result: PrefetchResult): string[]`
- **Purpose**: Extract all potential skill indicators from result
- **Sources**: title, description, tags, language
- **Returns**: Array of normalized tokens
- **Called by**: `calcProjectSkillMeta()`

#### `resolveSkill(token: string): string | null`
- **Purpose**: Map token to skill name
- **Checks**:
  1. ALIASES lookup
  2. Direct SKILL_TAXONOMY key match
- **Returns**: Skill name or null
- **Called by**: `calcProjectSkillMeta()`

#### `calcProjectSkillMeta(result: PrefetchResult): ProjectSkillMeta`
- **Purpose**: Extract matched skills and calculate metadata
- **Implementation**:
  1. Extract tokens from result
  2. Resolve each token to skill
  3. Calculate minYear (max across matched skills)
  4. Determine suitableMajors from skill taxonomy
- **Returns**: Object with:
  - `skills: string[]` - Matched skill names
  - `minYear: number` - Minimum year requirement (1-4)
  - `suitableMajors: Major[]` - Majors this project suits
- **Called by**: `enrichResults()`, `mapToSupabaseProject()`

#### `enrichResults(results: PrefetchResult[]): EnrichedResult[]`
- **Purpose**: Add skillMeta to each result
- **Parameters**: Raw results from prefetchers
- **Returns**: Results with skillMeta field added
- **Called by**: Data processing pipeline

---

### Save to Supabase (`src/saveToSupabase.ts`)

#### `determineDifficulty(result: PrefetchResult): string`
- **Purpose**: Map stars/popularity to difficulty level
- **Algorithm**:
  - < 100 stars → 'beginner'
  - < 1000 stars → 'intermediate'
  - ≥ 1000 stars → 'advanced'
  - No stars → defaults by source
- **Returns**: Difficulty string
- **Called by**: `mapToSupabaseProject()`

#### `mapToSupabaseProject(result: PrefetchResult): SupabaseProject`
- **Purpose**: Convert PrefetchResult to database schema
- **Implementation**:
  1. Calls `calcProjectSkillMeta()` for skills
  2. Maps fields to database columns
  3. Sets difficulty via `determineDifficulty()`
- **Mapping**:
  - `title` → `title`
  - `description` → `description`
  - `tags` + `language` → `tech_stack`
  - `skillMeta.skills` → `skills_needed`
  - `source` → `source`
  - `url` → `external_url`
  - `skillMeta.minYear` → `min_year`
  - `skillMeta.suitableMajors` → `suitable_majors`
- **Returns**: Database-ready project object

#### `checkDuplicate(external_url: string): Promise<boolean>`
- **Purpose**: Check if project URL already exists in database
- **Query**: `SELECT id FROM projects WHERE external_url = ?`
- **Returns**: Boolean indicating if duplicate exists
- **Called by**: `saveProjectsToSupabase()` for dupe skipping

#### `saveProjectsToSupabase(results: PrefetchResult[], options?: SaveOptions): Promise<SaveResult>`
- **Purpose**: Batch insert projects with duplicate checking
- **Parameters**:
  - `results`: Array of PrefetchResults
  - `options`: { skipDuplicates: boolean, batchSize: number }
- **Implementation**:
  1. Map results to SupabaseProject objects
  2. Check for duplicates (if skipDuplicates=true)
  3. Batch insert non-duplicates
  4. Log stats
- **Returns**: Object with:
  - `inserted: number` - Successfully inserted count
  - `skipped: number` - Duplicate count
  - `errors: number` - Error count
- **Called by**: fetchAndSave.ts main()

#### `saveAllResourcesToSupabase(results: PrefetchResult[]): Promise<SaveAllResult>`
- **Purpose**: Save projects, datasets, and resources to respective tables
- **Implementation**: Separates by category and saves to appropriate tables
- **Returns**: Combined save statistics
- **Called by**: fetchAndSave.ts with --save-all flag

---

### SQL Generation (`src/generateSQL.ts`)

#### `escapeSqlString(str: string): string`
- **Purpose**: Escape single quotes and backslashes for SQL
- **Returns**: SQL-safe string
- **Called by**: `generateInsertStatement()`

#### `generateInsertStatement(result: PrefetchResult, index: number): string`
- **Purpose**: Build SQL INSERT statement
- **Handles**:
  - String escaping
  - Empty arrays as `ARRAY[]::TEXT[]`
  - NULL values
- **Returns**: Complete INSERT statement
- **Called by**: `main()` for SQL file generation

#### `main(): Promise<void>`
- **Purpose**: Generate insert_external_projects.sql file
- **Flow**:
  1. Fetch projects via MajorPrefetcher
  2. Generate INSERT statement for each
  3. Write to SQL file
- **Output**: `insert_external_projects.sql` at repo root
- **Called by**: CLI execution

---

### Fetch and Save (`src/fetchAndSave.ts`)

#### `main(): Promise<void>`
- **Purpose**: Main orchestration script
- **Functionality**:
  1. Load API keys
  2. Create MajorPrefetcher
  3. Fetch all projects
  4. Save to Supabase or generate SQL
- **Options** (from CLI args):
  - `--sql` - Generate SQL file instead of direct insert
  - `--save-all` - Save resources and datasets too
  - `--skip-duplicates` - Check for existing URLs
- **Logging**: Detailed progress and error logs
- **Called by**: `npm run fetch-and-save` or direct execution

---

### Supabase Client (`src/supabaseClient.ts`)

#### `supabase: SupabaseClient`
- **Purpose**: Server-side Supabase client for data generators
- **Auth**: Uses SUPABASE_SERVICE_ROLE_KEY for admin access
- **Environment**: Loads from .env.local or .env
- **Used by**: All save functions

---

## CLI Usage

### Prefetcher CLI

```bash
# Fetch for single major
ts-node src/main.ts --major CS --limit 50 --output cs_projects.json

# Fetch for all majors
ts-node src/main.ts --all --limit 20 --output all_projects.json

# Save directly to Supabase
npm run fetch-and-save

# Generate SQL file
npm run generate-sql
```

### Available Flags

- `--major <MAJOR>` - Fetch for specific major (AI, CS, CIS, BI, CYS, DS, SWE)
- `--all` - Fetch for all majors
- `--limit <N>` - Limit results per source (default: 10)
- `--output <file.json>` - Save results to JSON file
- `--sql` - Generate SQL instead of direct insert
- `--save-all` - Save resources and datasets in addition to projects
- `--skip-duplicates` - Skip projects that already exist in database

---

## Environment Variables

```env
# GitHub
GITHUB_TOKEN=ghp_...

# Kaggle
KAGGLE_CREDENTIALS={"username":"...","key":"..."}

# HuggingFace
HF_TOKEN=hf_...

# GitLab
GITLAB_TOKEN=glpat-...

# HackTheBox
HTB_TOKEN=...

# OpenHub
OPENHUB_API_KEY=...

# SAP
SAP_API_KEY=...

# HackerRank
HACKERRANK_API_KEY=...

# LeetCode
LEETCODE_SESSION=...

# Supabase (for saving)
SUPABASE_URL=https://....supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## Data Flow

```
External APIs (15+ sources)
  ↓
Prefetchers (via REGISTRY)
  ↓
PrefetchResult objects
  ↓
Skill Matching (calcProjectSkillMeta)
  ↓
EnrichedResult objects
  ↓
Map to Database Schema
  ↓
Duplicate Check (optional)
  ↓
Batch Insert to Supabase
  OR
Generate SQL File
```

---

## Summary Statistics

- **Total API Integrations**: 13+
- **Total Prefetchers**: 15+
- **Supported Majors**: 7
- **Categories**: 3 (projects, datasets, resources)
- **Error Types**: 5 (API, Auth, RateLimit, NotFound, Network)
- **Retry Strategy**: 3 attempts with exponential backoff
- **Rate Limiting**: Token bucket per API
- **Skill Aliases**: 50+
- **Max Results per Source**: Configurable (default 10)

---

*For main function documentation, see [FUNCTION_DOCUMENTATION.md](./FUNCTION_DOCUMENTATION.md)*  
*For workflow diagrams, see [WORKFLOW_DIAGRAM.md](./WORKFLOW_DIAGRAM.md)*
