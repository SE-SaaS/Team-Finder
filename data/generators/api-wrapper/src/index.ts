/**
 * @packageDocumentation
 * Unified API Wrapper — GitHub, Kaggle, HuggingFace, LeetCode,
 * HackerRank, HackTheBox, CTFtime, PapersWithCode, GitLab,
 * OpenHub, SAP, Tableau, Power BI
 */

export * from "./errors";
export * from "./types";
export * from "./apis";

import type { ManagerCredentials, ClientConfig } from "./types";
import {
  GitHubAPI, KaggleAPI, HuggingFaceAPI, LeetCodeAPI,
  HackerRankAPI, HackTheBoxAPI, CTFtimeAPI, PapersWithCodeAPI,
  GitLabAPI, OpenHubAPI, SAPAPI, TableauAPI, PowerBIAPI,
} from "./apis";

/**
 * Single entry point — instantiate only the services you have credentials for.
 *
 * @example
 * ```ts
 * const api = new APIManager({
 *   github:       { token: "ghp_..." },
 *   leetcode:     {},
 *   ctftime:      {},
 *   gitlab:       { token: "glpat-...", baseURL: "https://gitlab.mycompany.com/api/v4" },
 * });
 *
 * const user  = await api.github!.getUser("torvalds");
 * const daily = await api.leetcode!.getDailyChallenge();
 * ```
 */
export class APIManager {
  public readonly github?:          GitHubAPI;
  public readonly kaggle?:          KaggleAPI;
  public readonly huggingface?:     HuggingFaceAPI;
  public readonly leetcode?:        LeetCodeAPI;
  public readonly hackerrank?:      HackerRankAPI;
  public readonly hackthebox?:      HackTheBoxAPI;
  public readonly ctftime?:         CTFtimeAPI;
  public readonly paperswithcode?:  PapersWithCodeAPI;
  public readonly gitlab?:          GitLabAPI;
  public readonly openhub?:         OpenHubAPI;
  public readonly sap?:             SAPAPI;
  public readonly tableau?:         TableauAPI;
  public readonly powerbi?:         PowerBIAPI;

  constructor(credentials: ManagerCredentials, config?: ClientConfig) {
    if (credentials.github)         this.github         = new GitHubAPI(credentials.github, config);
    if (credentials.kaggle)         this.kaggle         = new KaggleAPI(credentials.kaggle, config);
    if (credentials.huggingface)    this.huggingface    = new HuggingFaceAPI(credentials.huggingface, config);
    if (credentials.leetcode)       this.leetcode       = new LeetCodeAPI(config);
    if (credentials.hackerrank)     this.hackerrank     = new HackerRankAPI(credentials.hackerrank, config);
    if (credentials.hackthebox)     this.hackthebox     = new HackTheBoxAPI(credentials.hackthebox, config);
    if (credentials.ctftime)        this.ctftime        = new CTFtimeAPI(config);
    if (credentials.paperswithcode) this.paperswithcode = new PapersWithCodeAPI(credentials.paperswithcode, config);
    if (credentials.gitlab)         this.gitlab         = new GitLabAPI(credentials.gitlab, config);
    if (credentials.openhub)        this.openhub        = new OpenHubAPI(credentials.openhub, config);
    if (credentials.sap)            this.sap            = new SAPAPI(credentials.sap, config);
    if (credentials.tableau)        this.tableau        = new TableauAPI(credentials.tableau, config);
    if (credentials.powerbi)        this.powerbi        = new PowerBIAPI(credentials.powerbi, config);
  }
}
