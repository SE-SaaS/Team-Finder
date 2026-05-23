# Profile Wizard Rebuild — Design & Handoff

**Status:** Design phase (no code written yet). Decision locked: **option (c) — build a new "best of both" `/profile` wizard**, harvesting the good parts of the orphaned multi-step stack into the live route.
**Sequence:** finish this wizard rebuild → THEN Phase 2 (baseline test). Phase 0 (diagram) and Phase 1 (stabilize) are already ✅ done.
**Last updated:** 2026-05-23

---

## Decisions (2026-05-23, from user)

1. **Availability → ENUM** (`Full-time` / `Flexible` / `Evenings` / `Weekends`) — use Step6's `AvailabilityCard`. ⚠️ Ripple to verify FIRST: `profiles.availability` is currently numeric and `finalScore.ts` reads a number — switching to the enum likely needs a column migration + match-score update + dashboard display fix. Not UI-only.
2. **Course identity → `code`.** DB `user_courses` stores `course_code`; live save sends `{code, name}`. Old `Step1..7` use `course.id` — when harvesting, swap every `course.id` reference to `course.code`. Skill unlocks already work without prereqs (each course row has its own `unlocks_skills` array; wizard unions across selected courses). `courses.prerequisite_ids` is empty for all 458 seeded rows today; real prereq seeding is deferred to its own future task and will not require wizard code changes once `code` is the identity (the array values can simply be course codes). **Year is for grouping/display only — drop the auto-select-prior-year behavior from old Step2.** Users manually check each completed course (more honest for transfers / repeated courses).
3. **Bio + avatar → YES.** Name/identity comes from the logged-in session; avatar auto-generated from initials + brand color. ⚠️ Needs `profiles` columns `bio` / `avatar` / `avatar_color` — verify `04a_add_contact_fields.sql`.
4. **Draft → consolidate to ONE.** Keep the working inline `teamfinder_wizard_draft`; salvage `version` + `getNextIncompleteStep` from `profileStorage.ts`; then delete `profileStorage.ts`.
5. **Exams → PLACEHOLDER (option a).** Exam step exists in the wizard as a stub ("Skill verification coming soon — verify later from your profile"). No quiz logic, nothing writes to `assessment_results`. Real exam engine deferred to its own future task (would require a new question bank since `examQuestionsMock.ts.disabled` was deleted in Phase 1). **Roadmap step → DROP from the wizard** — it's a Learning-page feature needing data seeding, not a wizard step.

**All decisions locked.** Ready for file reads → component proposal → incremental implementation.

---

## The two implementations

### Live wizard — `frontend/src/app/profile/page.tsx` (743 lines, in production)
Already a *stepped* wizard, not flat. Worth keeping:
- Chain stepper UI + `isStepReachable()` first-time gating (can't skip ahead until required prior steps valid).
- `isStepValid` / `isStepDone` per step; progress counter.
- Inline draft autosave to `localStorage` key `teamfinder_wizard_draft`, overlaid on DB load.
- Saves via `POST /api/profile/complete` (server-side validation).
- 6 steps: `major · year · courses · skills · availability · specialization`.

Weak spots (what it dropped vs the old stack):
- Skills step is a **flat `ALL_SKILLS` pill list — NO locks**.
- Courses step is a flat list — no auto-select / prereq UX.
- No Basic Info (name), no Bio/avatar.
- `availability` = **number (5–40 slider)**.
- Courses tracked by **`course.code`**, saved as `{code, name}`.

### Old multi-step — `frontend/src/components/profile/steps/Step1..7` (orphaned, ~1273 lines)
The quality source. Per-step validation + error display, modular components. The good code to harvest:
- **Step3_SkillSelector** — the skill-lock system: `@/data/skillLocks` (`SKILL_LOCKS`) + `@/lib/SkillPill` (`isLocked`/`lockReason`/`isVerified`). Skills unlock from completed courses' `unlocks_skills`; year-1 gets C++ free; "X locked • Y unlocked" counter; min-3-skills (year-1 = 0).
- **Step2_YearCourses** — the prereq/flow UX: auto-select all prior-year courses, "failed a course? uncheck it" affordance, "Clear All Previous" escape hatch, grouped by year/semester, fetches `/api/courses/[uni]/[major]`.
- **Step1_BasicInfo** — university read-only from `session.user_metadata`, major + specialization with `validateStep1`.
- **Step6_Availability** — categorical enum via `AvailabilityCard`.
- **Step7_Bio** — bio (500 char) + initials avatar + summary.
- Step4 (Roadmap) & Step5 (Exams) are **placeholders only** (auto-skip / "coming soon"). Defer.
- Uses `@/types/profile` `ProfileData` + `profileStorage.ts` (key `teamfinder_profile_draft`, versioned, `getNextIncompleteStep`).
- Components expect a parent controller via props `{data, onChange, onNext, onBack, onSubmit}` — **that controller no longer exists** (steps are standalone).

---

## ⚠️ Blockers — data-model conflicts to resolve BEFORE coding

These are real integration forks. Each needs a decision (and a couple need files I hadn't finished reading — see below).

1. **`availability`: number (5–40) vs enum (`Full-time`/`Flexible`/`Evenings`/`Weekends`).**
   Live wizard + DB save use a number; old Step6 uses the enum. **Decision needed**, and it depends on the `profiles.availability` column type and how `frontend/src/algorithm/finalScore.ts` consumes it. *Likely keep numeric* (already wired to DB + match score) — confirm.
2. **Course identity: `code` (live/save) vs `id` (old steps).**
   `skillLocks.ts` `unlockableByCourses` uses course IDs, but Step3 actually unlocks off the DB `course.unlocks_skills` field. Pick one identity end-to-end.
3. **Extra fields:** old model has `name / bio / avatar / avatarColor / examResults / roadmapVerified`; live save sends none. Adding Bio/avatar needs `profiles` columns to exist (check `04a_add_contact_fields.sql`).
4. **Two draft systems** → consolidate to ONE (`teamfinder_wizard_draft` inline vs unused `profileStorage.ts`).
5. **Skill catalog mismatch:** live maps `ALL_SKILLS`; Step3 maps `SKILL_LOCKS`. Confirm they cover the same set (note: `frontend/src/lib/skills.ts` is currently modified in the working tree).

## Files NOT yet read (verify next — reads were interrupted)
- `frontend/src/app/api/profile/complete/route.ts` ← **the save contract; most important**
- `frontend/src/app/api/profile/route.ts`
- `frontend/src/lib/SkillPill.tsx`, `frontend/src/components/profile/ui/AvailabilityCard.tsx`
- `supabase/migrations/01_create_all_tables.sql` + `04a_add_contact_fields.sql` → `profiles` column types
- `frontend/src/algorithm/finalScore.ts` → how `availability` factors into match score

---

## Proposed approach (for review — not yet approved)
Keep the **live wizard shell** as the skeleton (stepper + `isStepReachable` gating + inline draft + `/api/profile/complete` save), then transplant the good organs:
- Skills step → adopt `SKILL_LOCKS` + `SkillPill` locked/unlocked system from Step3.
- Courses step → adopt Step2's auto-select-prior-year + "failed? uncheck" + Clear-All flow.
- Resolve the 5 blockers above (esp. availability + course identity) against the save contract.
- Consolidate to one draft system.
- Defer Roadmap/Exams (keep as "coming soon" or omit).
- Optional: add Bio step only if `profiles` has the columns.
- Build incrementally; `/dashboard` + matching must keep working; verify each step; keep `Step1..7` until the rebuild is proven.

## Where we are / next action
1. Read the 6 unread files above and lock the 5 decisions.
2. Produce the final component structure + save-contract mapping.
3. Implement incrementally behind the existing route, verify, then retire `Step1..7`.
