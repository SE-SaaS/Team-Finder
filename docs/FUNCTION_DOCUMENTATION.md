# Team-Finder Function Documentation

> Comprehensive documentation of all functions in the Team-Finder repository
> 
> Generated: 2026-04-08

---

## Table of Contents

1. [Frontend API Routes](#frontend-api-routes)
2. [Authentication & Authorization](#authentication--authorization)
3. [Profile Management](#profile-management)
4. [Skill Management](#skill-management)
5. [Data Generators](#data-generators)
6. [Backend Utilities](#backend-utilities)
7. [UI Components](#ui-components)
8. [Contexts & Providers](#contexts--providers)
9. [Utilities & Helpers](#utilities--helpers)

---

## Frontend API Routes

### Profile API (`frontend/src/app/api/profile/route.ts`)

#### `POST(req: NextRequest): Promise<NextResponse>`
- **Purpose**: Create or update user profile
- **Parameters**: 
  - `req`: NextRequest containing user profile data
- **Returns**: NextResponse with success status or error
- **Security**: 
  - University is ALWAYS taken from `user.user_metadata.university`
  - Request body university field is IGNORED completely
- **Workflow**:
  1. Authenticates user via `getUserFromRequest()`
  2. Validates university from user metadata
  3. Parses request body
  4. Converts year/semester strings to integers
  5. Upserts profile to database
- **Called by**: Frontend profile forms
- **Calls**: 
  - `getUserFromRequest()`
  - `createClient()` (Supabase)

#### `GET(req: NextRequest): Promise<NextResponse>`
- **Purpose**: Get current user's profile
- **Parameters**: 
  - `req`: NextRequest with authentication cookies
- **Returns**: NextResponse with user profile data or error
- **Workflow**:
  1. Authenticates user
  2. Fetches profile from database by user ID
  3. Returns profile data
- **Called by**: Profile page components
- **Calls**: 
  - `getUserFromRequest()`
  - `createClient()` (Supabase)

### Courses API (`frontend/src/app/api/courses/[university]/[major]/route.ts`)

#### `GET(request: NextRequest, { params }): Promise<NextResponse>`
- **Purpose**: ISR-cached endpoint returning courses for university and major
- **Parameters**: 
  - `university`: Route parameter (e.g., 'JU', 'HU')
  - `major`: Route parameter (e.g., 'CS', 'AI')
- **Returns**: Array of courses with year/semester ordering
- **Caching**: 
  - ISR with 24-hour revalidation
  - 7-day stale-while-revalidate
- **Database Query**:
  ```sql
  SELECT * FROM courses 
  WHERE university = ? AND major = ?
  ORDER BY year, semester, name
  ```
- **Called by**: Step2_YearCourses component
- **Export**: Route segment config with ISR settings

### Auth Signup API (`frontend/src/app/api/auth/signup/route.ts`)

#### `POST(req: NextRequest): Promise<NextResponse>`
- **Purpose**: Handle user signup with email/password validation
- **Parameters** (from request body):
  - `email`: User email (must be university domain)
  - `password`: User password
  - `fullName`: User's full name
- **Validation**:
  - University email domain (@ju.edu.jo, @hu.edu.jo)
  - Password requirements: 8-16 chars, uppercase, number, symbol
- **Implementation**:
  1. Validates email domain
  2. Validates password strength
  3. Calls Supabase auth.signUp()
  4. Creates initial profile entry
- **Returns**: `{ success: true }` or error response
- **Called by**: Signup page form
- **Security**: Email domain verification, password complexity

### Auth Callback (`frontend/src/app/auth/callback/route.ts`)

#### `GET(req: NextRequest): Promise<NextResponse>`
- **Purpose**: OAuth callback handler after email verification
- **Implementation**:
  1. Exchanges code for session via `supabase.auth.exchangeCodeForSession()`
  2. Gets user via `supabase.auth.getUser()`
  3. Creates profile entry if doesn't exist
  4. Redirects to dashboard on success
- **Redirects**:
  - Success: `/dashboard`
  - Error: `/auth/login?error=callback_failed`
- **Called by**: Email confirmation link
- **Database Operations**: May insert initial profile record

---

## Authentication & Authorization

### Server Auth (`frontend/src/lib/auth/serverAuth.ts`)

#### `getUserFromRequest(req: NextRequest): Promise<User | null>`
- **Purpose**: Get authenticated user from API route request
- **Parameters**: 
  - `req`: Next.js request object with cookies
- **Returns**: User object or null if not authenticated
- **Implementation**:
  - Creates server-side Supabase client with SSR cookie handling
  - Reads authentication cookies from request
  - Retrieves user session
- **Security**: Cookie-based authentication, read-only in API routes
- **Called by**: All protected API routes
- **Logging**: Logs cookie names and user email for debugging

---

## Profile Management

### Profile API Client (`frontend/src/lib/profileApi.ts`)

#### `saveProfile(_userId: string, data: Partial<ProfileData>): Promise<void>`
- **Purpose**: Save or update user profile via secure API route
- **Parameters**:
  - `_userId`: User ID (not used directly, authentication via cookies)
  - `data`: Partial profile data including major, year, bio, etc.
- **Returns**: Promise (throws on error)
- **Implementation**:
  - Makes POST request to `/api/profile`
  - Includes credentials for authentication
  - Sends profile data (major, specialization, year, semester, availability, bio, avatar, avatarColor)
- **Error Handling**: Throws error with server response message
- **Called by**: Profile wizard steps, profile edit forms

#### `getProfile(userId: string): Promise<ProfileData>`
- **Purpose**: Get own profile (authenticated user viewing their own data)
- **Parameters**:
  - `userId`: User ID
- **Returns**: Promise<ProfileData> with full profile including email
- **Security**: Returns full profile including private fields (email, internal fields)
- **Database Query**: 
  ```sql
  SELECT id, email, university, major, specialization, year, 
         availability, bio, avatar, avatar_color, updated_at
  FROM profiles WHERE id = userId
  ```
- **Called by**: Profile page, profile wizard

#### `getPublicProfile(userId: string): Promise<PublicProfileData>`
- **Purpose**: Get a public profile (browsing another student)
- **Parameters**:
  - `userId`: User ID
- **Returns**: Promise<PublicProfileData> without email or internal fields
- **Security**: NEVER exposes email or internal fields
- **Database Query**:
  ```sql
  SELECT university, major, specialization, year, availability, 
         bio, avatar, avatar_color
  FROM profiles WHERE id = userId
  ```
- **Called by**: User browsing/search features, team matching

#### `saveUserSkills(userId: string, skillNames: string[]): Promise<void>`
- **Purpose**: Save user's selected skills (with race condition fix)
- **Parameters**:
  - `userId`: User ID
  - `skillNames`: Array of skill names
- **Returns**: Promise (throws on error)
- **Implementation**:
  1. Deletes all existing skills for user
  2. Inserts new skills
- **Race Condition Fix**: Sequential delete then insert
- **Database Operations**:
  ```sql
  DELETE FROM user_skills WHERE user_id = userId;
  INSERT INTO user_skills (user_id, skill_name) VALUES ...;
  ```
- **Called by**: Skill selector step in profile wizard

#### `saveSkillRatings(userId: string, ratings: Record<string, SkillRating>): Promise<void>`
- **Purpose**: Save skill ratings/proficiencies
- **Parameters**:
  - `userId`: User ID
  - `ratings`: Object mapping skill names to {level, rating, verified}
- **Returns**: Promise (throws on error)
- **Implementation**:
  1. Deletes existing proficiencies
  2. Looks up skill IDs from skill names
  3. Inserts new proficiencies with skill_id
- **Database Operations**:
  ```sql
  DELETE FROM skill_proficiencies WHERE user_id = userId;
  SELECT id, name FROM skills WHERE name IN (...);
  INSERT INTO skill_proficiencies (user_id, skill_id, level, rating, verified) VALUES ...;
  ```
- **Called by**: Skill exam/assessment steps

#### `saveUserCourses(userId: string, courseIds: string[]): Promise<void>`
- **Purpose**: Save user's completed courses
- **Parameters**:
  - `userId`: User ID
  - `courseIds`: Array of course IDs
- **Returns**: Promise (throws on error)
- **Implementation**:
  1. Deletes existing courses
  2. Fetches course details (code, name) from courses table
  3. Inserts new courses with course_code and course_name
- **Database Operations**:
  ```sql
  DELETE FROM user_courses WHERE user_id = userId;
  SELECT id, code, name FROM courses WHERE id IN (...);
  INSERT INTO user_courses (user_id, course_code, course_name, status) VALUES ...;
  ```
- **Called by**: Year/Courses selection step

#### `saveExamResult(userId: string, skillId: number, originalDifficulty: string, adjustedDifficulty: string, score: number, retakeAllowedAt?: Date): Promise<void>`
- **Purpose**: Save exam/assessment result
- **Parameters**:
  - `userId`: User ID
  - `skillId`: Skill ID
  - `originalDifficulty`: Initial difficulty level
  - `adjustedDifficulty`: Adjusted difficulty based on performance
  - `score`: Exam score
  - `retakeAllowedAt`: Optional date when retake is allowed
- **Returns**: Promise (throws on error)
- **Database Operations**:
  ```sql
  INSERT INTO assessment_results (user_id, skill_id, original_difficulty, 
                                   adjusted_difficulty, score, retake_allowed_at) 
  VALUES (...);
  ```
- **Called by**: Skill exam component after completion

#### `getExamResults(userId: string): Promise<ExamResult[]>`
- **Purpose**: Get exam results for a user
- **Parameters**:
  - `userId`: User ID
- **Returns**: Promise<ExamResult[]> with all assessment results
- **Database Query**:
  ```sql
  SELECT * FROM assessment_results WHERE user_id = userId;
  ```
- **Called by**: Profile review, skill verification display

#### `canRetakeExam(userId: string, skillId: number): Promise<boolean>`
- **Purpose**: Check if user can retake exam
- **Parameters**:
  - `userId`: User ID
  - `skillId`: Skill ID
- **Returns**: Promise<boolean> - true if retake allowed
- **Implementation**:
  - Gets most recent exam result for skill
  - Checks if `retake_allowed_at` date has passed
  - Returns true if no result exists or date has passed
- **Database Query**:
  ```sql
  SELECT retake_allowed_at FROM assessment_results 
  WHERE user_id = userId AND skill_id = skillId 
  ORDER BY taken_at DESC LIMIT 1;
  ```
- **Called by**: Skill exam UI to enable/disable retake button

#### `getAllSkills(): Promise<Skill[]>`
- **Purpose**: Get all skills from database
- **Returns**: Promise<Skill[]> ordered by name
- **Database Query**:
  ```sql
  SELECT * FROM skills ORDER BY name;
  ```
- **Called by**: Skill selector components

#### `getAllCourses(): Promise<Course[]>`
- **Purpose**: Get all courses from database
- **Returns**: Promise<Course[]> ordered by year and name
- **Database Query**:
  ```sql
  SELECT * FROM courses ORDER BY year, name;
  ```
- **Called by**: Course selector components

---

## Skill Management

### Skill Matcher (`frontend/src/utils/skillMatcher.ts`)

#### `matchTagToSkill(tag: string, skillLocks?: SkillLock[]): string | null`
- **Purpose**: Match a single tag to a skill name
- **Parameters**:
  - `tag`: Raw tag from API (e.g., 'reactjs', 'python3')
  - `skillLocks`: Array of skill definitions (defaults to SKILL_LOCKS)
- **Returns**: Skill name if matched, null otherwise
- **Algorithm**:
  1. Normalizes tag to lowercase and trims
  2. Checks exact skill name match
  3. Checks aliases
  4. Returns null if no match
- **Called by**: Project import features, skill detection

#### `matchTagsToSkills(tags: string[]): string[]`
- **Purpose**: Match multiple tags to skill names
- **Parameters**:
  - `tags`: Array of raw tags from API
- **Returns**: Array of matched skill names (duplicates removed)
- **Implementation**:
  - Maps each tag through `matchTagToSkill()`
  - Filters out null results
  - Removes duplicates using Set
- **Called by**: GitHub/GitLab project imports

#### `getSkillYear(skillName: string): number`
- **Purpose**: Get skill year requirement by name
- **Parameters**:
  - `skillName`: Skill name (e.g., 'React')
- **Returns**: Required year (1-4) or 1 if not found
- **Data Source**: SKILL_LOCKS constant
- **Called by**: Project difficulty calculation

#### `calculateMinYear(skills: string[]): number`
- **Purpose**: Calculate minimum year for a project based on its skills
- **Parameters**:
  - `skills`: Array of skill names
- **Returns**: Minimum year required (1-4)
- **Algorithm**: Returns the maximum year requirement among all skills
- **Called by**: Project filtering, difficulty classification

#### `classifyDifficulty(minYear: number): 'beginner' | 'intermediate' | 'advanced'`
- **Purpose**: Classify difficulty based on year requirement
- **Parameters**:
  - `minYear`: Minimum year required (1-4)
- **Returns**: Difficulty level
- **Classification**:
  - Year 1: 'beginner'
  - Year 2: 'intermediate'
  - Year 3+: 'advanced'
- **Called by**: Project cards, filtering UI

---

## Skills Library (`frontend/src/lib/skills.ts`)

#### `ALL_SKILLS: readonly string[]`
- **Purpose**: Constant array of 46 skills across 7 categories
- **Categories**: Frontend, Backend, Database, ML/AI, DevOps, Mobile, Other
- **Used by**: Skill selection components, validation

#### `SKILL_CATEGORIES: Record<string, string>`
- **Purpose**: Map of skill → category
- **Example**: `{ 'React': 'Frontend', 'Python': 'Backend' }`
- **Used by**: Skill categorization in UI

#### `getSkillCategory(skill: string): string`
- **Purpose**: Get category for a skill
- **Parameters**: `skill` - Skill name
- **Returns**: Category name or 'Other' if not found
- **Called by**: Skill display components

#### `SKILL_TO_INDEX: Record<string, number>`
- **Purpose**: Map skill names to vector indices (0-45)
- **Used by**: ML feature encoding, skill vectors

#### `isValidSkill(name: string): boolean`
- **Purpose**: Type guard to check if skill is valid
- **Parameters**: `name` - Skill name to check
- **Returns**: Boolean
- **Called by**: Skill validation functions

#### `validateSkills(skills: string[]): string[]`
- **Purpose**: Filter array to only valid skills
- **Parameters**: `skills` - Array of skill names
- **Returns**: Filtered array of valid skills
- **Called by**: Skill import/matching functions

#### `skillsToVector(skills: string[]): number[]`
- **Purpose**: Convert skill list to binary vector (46 elements)
- **Parameters**: `skills` - Array of skill names
- **Returns**: Binary vector [0,1,0,1,...] where 1 = has skill
- **Usage**: Machine learning features, similarity calculations
- **Called by**: Team matching algorithms (future)

---

## Data Generators

### Prefetcher Main (`data/generators/prefetcher-ts/src/main.ts`)

#### `loadApiKeys(): Record<string, string>`
- **Purpose**: Load API keys from environment variables
- **Returns**: Object mapping service names to API keys
- **Services**: GitHub, Kaggle, HuggingFace, GitLab, HackTheBox, OpenHub, SAP, HackerRank, LeetCode
- **Implementation**: Filters out undefined values
- **Called by**: `main()`

#### `printUsage(): void`
- **Purpose**: Print CLI usage instructions
- **Output**: Help text with command format and available majors
- **Called by**: `main()` when invalid arguments

#### `main(): Promise<void>`
- **Purpose**: Main entry point for prefetcher CLI
- **Functionality**:
  - Parses command line arguments
  - Supports `--major <MAJOR>` or `--all` flags
  - Optional `--limit <N>` and `--output <file.json>`
  - Creates MajorPrefetcher instance
  - Fetches projects for specified major(s)
  - Prints summary statistics
  - Optionally saves results to JSON file
- **Called by**: CLI execution
- **Calls**: 
  - `loadApiKeys()`
  - `printUsage()`
  - `MajorPrefetcher.prefetch()` or `prefetchAll()`
  - `MajorPrefetcher.summarize()`

### API Wrapper (`data/generators/api-wrapper/src/index.ts`)

#### `class APIManager`
- **Purpose**: Single entry point for all external API integrations
- **Properties** (all readonly):
  - `github?: GitHubAPI`
  - `kaggle?: KaggleAPI`
  - `huggingface?: HuggingFaceAPI`
  - `leetcode?: LeetCodeAPI`
  - `hackerrank?: HackerRankAPI`
  - `hackthebox?: HackTheBoxAPI`
  - `ctftime?: CTFtimeAPI`
  - `paperswithcode?: PapersWithCodeAPI`
  - `gitlab?: GitLabAPI`
  - `openhub?: OpenHubAPI`
  - `sap?: SAPAPI`
  - `tableau?: TableauAPI`
  - `powerbi?: PowerBIAPI`

#### `constructor(credentials: ManagerCredentials, config?: ClientConfig)`
- **Purpose**: Instantiate only the services you have credentials for
- **Parameters**:
  - `credentials`: Object with API credentials for each service
  - `config`: Optional shared configuration
- **Implementation**: Conditionally creates API instances based on provided credentials
- **Example**:
  ```typescript
  const api = new APIManager({
    github: { token: "ghp_..." },
    leetcode: {},
    ctftime: {},
  });
  const user = await api.github!.getUser("torvalds");
  ```

---

## Backend Utilities

### User Metadata Migration (`backend/migrate_user_metadata.js`)

#### `getUniversityFromEmail(email: string): string | null`
- **Purpose**: Extract university code from email domain
- **Parameters**:
  - `email`: User's email address
- **Returns**: 'JU', 'HU', or null
- **Domain Mapping**:
  - `@ju.edu.jo` → 'JU'
  - `@hu.edu.jo` → 'HU'
  - Others → null
- **Called by**: `migrateUserMetadata()`

#### `migrateUserMetadata(): Promise<void>`
- **Purpose**: Main migration function to update user metadata with university
- **Functionality**:
  1. Fetches all users from Supabase Auth (admin access)
  2. Processes each user:
     - Skips if university already set
     - Extracts university from email
     - Updates user metadata with university and verification_method
  3. Prints summary statistics
- **Requirements**:
  - `NEXT_PUBLIC_SUPABASE_URL` environment variable
  - `SUPABASE_SERVICE_ROLE_KEY` environment variable (admin access)
- **Called by**: CLI execution (`node backend/migrate_user_metadata.js`)
- **Database Operations**: Uses Supabase Admin API
- **Error Handling**: Tracks updated, skipped, and error counts

---

## UI Components

### Auth Context (`frontend/src/contexts/AuthContext.tsx`)

#### `AuthProvider({ children }: { children: React.ReactNode }): JSX.Element`
- **Purpose**: Provide authentication context to entire application
- **State Management**:
  - `user`: Current User object or null
  - `session`: Current Session object or null
  - `loading`: Boolean indicating auth initialization state
- **Effects**:
  - Gets initial session on mount
  - Subscribes to auth state changes
  - Cleans up subscription on unmount
- **Provides**: AuthContext with user, session, loading, signUp, signIn, signOut
- **Called by**: Root layout component

#### `signUp(email: string, password: string, name: string): Promise<void>`
- **Purpose**: Register new user
- **Parameters**:
  - `email`: User email (must be university domain)
  - `password`: User password
  - `name`: User's full name
- **Implementation**:
  1. Calls Supabase auth.signUp with email, password, name
  2. Creates initial profile entry if successful
- **Profile Creation**: Inserts basic profile with id, username, email, name
- **Called by**: Signup form component
- **Error Handling**: Throws error on failure

#### `signIn(email: string, password: string): Promise<void>`
- **Purpose**: Sign in existing user
- **Parameters**:
  - `email`: User email
  - `password`: User password
- **Implementation**: Calls Supabase auth.signInWithPassword
- **Called by**: Login form component
- **Error Handling**: Throws error on failure

#### `signOut(): Promise<void>`
- **Purpose**: Sign out current user
- **Implementation**: Calls Supabase auth.signOut
- **Called by**: Logout button, navigation menu
- **Error Handling**: Throws error on failure

#### `useAuth(): AuthContextType`
- **Purpose**: Custom hook to access auth context
- **Returns**: AuthContextType with user, session, loading, and auth functions
- **Error Handling**: Throws error if used outside AuthProvider
- **Called by**: All components needing authentication state

---

## Supabase Client

### Browser Client (`frontend/src/lib/supabase.ts`)

#### `supabase: SupabaseClient`
- **Purpose**: Browser-side Supabase client instance
- **Type**: Browser client with SSR support
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anonymous/public API key
- **Created With**: `createBrowserClient()`
- **Used By**: All client-side components and API calls

---

## Utilities & Helpers

### Project Filters (`frontend/src/utils/projectFilters.ts`)

#### `buildProjectQuery(params): QueryFilter`
- **Purpose**: Build filter object for Supabase query
- **Parameters**:
  - `minYear`: Minimum year requirement
  - `majorFilter`: Major code filter
  - `type`: Project type filter
  - `difficulty`: Difficulty level
  - `status`: Project status
- **Returns**: Filter object for Supabase `.match()` or `.filter()` calls
- **Called by**: Project browsing/search features

#### `calculateProjectScore(project, student): number`
- **Purpose**: Score projects for student recommendations
- **Algorithm**:
  - Year match: +10 (exact) or +5 (one below)
  - Major match: +20
  - Skill overlap: +2 per known skill
  - Learning opportunity: +5 per new skill (if not too advanced)
- **Parameters**:
  - `project`: Project object with skills_needed, difficulty, major
  - `student`: Student object with skills, year, major
- **Returns**: Score (higher = better match)
- **Called by**: `rankProjects()`

#### `rankProjects(projects, student): Project[]`
- **Purpose**: Sort projects by calculateProjectScore
- **Parameters**:
  - `projects`: Array of projects
  - `student`: Student profile
- **Returns**: Sorted array (best matches first)
- **Called by**: Dashboard project recommendations

#### `isProjectSuitable(project, student): boolean`
- **Purpose**: Check year/major compatibility
- **Parameters**:
  - `project`: Project with minYear, major
  - `student`: Student with year, major
- **Returns**: Boolean indicating suitability
- **Logic**: 
  - Project minYear <= student year
  - Major matches or project is cross-major
- **Called by**: Project filtering UI

### Profile Validation (`frontend/src/lib/validation/profileValidation.ts`)

#### `validateMajor(majorCode: string): boolean`
- **Purpose**: Check against MAJOR_CODES
- **Parameters**: `majorCode` - Major code to validate
- **Returns**: Boolean indicating if major is valid
- **Called by**: Step1_BasicInfo validation

#### `validateSpecialization(majorCode: string, spec: string): boolean`
- **Purpose**: Validate specialization against major's allowed specializations
- **Parameters**:
  - `majorCode`: Parent major code
  - `spec`: Specialization to validate
- **Returns**: Boolean indicating validity
- **Called by**: Step1_BasicInfo validation

#### `validateYear(year: string): boolean`
- **Purpose**: Check year is in ['1st', '2nd', '3rd', '4th']
- **Parameters**: `year` - Year string to validate
- **Returns**: Boolean
- **Called by**: Step1_BasicInfo, Step2_YearCourses validation

#### `validateStep1(data: Partial<ProfileData>): ValidationErrors`
- **Purpose**: Aggregate validation for step 1
- **Parameters**: `data` - Profile data object
- **Returns**: Object mapping field names to error messages
- **Validates**: major, specialization, year (if specialization required)
- **Called by**: Step1_BasicInfo.validate()

### Profile Storage (`frontend/src/components/profile/utils/profileStorage.ts`)

#### `saveDraft(data: ProfileData, step: number, userId: string): void`
- **Purpose**: Save profile wizard draft to localStorage
- **Parameters**:
  - `data`: Current profile data
  - `step`: Current step number (1-7)
  - `userId`: User ID for scoping
- **Storage Key**: `profile_draft_${userId}`
- **Storage Data**:
  - `version`: Schema version number
  - `lastSaved`: ISO timestamp
  - `step`: Current step
  - `data`: Profile data
- **Called by**: Profile wizard on each step change

#### `loadDraft(userId: string): ProfileDraft | null`
- **Purpose**: Restore draft if valid
- **Parameters**: `userId` - User ID
- **Returns**: Draft object or null if expired/invalid
- **Validation**:
  - Checks expiry (7 days)
  - Checks userId matches
  - Checks version compatibility
- **Called by**: Profile wizard on mount

#### `clearDraft(): void`
- **Purpose**: Remove localStorage entry
- **Implementation**: Removes all `profile_draft_*` entries
- **Called by**: Profile wizard on successful submission or "Start Fresh"

#### `hasDraft(userId: string): boolean`
- **Purpose**: Check if valid draft exists
- **Parameters**: `userId` - User ID
- **Returns**: Boolean
- **Called by**: Profile wizard to show resume modal

#### `getNextIncompleteStep(data: ProfileData): number | null`
- **Purpose**: Find first incomplete step (1-7)
- **Parameters**: `data` - Profile data
- **Returns**: Step number or null if all complete
- **Logic**: Checks required fields for each step
- **Called by**: Draft resume to jump to correct step

---

## Component Hierarchy

### Pages

1. **Landing Page** (`frontend/src/app/page.tsx`)
   - Entry point with scrollytelling
   - Calls: TeamFinderCanvas, Scrollytelling components

2. **Dashboard** (`frontend/src/app/dashboard/page.tsx`)
   - Protected route
   - Calls: ProfileCompletionBanner, BackgroundCanvas

3. **Profile Page** (`frontend/src/app/profile/page.tsx`)
   - Profile wizard with 7 steps
   - Calls: All Step components (Step1_BasicInfo through Step7_Bio)

4. **Login Page** (`frontend/src/app/auth/login/page.tsx`)
   - Authentication form
   - Calls: useAuth hook

5. **Signup Page** (`frontend/src/app/auth/signup/page.tsx`)
   - Registration form
   - Calls: useAuth hook

### Profile Wizard Steps

1. **Step1_BasicInfo** - University, Major, Specialization
2. **Step2_YearCourses** - Year, Semester, Completed Courses
3. **Step3_SkillSelector** - Skill selection
4. **Step4_RoadmapImport** - Import from GitHub/GitLab
5. **Step5_SkillExams** - Skill assessments
6. **Step6_Availability** - Availability preferences
7. **Step7_Bio** - Bio, avatar, final submission

---

## Data Flow Diagrams

### Authentication Flow
```
User Input (Login/Signup)
  ↓
useAuth() hook
  ↓
AuthContext
  ↓
Supabase Auth
  ↓
Session/User State Update
  ↓
UI Re-render
```

### Profile Save Flow
```
Profile Form Submit
  ↓
saveProfile() [profileApi.ts]
  ↓
POST /api/profile
  ↓
getUserFromRequest() [serverAuth.ts]
  ↓
Validate University from Metadata
  ↓
Supabase Database Upsert
  ↓
Success/Error Response
```

### Skill Detection Flow
```
Project Import (GitHub/GitLab)
  ↓
Extract Tags/Languages
  ↓
matchTagsToSkills() [skillMatcher.ts]
  ↓
matchTagToSkill() (for each tag)
  ↓
Check SKILL_LOCKS for matches
  ↓
Return Matched Skills (deduplicated)
  ↓
Auto-select in Skill Selector
```

### Data Prefetcher Flow
```
CLI Command (--major CS --limit 50)
  ↓
main() [prefetcher-ts/main.ts]
  ↓
loadApiKeys()
  ↓
MajorPrefetcher.prefetch(major)
  ↓
APIManager (GitHub, Kaggle, etc.)
  ↓
Fetch Projects from Multiple Sources
  ↓
Aggregate & Categorize Results
  ↓
summarize() - Generate Statistics
  ↓
Save to JSON (optional)
```

---

## External API Integrations

### GitHub API
- Get user information
- Fetch repositories
- Search projects by topic/language

### Kaggle API
- Fetch datasets
- Get competitions

### HuggingFace API
- Fetch ML models
- Get datasets

### LeetCode API
- Get daily challenge
- Fetch problem sets

### GitLab API
- Fetch projects
- Search repositories

### Other APIs
- HackerRank, HackTheBox, CTFtime, PapersWithCode, OpenHub, SAP, Tableau, PowerBI

---

## Database Schema Summary

### Tables Referenced

1. **profiles** - User profile information
   - Fields: id, email, university, major, specialization, year, semester, availability, bio, avatar, avatar_color, updated_at

2. **user_skills** - User's selected skills
   - Fields: user_id, skill_name

3. **skill_proficiencies** - Skill ratings/levels
   - Fields: user_id, skill_id, level, rating, verified

4. **user_courses** - Completed courses
   - Fields: user_id, course_code, course_name, status

5. **assessment_results** - Exam results
   - Fields: user_id, skill_id, original_difficulty, adjusted_difficulty, score, taken_at, retake_allowed_at

6. **skills** - Master skill list
   - Fields: id, name

7. **courses** - Master course list
   - Fields: id, code, name, year

---

## Environment Variables

### Frontend (.env)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key

### Backend (.env)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key (for migrations)

### Data Generators (.env)
- `GITHUB_TOKEN` - GitHub personal access token
- `KAGGLE_CREDENTIALS` - Kaggle API credentials
- `HF_TOKEN` - HuggingFace token
- `GITLAB_TOKEN` - GitLab personal access token
- `HTB_TOKEN` - HackTheBox API token
- `OPENHUB_API_KEY` - OpenHub API key
- `SAP_API_KEY` - SAP API key
- `HACKERRANK_API_KEY` - HackerRank API key
- `LEETCODE_SESSION` - LeetCode session cookie

---

*This documentation is a living document and will be updated as new functions are added or existing ones are modified.*
