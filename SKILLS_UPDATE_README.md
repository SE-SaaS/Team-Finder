# Skills Update - Missing Skills Addition

## Summary
This update adds 9 missing skills to the Team Finder application and maps them to appropriate courses.

## New Skills Added

### Backend Skills
1. **C++** - Object-oriented systems programming (Year 2+)
2. **C** - Low-level systems programming (Year 3+)
3. **Rust** - Modern systems programming language (Year 4+)
4. **R** - Statistical computing language (Year 2+)
5. **Prolog** - Logic programming language (Year 4+)

### Security Skills
6. **Cryptography** - Encryption and security protocols (Year 3+)
7. **Decryption** - Decryption and cryptanalysis (Year 3+)
8. **Assembly** - Low-level assembly programming (Year 3+)

Note: **C#** was already present in the system.

## Files Modified

### 1. Frontend Skill Definitions
- `frontend/src/data/skillLocks.ts` - Added skill lock rules for new skills
- `frontend/src/constants/skills.js` - Added new skills to ALL_SKILLS array (38 → 46 skills)

### 2. Database Migration
- `supabase/migrations/add_skills_to_courses.sql` - New migration to map skills to courses

## Course Mappings

### C++ Unlocked By:
- All "Object-Oriented Programming" courses (JU/HU, all majors)

### C Unlocked By:
- Systems Programming and Compilers Construction
- Operating Systems

### R Unlocked By:
- Principles of Statistics (MATH003)
- Applied Statistics

### Prolog Unlocked By:
- Design And Implementation of Programming Languages
- Programming Languages Design

### Cryptography & Decryption Unlocked By:
- Cryptography courses (JU-CYS, HU-CYS)
- Cryptography and Coding Theory

### Assembly Unlocked By:
- Computer Organization
- Systems Programming and Compilers Construction

## How to Apply the Migration

### Option 1: Using Supabase CLI (Recommended)
```bash
cd supabase
npx supabase db push
```

### Option 2: Manual SQL Execution
1. Connect to your Supabase database
2. Run the SQL file:
```bash
psql -h your-db-url -U postgres -d postgres -f migrations/add_skills_to_courses.sql
```

### Option 3: Supabase Dashboard
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/add_skills_to_courses.sql`
3. Paste and execute

## Verification

After applying the migration, verify the changes:

```sql
-- Check courses with C++ skill
SELECT id, name, unlocks_skills
FROM courses
WHERE 'C++' = ANY(unlocks_skills);

-- Check courses with Cryptography skill
SELECT id, name, unlocks_skills
FROM courses
WHERE 'Cryptography' = ANY(unlocks_skills);

-- Count courses with skills
SELECT COUNT(*) as courses_with_skills
FROM courses
WHERE array_length(unlocks_skills, 1) > 0;
```

## Frontend Updates

The frontend changes are already in place:
- ✅ Skill locks configured with appropriate year requirements
- ✅ Skills added to constants for ID mapping
- ✅ Skills can be unlocked by completing courses or passing exams

## Filter Logic Status

The course filtering by year and semester in `Step2_YearCourses.tsx` is working correctly:
- ✅ Courses are fetched from API by university and major
- ✅ Courses are grouped by year (1-4) and semester (1-2)
- ✅ Courses display their unlocked skills count
- ✅ Users can select completed courses to unlock skills

## Testing Checklist

After deployment:
- [ ] New skills appear in the Skills Selector (Step 3)
- [ ] Skills show correct lock status based on year
- [ ] Completing relevant courses unlocks the skills
- [ ] Skill IDs are properly mapped (1-46)
- [ ] Cryptography courses show "Cryptography" and "Decryption" skills
- [ ] OOP courses show "C++" skill
- [ ] Statistics courses show "R" skill

## Notes

- Skills are soft-locked by year but can be unlocked early by:
  1. Completing the required courses
  2. Passing the skill exam
- Some courses now unlock multiple skills (e.g., Systems Programming unlocks both "C" and "Assembly")
- The migration uses pattern matching to catch all relevant courses (e.g., all courses with "database" in the name)
