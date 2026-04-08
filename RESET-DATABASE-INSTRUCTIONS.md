# Database Reset Instructions

## Option 1: Supabase Dashboard (Recommended - Easiest)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Login and select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run Each Migration in Order**

   ### Step 1: Reset Database
   Copy and paste the contents of `supabase/migrations/00_reset_database.sql`
   Click "Run" ▶️

   ### Step 2: Create Tables
   Copy and paste the contents of `supabase/migrations/01_create_all_tables.sql`
   Click "Run" ▶️
   
   **This creates 10 tables:**
   - ✅ profiles
   - ✅ courses
   - ✅ user_courses
   - ✅ user_skills
   - ✅ skills (master skills catalog)
   - ✅ skill_proficiencies
   - ✅ assessment_results
   - ✅ projects
   - ✅ project_members
   - ✅ project_applications

   ### Step 3: Seed Skills
   Copy and paste the contents of `supabase/migrations/03_seed_skills.sql`
   Click "Run" ▶️

   ### Step 4: Seed Courses
   Copy and paste the contents of `supabase/migrations/02_seed_courses.sql`
   Click "Run" ▶️

4. **Verify**
   Run these queries to check:
   
   ```sql
   -- Check courses
   SELECT university, major, COUNT(*) as course_count
   FROM courses
   GROUP BY university, major
   ORDER BY university, major;
   
   -- Check skills
   SELECT category, COUNT(*) as skill_count
   FROM skills
   GROUP BY category
   ORDER BY category;
   ```

   You should see:
   - **Courses:** JU CS (15), JU AI (9), JU DS (8), HU CS (9)
   - **Skills:** ~70 skills across 11 categories

---

## Option 2: Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Initialize Supabase (if not already done)
supabase init

# Link to your project
supabase link --project-ref fsiwgcrnxirgvkmdmvgd

# Reset database
supabase db reset

# Apply migrations
supabase db push
```

---

## What This Fixes

✅ **Profile save now includes semester**
✅ **Completed courses are saved correctly**
✅ **Courses have proper skill mappings** (unlocks_skills array populated)
✅ **Database schema matches code expectations**

## After Reset

1. **Test the profile wizard**
   - Go to `/profile` in your app
   - Complete all steps
   - Verify semester and courses are saved

2. **Check browser console**
   - Look for any errors during save
   - Courses should load for your major

3. **Verify data**
   - Check Supabase Dashboard → Table Editor → profiles
   - Check user_courses table after completing profile
