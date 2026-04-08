# Profile Save Issues - Fixes Applied

## Issues Found & Fixed ✅

### 1. **Semester Field Not Being Saved**
**Problem:** The `semester` field was selected in the profile wizard but never sent to the API.

**Fixed in:** `frontend/src/lib/profileApi.ts`
```typescript
// BEFORE: semester was missing
body: JSON.stringify({
  major: data.major,
  year: data.year,
  // semester: MISSING!
})

// AFTER: semester included
body: JSON.stringify({
  major: data.major,
  year: data.year,
  semester: data.semester, // ✅ ADDED
})
```

---

### 2. **Completed Courses Not Being Saved**
**Problem:** The `user_courses` table schema uses `course_code` and `course_name`, but the code was trying to use `course_id`.

**Fixed in:** `frontend/src/lib/profileApi.ts` - `saveUserCourses()` function
```typescript
// BEFORE: Wrong schema (course_id doesn't exist)
const coursesData = courseIds.map(courseId => ({
  user_id: userId,
  course_id: courseId, // ❌ WRONG FIELD
  status: 'completed',
}));

// AFTER: Correct schema (course_code + course_name)
// Fetch course details first
const { data: courses } = await supabase
  .from('courses')
  .select('id, code, name')
  .in('id', courseIds);

const coursesData = courses.map(course => ({
  user_id: userId,
  course_code: course.code, // ✅ CORRECT
  course_name: course.name,  // ✅ CORRECT
  status: 'completed',
}));
```

---

### 3. **Courses Missing Skill Mappings**
**Problem:** All courses in the database had empty `unlocks_skills` arrays, so no skills were being unlocked when selecting courses.

**Fix:** Database reset with proper seed data
- Created `02_seed_courses.sql` with courses that have proper `unlocks_skills` mappings
- Example: "Introduction to Programming" → unlocks ['C++']
- Example: "Web Development" → unlocks ['HTML/CSS', 'JavaScript']

---

### 4. **Incomplete Course Data**
**Problem:** Some majors had very few courses (JU CS only had 15 courses, many incomplete).

**Fix:** New seed file with comprehensive course data for:
- JU: CS, AI, DS
- HU: CS
(You can expand to other majors later)

---

## Complete Database Schema

### Core Profile Tables
1. **profiles** - User profiles with university verification
2. **user_courses** - Completed courses (uses course_code + course_name)
3. **user_skills** - Selected skills (skill names)
4. **skills** - Master skills catalog (NEW!)
5. **skill_proficiencies** - Skill ratings and levels (NEW!)
6. **assessment_results** - Exam results (NEW!)

### Course System
7. **courses** - All available courses with skill unlocks

### Team Matching System
8. **projects** - University & external projects (NEW!)
9. **project_members** - Project team members (NEW!)
10. **project_applications** - Join requests (NEW!)

### Key Schema Details

**profiles table:**
- ✅ semester field EXISTS and is NOW BEING SAVED

**user_courses table:**
- ✅ Uses `course_code` + `course_name` (NOT course_id)

**courses table:**
- ✅ `unlocks_skills` is TEXT[] array of skill names
- Example: ['C++', 'Python', 'JavaScript']

**skills table (NEW):**
- Master catalog of all available skills
- Categories: Frontend, Backend, Database, DevOps, etc.
- Referenced by skill_proficiencies and assessment_results

---

## Next Steps

1. **Reset the database** (see RESET-DATABASE-INSTRUCTIONS.md)
2. **Test the profile wizard**
3. **Verify data is saved correctly**

## Files Changed

- ✅ `frontend/src/lib/profileApi.ts` - Added semester, fixed saveUserCourses
- ✅ `supabase/migrations/00_reset_database.sql` - Reset script
- ✅ `supabase/migrations/01_create_all_tables.sql` - Fresh schema
- ✅ `supabase/migrations/02_seed_courses.sql` - Courses with skills
