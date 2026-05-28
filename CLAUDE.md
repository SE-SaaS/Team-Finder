# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Team-Finder is a university student team-matching platform for students at the University of Jordan (@ju.edu.jo) and Hashemite University (@hu.edu.jo). Students build profiles with skills, completed courses, and availability to find collaborators for projects.

## Commands

### Frontend (Next.js 14, runs on port 3002)
```bash
cd frontend
npm run dev       # Start dev server on http://localhost:3002
npm run build     # Production build
npm run lint      # ESLint
```

### Backend (Python FastAPI + LangGraph AI agent, runs on port 8000)
```bash
cd backend
pip install -r requirements.txt   # Install dependencies
python app/main.py                 # Start API server on http://localhost:8000
```
On Windows, `backend/start_server.bat` does the same.

Endpoints: `GET /` (status), `GET /api/health` (agent + DB readiness), `POST /api/chat` (JWT-auth required).

### Data prefetcher (`data/generators/prefetcher-ts/`)
```bash
npm run fetch:major      # Fetch resources for a single major
npm run fetch:all        # Fetch across all majors
npm run save:all         # Persist results to Supabase
npm run generate:sql     # Emit SQL insert script
```

### Seed scripts
- `backend/scripts/seed_dev_tools.py` — dev-tools catalog
- `backend/scripts/seed_roadmaps.py` — roadmap entries
- `scripts/seed-projects.js` — `projects` table

### Database Migrations
Apply SQL files from `supabase/migrations/` in filename-sorted order via the Supabase dashboard or CLI. Prefixes are unique (`00a/00b … 04a/04b …`); alphabetic sort gives the correct apply order.

### Tests
There is no automated test suite. Manual verification flow lives in `TESTING_GUIDE.md`.

## Architecture

### Three-layer stack

**Frontend** (`frontend/src/`): Next.js App Router with TypeScript and TailwindCSS. Supabase client handles auth and all direct DB reads. API routes in `src/app/api/` handle writes requiring server-side auth.

**Backend** (`backend/`): Python FastAPI server. It hosts a LangGraph agent backed by Claude (`claude-sonnet-4-20250514`) with **14 hand-written `@tool` functions** in `backend/ai_agent/agent.py`, grouped as:
- **Profile (3):** `get_my_profile`, `get_learning_progress`, `mark_learning_item_complete`
- **Read (4):** `search_courses`, `search_skills_catalog`, `get_available_projects`, `find_teammates`
- **Write (4):** `add_course_to_student`, `remove_course_from_student`, `add_skill_to_student`, `remove_skill_from_student`
- **Utility (3):** `get_major_plan`, `search_roadmap`, `get_available_roadmaps`

The agent is a singleton cached in memory; it connects to the Supabase PostgreSQL database via `DATABASE_URL` using a `psycopg2.ThreadedConnectionPool` for tool queries and a separate `psycopg AsyncConnectionPool` for LangGraph's `AsyncPostgresSaver` checkpointer (which persists conversation state **in the same Supabase DB**). Thread IDs are formatted `{user_id}:{uuid}`; `main.py` enforces per-user thread ownership by prefix match before resuming a thread — this is the multi-tenant boundary.

At startup the agent loads hardcoded curricula from `data/raw/majors/majors_plans/plans.py` for 12 major codes (`AI_JU`, `BIT_JU`, `CIS_JU`, `CS_JU`, `CYS_JU`, `DS_JU`, `BIT_HU`, `CIS_HU`, `CS_HU`, `CYS_HU`, `DSAI_HU`, `SWE_HU`). Adding a new major requires updating both `_VALID_MAJOR_CODES` in `agent.py` and `plans.py`.

CORS in `main.py` allows any `*.vercel.app` origin, any `localhost`/`127.0.0.1` port, plus a comma-separated `ALLOWED_ORIGINS` env var.

> Note: `backend/PlanSummary.md` describes an earlier `SQLDatabaseToolkit`-based design that was never built — ignore it; the tool list above is the source of truth.

**Database**: Supabase (PostgreSQL). Row-Level Security is enabled on all tables. Migrations live in `supabase/migrations/`.

### Key frontend modules

- `src/algorithm/` — Client-side team matching engine. `finalScore()` computes a 0–100 match score from cosine skill similarity, normalized rating, and availability score, with a penalty multiplier for low ratings. Weights are in `src/constants/weights.ts`.
- `src/components/profile/steps/` — multi-step profile wizard components (Step1–Step7), retained as the quality reference for the planned best-of-both wizard rework. Draft state is saved to localStorage via `src/components/profile/utils/profileStorage.ts`; final submission writes to Supabase.
- `src/contexts/AuthContext.tsx` — Wraps Supabase auth session; consumed app-wide. Provides `user: User | null`.
- `src/contexts/AuthenticatedUserContext.tsx` — Thin wrapper around `AuthContext` that provides `user: User` (non-null guaranteed). Only valid inside `(authenticated)/` routes — do not use outside that group.
- `src/app/(authenticated)/layout.tsx` — The auth gate. Reads from `AuthContext`, redirects unauthenticated users to `/auth/login`, then wraps children in `AuthenticatedUserProvider`. This is the single redirect point for all protected routes.
- `src/middleware.ts` — Refreshes Supabase sessions on every request. Does NOT redirect unauthenticated users — that is handled by the layout above.
- `src/lib/supabase.ts` / `supabaseServer.ts` — Client vs. server-side Supabase instances.

### Data generation (`data/generators/`)

- `prefetcher-ts/` — TypeScript CLI that seeds external projects from 13+ sources (GitHub, GitLab, Kaggle, HuggingFace, LeetCode, CTFtime, etc.) into Supabase. Each source implements `basePrefetcher.ts`.
- `api-wrapper/` — Typed wrapper for external APIs used by the prefetcher.
- Raw major curriculum PDFs are in `data/raw/majors/`; extracted JSON is in `data/extraction/`.

### Database schema (key tables)

| Table | Purpose |
|---|---|
| `profiles` | User profile; `university` and `email` fields are immutable after creation |
| `courses` | Master course catalog per university/major with `unlocks_skills` array |
| `user_courses` | Courses completed by each user |
| `user_skills` | Skills selected by each user |
| `skills` | Master skill catalog |
| `skill_proficiencies` | Per-user skill levels and ratings (0–100) |
| `assessment_results` | Skill exam scores with retake tracking |
| `projects` | University-created and external projects |
| `project_members` / `project_applications` | Team membership and join requests |
| `learning_progress` | Per-user completion of roadmap nodes and learning courses |

## Environment Variables

Copy `.env.example` to `.env` in the root. The frontend reads from `frontend/.env.local`.

| Variable | Used by |
|---|---|
| `ANTHROPIC_API_KEY` | Backend AI agent |
| `DATABASE_URL` | Backend direct DB connection + LangGraph checkpointer |
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend + backend (required at backend startup) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | Next.js API routes needing elevated access |
| `SUPABASE_JWT_SECRET` | Backend `verify_supabase_jwt` for `/api/chat` Bearer auth |
| `NEXT_PUBLIC_BACKEND_URL` | Frontend AI chat → backend URL (defaults to `http://localhost:8000`) |
| `ALLOWED_ORIGINS` | Extra CORS origins for the backend (comma-separated) |

The backend hard-fails at startup if `NEXT_PUBLIC_SUPABASE_URL`, `DATABASE_URL`, or `ANTHROPIC_API_KEY` is missing.

## Auth Context Rules

Always use the correct context for the location:

| Location | Use | Reason |
|---|---|---|
| Inside `(authenticated)/` pages | `useAuthenticatedUser()` | `user` is `User` — non-null, no loading state needed |
| Inside components rendered only in authenticated pages | `useAuthenticatedUser()` | Same guarantee applies |
| Inside `AuthContext` itself or the layout | `useAuth()` | This is the source; nullable by design |
| Outside `(authenticated)/` (auth pages, public pages) | `useAuth()` | User may not be logged in |

**Do not** add `if (!user) return` guards inside `(authenticated)/` pages — the layout already handles the unauthenticated case before children render.

**Do not** add `useEffect` redirect blocks inside `(authenticated)/` pages — the layout handles redirection. Duplicate redirects cause race conditions.


## Critical Security Rules

1. **University is immutable** — always read `university` from `user.user_metadata`, never from the request body. The Supabase RLS `UPDATE` policy enforces this at the DB level.
2. **All API routes must authenticate** — call `supabase.auth.getUser()` server-side before processing any write.
3. **AI agent write access is limited** — the agent's custom tools only modify `user_courses` and `user_skills`; all other tables are read-only via the SQL toolkit.

### Known auth issues (not yet fixed)

- `AuthContext.signUp()` is an unvalidated backdoor — it bypasses domain restriction and password rules. Do not call it. The active signup path is `POST /api/auth/signup`.
- `auth/callback/route.ts` line 38 falls back to `'University of Jordan'` when `user_metadata.university` is missing — HU users who registered before the metadata backfill will be silently mis-assigned. Fix: use `getUniversityFromEmail(user.email!)` as the fallback.
- `NEXT_PUBLIC_APP_URL` must be set in all environments — if missing, confirmation emails link to `localhost:3002` in production.
- `middleware.ts` logs `user.email` on every request — PII leak in production logs.

## Troubleshooting

- **"Unverified university email"** — Run `backend/migrate_user_metadata.js` to backfill the `university` field into Supabase auth metadata. See `docs/APPLY_MIGRATION.md`.
- **Profile save fails** — Ensure `user.user_metadata.university` is set and all required profile fields pass the DB constraints.
- **Skill matching returns nothing** — Tags must be lowercase and match aliases defined in `src/data/skillLocks.ts`.
