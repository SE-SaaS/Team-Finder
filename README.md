# Team-Finder

A university student team-matching platform for the **University of Jordan** (`@ju.edu.jo`) and **Hashemite University** (`@hu.edu.jo`).

Students build profiles with their completed courses, skills, and availability. The platform computes match scores between profiles so students can find the right collaborators for their projects.

---

## Features

- **University-gated auth** — Only verified university email addresses can register
- **7-step profile wizard** — Courses, skills, GitHub/GitLab import, assessments, availability, bio
- **AI-powered chat assistant** — LangGraph agent backed by Claude helps students explore profiles and update their data
- **Client-side match scoring** — Cosine skill similarity + availability + rating, computed in the browser
- **Skill assessments** — Students can verify proficiency levels through in-app exams
- **Learning section** — Skill roadmaps and curated resources
- **External project seeding** — Data pipeline pulls projects from GitHub, Kaggle, HuggingFace, CTFtime, and 10+ more sources

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS |
| Backend | Python FastAPI + LangGraph AI agent |
| AI model | Claude (`claude-sonnet-4-20250514`) via Anthropic SDK |
| Database | PostgreSQL via Supabase (RLS on all tables) |
| Auth | Supabase Auth |
| Data pipeline | TypeScript CLI seeding from 13+ external APIs |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- A [Supabase](https://supabase.com) project
- An [Anthropic API key](https://console.anthropic.com)

### 1. Clone and configure environment

```bash
git clone <repo-url>
cd Team-Finder
cp .env.example .env
```

Fill in `.env`:

```env
ANTHROPIC_API_KEY=...
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Copy the frontend variables:

```bash
cp .env .env.local   # then move to frontend/.env.local
```

### 2. Apply database migrations

Run the SQL files in `supabase/migrations/` in numeric order via the Supabase dashboard or CLI:

```
00_drop_all_tables.sql   (only if starting fresh)
01_create_all_tables.sql
02_seed_courses.sql
03_seed_skills.sql
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev          # http://localhost:3002
```

### 4. Start the backend

```bash
cd backend
pip install -r requirements.txt
python app/main.py   # http://localhost:8000
```

On Windows you can also run `backend/start_server.bat`.

---

## Project Structure

```
Team-Finder/
├── frontend/          # Next.js 14 app (port 3002)
│   └── src/
│       ├── app/           # Pages + API routes
│       ├── algorithm/     # Client-side match scoring
│       ├── components/    # React components (profile wizard, dashboard, …)
│       ├── contexts/      # AuthContext
│       ├── lib/           # Supabase clients, validation helpers
│       └── constants/     # Match algorithm weights
├── backend/           # FastAPI + LangGraph AI agent (port 8000)
│   ├── app/               # Routes, schemas, services
│   └── ai_agent/          # LangGraph agent + system prompt
├── supabase/
│   └── migrations/        # SQL migration files
├── data/
│   └── generators/        # TypeScript CLI for seeding external projects
└── docs/                  # Full documentation
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/BLUEPRINT.md](docs/BLUEPRINT.md) | Full architecture reference — start here for deep dives |
| [docs/FUNCTION_DOCUMENTATION.md](docs/FUNCTION_DOCUMENTATION.md) | Per-function API reference |
| [docs/WORKFLOW_DIAGRAM.md](docs/WORKFLOW_DIAGRAM.md) | Sequence and architecture diagrams |
| [docs/APPLY_MIGRATION.md](docs/APPLY_MIGRATION.md) | Database migration instructions |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | Manual and integration test cases |

---

## Security Rules

1. **University is immutable** — always read from `user.user_metadata.university`, never from the request body.
2. **All API routes require auth** — call `supabase.auth.getUser()` server-side before any write.
3. **AI agent write scope is limited** — the agent can only modify `user_courses` and `user_skills`.

See [docs/BLUEPRINT.md — Security Model](docs/BLUEPRINT.md#7-security-model) for full details.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Unverified university email" | Run `backend/migrate_user_metadata.js` — see [docs/APPLY_MIGRATION.md](docs/APPLY_MIGRATION.md) |
| Profile save fails | Ensure `user.user_metadata.university` is set and all required fields are present |
| Skill matching returns nothing | Tags must be lowercase and match aliases in `src/data/skillLocks.ts` |
| Backend chat 500 error | Check `DATABASE_URL` in `.env` and inspect backend logs |

---

## License

See [LICENSE](LICENSE).
