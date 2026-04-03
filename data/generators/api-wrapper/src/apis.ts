import { BaseClient } from "./client";
import type {
  ClientConfig,
  GitHubCredentials, GitHubUser, GitHubRepo, GitHubIssue, CreateIssueBody, ListReposParams,
  KaggleCredentials, KaggleDataset, KaggleCompetition,
  HuggingFaceCredentials, HFModel, HFDataset, ListModelsParams,
  LeetCodeDailyChallenge, LeetCodeUserProfile,
  HackerRankCredentials, HackerRankContest,
  HackTheBoxCredentials, HTBMachine, HTBUserProfile,
  CTFEvent, CTFTeam,
  PapersWithCodeCredentials, PWCPaper,
  GitLabCredentials, GitLabProject,
  OpenHubCredentials,
  SAPCredentials,
  TableauCredentials, TableauView,
  PowerBICredentials, PowerBIDataset, PowerBIReport,
} from "./types";

// ─── GitHub ───────────────────────────────────────────────────────────────────

/**
 * GitHub REST API v3
 * @see https://docs.github.com/en/rest
 */
export class GitHubAPI extends BaseClient {
  constructor(creds: GitHubCredentials = {}, config?: ClientConfig) {
    super(
      "https://api.github.com",
      "GitHub",
      {
        ...(creds.token ? { Authorization: `Bearer ${creds.token}` } : {}),
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      config
    );
  }

  /** Get a public user's profile */
  getUser(username: string): Promise<GitHubUser> {
    return this.get(`/users/${username}`);
  }

  /** Get a repository by owner and repo name */
  getRepo(owner: string, repo: string): Promise<GitHubRepo> {
    return this.get(`/repos/${owner}/${repo}`);
  }

  /** List repositories for a user */
  listRepos(username: string, params?: ListReposParams): Promise<GitHubRepo[]> {
    return this.get(`/users/${username}/repos`, { params });
  }

  /** Search GitHub repositories */
  searchRepos(query: string, params?: { sort?: string; per_page?: number; page?: number }): Promise<{ total_count: number; items: GitHubRepo[] }> {
    return this.get("/search/repositories", { params: { q: query, ...params } });
  }

  /** List issues for a repository */
  listIssues(owner: string, repo: string, params?: { state?: "open" | "closed" | "all"; per_page?: number; page?: number }): Promise<GitHubIssue[]> {
    return this.get(`/repos/${owner}/${repo}/issues`, { params });
  }

  /** Create an issue in a repository */
  createIssue(owner: string, repo: string, body: CreateIssueBody): Promise<GitHubIssue> {
    return this.post(`/repos/${owner}/${repo}/issues`, { body });
  }

  /** Get authenticated user (requires token) */
  getAuthenticatedUser(): Promise<GitHubUser> {
    return this.get("/user");
  }
}

// ─── Kaggle ───────────────────────────────────────────────────────────────────

/**
 * Kaggle Public API v1
 * @see https://www.kaggle.com/docs/api
 */
export class KaggleAPI extends BaseClient {
  constructor(creds: KaggleCredentials, config?: ClientConfig) {
    const encoded = btoa(`${creds.username}:${creds.key}`);

    super(
      "https://www.kaggle.com/api/v1",
      "Kaggle",
      { Authorization: `Basic ${encoded}` },
      config
    );
  }

  /** List available datasets */
  listDatasets(params?: { search?: string; page?: number; pageSize?: number }): Promise<KaggleDataset[]> {
    return this.get("/datasets/list", { params });
  }

  /** Get a specific dataset */
  getDataset(owner: string, dataset: string): Promise<KaggleDataset> {
    return this.get(`/datasets/${owner}/${dataset}`);
  }

  /** List competitions */
  listCompetitions(params?: { search?: string; page?: number }): Promise<KaggleCompetition[]> {
    return this.get("/competitions/list", { params });
  }

  /** List kernels (notebooks) */
  listKernels(params?: { search?: string; page?: number }): Promise<unknown[]> {
    return this.get("/kernels/list", { params });
  }
}

// ─── HuggingFace ──────────────────────────────────────────────────────────────

/**
 * HuggingFace Hub API
 * @see https://huggingface.co/docs/hub/api
 */
export class HuggingFaceAPI extends BaseClient {
  constructor(creds: HuggingFaceCredentials = {}, config?: ClientConfig) {
    super(
      "https://huggingface.co/api",
      "HuggingFace",
      creds.token ? { Authorization: `Bearer ${creds.token}` } : {},
      config
    );
  }

  /** List models on the Hub */
  listModels(params?: ListModelsParams): Promise<HFModel[]> {
    return this.get("/models", { params });
  }

  /** Get a specific model's metadata */
  getModel(modelId: string): Promise<HFModel> {
    return this.get(`/models/${modelId}`);
  }

  /** List datasets on the Hub */
  listDatasets(params?: { search?: string; limit?: number }): Promise<HFDataset[]> {
    return this.get("/datasets", { params });
  }

  /** List spaces on the Hub */
  listSpaces(params?: { search?: string; limit?: number }): Promise<unknown[]> {
    return this.get("/spaces", { params });
  }
}

// ─── LeetCode (GraphQL) ───────────────────────────────────────────────────────

/**
 * LeetCode GraphQL API (unofficial public endpoint)
 */
export class LeetCodeAPI {
  private readonly endpoint = "https://leetcode.com/graphql";
  private readonly timeout: number;

  constructor(config?: Pick<ClientConfig, "timeout">) {
    this.timeout = config?.timeout ?? 10_000;
  }

  private async query<T>(gql: string, variables: Record<string, unknown> = {}): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: gql, variables }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`LeetCode API error: ${response.status}`);
      }

      const json = (await response.json()) as { data: T; errors?: { message: string }[] };
      if (json.errors?.length) throw new Error(json.errors[0].message);
      return json.data;
    } finally {
      clearTimeout(timer);
    }
  }

  /** Get a user's public profile and stats */
  getUserProfile(username: string): Promise<{ matchedUser: LeetCodeUserProfile }> {
    return this.query(
      `query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats { acSubmissionNum { difficulty count } }
          profile { ranking reputation }
        }
      }`,
      { username }
    );
  }

  /** Get today's daily challenge */
  getDailyChallenge(): Promise<{ activeDailyCodingChallengeQuestion: LeetCodeDailyChallenge }> {
    return this.query(
      `query {
        activeDailyCodingChallengeQuestion {
          date link
          question { title difficulty topicTags { name } }
        }
      }`
    );
  }

  /** List problems from the problem set */
  getProblemList(params?: {
    categorySlug?: string;
    limit?: number;
    skip?: number;
    filters?: Record<string, unknown>;
  }): Promise<unknown> {
    return this.query(
      `query getProblemSet($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
          total
          questions { acRate difficulty frontendQuestionId title titleSlug }
        }
      }`,
      params ?? {}
    );
  }
}

// ─── HackerRank ───────────────────────────────────────────────────────────────

/**
 * HackerRank API v3
 * @see https://www.hackerrank.com/work/api
 */
export class HackerRankAPI extends BaseClient {
  constructor(creds: HackerRankCredentials, config?: ClientConfig) {
    super(
      "https://www.hackerrank.com/api/v3",
      "HackerRank",
      { Authorization: `Bearer ${creds.token}` },
      config
    );
  }

  /** List contests */
  getContests(params?: { limit?: number; offset?: number }): Promise<{ models: HackerRankContest[] }> {
    return this.get("/contests", { params });
  }

  /** Get a specific contest by slug */
  getContest(slug: string): Promise<HackerRankContest> {
    return this.get(`/contests/${slug}`);
  }

  /** List challenges in a contest */
  getChallenges(contestSlug: string, params?: { limit?: number; offset?: number }): Promise<unknown> {
    return this.get(`/contests/${contestSlug}/challenges`, { params });
  }

  /** Get leaderboard for a contest */
  getLeaderboard(contestSlug: string): Promise<unknown> {
    return this.get(`/contests/${contestSlug}/leaderboard`);
  }
}

// ─── HackTheBox ───────────────────────────────────────────────────────────────

/**
 * HackTheBox API v4
 * @see https://documenter.getpostman.com/view/13129365/TVeqbmeq
 */
export class HackTheBoxAPI extends BaseClient {
  constructor(creds: HackTheBoxCredentials, config?: ClientConfig) {
    super(
      "https://www.hackthebox.com/api/v4",
      "HackTheBox",
      { Authorization: `Bearer ${creds.token}` },
      config
    );
  }

  /** Get a user's public profile */
  getProfile(userId: number): Promise<{ profile: HTBUserProfile }> {
    return this.get(`/user/profile/basic/${userId}`);
  }

  /** List active machines */
  getActiveMachines(): Promise<{ data: HTBMachine[] }> {
    return this.get("/machine/active");
  }

  /** List all machines */
  getMachineList(params?: { difficulty?: string; os?: string }): Promise<{ data: HTBMachine[] }> {
    return this.get("/machine/list", { params });
  }

  /** Get global user rankings */
  getRanking(params?: { page?: number; country?: string }): Promise<unknown> {
    return this.get("/rankings/users", { params });
  }
}

// ─── CTFtime ──────────────────────────────────────────────────────────────────

/**
 * CTFtime API v1 (public, no auth required)
 * @see https://ctftime.org/api/
 */
export class CTFtimeAPI extends BaseClient {
  constructor(config?: ClientConfig) {
    super("https://ctftime.org/api/v1", "CTFtime", {}, config);
  }

  /** List upcoming/past CTF events */
  getEvents(params?: { limit?: number; start?: number; finish?: number }): Promise<CTFEvent[]> {
    return this.get("/events/", { params });
  }

  /** Get a specific event */
  getEvent(eventId: number): Promise<CTFEvent> {
    return this.get(`/events/${eventId}/`);
  }

  /** Get a team's profile */
  getTeam(teamId: number): Promise<CTFTeam> {
    return this.get(`/teams/${teamId}/`);
  }

  /** Get top teams for a year */
  getTopTeams(year: number): Promise<Record<string, CTFTeam[]>> {
    return this.get(`/top/${year}/`);
  }
}

// ─── PapersWithCode ───────────────────────────────────────────────────────────

/**
 * Papers With Code API v1
 * @see https://paperswithcode.com/api/v1/docs/
 */
export class PapersWithCodeAPI extends BaseClient {
  constructor(creds: PapersWithCodeCredentials = {}, config?: ClientConfig) {
    super(
      "https://paperswithcode.com/api/v1",
      "PapersWithCode",
      creds.token ? { Authorization: `Token ${creds.token}` } : {},
      config
    );
  }

  /** List papers with optional search */
  listPapers(params?: { q?: string; page?: number; items_per_page?: number }): Promise<{ count: number; results: PWCPaper[] }> {
    return this.get("/papers/", { params });
  }

  /** Get a specific paper */
  getPaper(paperId: string): Promise<PWCPaper> {
    return this.get(`/papers/${paperId}/`);
  }

  /** List available datasets */
  listDatasets(params?: { q?: string; page?: number }): Promise<unknown> {
    return this.get("/datasets/", { params });
  }

  /** List methods (ML techniques) */
  listMethods(params?: { q?: string; page?: number }): Promise<unknown> {
    return this.get("/methods/", { params });
  }

  /** Get SOTA results for a task */
  getSOTAResults(taskId: string, params?: { page?: number }): Promise<unknown> {
    return this.get(`/tasks/${taskId}/results/`, { params });
  }
}

// ─── GitLab ───────────────────────────────────────────────────────────────────

/**
 * GitLab REST API v4 (supports self-hosted instances)
 * @see https://docs.gitlab.com/ee/api/
 */
export class GitLabAPI extends BaseClient {
  constructor(creds: GitLabCredentials, config?: ClientConfig) {
    super(
      creds.baseURL ?? "https://gitlab.com/api/v4",
      "GitLab",
      { "PRIVATE-TOKEN": creds.token },
      config
    );
  }

  /** Get the authenticated user */
  getCurrentUser(): Promise<unknown> {
    return this.get("/user");
  }

  /** Get a user by ID */
  getUser(userId: number): Promise<unknown> {
    return this.get(`/users/${userId}`);
  }

  /** List accessible projects */
  listProjects(params?: { search?: string; per_page?: number; page?: number }): Promise<GitLabProject[]> {
    return this.get("/projects", { params });
  }

  /** Get a specific project */
  getProject(projectId: number | string): Promise<GitLabProject> {
    return this.get(`/projects/${encodeURIComponent(String(projectId))}`);
  }

  /** List issues in a project */
  listIssues(projectId: number | string, params?: { state?: "opened" | "closed" | "all"; per_page?: number; page?: number }): Promise<unknown[]> {
    return this.get(`/projects/${projectId}/issues`, { params });
  }

  /** Create an issue in a project */
  createIssue(projectId: number | string, body: { title: string; description?: string; labels?: string }): Promise<unknown> {
    return this.post(`/projects/${projectId}/issues`, { body });
  }
}

// ─── OpenHub ──────────────────────────────────────────────────────────────────

/**
 * OpenHub API v1
 * @see https://github.com/blackducksoftware/ohloh_api
 */
export class OpenHubAPI extends BaseClient {
  private readonly apiKey: string;

  constructor(creds: OpenHubCredentials, config?: ClientConfig) {
    super("https://www.openhub.net/api/v1", "OpenHub", {}, config);
    this.apiKey = creds.apiKey;
  }

  private withKey(params?: Record<string, string | number | boolean>) {
    return { api_key: this.apiKey, ...params };
  }

  /** Search for open source projects */
  searchProjects(query: string): Promise<unknown> {
    return this.get("/projects.json", { params: this.withKey({ query }) });
  }

  /** Get a specific project by ID or name */
  getProject(projectId: string | number): Promise<unknown> {
    return this.get(`/projects/${projectId}.json`, { params: this.withKey() });
  }

  /** Get an account (contributor) by login */
  getAccount(login: string): Promise<unknown> {
    return this.get(`/accounts/${login}.json`, { params: this.withKey() });
  }
}

// ─── SAP ──────────────────────────────────────────────────────────────────────

/**
 * SAP API Business Hub
 * @see https://api.sap.com
 */
export class SAPAPI extends BaseClient {
  constructor(creds: SAPCredentials, config?: ClientConfig) {
    super(
      "https://api.sap.com/api",
      "SAP",
      { Authorization: `Bearer ${creds.token}` },
      config
    );
  }

  /** List available APIs */
  listAPIs(params?: { search?: string; type?: string }): Promise<unknown> {
    return this.get("/", { params });
  }

  /** Get details about a specific API */
  getAPI(apiId: string): Promise<unknown> {
    return this.get(`/${apiId}`);
  }
}

// ─── Tableau ──────────────────────────────────────────────────────────────────

/**
 * Tableau REST API v3.22
 * @see https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api.htm
 */
export class TableauAPI extends BaseClient {
  private readonly siteId: string;

  constructor(creds: TableauCredentials, config?: ClientConfig) {
    super(
      "https://public.tableau.com/api/3.22",
      "Tableau",
      { "x-tableau-auth": creds.token },
      config
    );
    this.siteId = creds.siteId ?? "default";
  }

  /** List views on the site */
  getViews(params?: { pageNumber?: number; pageSize?: number }): Promise<{ views: { view: TableauView[] } }> {
    return this.get(`/sites/${this.siteId}/views`, { params });
  }

  /** List workbooks on the site */
  getWorkbooks(params?: { pageNumber?: number; pageSize?: number }): Promise<unknown> {
    return this.get(`/sites/${this.siteId}/workbooks`, { params });
  }

  /** Get a specific workbook */
  getWorkbook(workbookId: string): Promise<unknown> {
    return this.get(`/sites/${this.siteId}/workbooks/${workbookId}`);
  }
}

// ─── Power BI ─────────────────────────────────────────────────────────────────

/**
 * Power BI REST API v1.0
 * @see https://learn.microsoft.com/en-us/rest/api/power-bi/
 */
export class PowerBIAPI extends BaseClient {
  constructor(creds: PowerBICredentials, config?: ClientConfig) {
    super(
      "https://api.powerbi.com/v1.0/myorg",
      "PowerBI",
      { Authorization: `Bearer ${creds.token}` },
      config
    );
  }

  /** List all datasets */
  getDatasets(): Promise<{ value: PowerBIDataset[] }> {
    return this.get("/datasets");
  }

  /** List all reports */
  getReports(): Promise<{ value: PowerBIReport[] }> {
    return this.get("/reports");
  }

  /** List all dashboards */
  getDashboards(): Promise<unknown> {
    return this.get("/dashboards");
  }

  /** Get a dataset in a workspace group */
  getDatasetInGroup(groupId: string, datasetId: string): Promise<PowerBIDataset> {
    return this.get(`/groups/${groupId}/datasets/${datasetId}`);
  }

  /** Trigger a dataset refresh */
  refreshDataset(groupId: string, datasetId: string): Promise<void> {
    return this.post(`/groups/${groupId}/datasets/${datasetId}/refreshes`);
  }
}
