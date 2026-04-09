# Team-Finder System Architecture & Workflow Diagram

> Visual representation of the complete system pipeline and function interactions

---

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        UI[Next.js UI Components]
    end

    subgraph "Frontend Application"
        Pages[Pages/Routes]
        Components[React Components]
        Contexts[Context Providers]
        Hooks[Custom Hooks]
        ClientAPI[Client API Utilities]
    end

    subgraph "API Layer"
        ProfileAPI[Profile API Route]
        CoursesAPI[Courses API Route]
        SignupAPI[Signup API Route]
        AuthCallback[Auth Callback]
    end

    subgraph "Authentication"
        AuthContext[Auth Context]
        ServerAuth[Server Auth Utils]
        SupabaseAuth[Supabase Auth]
    end

    subgraph "Data Layer"
        SupabaseDB[(Supabase Database)]
        ProfilesTable[Profiles Table]
        SkillsTable[Skills Tables]
        CoursesTable[Courses Tables]
        AssessmentsTable[Assessments Table]
    end

    subgraph "External Data"
        DataGen[Data Generators]
        APIWrapper[API Wrapper]
        ExternalAPIs[External APIs]
    end

    Browser --> UI
    UI --> Pages
    Pages --> Components
    Components --> Contexts
    Components --> Hooks
    Components --> ClientAPI
    
    ClientAPI --> ProfileAPI
    ClientAPI --> CoursesAPI
    ClientAPI --> SignupAPI
    
    ProfileAPI --> ServerAuth
    CoursesAPI --> ServerAuth
    ServerAuth --> SupabaseAuth
    
    AuthContext --> SupabaseAuth
    SupabaseAuth --> SupabaseDB
    
    ProfileAPI --> ProfilesTable
    ProfileAPI --> SkillsTable
    ProfileAPI --> CoursesTable
    ProfileAPI --> AssessmentsTable
    
    DataGen --> APIWrapper
    APIWrapper --> ExternalAPIs
    ExternalAPIs --> SupabaseDB
    
    ProfilesTable --> SupabaseDB
    SkillsTable --> SupabaseDB
    CoursesTable --> SupabaseDB
    AssessmentsTable --> SupabaseDB
```

---

## User Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant LoginPage
    participant AuthContext
    participant SupabaseAuth
    participant Database
    participant Dashboard

    User->>LoginPage: Enter credentials
    LoginPage->>AuthContext: signIn(email, password)
    AuthContext->>SupabaseAuth: auth.signInWithPassword()
    SupabaseAuth->>Database: Verify credentials
    Database-->>SupabaseAuth: User record
    SupabaseAuth-->>AuthContext: Session + User
    AuthContext-->>LoginPage: Success
    LoginPage->>Dashboard: Redirect to dashboard
    Dashboard->>AuthContext: useAuth()
    AuthContext-->>Dashboard: User state
```

---

## User Registration Flow

```mermaid
sequenceDiagram
    participant User
    participant SignupPage
    participant AuthContext
    participant SupabaseAuth
    participant Database

    User->>SignupPage: Enter email, password, name
    SignupPage->>SignupPage: Validate email domain (@ju.edu.jo, @hu.edu.jo)
    SignupPage->>AuthContext: signUp(email, password, name)
    AuthContext->>SupabaseAuth: auth.signUp()
    SupabaseAuth->>Database: Create auth user
    SupabaseAuth-->>AuthContext: User created
    AuthContext->>Database: Insert profile (id, username, email, name)
    Database-->>AuthContext: Profile created
    AuthContext-->>SignupPage: Success
    SignupPage->>User: Show confirmation message
```

---

## Profile Creation/Update Flow

```mermaid
sequenceDiagram
    participant User
    participant ProfileWizard
    participant saveProfile
    participant ProfileAPI
    participant ServerAuth
    participant Database

    User->>ProfileWizard: Complete profile steps
    ProfileWizard->>saveProfile: saveProfile(userId, profileData)
    saveProfile->>ProfileAPI: POST /api/profile (with cookies)
    ProfileAPI->>ServerAuth: getUserFromRequest(req)
    ServerAuth->>ServerAuth: Extract session from cookies
    ServerAuth-->>ProfileAPI: User object
    ProfileAPI->>ProfileAPI: Extract university from user.user_metadata
    ProfileAPI->>ProfileAPI: Validate university exists
    ProfileAPI->>ProfileAPI: Parse & normalize data
    ProfileAPI->>Database: UPSERT INTO profiles
    Database-->>ProfileAPI: Success
    ProfileAPI-->>saveProfile: 200 OK
    saveProfile-->>ProfileWizard: Success
    ProfileWizard->>User: Show success message
```

---

## Skill Selection & Matching Flow

```mermaid
flowchart TD
    Start[User at Skill Selection] --> Manual[Manual Selection]
    Start --> Import[Import from GitHub/GitLab]
    
    Manual --> SelectSkills[Select skills from list]
    SelectSkills --> SaveSkills[saveUserSkills]
    
    Import --> FetchProjects[Fetch user projects]
    FetchProjects --> ExtractTags[Extract tags/languages]
    ExtractTags --> MatchTags[matchTagsToSkills]
    MatchTags --> Loop[For each tag]
    Loop --> MatchTag[matchTagToSkill]
    MatchTag --> CheckExact{Exact match?}
    CheckExact -->|Yes| AddSkill[Add to skill list]
    CheckExact -->|No| CheckAlias{Alias match?}
    CheckAlias -->|Yes| AddSkill
    CheckAlias -->|No| Skip[Skip tag]
    AddSkill --> MoreTags{More tags?}
    Skip --> MoreTags
    MoreTags -->|Yes| Loop
    MoreTags -->|No| Dedupe[Remove duplicates]
    Dedupe --> AutoSelect[Auto-select matched skills]
    AutoSelect --> SaveSkills
    
    SaveSkills --> DeleteExisting[DELETE existing user_skills]
    DeleteExisting --> InsertNew[INSERT new user_skills]
    InsertNew --> Done[Complete]
```

---

## Skill Assessment Flow

```mermaid
sequenceDiagram
    participant User
    participant ExamUI
    participant canRetakeExam
    participant saveExamResult
    participant Database

    User->>ExamUI: View skill exam
    ExamUI->>canRetakeExam: canRetakeExam(userId, skillId)
    canRetakeExam->>Database: SELECT retake_allowed_at
    Database-->>canRetakeExam: Last result or null
    canRetakeExam->>canRetakeExam: Check if retake_allowed_at <= now
    canRetakeExam-->>ExamUI: boolean (can retake)
    
    alt Can take exam
        ExamUI->>User: Show exam questions
        User->>ExamUI: Complete exam
        ExamUI->>ExamUI: Calculate score
        ExamUI->>ExamUI: Adjust difficulty
        ExamUI->>saveExamResult: saveExamResult(params)
        saveExamResult->>Database: INSERT INTO assessment_results
        Database-->>saveExamResult: Success
        saveExamResult-->>ExamUI: Success
        ExamUI->>User: Show results
    else Cannot retake yet
        ExamUI->>User: Show retake cooldown message
    end
```

---

## Course Selection Flow

```mermaid
flowchart LR
    Start[User selects year/semester] --> FetchCourses[getAllCourses]
    FetchCourses --> Database[(Database)]
    Database --> FilterYear[Filter courses by year]
    FilterYear --> Display[Display filtered courses]
    Display --> UserSelect[User selects completed courses]
    UserSelect --> SaveCourses[saveUserCourses]
    SaveCourses --> DeleteOld[DELETE existing user_courses]
    DeleteOld --> FetchDetails[SELECT course details]
    FetchDetails --> Database
    Database --> Insert[INSERT user_courses]
    Insert --> Database
    Database --> Success[Success]
```

---

## Data Prefetcher Pipeline

```mermaid
flowchart TB
    Start[CLI: ts-node main.ts] --> ParseArgs[Parse arguments]
    ParseArgs --> LoadKeys[loadApiKeys]
    LoadKeys --> CheckMode{--all or --major?}
    
    CheckMode -->|--all| PrefetchAll[prefetchAll]
    CheckMode -->|--major| PrefetchOne[prefetch major]
    
    PrefetchAll --> LoopMajors[For each Major]
    LoopMajors --> FetchMajor[Fetch projects for major]
    
    PrefetchOne --> FetchMajor
    
    FetchMajor --> InitAPIs[Initialize API Manager]
    InitAPIs --> APIManager[APIManager constructor]
    APIManager --> CreateClients{Create API clients}
    
    CreateClients --> GitHub[GitHubAPI?]
    CreateClients --> Kaggle[KaggleAPI?]
    CreateClients --> HuggingFace[HuggingFaceAPI?]
    CreateClients --> GitLab[GitLabAPI?]
    CreateClients --> Others[Other APIs...]
    
    GitHub --> FetchGitHub[Fetch GitHub projects]
    Kaggle --> FetchKaggle[Fetch Kaggle datasets]
    HuggingFace --> FetchHF[Fetch HF models]
    GitLab --> FetchGitLab[Fetch GitLab projects]
    Others --> FetchOthers[Fetch from other sources]
    
    FetchGitHub --> Aggregate[Aggregate results]
    FetchKaggle --> Aggregate
    FetchHF --> Aggregate
    FetchGitLab --> Aggregate
    FetchOthers --> Aggregate
    
    Aggregate --> Categorize[Categorize by source & category]
    Categorize --> Summarize[summarize results]
    Summarize --> PrintStats[Print statistics]
    
    PrintStats --> SaveFile{--output specified?}
    SaveFile -->|Yes| WriteJSON[Write to JSON file]
    SaveFile -->|No| End[Complete]
    WriteJSON --> End
```

---

## API Manager Initialization

```mermaid
flowchart TB
    Start[new APIManager credentials, config] --> CheckGitHub{GitHub credentials?}
    CheckGitHub -->|Yes| CreateGitHub[this.github = new GitHubAPI]
    CheckGitHub -->|No| SkipGitHub[Skip]
    
    CreateGitHub --> CheckKaggle{Kaggle credentials?}
    SkipGitHub --> CheckKaggle
    CheckKaggle -->|Yes| CreateKaggle[this.kaggle = new KaggleAPI]
    CheckKaggle -->|No| SkipKaggle[Skip]
    
    CreateKaggle --> CheckHF{HuggingFace credentials?}
    SkipKaggle --> CheckHF
    CheckHF -->|Yes| CreateHF[this.huggingface = new HuggingFaceAPI]
    CheckHF -->|No| SkipHF[Skip]
    
    CreateHF --> CheckLeetCode{LeetCode credentials?}
    SkipHF --> CheckLeetCode
    CheckLeetCode -->|Yes| CreateLeetCode[this.leetcode = new LeetCodeAPI]
    CheckLeetCode -->|No| SkipLeetCode[Skip]
    
    CreateLeetCode --> MoreAPIs[Continue for all APIs...]
    SkipLeetCode --> MoreAPIs
    
    MoreAPIs --> Ready[APIManager Ready]
```

---

## Database Migration Flow

```mermaid
sequenceDiagram
    participant Admin
    participant MigrateScript
    participant SupabaseAdmin
    participant AuthDB
    participant ProfilesDB

    Admin->>MigrateScript: node migrate_user_metadata.js
    MigrateScript->>MigrateScript: Load environment variables
    MigrateScript->>SupabaseAdmin: Create admin client
    MigrateScript->>AuthDB: admin.listUsers()
    AuthDB-->>MigrateScript: Array of users
    
    loop For each user
        MigrateScript->>MigrateScript: Check if university exists in metadata
        alt University exists
            MigrateScript->>MigrateScript: Skip (already migrated)
        else University missing
            MigrateScript->>MigrateScript: getUniversityFromEmail(email)
            alt University email
                MigrateScript->>AuthDB: admin.updateUserById(id, metadata)
                AuthDB-->>MigrateScript: Success
                MigrateScript->>MigrateScript: Increment updated count
            else Not university email
                MigrateScript->>MigrateScript: Skip (increment skipped count)
            end
        end
    end
    
    MigrateScript->>Admin: Print summary (updated, skipped, errors)
```

---

## Complete User Journey

```mermaid
flowchart TB
    Start[User visits site] --> Landing[Landing Page]
    Landing --> SignupBtn[Click Signup]
    SignupBtn --> SignupPage[Signup Form]
    SignupPage --> ValidateEmail{Valid university email?}
    ValidateEmail -->|No| ErrorMsg[Show error message]
    ValidateEmail -->|Yes| CreateAccount[Create account]
    
    CreateAccount --> ConfirmEmail[Email confirmation]
    ConfirmEmail --> Login[Login]
    Login --> Dashboard[Dashboard]
    
    Dashboard --> CheckProfile{Profile complete?}
    CheckProfile -->|No| ShowBanner[Show completion banner]
    ShowBanner --> ProfileWizard[Start Profile Wizard]
    
    ProfileWizard --> Step1[Step 1: Basic Info]
    Step1 --> Step2[Step 2: Year & Courses]
    Step2 --> Step3[Step 3: Skill Selection]
    Step3 --> Step4[Step 4: Import Projects]
    Step4 --> Step5[Step 5: Skill Exams]
    Step5 --> Step6[Step 6: Availability]
    Step6 --> Step7[Step 7: Bio & Avatar]
    Step7 --> SaveAll[Save complete profile]
    
    SaveAll --> VerifyData[Verify all data saved]
    VerifyData --> Dashboard2[Return to Dashboard]
    
    CheckProfile -->|Yes| ShowDashboard[Show main dashboard]
    Dashboard2 --> ShowDashboard
    
    ShowDashboard --> Features[Access features]
    Features --> FindTeams[Find team members]
    Features --> BrowseProjects[Browse projects]
    Features --> UpdateProfile[Update profile]
```

---

## Component Communication Map

```mermaid
graph LR
    subgraph "Layout Layer"
        RootLayout[Root Layout]
    end
    
    subgraph "Context Layer"
        AuthContext[Auth Context Provider]
        ThemeContext[Background Theme Context]
    end
    
    subgraph "Page Components"
        Landing[Landing Page]
        Dashboard[Dashboard Page]
        Profile[Profile Page]
        Login[Login Page]
        Signup[Signup Page]
    end
    
    subgraph "Shared Components"
        Nav[Navigation]
        Banner[Profile Completion Banner]
        Background[Background Canvas]
    end
    
    subgraph "Profile Components"
        Step1[Basic Info Step]
        Step2[Courses Step]
        Step3[Skills Step]
        Step4[Import Step]
        Step5[Exams Step]
        Step6[Availability Step]
        Step7[Bio Step]
    end
    
    RootLayout --> AuthContext
    RootLayout --> ThemeContext
    
    AuthContext --> Landing
    AuthContext --> Dashboard
    AuthContext --> Profile
    AuthContext --> Login
    AuthContext --> Signup
    
    ThemeContext --> Background
    
    Dashboard --> Banner
    Dashboard --> Background
    
    Profile --> Step1
    Profile --> Step2
    Profile --> Step3
    Profile --> Step4
    Profile --> Step5
    Profile --> Step6
    Profile --> Step7
    
    Step1 -.->|uses| AuthContext
    Step2 -.->|uses| AuthContext
    Step3 -.->|uses| AuthContext
```

---

## Security Flow

```mermaid
flowchart TB
    Request[Client Request] --> HasCookies{Has auth cookies?}
    HasCookies -->|No| Unauthorized[401 Unauthorized]
    HasCookies -->|Yes| ExtractCookies[Extract cookies]
    
    ExtractCookies --> CreateClient[Create server Supabase client]
    CreateClient --> GetUser[supabase.auth.getUser]
    GetUser --> UserExists{User exists?}
    
    UserExists -->|No| Unauthorized
    UserExists -->|Yes| CheckMetadata[Check user.user_metadata]
    
    CheckMetadata --> HasUniversity{Has university in metadata?}
    HasUniversity -->|No| Forbidden[403 Forbidden - Unverified]
    HasUniversity -->|Yes| ValidateUniversity[Validate university]
    
    ValidateUniversity --> IsValid{Valid university?}
    IsValid -->|No| Forbidden
    IsValid -->|Yes| ProcessRequest[Process request]
    
    ProcessRequest --> IgnoreBody[IGNORE university from request body]
    IgnoreBody --> UseMetadata[USE university from metadata ONLY]
    UseMetadata --> Execute[Execute database operations]
    Execute --> Success[200 OK]
```

---

## Error Handling Flow

```mermaid
flowchart TB
    Operation[Database/API Operation] --> TryCatch{Try-Catch Block}
    TryCatch -->|Success| ReturnData[Return data]
    TryCatch -->|Error| CatchError[Catch error]
    
    CatchError --> LogError[Log error to console]
    LogError --> CheckType{Error type?}
    
    CheckType -->|Auth Error| Return401[Return 401 Unauthorized]
    CheckType -->|Permission Error| Return403[Return 403 Forbidden]
    CheckType -->|Validation Error| Return400[Return 400 Bad Request]
    CheckType -->|Not Found Error| Return404[Return 404 Not Found]
    CheckType -->|Database Error| Return500[Return 500 Internal Server Error]
    
    Return401 --> ErrorResponse[Error response with message]
    Return403 --> ErrorResponse
    Return400 --> ErrorResponse
    Return404 --> ErrorResponse
    Return500 --> ErrorResponse
    
    ErrorResponse --> Client[Send to client]
    Client --> UIError[Display error in UI]
```

---

## Legend

### Node Types
- **Rectangle**: Process/Function
- **Diamond**: Decision point
- **Cylinder**: Database
- **Parallelogram**: Input/Output
- **Circle**: Start/End
- **Rounded Rectangle**: External system

### Arrow Types
- **Solid arrow**: Direct function call
- **Dotted arrow**: Uses/References
- **Dashed arrow**: Async operation

---

## Quick Reference: Function Call Graph

### Authentication Chain
```
useAuth() → AuthContext → supabase.auth → Supabase Auth Service → Database
```

### Profile Save Chain
```
saveProfile() → POST /api/profile → getUserFromRequest() → createClient() → supabase.from().upsert()
```

### Skill Matching Chain
```
Project Import → matchTagsToSkills() → matchTagToSkill() → SKILL_LOCKS lookup → Matched skills
```

### Data Generation Chain
```
CLI → main() → loadApiKeys() → APIManager → Multiple API clients → External APIs → Aggregated data
```

---

*This workflow diagram provides a visual representation of the complete system architecture. For detailed function documentation, see [FUNCTION_DOCUMENTATION.md](./FUNCTION_DOCUMENTATION.md)*
