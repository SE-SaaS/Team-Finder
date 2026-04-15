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

### Database Migrations
Apply SQL files from `supabase/migrations/` in numeric order via the Supabase dashboard or CLI.

## Architecture

### Three-layer stack

**Frontend** (`frontend/src/`): Next.js App Router with TypeScript and TailwindCSS. Supabase client handles auth and all direct DB reads. API routes in `src/app/api/` handle writes requiring server-side auth.

**Backend** (`backend/`): Python FastAPI server exposing `/api/chat`. It hosts a LangGraph agent backed by Claude (`claude-sonnet-4-20250514`) with two tool sets:
- Auto-generated SQL read tools via `SQLDatabaseToolkit`
- Custom write tools for `user_courses` and `user_skills` tables
The agent is a singleton cached in memory; it connects directly to the Supabase PostgreSQL database via `DATABASE_URL`.

**Database**: Supabase (PostgreSQL). Row-Level Security is enabled on all tables. Migrations live in `supabase/migrations/`.

### Key frontend modules

- `src/algorithm/` — Client-side team matching engine. `finalScore()` computes a 0–100 match score from cosine skill similarity, normalized rating, and availability score, with a penalty multiplier for low ratings. Weights are in `src/constants/weights.ts`.
- `src/components/profile/steps/` — 7-step profile wizard (Step1–Step7). Draft state is saved to localStorage via `src/components/profile/utils/profileStorage.ts`; final submission writes to Supabase.
- `src/contexts/AuthContext.tsx` — Wraps Supabase auth session; consumed app-wide.
- `src/middleware.ts` — Refreshes Supabase sessions on every request. Does not redirect unauthenticated users (route protection is per-page).
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

## Environment Variables

Copy `.env.example` to `.env` in the root. The frontend reads from `frontend/.env.local`.

| Variable | Used by |
|---|---|
| `ANTHROPIC_API_KEY` | Backend AI agent |
| `DATABASE_URL` | Backend direct DB connection |
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend + backend |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | API routes needing elevated access |

## Critical Security Rules

1. **University is immutable** — always read `university` from `user.user_metadata`, never from the request body. The Supabase RLS `UPDATE` policy enforces this at the DB level.
2. **All API routes must authenticate** — call `supabase.auth.getUser()` server-side before processing any write.
3. **AI agent write access is limited** — the agent's custom tools only modify `user_courses` and `user_skills`; all other tables are read-only via the SQL toolkit.

## Troubleshooting

- **"Unverified university email"** — Run `backend/migrate_user_metadata.js` to backfill the `university` field into Supabase auth metadata. See `docs/APPLY_MIGRATION.md`.
- **Profile save fails** — Ensure `user.user_metadata.university` is set and all required profile fields pass the DB constraints.
- **Skill matching returns nothing** — Tags must be lowercase and match aliases defined in `src/data/skillLocks.ts`.
