# Complete Function Inventory

> Quick reference guide to all functions in the Team-Finder repository

**Generated**: 2026-04-08  
**Total Functions Documented**: 150+

---

## Statistics

### By Module

| Module | Functions | Components | Utilities |
|--------|-----------|------------|-----------|
| Frontend API Routes | 6 | 0 | 0 |
| Frontend Pages | 5 | 0 | 0 |
| Frontend Components | 0 | 18 | 0 |
| Frontend Contexts | 4 | 2 | 0 |
| Frontend Libraries | 0 | 0 | 25 |
| Frontend Utils | 0 | 0 | 15 |
| Backend | 2 | 0 | 0 |
| API Wrapper | 50+ | 0 | 13 |
| Prefetcher System | 0 | 0 | 30+ |
| **Total** | **67+** | **20** | **83+** |

### By Category

- **API Endpoints**: 6
- **Page Components**: 5
- **UI Components**: 18
- **React Hooks**: 2
- **Context Providers**: 2
- **Database Functions**: 15
- **Validation Functions**: 5
- **Utility Functions**: 40+
- **External API Clients**: 13
- **Data Prefetchers**: 15+
- **Skill Matching**: 8
- **Error Handlers**: 5

---

## Quick Index

### Frontend API Routes
- [Profile API](./FUNCTION_DOCUMENTATION.md#profile-api-frontendsrcappapiprofileroute-ts) - GET/POST profile data
- [Courses API](./FUNCTION_DOCUMENTATION.md#courses-api) - GET courses by university/major
- [Auth Signup API](./FUNCTION_DOCUMENTATION.md#auth-signup-api) - POST user registration
- [Auth Callback](./FUNCTION_DOCUMENTATION.md#auth-callback) - GET OAuth callback

### Frontend Pages
- Landing Page (`app/page.tsx`) - Animated landing with scrollytelling
- Login Page (`app/auth/login/page.tsx`) - Authentication form
- Signup Page (`app/auth/signup/page.tsx`) - Registration with email validation
- Dashboard (`app/dashboard/page.tsx`) - Main dashboard
- Profile Wizard (`app/profile/page.tsx`) - 7-step onboarding

### Frontend Components

#### Profile Wizard Steps (7)
1. **Step1_BasicInfo** - University, Major, Specialization
2. **Step2_YearCourses** - Year, Semester, Courses
3. **Step3_SkillSelector** - Skill selection with unlocks
4. **Step4_RoadmapImport** - Project import (placeholder)
5. **Step5_SkillExams** - Skill assessments
6. **Step6_Availability** - Availability preferences
7. **Step7_Bio** - Bio and avatar

#### Dashboard Components (3)
- **ProfileCompletionBanner** - Incomplete profile notification
- **BackgroundCanvas** - Animated gradient background
- **ThemeToggle** - Background theme switcher

#### UI Components (4)
- **TeamFinderCanvas** - Frame sequence animation
- **Scrollytelling** - Landing page scroll effects
- **AvailabilityCard** - Availability option card
- **SkillPill** - Skill badge with states

#### Misc Components (2)
- **AuthProvider** - Authentication context
- **BackgroundThemeProvider** - Theme context

### Frontend Utilities

#### Profile Management (`lib/profileApi.ts`)
- `saveProfile()` - Save profile via API
- `getProfile()` - Get own profile
- `getPublicProfile()` - Get public profile view
- `saveUserSkills()` - Save skill selections
- `saveUserCourses()` - Save completed courses
- `saveSkillRatings()` - Save skill proficiencies
- `saveExamResult()` - Save assessment result
- `getExamResults()` - Get user's exam results
- `canRetakeExam()` - Check retake eligibility
- `getAllSkills()` - Fetch all skills
- `getAllCourses()` - Fetch all courses

#### Skills Library (`lib/skills.ts`)
- `getSkillCategory()` - Get skill category
- `isValidSkill()` - Validate skill name
- `validateSkills()` - Filter valid skills
- `skillsToVector()` - Convert to binary vector

#### Skill Matching (`utils/skillMatcher.ts`)
- `matchTagToSkill()` - Match single tag to skill
- `matchTagsToSkills()` - Batch tag matching
- `getSkillYear()` - Get skill year requirement
- `calculateMinYear()` - Calculate min year for skills
- `classifyDifficulty()` - Map year to difficulty

#### Project Filtering (`utils/projectFilters.ts`)
- `buildProjectQuery()` - Build filter object
- `calculateProjectScore()` - Score projects for recommendations
- `rankProjects()` - Sort by score
- `isProjectSuitable()` - Check compatibility

#### Validation (`lib/validation/profileValidation.ts`)
- `validateMajor()` - Validate major code
- `validateSpecialization()` - Validate specialization
- `validateYear()` - Validate year
- `validateStep1()` - Step 1 validation

#### Profile Storage (`components/profile/utils/profileStorage.ts`)
- `saveDraft()` - Save to localStorage
- `loadDraft()` - Load from localStorage
- `clearDraft()` - Remove draft
- `hasDraft()` - Check draft exists
- `getNextIncompleteStep()` - Find next step

#### Authentication (`lib/auth/serverAuth.ts`)
- `getUserFromRequest()` - Extract user from cookies

#### Data Files
- `UNIVERSITIES` - University list (25)
- `MAJORS` - Major definitions (8)
- `SKILL_LOCKS` - Skill unlock rules (46+)
- `ALL_SKILLS` - Complete skill list (46)
- `SKILL_CATEGORIES` - Skill categorization

### Backend

#### Migration Script (`backend/migrate_user_metadata.js`)
- `getUniversityFromEmail()` - Extract university code
- `migrateUserMetadata()` - Update user metadata

### Data Generators

#### API Wrapper (13 API clients)
See [DATA_GENERATORS.md](./DATA_GENERATORS.md) for complete documentation:
- GitHubAPI (7 methods)
- KaggleAPI (4 methods)
- HuggingFaceAPI (4 methods)
- LeetCodeAPI (3 methods)
- HackerRankAPI
- HackTheBoxAPI
- CTFtimeAPI
- PapersWithCodeAPI
- GitLabAPI
- OpenHubAPI
- SAPAPI
- TableauAPI
- PowerBIAPI

#### Prefetcher System (15+ prefetchers)
See [DATA_GENERATORS.md](./DATA_GENERATORS.md) for complete documentation:
- MajorPrefetcher (orchestrator)
- BasePrefetcher (abstract base)
- 15+ source-specific prefetchers
- Skill matching system
- Supabase save functions
- SQL generation

---

## Function Call Chains

### User Registration
```
SignupPage.handleSignup()
  → POST /api/auth/signup
    → supabase.auth.signUp()
    → supabase.from('profiles').insert()
  → Redirect to login
```

### User Login
```
LoginPage.handleSubmit()
  → AuthContext.signIn()
    → supabase.auth.signInWithPassword()
    → Update session state
  → Redirect to dashboard
```

### Profile Completion
```
ProfileWizard.handleSubmit()
  → saveProfile(data)
    → POST /api/profile
      → getUserFromRequest()
      → supabase.from('profiles').upsert()
  → saveUserCourses(courseIds)
    → DELETE user_courses
    → INSERT user_courses
  → saveUserSkills(skills)
    → DELETE user_skills
    → INSERT user_skills
  → Redirect to dashboard
```

### Skill Matching from Projects
```
GitHub Import
  → Fetch repos via GitHubAPI.listRepos()
  → Extract tags + languages
  → matchTagsToSkills(tags)
    → For each tag: matchTagToSkill()
      → Check ALIASES
      → Check SKILL_LOCKS
      → Return matched skill or null
    → Deduplicate results
  → Auto-select in SkillSelector
```

### Data Prefetching
```
CLI: ts-node main.ts --major CS
  → main()
    → loadApiKeys()
    → MajorPrefetcher.prefetch('CS')
      → Get sources from SOURCE_MAP['CS']
      → For each source:
        → getPrefetcher(source)
        → prefetcher.fetchAll()
          → fetchProjects()
          → fetchDatasets()
          → fetchResources()
      → Aggregate results
    → summarize(results)
    → Save to JSON or Supabase
```

---

## Database Operations

### Tables Accessed

1. **profiles** - User profiles
   - `GET`: getProfile, getPublicProfile, GET /api/profile
   - `INSERT`: signUp, POST /api/auth/signup
   - `UPDATE`: POST /api/profile (upsert)

2. **user_skills** - User's selected skills
   - `DELETE`: saveUserSkills
   - `INSERT`: saveUserSkills

3. **skill_proficiencies** - Skill ratings
   - `DELETE`: saveSkillRatings
   - `INSERT`: saveSkillRatings

4. **user_courses** - Completed courses
   - `DELETE`: saveUserCourses
   - `INSERT`: saveUserCourses

5. **assessment_results** - Exam results
   - `SELECT`: canRetakeExam, getExamResults
   - `INSERT`: saveExamResult

6. **skills** - Master skill list
   - `SELECT`: getAllSkills, saveSkillRatings

7. **courses** - Master course list
   - `SELECT`: getAllCourses, GET /api/courses/[university]/[major]

8. **projects** - External projects
   - `SELECT`: checkDuplicate, project browsing
   - `INSERT`: saveProjectsToSupabase

---

## External API Endpoints

### GitHub API
- `GET /users/{username}` - User info
- `GET /repos/{owner}/{repo}` - Repo details
- `GET /users/{username}/repos` - List repos
- `GET /search/repositories` - Search repos
- `GET /repos/{owner}/{repo}/issues` - List issues
- `POST /repos/{owner}/{repo}/issues` - Create issue

### Kaggle API
- `GET /datasets/list` - List datasets
- `GET /datasets/view/{owner}/{dataset}` - Dataset details
- `GET /competitions/list` - List competitions
- `GET /kernels/list` - List kernels

### HuggingFace API
- `GET /api/models` - List models
- `GET /api/models/{id}` - Model details
- `GET /api/datasets` - List datasets
- `GET /api/spaces` - List spaces

### LeetCode (GraphQL)
- `query getUserProfile` - User stats
- `query getDailyChallenge` - Today's problem

---

## Error Handling Patterns

### API Routes
```typescript
try {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Process request
  const result = await operation();
  return NextResponse.json(result);
  
} catch (error) {
  console.error('Error:', error);
  return NextResponse.json({ error: error.message }, { status: 500 });
}
```

### External API Calls
```typescript
try {
  await rateLimiter.throttle();
  const response = await executeRequest(method, url, options);
  return response;
} catch (error) {
  if (isRetryable(error.status) && retries < maxRetries) {
    await delay(exponentialBackoff(retries));
    return retry();
  }
  throw new APIError(error);
}
```

### React Components
```typescript
try {
  await apiCall();
  setSuccess(true);
} catch (error) {
  setError(error.message);
  console.error(error);
}
```

---

## Performance Optimizations

1. **ISR Caching** - Courses API uses 24h ISR
2. **Parallel Fetching** - Prefetcher uses Promise.allSettled
3. **Rate Limiting** - Token bucket rate limiters per API
4. **Batch Operations** - Batch inserts for skills/courses
5. **Draft Persistence** - localStorage for wizard progress
6. **Lazy Loading** - Next.js code splitting
7. **Optimistic UI** - Form states update immediately

---

## Security Measures

1. **Server-side Auth** - All API routes check getUserFromRequest()
2. **University Verification** - Email domain validation
3. **Metadata Security** - University ALWAYS from metadata, never request body
4. **RLS Policies** - Database-level access control
5. **Public/Private Views** - Separate profile access levels
6. **Cookie-based Sessions** - HTTP-only secure cookies
7. **Input Validation** - Client and server-side validation
8. **SQL Injection Prevention** - Parameterized queries via Supabase
9. **API Key Protection** - Environment variables, never committed

---

## Testing Coverage

### Areas to Test
- [ ] User registration flow
- [ ] Email domain validation
- [ ] Profile wizard (all 7 steps)
- [ ] Skill selection and unlocking
- [ ] Course selection and auto-completion
- [ ] Skill matching from GitHub
- [ ] Project scoring and ranking
- [ ] Draft save/resume
- [ ] API error handling
- [ ] Rate limiting
- [ ] Duplicate checking
- [ ] Authentication persistence

---

## Documentation Files

| File | Purpose | Lines |
|------|---------|-------|
| [README.md](./README.md) | Main documentation index | 380 |
| [FUNCTION_DOCUMENTATION.md](./FUNCTION_DOCUMENTATION.md) | Complete function reference | 700+ |
| [WORKFLOW_DIAGRAM.md](./WORKFLOW_DIAGRAM.md) | Visual diagrams and flows | 580 |
| [DATA_GENERATORS.md](./DATA_GENERATORS.md) | API wrapper & prefetcher docs | 850 |
| [FUNCTION_INVENTORY.md](./FUNCTION_INVENTORY.md) | This file - quick reference | 450 |
| [BUG_FIXES_SKILL_SYSTEM.md](./BUG_FIXES_SKILL_SYSTEM.md) | Historical bug fixes | 200 |
| [SKILLS_UPDATE_README.md](./SKILLS_UPDATE_README.md) | Skill system updates | 120 |
| [APPLY_MIGRATION.md](./APPLY_MIGRATION.md) | Migration instructions | 90 |

**Total Documentation**: ~3,000+ lines

---

*For detailed function documentation, see [FUNCTION_DOCUMENTATION.md](./FUNCTION_DOCUMENTATION.md)*  
*For visual workflows, see [WORKFLOW_DIAGRAM.md](./WORKFLOW_DIAGRAM.md)*  
*For data generator details, see [DATA_GENERATORS.md](./DATA_GENERATORS.md)*
