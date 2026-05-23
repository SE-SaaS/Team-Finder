# STATUS

One-page project snapshot. Update this at the end of every working session.

- **Last updated:** 2026-05-23
- **Maintainer notes:** Read this first. For test details see `TESTING_CHECKLIST.md`. For design variant work see `DESIGN_LAB.md`.

---

## Legend

- `[ ]` = todo / unchecked
- `[x]` = done / verified
- `[WORKING]` — exists in code, behavior matches intent (verified manually or by reading code path)
- `[UNVERIFIED]` — code exists but not manually tested this session
- `[BROKEN]` — known failure with a pointer to the symptom
- `[WIP]` — actively being changed; expect churn
- `[PLANNED]` — not built yet

---

## TL;DR

Team-Finder has a complete code surface (frontend wizard, FastAPI+LangGraph agent, prefetcher pipeline, ~14 migrations) but **no automated tests, no QA log, and a backlog of recent bug-fix commits** (CORS, AI chat, profile auto-create, major-code mismatch). The work needed now is verification and stabilization, not new features.

**Architecture diagram:** [workflow/diagrams/architecture.excalidraw](./diagrams/architecture.excalidraw) ([PNG preview](./diagrams/architecture.png)) — generated 2026-05-23 via the Excalidraw MCP.

---

## Working (verified by code-read, not necessarily by browser)

- [x] `[WORKING]` Frontend dev server on `http://localhost:3002` (`frontend/package.json`)
- [x] `[WORKING]` Backend FastAPI on `http://localhost:8000` with three endpoints (`/`, `/api/health`, `/api/chat`) — `backend/app/main.py`
- [x] `[WORKING]` Profile wizard live at `frontend/src/app/profile/page.tsx` (flat: major / year / courses / skills / availability / specialization). Multi-step `Step1..Step7` components retained under `frontend/src/components/profile/steps/` for the Phase 3 design-lab variant.
- [x] `[WORKING]` 4 Next.js API routes exist: `auth/signup`, `courses/[university]/[major]`, `profile`, `profile/complete`
- [x] `[WORKING]` AI agent loads 14 tools across 4 groups (profile / read / write / utility) — `backend/ai_agent/agent.py:684`
- [x] `[WORKING]` LangGraph checkpointer (`AsyncPostgresSaver`) persists chat state in Supabase; thread IDs prefixed `{user_id}:` with ownership check in `main.py:131`
- [x] `[WORKING]` 12 major codes hardcoded in `backend/majors_plans/plans.py` (6 JU + 6 HU)
- [x] `[WORKING]` Match algorithm: cosine skill similarity + availability + rating + penalty (`frontend/src/algorithm/finalScore.ts`)
- [x] `[WORKING]` Prefetcher: 15 source adapters in `data/generators/prefetcher-ts/src/sources/`
- [x] `[WORKING]` Backend startup hard-fails on missing env vars (`NEXT_PUBLIC_SUPABASE_URL`, `DATABASE_URL`, `ANTHROPIC_API_KEY`)
- [x] `[WORKING]` CORS allows any `*.vercel.app` + localhost + comma-separated `ALLOWED_ORIGINS`

## Unverified — needs browser testing this session or next

- [ ] `[UNVERIFIED]` End-to-end signup with `@ju.edu.jo` and `@hu.edu.jo`
- [ ] `[UNVERIFIED]` Profile wizard happy path Step1 → Step7 → submit
- [ ] `[UNVERIFIED]` Profile draft restore from localStorage (`profileStorage.ts`)
- [ ] `[UNVERIFIED]` AI chat widget on dashboard sends message and receives response
- [ ] `[UNVERIFIED]` Agent can read profile via `get_my_profile` (real user)
- [ ] `[UNVERIFIED]` Agent can write to `user_courses` / `user_skills` / `learning_progress`
- [ ] `[UNVERIFIED]` `find_teammates` returns same-university students only
- [ ] `[UNVERIFIED]` Project browsing renders prefetched + university-created projects
- [ ] `[UNVERIFIED]` Match scoring renders sensible numbers for two real profiles
- [ ] `[UNVERIFIED]` Learning page roadmap completion writes to `learning_progress`

## Known issues / broken

- [ ] `[BROKEN]` No automated test suite exists. `npm run lint` and Python imports are the only safety net.

## In progress / WIP

- [ ] `[WIP]` CLAUDE.md fact-correction edits in this session (kept pending user review of diff)
- [ ] `[WIP]` Workflow doc system (this folder) — first cut
- [ ] `[WIP]` Design exploration via `frontend-design` skill (see `DESIGN_LAB.md`)

## Up next (priority queue)

1. Run the manual checklist in `TESTING_CHECKLIST.md` end-to-end, marking each row.
2. Pick one design slot from `DESIGN_LAB.md` and generate two variants using the `frontend-design` skill.

## Recent change context (from git log)

Recent commits (`b25280c`, `d98e549`, `7ca8aee`, `b8a7550`, `b13a270`, `091adf5`, `1ef7470`, `b69bdbf`, `ed5d1a8`, `e4dab45`, `e546142`) cluster around: AI chat stability, CORS/`ALLOWED_ORIGINS` tuning, profile auto-create, major code mismatches, prefetcher hardening, schema additions for project metadata/difficulty. Read this as: the surface area being touched lately is **agent + auth + profile creation** — those are the most likely places for regression today.

---

## How to use this file in a future session

1. Open this file first.
2. Skim Working / Unverified / Broken sections — that is the current map.
3. Pick from `Up next` or from any unchecked `[UNVERIFIED]` item.
4. While working, move items between sections as their status changes.
5. End the session by updating `Last updated` and the `TL;DR`.
