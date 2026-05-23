# TESTING CHECKLIST

Manual QA checklist by feature area. Tick items as you verify them. Each section ends with a `Last run` date and the tester's note.

Mark a row with one of:

- `[x] PASS` — works as expected
- `[x] FAIL` — broken; add a one-line note below the row pointing to the symptom
- `[~] PARTIAL` — works partially; note what's missing
- `[ ]` — not yet tested this round

When all sections in this file have been run once, copy the date to `STATUS.md` → `Last updated` and reset all rows to `[ ]` for the next round.

---

## 0. Pre-flight

- [ ] `.env` at repo root contains: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_BACKEND_URL`, `ALLOWED_ORIGINS`
- [ ] `frontend/.env.local` exists with the public Supabase values
- [ ] Backend imports cleanly: `cd backend && python -c "from ai_agent.agent import create_university_assistant"`
- [ ] Frontend lint passes: `cd frontend && npm run lint`
- [ ] Frontend type-check enumerated: `cd frontend && npx tsc --noEmit` — record warning count in `STATUS.md`

---

## 1. Backend health

Start: `cd backend && python app/main.py`

- [ ] `GET http://localhost:8000/` returns `status: online`
- [ ] `GET http://localhost:8000/api/health` returns `agent: initialized, database: connected`
- [ ] `POST /api/chat` without `Authorization` header returns 401
- [ ] `POST /api/chat` with a valid Bearer token returns a streamed response

Last run: ___ — Notes: ___

---

## 2. Auth & university gating

- [ ] Signup with `@gmail.com` is rejected
- [ ] Signup with `@ju.edu.jo` is accepted and triggers verification email
- [ ] Signup with `@hu.edu.jo` is accepted and triggers verification email
- [ ] After verification, `user.user_metadata.university` is set correctly (JU or HU)
- [ ] Profile API rejects request body that tries to override `university`
- [ ] Older accounts missing the `university` metadata can be backfilled via `backend/migrate_user_metadata.js`

Last run: ___ — Notes: ___

---

## 3. Profile wizard (7 steps)

- [ ] Step 1 (Basic Info): name, year, major selectable
- [ ] Step 2 (Year + Courses): course catalog loads for the chosen major
- [ ] Step 3 (Skill selector): manual add + unlocks-from-courses both work; tags are lowercase per `skillLocks.ts`
- [ ] Step 4 (Roadmap import): pulling a roadmap populates skills
- [ ] Step 5 (Skill exams): currently inert — `examQuestionsMock.ts` disabled; decide build vs remove
- [ ] Step 6 (Availability): availability value maps to score in `availScore.ts`
- [ ] Step 7 (Bio): submit writes a `profiles` row and clears localStorage draft
- [ ] Mid-flow refresh restores draft from localStorage
- [ ] Submit failure (e.g., bad input) surfaces a readable error, no silent failure

Last run: ___ — Notes: ___

---

## 4. Dashboard & navigation

- [ ] `/dashboard` requires login (otherwise redirects or shows gate)
- [ ] Sidebar/nav links to `/profile`, `/learning`, `/projects`, `/settings` all resolve
- [ ] AI chat button visible bottom-right
- [ ] Logout clears session

Last run: ___ — Notes: ___

---

## 5. AI chat (the highest-risk surface)

- [ ] Chat widget opens on dashboard
- [ ] First message returns a response (proves backend reachable + JWT flow)
- [ ] Conversation persists across page reload (checkpointer working)
- [ ] Asking "show me my profile" triggers `get_my_profile` and returns real data
- [ ] Asking "add Python to my skills" writes a `user_skills` row
- [ ] Asking "remove Python" deletes the row
- [ ] Asking "add CS101 to my courses" writes a `user_courses` row (only if `CS101` exists in `courses`)
- [ ] Asking "mark <node_id> complete" writes a `learning_progress` row
- [ ] Asking "find me teammates with Python" returns only same-university users, no emails
- [ ] Trying to resume another user's thread (manually crafting `thread_id`) returns 403
- [ ] Unknown major code in `get_major_plan` returns the listed-valid-codes error message

Last run: ___ — Notes: ___

---

## 6. Project browsing & matching

- [ ] `/projects` lists prefetched external + university-created projects
- [ ] Filtering by skill narrows results
- [ ] Project detail page renders description, tech stack, skills needed, difficulty
- [ ] Authenticated user can create an external project (per commit `dd8b007`)
- [ ] `finalScore()` returns 0–100 for a synthetic profile pair; low-rating penalty applies

Last run: ___ — Notes: ___

---

## 7. Learning page

- [ ] University courses tab loads for current major
- [ ] Dev tools tab populated (`backend/scripts/seed_dev_tools.py` was run)
- [ ] Roadmaps tab populated (`backend/scripts/seed_roadmaps.py` was run)
- [ ] Marking a roadmap node complete persists across refresh
- [ ] Marking a course complete persists across refresh

Last run: ___ — Notes: ___

---

## 8. Prefetcher pipeline (only if seeding/refreshing data)

- [ ] `npm run fetch:major` runs for one major without errors
- [ ] `npm run save:all` writes rows to Supabase (check `projects` table count diff)
- [ ] `npm run generate:sql` emits a parseable `.sql` file
- [ ] All 15 source files in `src/sources/` either return results or fail gracefully

Last run: ___ — Notes: ___

---

## 9. Database migrations (fresh DB scenario)

- [ ] Applying `supabase/migrations/*.sql` in alphabetic order completes without error
- [ ] All tables listed in `CLAUDE.md` schema section exist after migration
- [ ] Row-Level Security policies are active (`SELECT relrowsecurity FROM pg_class WHERE relname IN (...)`)

Last run: ___ — Notes: ___

---

## 10. Deployment smoke (when ready)

- [ ] Vercel preview build succeeds for frontend
- [ ] Backend deploys (Railway / Nixpacks via `backend/nixpacks.toml`)
- [ ] Production `ALLOWED_ORIGINS` includes the actual Vercel URL
- [ ] Production `NEXT_PUBLIC_BACKEND_URL` points at the deployed backend
- [ ] `/api/health` returns `healthy` in production

Last run: ___ — Notes: ___

---

## Round summary

After running everything once, fill this in and copy to `STATUS.md`:

- Date: ___
- Tester: ___
- Total `PASS`: ___ / Total `FAIL`: ___ / Total `PARTIAL`: ___
- Top 3 things to fix before next round: 1) ___ 2) ___ 3) ___
