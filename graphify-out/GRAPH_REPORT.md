# Graph Report - Team-Finder  (2026-07-08)

## Corpus Check
- 252 files · ~176,106 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1483 nodes · 2481 edges · 119 communities (102 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.56)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2c34a4d2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createClient
- scoring.ts
- PrefetchResult
- agent.py
- Project Generators
- index.ts
- dependencies
- package.json
- main.py
- Backend Plan Summary
- Services
- scripts
- types.ts
- useAuthenticatedUser
- CLAUDE.md
- apis.ts
- compilerOptions
- .mcp.json
- compilerOptions
- index.ts
- generate-architecture-excalidraw.mjs
- profileValidation.ts
- profile.ts
- index.test.ts
- BasePrefetcher
- Skills System Fixes - Complete Summary
- useProgress
- University of Jordan (JU) - IT Majors Course Catalog
- compilerOptions
- index.ts
- skillLocks.ts
- types.ts
- supabase.ts
- CourseCatalog.tsx
- User Metadata Migration Guide
- Team-Finder System Architecture & Workflow Diagram
- BackgroundCanvas.tsx
- supabaseClient.ts
- FetchOptions
- layout.tsx
- ProfileData
- 🧪 AI Agent Testing Guide
- TESTING CHECKLIST
- Artificial Intelligence (AI)
- Computer Information Systems (CIS)
- Computer Science (CS)
- Cybersecurity (CYS)
- Data Science (DS)
- useDevTools.ts
- generate_pdf.py
- page.tsx
- Slots
- seed_roadmaps.py
- page.tsx
- PersonalizedPath.tsx
- ProfileWizardController.tsx
- STATUS
- GitLabAPI
- PowerBIAPI
- BaseClient
- github.ts
- AuthContext.tsx
- 🚀 Manual Testing Steps
- Profile Wizard Rebuild — Design & Handoff
- Course Extraction Status
- KaggleAPI
- PapersWithCodeAPI
- CourseDetailModal.tsx
- Team-Finder
- package.json
- Seed University Projects
- auth.py
- CTFtimeAPI
- HackerRankAPI
- prefetcher-ts
- openhub.ts
- LeetCodeAPI
- TableauAPI
- README.md
- page.tsx
- Step3_SkillSelector.tsx
- migrate_user_metadata.js
- GitLabPrefetcher
- HackerRankPrefetcher
- LeetCodePrefetcher
- Step7_Bio.tsx
- projectFilters.ts
- GitLabPrefetcher
- Team-Finder Documentation
- Quick Reference: Function Call Graph
- page.tsx
- LearningPage.tsx
- Setup
- apply_migration.py
- README.md
- page.tsx
- SectionTabs.tsx
- seed-projects.js
- seed_dev_tools.py
- Legend
- middleware.ts
- index.js
- .eslintrc.json
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts

## God Nodes (most connected - your core abstractions)
1. `PrefetchResult` - 88 edges
2. `FetchOptions` - 49 edges
3. `createClient()` - 46 edges
4. `getUserFromRequest()` - 40 edges
5. `useAuthenticatedUser()` - 33 edges
6. `BasePrefetcher` - 31 edges
7. `logger` - 28 edges
8. `BaseClient` - 23 edges
9. `supabase` - 20 edges
10. `ClientConfig` - 19 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --indirect_call--> `frame()`  [INFERRED]
  frontend/src/app/page.tsx → scripts/generate-architecture-excalidraw.mjs
- `get_agent()` --calls--> `create_university_assistant()`  [INFERRED]
  backend/app/main.py → backend/ai_agent/agent.py
- `ThreadPage()` --calls--> `useAuthenticatedUser()`  [EXTRACTED]
  frontend/src/app/(authenticated)/chat/[id]/page.tsx → frontend/src/contexts/AuthenticatedUserContext.tsx
- `ChatListPage()` --calls--> `useAuthenticatedUser()`  [EXTRACTED]
  frontend/src/app/(authenticated)/chat/page.tsx → frontend/src/contexts/AuthenticatedUserContext.tsx
- `Dashboard()` --calls--> `useAuthenticatedUser()`  [EXTRACTED]
  frontend/src/app/(authenticated)/dashboard/page.tsx → frontend/src/contexts/AuthenticatedUserContext.tsx

## Import Cycles
- None detected.

## Communities (119 total, 17 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.09
Nodes (42): explainMatch(), POST(), PATCH(), POST(), POST(), POST(), POST(), GET() (+34 more)

### Community 1 - "scoring.ts"
Cohesion: 0.07
Nodes (51): getPrefetcher(), bucketDifficulty(), clamp(), DifficultyLabel, docsScoreRepo(), EASY_TOPICS, HARD_TOPICS, LANGUAGE_WEIGHT (+43 more)

### Community 2 - "PrefetchResult"
Cohesion: 0.07
Nodes (15): PrefetchResult, AIGeneratorPrefetcher, CTFtimePrefetcher, GL_TOPICS, HackerRankPrefetcher, HR_TRACKS, OH_QUERIES, OpenHubPrefetcher (+7 more)

### Community 3 - "agent.py"
Cohesion: 0.09
Nodes (38): add_course_to_student(), add_skill_to_student(), create_university_assistant(), find_teammates(), get_available_projects(), get_available_roadmaps(), get_db_cursor(), get_learning_progress() (+30 more)

### Community 4 - "Project Generators"
Cohesion: 0.06
Nodes (31): 1. Install Dependencies, 2. Environment Variables, 3. Kaggle Setup (one-time), Automatic Classification Rules:, **BIT (Business Information Technology)**, **BIT - Business Information Technology**, **CIS (Computer Information Systems)**, **CIS - Computer Information Systems** (+23 more)

### Community 5 - "index.ts"
Cohesion: 0.12
Nodes (20): Availability, availScore(), cosineSimilarity(), SkillMatchExplanation, finalScore(), MatchScore, ScoreBreakdown, Student (+12 more)

### Community 6 - "dependencies"
Cohesion: 0.07
Nodes (29): dependencies, clsx, framer-motion, geist, next, react, react-dom, @sentry/nextjs (+21 more)

### Community 7 - "package.json"
Cohesion: 0.07
Nodes (28): author, description, devDependencies, eslint, typedoc, typescript, @typescript-eslint/eslint-plugin, @typescript-eslint/parser (+20 more)

### Community 8 - "main.py"
Cohesion: 0.11
Nodes (24): AuthenticatedUser, AuthenticatedUser, _get_jwks_client(), PyJWKClient, Supabase JWT verification for FastAPI.  Verifies the `Authorization: Bearer <t, FastAPI dependency — verifies a Supabase-issued JWT.      Returns the authenti, verify_supabase_jwt(), chat() (+16 more)

### Community 9 - "Backend Plan Summary"
Cohesion: 0.07
Nodes (26): 1. `{user_id}` placeholder never interpolated — `system_prompt.py:3`, 2. `get_major_plan` tool references a file that does not exist, 3. Global `_db_connection` breaks under any concurrency, 4. `search_roadmap` blocks the async event loop, 5. `saveSkillRatings` silently ignores the delete error, 6. `profile_completed: false` is set on signup, never updated, 7. Agent cache initialization race condition, Backend Plan Summary (+18 more)

### Community 10 - "Services"
Cohesion: 0.08
Nodes (24): Configuration, Credentials Reference, CTFtime, Error Handling, Features, GitHub, GitLab, HackerRank (+16 more)

### Community 11 - "scripts"
Cohesion: 0.08
Nodes (24): dependencies, axios, cheerio, dotenv, @supabase/supabase-js, unified-api-wrapper, description, devDependencies (+16 more)

### Community 12 - "types.ts"
Cohesion: 0.13
Nodes (13): PrefetcherCtor, REGISTRY, Category, SOURCE_MAP, SOURCE_STRATEGY, Strategy, GL_TOPICS, HR_TRACKS (+5 more)

### Community 13 - "useAuthenticatedUser"
Cohesion: 0.15
Nodes (15): ProfilePage(), CreateProjectPage(), PROJECT_TYPES, ProjectType, EditProjectPage(), PROJECT_TYPES, ProjectType, SettingsPage() (+7 more)

### Community 14 - "CLAUDE.md"
Cohesion: 0.10
Nodes (18): Architecture, Auth Context Rules, Backend (Python FastAPI + LangGraph AI agent, runs on port 8000), Commands, Critical Security Rules, Data generation (`data/generators/`), Data prefetcher (`data/generators/prefetcher-ts/`), Database Migrations (+10 more)

### Community 15 - "apis.ts"
Cohesion: 0.15
Nodes (9): HackTheBoxAPI, HuggingFaceAPI, HackTheBoxCredentials, HFDataset, HFModel, HTBMachine, HTBUserProfile, HuggingFaceCredentials (+1 more)

### Community 16 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution (+11 more)

### Community 17 - ".mcp.json"
Cohesion: 0.13
Nodes (19): GITHUB_PERSONAL_ACCESS_TOKEN, npx, uvx, context7, fetch, filesystem, github, memory (+11 more)

### Community 18 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 19 - "index.ts"
Cohesion: 0.16
Nodes (7): OpenHubAPI, SAPAPI, APIManager, ClientConfig, ManagerCredentials, OpenHubCredentials, SAPCredentials

### Community 20 - "generate-architecture-excalidraw.mjs"
Cohesion: 0.22
Nodes (16): exo2, Home(), rajdhani, russoOne, shareTechMono, arrow(), baseElement(), dataFlowDiagram() (+8 more)

### Community 21 - "profileValidation.ts"
Cohesion: 0.15
Nodes (12): Step1_BasicInfo(), Step1Props, getSpecializations(), MAJOR_CODES, MajorCode, MajorInfo, MAJORS, ProfileCompletionCheck (+4 more)

### Community 22 - "profile.ts"
Cohesion: 0.11
Nodes (16): OPTIONS, Step6Props, AvailabilityType, CompletedCourseStatus, CONFIDENCE_STAR_THRESHOLDS, ExamLevel, ExamQuestion, ExamResult (+8 more)

### Community 23 - "index.test.ts"
Cohesion: 0.18
Nodes (7): RateLimiter, APIError, AuthError, NetworkError, NotFoundError, RateLimitError, mockFetch

### Community 24 - "BasePrefetcher"
Cohesion: 0.13
Nodes (4): BasePrefetcher, AIGeneratorPrefetcher, SEEDS, KagglePrefetcher

### Community 25 - "Skills System Fixes - Complete Summary"
Cohesion: 0.11
Nodes (17): 1. **Removed Skill IDs** (Use Names Instead), 2. **Added Tag Aliases for Matching**, 3. **Created Tag Matching Utilities**, 4. **Updated Database Schema**, 5. **Created Filtering Logic**, 🎯 Core Principle, 📊 Example Flow, 🗂️ File Structure (+9 more)

### Community 26 - "useProgress"
Cohesion: 0.21
Nodes (13): DIFF_COLOR, NodeDetailPanel(), NodeDetailPanelProps, PLATFORM_STYLE, RoadmapNodeComponent, TYPE_STYLE, NODE_TYPES, RoadmapViewer() (+5 more)

### Community 27 - "University of Jordan (JU) - IT Majors Course Catalog"
Cohesion: 0.12
Nodes (16): Business Information Technology (BIT), Overview, Semester 1, Semester 1, Semester 1, Semester 1, Semester 2, Semester 2 (+8 more)

### Community 28 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, lib, module, outDir (+8 more)

### Community 29 - "index.ts"
Cohesion: 0.18
Nodes (13): roadmaps, CourseRow, deriveDifficulty(), normalize(), CourseAffiliation, CourseBook, CourseStatus, Difficulty (+5 more)

### Community 30 - "skillLocks.ts"
Cohesion: 0.19
Nodes (11): canUnlockWithCourses(), getLockedSkills(), getSkillLock(), getUnlockedSkills(), isSkillLocked(), SKILL_LOCKS, SkillLock, calculateMinYear() (+3 more)

### Community 31 - "types.ts"
Cohesion: 0.20
Nodes (7): GitHubAPI, CreateIssueBody, GitHubCredentials, GitHubIssue, GitHubRepo, GitHubUser, ListReposParams

### Community 32 - "supabase.ts"
Cohesion: 0.17
Nodes (7): Message, OtherUser, ThreadPage(), Project, ProjectsPage(), QuestionRow, supabase

### Community 33 - "CourseCatalog.tsx"
Cohesion: 0.21
Nodes (12): CourseCardProps, DIFF_STYLE, STATUS_ICON, CourseCatalog(), CourseCatalogProps, DIFFICULTIES, YEARS, CourseStatus (+4 more)

### Community 34 - "User Metadata Migration Guide"
Cohesion: 0.13
Nodes (14): After Migration, Error: "Failed to fetch users", Error: "Failed to update [email]", Error: "Missing required environment variables", Expected Output, Prerequisites, Problem, Running the Migration (+6 more)

### Community 35 - "Team-Finder System Architecture & Workflow Diagram"
Cohesion: 0.13
Nodes (15): API Manager Initialization, Complete User Journey, Component Communication Map, Course Selection Flow, Data Prefetcher Pipeline, Database Migration Flow, Error Handling Flow, Profile Creation/Update Flow (+7 more)

### Community 36 - "BackgroundCanvas.tsx"
Cohesion: 0.21
Nodes (10): BackgroundCanvas(), themes, config, ThemeToggle(), BackgroundThemeContext, BackgroundThemeContextValue, BackgroundThemeProvider(), BgTheme (+2 more)

### Community 37 - "supabaseClient.ts"
Cohesion: 0.20
Nodes (6): insertProjects(), insertProjectsBatched(), ProjectRecord, envPaths, missing, supabase

### Community 38 - "FetchOptions"
Cohesion: 0.31
Nodes (3): FetchOptions, CTFtimePrefetcher, HuggingFacePrefetcher

### Community 39 - "layout.tsx"
Cohesion: 0.15
Nodes (6): dmSans, inter, metadata, ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState

### Community 40 - "ProfileData"
Cohesion: 0.19
Nodes (11): ControllerDraft, SEMESTERS, Step2Props, YearPhase, YEARS, Step3Props, Step5_SkillExams(), Step5Props (+3 more)

### Community 41 - "🧪 AI Agent Testing Guide"
Cohesion: 0.14
Nodes (14): 🧪 AI Agent Testing Guide, ✅ Automated Tests Completed, Backend Won't Start, Chat Not Responding, 📊 Expected Results, ❌ Failure Indicators:, Frontend Errors, Known Issues: (+6 more)

### Community 42 - "TESTING CHECKLIST"
Cohesion: 0.14
Nodes (13): 0. Pre-flight, 10. Deployment smoke (when ready), 1. Backend health, 2. Auth & university gating, 3. Profile wizard (7 steps), 4. Dashboard & navigation, 5. AI chat (the highest-risk surface), 6. Project browsing & matching (+5 more)

### Community 43 - "Artificial Intelligence (AI)"
Cohesion: 0.15
Nodes (13): Artificial Intelligence (AI), Semester 1, Semester 1, Semester 1, Semester 1, Semester 2, Semester 2, Semester 2 (+5 more)

### Community 44 - "Computer Information Systems (CIS)"
Cohesion: 0.15
Nodes (13): Computer Information Systems (CIS), Semester 1, Semester 1, Semester 1, Semester 1, Semester 2, Semester 2, Semester 2 (+5 more)

### Community 45 - "Computer Science (CS)"
Cohesion: 0.15
Nodes (13): Computer Science (CS), Semester 1, Semester 1, Semester 1, Semester 1, Semester 2, Semester 2, Semester 2 (+5 more)

### Community 46 - "Cybersecurity (CYS)"
Cohesion: 0.15
Nodes (13): Cybersecurity (CYS), Semester 1, Semester 1, Semester 1, Semester 1, Semester 2, Semester 2, Semester 2 (+5 more)

### Community 47 - "Data Science (DS)"
Cohesion: 0.15
Nodes (13): Data Science (DS), Semester 1, Semester 1, Semester 1, Semester 1, Semester 2, Semester 2, Semester 2 (+5 more)

### Community 48 - "useDevTools.ts"
Cohesion: 0.26
Nodes (8): DevDocsExplorer(), DevToolsHub(), TABS, GitHubGuide(), ResourceLink(), devTools, useDevTools(), DevToolEntry

### Community 49 - "generate_pdf.py"
Cohesion: 0.23
Nodes (12): build_pdf(), build_styles(), cover_page(), escape(), make_page_template(), md_inline(), parse_markdown(), Path (+4 more)

### Community 50 - "page.tsx"
Cohesion: 0.20
Nodes (6): Dashboard(), difficultyMap, ProfileStats, Project, ProfileCompletionBanner(), isProfileComplete()

### Community 51 - "Slots"
Cohesion: 0.17
Nodes (11): ai-chat-widget, dashboard-hero, DESIGN LAB, How to use this file, learning-roadmap-node, match-result-card, profile-step3-skill-selector, project-card-grid (+3 more)

### Community 52 - "seed_roadmaps.py"
Cohesion: 0.31
Nodes (10): FetchContentIndex(), FetchRoadmapNodes(), GithubHeaders(), Main(), ParseContentFile(), Fetch roadmap.sh JSON and content files from GitHub, seed into Supabase.  For, Parse a roadmap.sh content markdown file into description and resource list., Download roadmap JSON and return topic and subtopic nodes only. (+2 more)

### Community 53 - "page.tsx"
Cohesion: 0.18
Nodes (8): ApplicationRow, ApplicationStatus, Project, ProjectDetailPage(), ProjectType, TeamMember, Props, TeammateMatch

### Community 54 - "PersonalizedPath.tsx"
Cohesion: 0.25
Nodes (7): GOAL_DESCRIPTIONS, GoalSelector(), GoalSelectorProps, PersonalizedPath(), ProgressBarProps, useRoadmap(), useRoadmaps()

### Community 55 - "ProfileWizardController.tsx"
Cohesion: 0.29
Nodes (10): clearDraft(), intToYear(), loadDraft(), ProfileWizardController(), ProfileWizardControllerProps, saveDraft(), STEP_SEQUENCE, StepNumber (+2 more)

### Community 56 - "STATUS"
Cohesion: 0.18
Nodes (10): How to use this file in a future session, In progress / WIP, Known issues / broken, Legend, Recent change context (from git log), STATUS, TL;DR, Unverified — needs browser testing this session or next (+2 more)

### Community 57 - "GitLabAPI"
Cohesion: 0.22
Nodes (3): GitLabAPI, GitLabCredentials, GitLabProject

### Community 58 - "PowerBIAPI"
Cohesion: 0.22
Nodes (4): PowerBIAPI, PowerBICredentials, PowerBIDataset, PowerBIReport

### Community 60 - "github.ts"
Cohesion: 0.36
Nodes (3): GitHubPrefetcher, MAJOR_TOPICS, sleep()

### Community 61 - "AuthContext.tsx"
Cohesion: 0.29
Nodes (7): LoginPage(), AuthenticatedLayout(), AuthContext, AuthContextType, AuthProvider(), useAuth(), AuthenticatedUserProvider()

### Community 62 - "🚀 Manual Testing Steps"
Cohesion: 0.20
Nodes (10): **Career Guidance:**, **Database Queries:**, 🚀 Manual Testing Steps, **Profile Management:** (if you have a student email), Step 1: Start the Backend Server, Step 2: Verify Backend is Running, Step 3: Check Health Endpoint, Step 4: Start the Frontend (+2 more)

### Community 63 - "Profile Wizard Rebuild — Design & Handoff"
Cohesion: 0.20
Nodes (9): ⚠️ Blockers — data-model conflicts to resolve BEFORE coding, Decisions (2026-05-23, from user), Files NOT yet read (verify next — reads were interrupted), Live wizard — `frontend/src/app/profile/page.tsx` (743 lines, in production), Old multi-step — `frontend/src/components/profile/steps/Step1..7` (orphaned, ~1273 lines), Profile Wizard Rebuild — Design & Handoff, Proposed approach (for review — not yet approved), The two implementations (+1 more)

### Community 64 - "Course Extraction Status"
Cohesion: 0.22
Nodes (8): Approach, ✅ COMPLETE - All 12 Majors Extracted, Course Extraction Status, Hashemite University (HU) - 271 courses, 733 credits, Next Steps, Output Files, Total: 458 courses, 1,282 credits, University of Jordan (JU) - 187 courses, 549 credits

### Community 65 - "KaggleAPI"
Cohesion: 0.25
Nodes (4): KaggleAPI, KaggleCompetition, KaggleCredentials, KaggleDataset

### Community 66 - "PapersWithCodeAPI"
Cohesion: 0.25
Nodes (3): PapersWithCodeAPI, PapersWithCodeCredentials, PWCPaper

### Community 67 - "CourseDetailModal.tsx"
Cohesion: 0.28
Nodes (7): CourseDetailModal(), CourseDetailModalProps, TYPE_LABELS, CONFIG, ResourceLinkProps, CourseResource, ResourceType

### Community 68 - "Team-Finder"
Cohesion: 0.22
Nodes (9): Active Documentation, Core Product Flow, Database ERD, License, Main Features, Project Structure, Security Notes, Team-Finder (+1 more)

### Community 69 - "package.json"
Cohesion: 0.22
Nodes (8): dependencies, dotenv, @supabase/supabase-js, name, scripts, seed, type, version

### Community 70 - "Seed University Projects"
Cohesion: 0.22
Nodes (8): Database Seeding Scripts, Features, Project Status Types, Run, Seed University Projects, Setup, Testing Prefetching, What it does

### Community 71 - "auth.py"
Cohesion: 0.32
Nodes (6): AuthenticatedUser, _get_jwks_client(), PyJWKClient, Supabase JWT verification for FastAPI.  Verifies the `Authorization: Bearer <t, FastAPI dependency — verifies a Supabase-issued JWT.      Returns the authenti, verify_supabase_jwt()

### Community 72 - "CTFtimeAPI"
Cohesion: 0.32
Nodes (3): CTFtimeAPI, CTFEvent, CTFTeam

### Community 73 - "HackerRankAPI"
Cohesion: 0.29
Nodes (3): HackerRankAPI, HackerRankContest, HackerRankCredentials

### Community 74 - "prefetcher-ts"
Cohesion: 0.25
Nodes (7): Build & run (prod), Import into your AI wrapper, prefetcher-ts, Run (dev), Setup, Source map, Strategy per source

### Community 76 - "LeetCodeAPI"
Cohesion: 0.43
Nodes (3): LeetCodeAPI, LeetCodeDailyChallenge, LeetCodeUserProfile

### Community 77 - "TableauAPI"
Cohesion: 0.29
Nodes (3): TableauAPI, TableauCredentials, TableauView

### Community 79 - "page.tsx"
Cohesion: 0.33
Nodes (4): FAQItem, FAQPage(), FAQS, VoteState

### Community 80 - "Step3_SkillSelector.tsx"
Cohesion: 0.33
Nodes (4): deriveUnlocks(), Step3_SkillSelector(), UnlockSets, SkillPillProps

### Community 81 - "migrate_user_metadata.js"
Cohesion: 0.40
Nodes (5): { createClient }, getUniversityFromEmail(), migrateUserMetadata(), path, supabase

### Community 85 - "Step7_Bio.tsx"
Cohesion: 0.47
Nodes (5): deriveInitials(), pickAvatarColor(), Step7_Bio(), Step7Props, AVATAR_COLORS

### Community 86 - "projectFilters.ts"
Cohesion: 0.40
Nodes (3): calculateProjectScore(), ProjectFilterParams, rankProjects()

### Community 88 - "Team-Finder Documentation"
Cohesion: 0.40
Nodes (5): Active Documents, Documentation Scope, ERD, Team-Finder Documentation, Workflow

### Community 89 - "Quick Reference: Function Call Graph"
Cohesion: 0.40
Nodes (5): Authentication Chain, Data Generation Chain, Profile Save Chain, Quick Reference: Function Call Graph, Skill Matching Chain

### Community 90 - "page.tsx"
Cohesion: 0.40
Nodes (3): ChatListPage(), ThreadRow, UserSearchResult

### Community 92 - "Setup"
Cohesion: 0.40
Nodes (5): Backend, Environment, Frontend, Prerequisites, Setup

### Community 93 - "apply_migration.py"
Cohesion: 0.60
Nodes (4): load_env(), main(), Path, One-off migration runner. Reads DATABASE_URL from .env (root) and applies the S

### Community 94 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 95 - "page.tsx"
Cohesion: 0.50
Nodes (3): Answer, Question, QuestionDetailPage()

### Community 99 - "Legend"
Cohesion: 0.67
Nodes (3): Arrow Types, Legend, Node Types

## Knowledge Gaps
- **551 isolated node(s):** `@upstash/context7-mcp`, `@supabase/mcp-server-supabase`, `@modelcontextprotocol/server-github`, `GITHUB_PERSONAL_ACCESS_TOKEN`, `@modelcontextprotocol/server-filesystem` (+546 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PrefetchResult` connect `PrefetchResult` to `scoring.ts`, `FetchOptions`, `openhub.ts`, `types.ts`, `GitLabPrefetcher`, `HackerRankPrefetcher`, `LeetCodePrefetcher`, `GitLabPrefetcher`, `BasePrefetcher`, `github.ts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `logger` connect `createClient` to `supabase.ts`, `useAuthenticatedUser`, `page.tsx`, `page.tsx`, `ProfileWizardController.tsx`, `index.ts`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `supabase` connect `supabase.ts` to `createClient`, `useProgress`, `useAuthenticatedUser`, `page.tsx`, `index.ts`, `page.tsx`, `ProfileWizardController.tsx`, `page.tsx`, `LearningPage.tsx`, `AuthContext.tsx`, `page.tsx`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `@upstash/context7-mcp`, `@supabase/mcp-server-supabase`, `@modelcontextprotocol/server-github` to the rest of the system?**
  _589 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.0937766410912191 - nodes in this community are weakly interconnected._
- **Should `scoring.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06806526806526807 - nodes in this community are weakly interconnected._
- **Should `PrefetchResult` be split into smaller, more focused modules?**
  _Cohesion score 0.07399577167019028 - nodes in this community are weakly interconnected._