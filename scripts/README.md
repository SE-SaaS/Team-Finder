# Database Seeding Scripts

## Seed University Projects

This script populates the database with standardized university projects for testing.

### Setup

```bash
cd scripts
npm install
```

### Run

```bash
npm run seed
```

Or directly:
```bash
node seed-projects.js
```

### What it does

- Inserts 16 standardized university projects (8 for JU, 8 for HU)
- Projects have varied difficulty levels (beginner, intermediate, advanced)
- Some projects are **locked** (visible but require criteria to join)
- Some projects are **open** (ready to join immediately)

### Project Status Types

- `open` - Available for students to join
- `locked` - Visible but requires certain conditions (e.g., specific skills, year level, prerequisites)

### Features

Each project includes:
- Title and description
- Difficulty level
- Tech stack (array of technologies)
- Required skills (array of skills)
- Team size
- Deadline
- University (JU or HU)
- Status (open/locked)

### Testing Prefetching

After seeding, you can test the dashboard's prefetching functionality:
1. Navigate to `/dashboard`
2. Switch between University/External/My tabs
3. Projects should load instantly due to prefetching
4. Locked projects appear with a lock icon and disabled join button
