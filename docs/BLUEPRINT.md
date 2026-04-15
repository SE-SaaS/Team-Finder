# Team-Finder — System Blueprint

> Authoritative architectural reference for the Team-Finder platform.
> Last Updated: 2026-04-15

---

## 1. Product Overview

**Team-Finder** is a university student team-matching platform for the University of Jordan (`@ju.edu.jo`) and Hashemite University (`@hu.edu.jo`). Students build structured profiles listing completed courses, selected skills, and weekly availability so the platform can surface well-matched collaborators for academic or personal projects.

### Core Value Propositions

| Persona | Problem Solved |
|---------|---------------|
| Student looking for teammates | Discovers profiles ranked by real skill overlap, not just tags |
| Student building a profile | Imports GitHub/GitLab projects to auto-detect skills |
| Student wanting to grow | Finds learning resources and takes skill assessments |

---

## 2. Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend framework | Next.js 14 (App Router) | Runs on port 3002 |
| UI styling | TailwindCSS + Framer Motion | |
| Graph/flow UI | XYFlow (React Flow) | |
| Auth and DB client | Supabase SSR (`@supabase/ssr`) | |
| Backend framework | FastAPI + Uvicorn | Python, runs on port 8000 |
| AI orchestration | LangGraph >= 1.0.8 | Singleton agent, cached in memory |
| AI model | Claude `claude-sonnet-4-20250514` | via Anthropic SDK |
| Database | PostgreSQL via Supabase | RLS enabled on all tables |
| Data generators | TypeScript CLI (ts-node) | Seeds from 13+ external APIs |

---

## 3. Repository Layout

```
Team-Finder/
├── frontend/                    # Next.js 14 application
│   ├── src/
│   │   ├── app/                 # App Router pages + API routes
│   │   ├── algorithm/           # Client-side match scoring engine
│   │   ├── components/          # React components
│   │   │   ├── profile/steps/   # 7-step profile wizard (Step1–Step7)
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   ├── learning/        # Learning page components
│   │   │   └── shared/          # Reusable UI components
│   │   ├── constants/           # Weights and config constants
│   │   ├── contexts/            # React contexts (AuthContext)
│   │   ├── data/                # Static data (skillLocks, etc.)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Supabase clients, auth utils, validation
│   │   └── types/               # TypeScript type definitions
│   ├── public/                  # Static assets
│   ├── package.json
│   └── next.config.js
│
├── backend/                     # FastAPI + LangGraph AI agent
│   ├── app/
│   │   ├── main.py              # Server entry — mounts FastAPI + CORS
│   │   ├── api/                 # Route handlers
│   │   ├── core/                # Config / settings
│   │   ├── models/              # DB models
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   └── services/            # Business logic layer
│   ├── ai_agent/
│   │   ├── agent.py             # LangGraph agent definition
│   │   └── system_prompt.py     # Agent instructions
│   ├── requirements.txt
│   └── start_server.bat         # Windows convenience launcher
│
├── supabase/
│   └── migrations/              # SQL files — apply in numeric order
│       ├── 00_drop_all_tables.sql
│       ├── 00_reset_database.sql
│       ├── 01_create_all_tables.sql
│       ├── 02_seed_courses.sql
│       └── 03_seed_skills.sql
│
├── data/
│   ├── generators/
│   │   ├── prefetcher-ts/       # TS CLI — seeds external projects
│   │   │   └── src/
│   │   │       ├── sources/     # One file per source (GitHub, Kaggle, …)
│   │   │       ├── skills/      # Skill inference from project metadata
│   │   │       ├── generateSQL.ts
│   │   │       ├── saveToSupabase.ts
│   │   │       └── main.ts
│   │   └── api-wrapper/         # Typed wrapper for all external APIs
│   ├── raw/majors/              # PDF curricula (UJ + HU)
│   └── extraction/              # Extracted major JSON + metadata
│
├── docs/                        # All project documentation
├── scripts/                     # Utility scripts
├── insert_external_projects.sql # SQL for seeding external projects
├── TESTING_GUIDE.md
├── CLAUDE.md                    # Claude Code assistant instructions
├── LICENSE
└── README.md
```

---

## 4. Architecture Deep Dive

### 4.1 Request Flow

```
Browser
  │
  ├─► Next.js Middleware (src/middleware.ts)
  │     └─ Refreshes Supabase session cookie on every request
  │
  ├─► Next.js Page / Client Component
  │     └─ Direct Supabase JS calls for reads (auth + DB)
  │
  ├─► Next.js API Route (src/app/api/)
  │     └─ Server-side: getUser() → validate → write DB
  │
  └─► FastAPI Backend (port 8000)
        └─ POST /api/chat → LangGraph agent (Claude Sonnet)
              ├─ SQLDatabaseToolkit  →  read-only SQL on all tables
              └─ Custom tools        →  write to user_courses, user_skills only
```

### 4.2 Frontend — Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/auth/login` | Email/password login |
| `/auth/signup` | Registration (university email required) |
| `/auth/reset-password` | Password reset |
| `/dashboard` | Main hub after login |
| `/profile` | 7-step profile builder |
| `/projects` | Browse and create projects |
| `/learning` | Skill learning resources and roadmaps |
| `/legal/privacy` | Privacy policy |
| `/legal/terms` | Terms of service |

### 4.3 Frontend — API Routes

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/signup` | POST | No | Create Supabase user + set metadata |
| `/api/profile` | GET / POST | Yes | Read or upsert user profile |
| `/api/courses/[university]/[major]` | GET | Yes | Fetch course list for wizard |

### 4.4 Match Algorithm (`src/algorithm/`)

```
finalScore(userA, userB)  →  0–100
  ├─ cosineSimilarity(skillVectorA, skillVectorB)
  ├─ normalizedRating(userB.avgRating)
  ├─ availScore(userA.availability, userB.availability)
  └─ penaltyMultiplier  (applied when rating < threshold)
```

All weights live in `src/constants/weights.ts`. Change them there only.

### 4.5 Profile Wizard (`src/components/profile/steps/`)

| Step | Content |
|------|---------|
| Step 1 | University, major, specialization, year |
| Step 2 | Course selection |
| Step 3 | GitHub / GitLab project import — auto-skill detection |
| Step 4 | Skill selection and confirmation |
| Step 5 | Skill assessments |
| Step 6 | Weekly availability |
| Step 7 | Bio, avatar, links |

Draft state is persisted to `localStorage` via `profileStorage.ts`. Final submit writes atomically to Supabase (profiles, user_skills, user_courses, skill_proficiencies).

### 4.6 Backend — AI Agent

Single conversational endpoint:

```
POST /api/chat
Body: { messages: ChatMessage[], user_id: string }
```

The LangGraph agent is a singleton initialized once at startup with two tool sets:

- **Read tools** — auto-generated from `SQLDatabaseToolkit` (read-only, all tables)
- **Write tools** — custom Python functions scoped to `user_courses` and `user_skills` only

### 4.7 Database Schema

| Table | Key Columns | Notes |
|-------|-------------|-------|
| `profiles` | `id`, `university`, `email`, `major`, `year`, `bio`, `availability` | `university` and `email` immutable after creation |
| `courses` | `id`, `university`, `major`, `name`, `unlocks_skills[]` | Master catalog |
| `user_courses` | `user_id`, `course_id` | Many-to-many |
| `skills` | `id`, `name`, `category` | Master catalog |
| `user_skills` | `user_id`, `skill_id` | Many-to-many |
| `skill_proficiencies` | `user_id`, `skill_id`, `rating` | 0–100 rating per skill |
| `assessment_results` | `user_id`, `skill_id`, `score`, `retake_count` | Exam scores |
| `projects` | `id`, `title`, `source`, `tags`, `skills[]`, `university` | Internal + external |
| `project_members` | `project_id`, `user_id`, `role` | Team membership |
| `project_applications` | `project_id`, `applicant_id`, `status` | Join requests |

RLS is enabled on every table. The `profiles` `UPDATE` policy blocks changes to `university`.

---

## 5. Data Pipeline

### External Project Seeding (`data/generators/prefetcher-ts/`)

The TypeScript CLI seeds the `projects` table from 13+ external sources:

| Source | Type |
|--------|------|
| GitHub | Code repositories |
| GitLab | Code repositories |
| Kaggle | Data science competitions / datasets |
| HuggingFace | ML model and dataset cards |
| LeetCode | Algorithmic problems |
| CTFtime | Cybersecurity competitions |
| + 7 more | Academic, open-source, etc. |

Each source implements `basePrefetcher.ts`. Pipeline flow:

```
main.ts
  └─ for each source:
       ├─ fetch(source)           // API call via api-wrapper
       ├─ inferSkills(metadata)   // tag/language → skill mapping
       ├─ generateSQL(projects)   // build INSERT statements
       └─ saveToSupabase(rows)    // direct PostgreSQL insert
```

### Curriculum Extraction (`data/`)

- Raw PDFs in `data/raw/majors/` contain official course catalogs.
- Extracted JSON in `data/extraction/` is used to seed the `courses` table.

---

## 6. Environment Variables

| Variable | Used By | Required |
|----------|---------|----------|
| `ANTHROPIC_API_KEY` | Backend AI agent | Yes |
| `DATABASE_URL` | Backend direct PostgreSQL connection | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend + backend | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | API routes with elevated write access | Yes |
| `GITHUB_TOKEN` | Data prefetcher | For seeding |
| `KAGGLE_CREDENTIALS` | Data prefetcher | For seeding |
| `HF_TOKEN` | Data prefetcher | For seeding |
| `GITLAB_TOKEN` | Data prefetcher | For seeding |

Copy `.env.example` to `.env` in the root, then copy relevant vars to `frontend/.env.local`.

---

## 7. Security Model

### Rule 1 — University Immutability

```typescript
// CORRECT
const university = user.user_metadata.university;

// NEVER — trusts user-supplied data
const university = req.body.university;
```

Enforced at DB level via RLS `UPDATE` policy on `profiles`.

### Rule 2 — All Writes Require Auth

Every API route must call `supabase.auth.getUser()` server-side before processing any write. Return `401` if no valid session.

### Rule 3 — AI Agent Write Scope

The LangGraph agent's custom write tools are limited to `user_courses` and `user_skills`. All other tables are accessible only via the read-only SQL toolkit.

---

## 8. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Separate Python backend (not full-stack Next.js) | Enables LangGraph / Python AI tooling |
| Supabase RLS for data isolation | Security without custom middleware |
| Client-side match scoring | Pure computation — no PII leaves the browser |
| Draft state in localStorage | Multi-step wizard — prevents data loss on reload |
| University immutability via auth metadata | Prevents post-signup affiliation spoofing |
| LangGraph singleton cached in memory | Eliminates cold-start overhead on every chat request |

---

## 9. Development Workflows

### Adding a New Page

1. Create `frontend/src/app/<route>/page.tsx`
2. Add auth guard if login is required (check `AuthContext`)
3. Register the route in Section 4.2 of this Blueprint

### Adding a New API Route

1. Create `frontend/src/app/api/<route>/route.ts`
2. Call `supabase.auth.getUser()` at the top — return 401 if not authenticated
3. Never read `university` from the request body
4. Document the endpoint in this Blueprint (Section 4.3) and in `FUNCTION_DOCUMENTATION.md`

### Adding a New AI Agent Tool

1. Add the function in `backend/ai_agent/agent.py`
2. Write access is only permitted for `user_courses` and `user_skills`
3. Update `system_prompt.py` to describe the capability
4. Test via `POST /api/chat`

### Applying a Database Migration

1. Create a new SQL file in `supabase/migrations/` with the next numeric prefix
2. Apply via the Supabase dashboard SQL editor or Supabase CLI
3. Update the schema table in Section 4.7 of this Blueprint

---

## 10. Troubleshooting

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| "Unverified university email" | `university` missing from auth metadata | Run `backend/migrate_user_metadata.js`; see `docs/APPLY_MIGRATION.md` |
| Profile save fails | Missing required fields or `university` not in metadata | Verify `user.user_metadata.university` is set |
| Skill matching returns nothing | Tags not normalized or missing from `skillLocks.ts` aliases | Ensure tags are lowercase; check `src/data/skillLocks.ts` |
| Chat endpoint 500 | DB connection or agent init failure | Check `DATABASE_URL` in `.env`; inspect backend logs |

---

## 11. Document Index

| Document | Purpose |
|----------|---------|
| [README.md](../README.md) | Project intro, setup, quick start |
| [BLUEPRINT.md](./BLUEPRINT.md) | This file — full architecture reference |
| [FUNCTION_DOCUMENTATION.md](./FUNCTION_DOCUMENTATION.md) | Per-function API reference |
| [FUNCTION_INVENTORY.md](./FUNCTION_INVENTORY.md) | Flat list of all functions |
| [WORKFLOW_DIAGRAM.md](./WORKFLOW_DIAGRAM.md) | Sequence and architecture diagrams |
| [APPLY_MIGRATION.md](./APPLY_MIGRATION.md) | Database migration guide |
| [BUG_FIXES_SKILL_SYSTEM.md](./BUG_FIXES_SKILL_SYSTEM.md) | Historical skill system fixes |
| [SKILLS_UPDATE_README.md](./SKILLS_UPDATE_README.md) | Skill data update notes |
| [../TESTING_GUIDE.md](../TESTING_GUIDE.md) | Manual and integration test cases |
