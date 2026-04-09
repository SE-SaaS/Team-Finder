# Team-Finder Documentation

> Complete technical documentation for the Team-Finder project

## Overview

Team-Finder is a university student team-matching platform that helps students find project collaborators based on skills, courses, and availability. The system includes profile management, skill assessment, project importing, and team matching capabilities.

## Documentation Structure

### 📚 Core Documentation

1. **[Function Documentation](./FUNCTION_DOCUMENTATION.md)**
   - Comprehensive documentation of every function in the repository
   - Organized by module and functionality
   - Includes parameters, return types, and usage examples
   - Documents data flows and database operations

2. **[Workflow Diagram](./WORKFLOW_DIAGRAM.md)**
   - Visual representations of system architecture
   - Sequence diagrams for key user flows
   - Data pipeline visualizations
   - Component interaction maps

### 📖 Additional Documentation

3. **[Bug Fixes - Skill System](./BUG_FIXES_SKILL_SYSTEM.md)**
   - Historical bug fixes and solutions
   - Skill system improvements

4. **[Skills Update README](./SKILLS_UPDATE_README.md)**
   - Skill system update documentation

5. **[Apply Migration](./APPLY_MIGRATION.md)**
   - Database migration instructions

## Quick Start

### For Developers

1. **Understanding the codebase**: Start with [Function Documentation](./FUNCTION_DOCUMENTATION.md)
2. **Understanding workflows**: Review [Workflow Diagram](./WORKFLOW_DIAGRAM.md)
3. **Setting up**: Check main README.md for environment setup

### For Contributors

1. Read the function documentation to understand existing patterns
2. Follow the established architecture shown in workflow diagrams
3. Maintain documentation when adding new features

## System Architecture

### Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Data Generation**: Node.js, TypeScript
- **External APIs**: GitHub, GitLab, Kaggle, HuggingFace, LeetCode, and more

### Project Structure

```
Team-Finder/
├── frontend/                  # Next.js frontend application
│   ├── src/
│   │   ├── app/              # Next.js app router pages
│   │   │   ├── api/          # API routes
│   │   │   ├── auth/         # Authentication pages
│   │   │   ├── dashboard/    # Dashboard page
│   │   │   └── profile/      # Profile wizard
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   ├── lib/              # Utilities and helpers
│   │   ├── utils/            # Utility functions
│   │   ├── types/            # TypeScript types
│   │   └── data/             # Static data
│   └── public/               # Static assets
├── backend/                   # Backend utilities
│   └── migrate_user_metadata.js
├── data/                      # Data generation tools
│   └── generators/
│       ├── prefetcher-ts/    # Project prefetcher
│       └── api-wrapper/      # External API wrapper
├── supabase/                  # Supabase configuration
│   └── migrations/           # Database migrations
└── docs/                      # Documentation (this folder)
```

## Key Features

### 1. User Authentication
- University email verification (@ju.edu.jo, @hu.edu.jo)
- Secure session management
- Role-based access control

### 2. Profile Management
- 7-step profile wizard
- Basic information (university, major, specialization)
- Course selection
- Skill selection and verification
- Project importing from GitHub/GitLab
- Skill assessments/exams
- Availability preferences
- Bio and avatar customization

### 3. Skill System
- Comprehensive skill database
- Year-based skill requirements
- Automatic skill matching from project tags
- Skill proficiency levels
- Verification through assessments

### 4. Project Importing
- Import projects from GitHub
- Import projects from GitLab
- Automatic skill detection from project tags/languages
- Difficulty classification

### 5. Data Generation
- Multi-source project prefetcher
- Support for 13+ external APIs
- Major-specific project curation
- Automated categorization and tagging

## API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `GET /auth/callback` - OAuth callback

### Profile Endpoints

- `GET /api/profile` - Get current user's profile
- `POST /api/profile` - Create/update user profile

### Course Endpoints

- `GET /api/courses/[university]/[major]` - Get courses by university and major

## Database Schema

### Core Tables

1. **profiles** - User profile information
2. **user_skills** - User's selected skills (many-to-many)
3. **skill_proficiencies** - Skill ratings and verification
4. **user_courses** - Completed courses
5. **assessment_results** - Skill exam results
6. **skills** - Master skill list
7. **courses** - Master course list
8. **projects** - External projects database

### Security Model

- Row-Level Security (RLS) enabled on all tables
- University verification via email domain
- University field ALWAYS from user metadata, never from request body
- Separate public/private profile views

## Development Workflow

### Adding New Features

1. **Plan**: Review existing architecture and patterns
2. **Implement**: Follow established coding patterns
3. **Document**: Update function documentation
4. **Diagram**: Update workflow diagrams if architecture changes
5. **Test**: Ensure all flows work end-to-end
6. **Commit**: Use descriptive commit messages

### Code Organization Principles

- **Separation of Concerns**: API routes, business logic, UI components are separate
- **Type Safety**: TypeScript throughout
- **Reusability**: Shared utilities and components
- **Security First**: Server-side validation, auth checks, sanitized inputs

## Common Workflows

### User Registration Flow
1. User enters university email
2. System validates email domain
3. Creates auth user with metadata
4. Initializes profile entry
5. Sends confirmation email

### Profile Completion Flow
1. User completes 7-step wizard
2. Each step saves to local storage (draft)
3. Final submission triggers multiple saves:
   - Profile data → profiles table
   - Skills → user_skills table
   - Courses → user_courses table
   - Skill ratings → skill_proficiencies table
4. Redirects to dashboard

### Project Import Flow
1. User provides GitHub/GitLab username
2. System fetches public repositories
3. Extracts tags and languages
4. Matches tags to skills using matchTagsToSkills()
5. Auto-selects matched skills in wizard
6. User confirms or modifies selections

## Environment Setup

### Required Environment Variables

**Frontend (.env)**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Backend (.env)**
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Data Generators (.env)**
```env
GITHUB_TOKEN=your_github_token
KAGGLE_CREDENTIALS=your_kaggle_credentials
HF_TOKEN=your_huggingface_token
GITLAB_TOKEN=your_gitlab_token
# ... and more (see Function Documentation)
```

## Testing

### Testing Approach
- Manual testing for UI flows
- API route testing via Postman/Thunder Client
- Database testing via Supabase dashboard

### Key Test Cases
1. User registration with university email
2. Profile wizard completion (all 7 steps)
3. Skill matching from GitHub projects
4. Profile update (preserving existing data)
5. Authentication persistence

## Security Considerations

### Critical Security Rules

1. **University Verification**
   - ALWAYS use university from user.user_metadata
   - NEVER trust university field from request body
   - Validate email domain on signup

2. **Authentication**
   - All API routes must call getUserFromRequest()
   - Check user exists before processing
   - Return 401 for unauthenticated requests

3. **Data Access**
   - Use RLS policies for data isolation
   - Separate public/private profile views
   - Never expose email in public views

4. **Input Validation**
   - Validate and sanitize all user inputs
   - Use TypeScript types for compile-time checks
   - Validate on both client and server

## Performance Considerations

### Optimization Strategies

1. **Database Queries**
   - Use single queries instead of N+1
   - Index frequently queried fields
   - Batch inserts/updates where possible

2. **API Calls**
   - Rate limiting for external APIs
   - Caching for repeated requests
   - Parallel fetching where appropriate

3. **Frontend**
   - Code splitting with Next.js
   - Image optimization
   - Lazy loading for components

## Troubleshooting

### Common Issues

1. **"Unverified university email" error**
   - Solution: Run migrate_user_metadata.js to add university to metadata
   - See: [Apply Migration](./APPLY_MIGRATION.md)

2. **Profile save fails**
   - Check: User has university in metadata
   - Check: All required fields are present
   - Check: Database constraints are satisfied

3. **Skill matching returns no results**
   - Check: Tags are properly normalized (lowercase)
   - Check: Skill aliases are up to date in SKILL_LOCKS
   - Check: Tags actually match defined skills

## Contributing

### Documentation Standards

When adding new code:

1. **Add function documentation** to [FUNCTION_DOCUMENTATION.md](./FUNCTION_DOCUMENTATION.md):
   - Function signature
   - Purpose
   - Parameters and return types
   - Key implementation details
   - What calls it / what it calls

2. **Update workflow diagrams** in [WORKFLOW_DIAGRAM.md](./WORKFLOW_DIAGRAM.md) if:
   - Adding new API routes
   - Changing authentication flow
   - Adding new user workflows
   - Modifying data pipelines

3. **Update this README** if:
   - Adding new major features
   - Changing project structure
   - Adding new environment variables
   - Modifying security rules

## Roadmap

### Planned Features
- Team matching algorithm
- Real-time messaging
- Project proposals
- Skill endorsements
- Team analytics
- External project integration

## Support

### Getting Help

1. **Documentation**: Check these docs first
2. **Code Comments**: Many functions have inline comments
3. **Git History**: Check commit messages for context
4. **Issue Tracker**: Create issue for bugs/questions

## License

See [LICENSE](../LICENSE) file in root directory.

---

## Document Index

| Document | Purpose | Audience |
|----------|---------|----------|
| [FUNCTION_DOCUMENTATION.md](./FUNCTION_DOCUMENTATION.md) | Comprehensive function reference | Developers, Contributors |
| [WORKFLOW_DIAGRAM.md](./WORKFLOW_DIAGRAM.md) | Visual architecture and flows | Developers, Architects |
| [BUG_FIXES_SKILL_SYSTEM.md](./BUG_FIXES_SKILL_SYSTEM.md) | Historical bug fixes | Developers |
| [SKILLS_UPDATE_README.md](./SKILLS_UPDATE_README.md) | Skill system updates | Developers |
| [APPLY_MIGRATION.md](./APPLY_MIGRATION.md) | Migration guide | DevOps, Administrators |

---

**Last Updated**: 2026-04-08  
**Version**: 1.0.0  
**Maintainer**: Team-Finder Development Team
