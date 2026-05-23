# DESIGN LAB

Tracker for visual design exploration. Each **slot** is a page or component you want alternative looks for. For each slot you list **variants** (v1, v2, ...) generated using the `frontend-design` skill, then mark the pick.

The goal is to keep the data layer and component contracts constant and only vary the visual treatment: typography, color, layout grid, background, spacing, motion. This lets you compare designs side-by-side without rewriting business logic.

---

## How to use this file

1. Pick a slot from the table below (or add a new one).
2. Run the `frontend-design` skill with the slot's brief.
3. Place the generated page under `frontend/src/app/design-lab/<slot>-v<N>/page.tsx`. Route only — never imported by real pages.
4. Add a row in the slot's variant table with date, brief one-liner, and a screenshot path under `workflow/design-lab-shots/<slot>-v<N>.png`.
5. After at least two variants exist, fill in the `Picked` row and reason.
6. When a pick is promoted into the real app, mark `Status: PROMOTED` and remove the `design-lab` route (optional — you can keep variants as reference).

`frontend-design` brief template:

> Generate a `<slot>` page that reuses the existing data shapes from `<source file>`. Match the contract — same props, same data — but explore a distinct visual direction: `<one-line direction>`. Avoid generic AI defaults; aim for a confident, opinionated style.

---

## Slot status

| Slot | Status | Variants | Picked |
|---|---|---|---|
| dashboard-hero | OPEN | 0 | — |
| profile-step3-skill-selector | OPEN | 0 | — |
| project-card-grid | OPEN | 0 | — |
| ai-chat-widget | OPEN | 0 | — |
| learning-roadmap-node | OPEN | 0 | — |
| match-result-card | OPEN | 0 | — |

Status values: `OPEN` (no variants yet) · `IN PROGRESS` (variants exist, no pick) · `PICKED` (variant chosen, not promoted) · `PROMOTED` (variant lives in real app)

---

## Slots

### dashboard-hero

Top of `/dashboard`. Greeting + quick-stat tiles + entry point to AI chat. The current treatment is functional but generic.

Data sources to reuse: `frontend/src/contexts/AuthContext.tsx` for user, any current dashboard component for stat shape.

| Variant | Date | Direction | Screenshot | Notes |
|---|---|---|---|---|
| — | — | — | — | — |

**Picked:** — / **Reason:** —

---

### profile-step3-skill-selector

Heaviest interaction in the wizard. Users tag many skills, drag them, see unlocks. Visually crowded today.

Data sources to reuse: `frontend/src/data/skillLocks.ts`, the existing `Step3_SkillSelector.tsx` props.

| Variant | Date | Direction | Screenshot | Notes |
|---|---|---|---|---|
| — | — | — | — | — |

**Picked:** — / **Reason:** —

---

### project-card-grid

`/projects` listing. Cards currently mostly text + tags.

Data sources to reuse: whatever the current `/projects` page calls; project shape from `projects` table (title, description, difficulty, tech_stack, skills_needed).

| Variant | Date | Direction | Screenshot | Notes |
|---|---|---|---|---|
| — | — | — | — | — |

**Picked:** — / **Reason:** —

---

### ai-chat-widget

The floating chat. Sensitive UI — needs to feel calm, not intrusive, and read like a tool not a toy.

Data sources to reuse: existing chat component message shape.

| Variant | Date | Direction | Screenshot | Notes |
|---|---|---|---|---|
| — | — | — | — | — |

**Picked:** — / **Reason:** —

---

### learning-roadmap-node

A single node in the roadmap view. Needs to clearly show completed/locked/available states.

Data sources to reuse: `learning_progress` table shape, roadmap node ids.

| Variant | Date | Direction | Screenshot | Notes |
|---|---|---|---|---|
| — | — | — | — | — |

**Picked:** — / **Reason:** —

---

### match-result-card

How a teammate suggestion is rendered after the algorithm scores them. Should communicate why the match is good (overlapping skills, availability) without leaking PII (no email).

Data sources to reuse: `frontend/src/algorithm/finalScore.ts`, `find_teammates` agent tool output shape.

| Variant | Date | Direction | Screenshot | Notes |
|---|---|---|---|---|
| — | — | — | — | — |

**Picked:** — / **Reason:** —

---

## Rules

- **Never** import a `design-lab/*` variant from real app code. Variants are reachable only by direct URL.
- **Never** mock data inside variants. Pull from the real data layer — even if read-only — so visual comparisons reflect real content density.
- A variant that requires changing a shared component to render is not a variant. Move it back to the real codebase and reconsider.
- Two variants minimum before declaring a pick. The point is comparison.
