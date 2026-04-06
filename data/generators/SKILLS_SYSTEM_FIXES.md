# Skills System Fixes - Complete Summary

## 🎯 Core Principle
**Projects are for LEARNING, not just applying existing knowledge.**
- Filter by **year** (is it too advanced?)
- Filter by **major** (is it relevant?)
- **DON'T** filter by skills (students should see projects with NEW skills to learn!)

---

## ✅ Fixes Applied

### 1. **Removed Skill IDs** (Use Names Instead)

**Before (Bad):**
```typescript
skills: number[]  // [1, 4, 7, 12] - What does ID 7 mean?
```

**After (Good):**
```typescript
skills: string[]  // ['React', 'Python', 'SQL'] - Self-documenting!
```

**Files Changed:**
- `frontend/src/types/profile.ts` - Changed `skills: number[]` → `skills: string[]`
- `frontend/src/constants/skills.js` - Removed `SKILL_ID_MAP`, `ID_TO_SKILL_MAP`

---

### 2. **Added Tag Aliases for Matching**

**Problem:** APIs return different tag formats
- GitHub: `"reactjs"`, `"react-hooks"`
- Kaggle: `"react.js"`
- HuggingFace: `"react-app"`

**Solution:** Added `aliases` array to each skill

```typescript
{
  skill: 'React',
  aliases: ['reactjs', 'react.js', 'react-app', 'react-framework'],
  requiredYear: 2,
  category: 'Frontend'
}
```

**Coverage:** Added aliases for all 46 skills in `skillLocks.ts`

---

### 3. **Created Tag Matching Utilities**

**File:** `frontend/src/utils/skillMatcher.ts`

```typescript
// Match API tags to skill names
const tags = ['reactjs', 'typescript', 'mongodb'];
const skills = matchTagsToSkills(tags);
// → ['React', 'TypeScript', 'MongoDB']

// Calculate minimum year
const minYear = calculateMinYear(skills);
// → 3 (MongoDB is Year 3)

// Classify difficulty
const difficulty = classifyDifficulty(minYear);
// → 'advanced'
```

---

### 4. **Updated Database Schema**

**Migration:** `supabase/migrations/update_project_filtering.sql`

```sql
-- Projects table columns:
min_year INTEGER              -- Minimum year required (1-4)
suitable_majors TEXT[]        -- ['CS', 'AI', 'DS'] or [] for all
tags TEXT[]                   -- Raw tags from APIs
skills_needed TEXT[]          -- Normalized skill names
difficulty TEXT               -- beginner/intermediate/advanced
```

**User skills:**
```sql
-- user_skills table (already correct):
skill_name TEXT              -- ✅ Uses names, not IDs!
proficiency TEXT             -- beginner/intermediate/advanced
```

---

### 5. **Created Filtering Logic**

**File:** `frontend/src/utils/projectFilters.ts`

**Smart Filtering:**
```typescript
// Show projects where:
✅ project.min_year <= student.year        // Not too advanced
✅ student.major in project.suitable_majors // Relevant
❌ NOT filtered by skills!                  // Can learn new skills!
```

**Smart Ranking:**
```typescript
// Score projects by:
- Year match: +10 (exact), +5 (one below)
- Major match: +20
- Known skills: +2 per skill
- NEW skills: +5 per skill (learning opportunity!)
```

---

## 📊 Example Flow

### Step 1: Fetch Project from GitHub
```typescript
{
  title: "E-commerce Dashboard",
  tags: ["reactjs", "typescript", "mongodb", "docker"],
  language: "TypeScript",
  stars: 1200
}
```

### Step 2: Match Tags to Skills
```typescript
import { matchTagsToSkills, calculateMinYear, classifyDifficulty } from '@/utils/skillMatcher';

const skills = matchTagsToSkills(tags);
// → ['React', 'TypeScript', 'MongoDB', 'Docker']

const minYear = calculateMinYear(skills);
// → 3 (Docker & MongoDB are Year 3)

const difficulty = classifyDifficulty(minYear);
// → 'advanced'
```

### Step 3: Determine Suitable Majors
```typescript
// Based on skills, this suits:
suitable_majors = ['CS', 'SWE', 'DS', 'AI']
// (Not CIS or CYS - they focus on different areas)
```

### Step 4: Store in Database
```sql
INSERT INTO projects (
  title, tags, skills_needed,
  min_year, suitable_majors, difficulty,
  type, source, external_url, status
) VALUES (
  'E-commerce Dashboard',
  ARRAY['reactjs', 'typescript', 'mongodb', 'docker'],
  ARRAY['React', 'TypeScript', 'MongoDB', 'Docker'],
  3,
  ARRAY['CS', 'SWE', 'DS', 'AI'],
  'advanced',
  'external', 'github', 'https://github.com/...', 'open'
);
```

### Step 5: Student Sees Project
```typescript
// Student: Year 3, CS major, knows ['HTML/CSS', 'JavaScript', 'Python']

// ✅ Project shows up because:
- min_year (3) <= student.year (3)  ✅
- 'CS' in suitable_majors           ✅
- status = 'open'                   ✅

// Score: 10 (year match) + 20 (major match) + 20 (4 new skills × 5) = 50
// Ranked high because lots of learning opportunities!
```

---

## 🗂️ File Structure

```
frontend/src/
├── types/
│   └── profile.ts               ✅ Updated: skills: string[]
│                                ✅ Added: aliases to SkillLock
├── constants/
│   └── skills.js                ✅ Removed: ID mappings
│                                ✅ Added: isValidSkill()
├── data/
│   └── skillLocks.ts            ✅ Added: aliases for all 46 skills
└── utils/
    ├── skillMatcher.ts          ✅ NEW: Tag matching & year calculation
    └── projectFilters.ts        ✅ NEW: Filtering & ranking logic

supabase/migrations/
└── update_project_filtering.sql ✅ NEW: Updated schema

data/generators/
└── SKILLS_SYSTEM_FIXES.md       ✅ This file
```

---

## 🚀 Next Steps

1. **Apply Migration:**
   ```bash
   cd supabase
   supabase db reset  # or apply migration manually
   ```

2. **Port to TypeScript Prefetcher:**
   - Copy `skillMatcher.ts` utilities to `data/generators/prefetcher-ts/src/core/`
   - Use in prefetcher to calculate `min_year`, `suitable_majors`, `difficulty`

3. **Add Supabase Integration:**
   - Install `@supabase/supabase-js` in prefetcher
   - Store fetched projects directly in database

4. **Update Frontend Queries:**
   - Use `projectFilters.ts` utilities
   - Implement ranking by recommendation score

---

## 📝 Key Takeaways

✅ **Skill names, not IDs** - Stable, portable, self-documenting  
✅ **Tag aliases** - Match variations from different APIs  
✅ **Filter by year & major** - Show appropriate complexity & relevance  
❌ **Don't filter by skills** - Students are here to LEARN!  
🎯 **Rank by learning opportunity** - More new skills = higher score!
