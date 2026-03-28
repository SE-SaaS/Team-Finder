# How to Apply the Skills Migration

## Method 1: Supabase Dashboard SQL Editor (Recommended - Easiest)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Login and select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy the Migration SQL**
   - Open: `supabase/migrations/add_skills_to_courses.sql`
   - Copy ALL the contents (Ctrl+A, Ctrl+C)

4. **Paste and Execute**
   - Paste into the SQL Editor
   - Click "Run" (or press Ctrl+Enter)
   - Wait for "Success" message

5. **Verify**
   - Run this query to check:
   ```sql
   SELECT id, name, unlocks_skills
   FROM courses
   WHERE 'C++' = ANY(unlocks_skills)
   LIMIT 5;
   ```
   - You should see courses with C++ skill

---

## Method 2: Direct Database Connection (Advanced)

If you have PostgreSQL client installed:

```bash
psql "postgresql://postgres:NUyDFhLKvKqzaXyR@db.fsiwgcrnxirgvkmdmvgd.supabase.co:5432/postgres" -f supabase/migrations/add_skills_to_courses.sql
```

---

## After Migration

### Test the Skills
1. Run your frontend: `npm run dev`
2. Go to profile creation (Step 2 - Courses)
3. Select some courses
4. Go to Step 3 - Skills
5. You should see all 46 skills including:
   - C++, C, Rust, R, Prolog
   - Cryptography, Decryption, Assembly

### Verify Database
Run this query in SQL Editor:
```sql
-- Count courses with skills
SELECT
  COUNT(*) FILTER (WHERE array_length(unlocks_skills, 1) > 0) as courses_with_skills,
  COUNT(*) as total_courses
FROM courses;

-- Show sample of new skills
SELECT DISTINCT unnest(unlocks_skills) as skill
FROM courses
WHERE unlocks_skills @> ARRAY['C++']::TEXT[]
   OR unlocks_skills @> ARRAY['Cryptography']::TEXT[]
   OR unlocks_skills @> ARRAY['R']::TEXT[]
ORDER BY skill;
```

---

## Troubleshooting

**Problem: No skills showing up**
- Clear your browser cache
- Check API route is returning `unlocks_skills` field
- Verify migration ran successfully

**Problem: Permission denied**
- Make sure you're using the Service Role Key in the SQL Editor
- Or run queries as the postgres user

**Problem: Duplicate key errors**
- Migration has already been run - safe to ignore
- To re-run, first clear existing skills:
  ```sql
  UPDATE courses SET unlocks_skills = ARRAY[]::TEXT[];
  ```
  Then run the migration again

---

## Quick Copy-Paste SQL

If you just want to quickly test a few skills, run this in SQL Editor:

```sql
-- Add C++ to OOP courses
UPDATE courses SET unlocks_skills = ARRAY['C++']::TEXT[]
WHERE name ILIKE '%object-oriented%';

-- Add Cryptography to crypto courses
UPDATE courses SET unlocks_skills = ARRAY['Cryptography', 'Decryption']::TEXT[]
WHERE name ILIKE '%cryptography%';

-- Add R to statistics courses
UPDATE courses SET unlocks_skills = ARRAY['R']::TEXT[]
WHERE code = 'MATH003' OR name ILIKE '%statistics%';

-- Verify
SELECT id, name, unlocks_skills FROM courses WHERE unlocks_skills != ARRAY[]::TEXT[] LIMIT 10;
```
