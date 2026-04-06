# Apply Database Migration

## Step 1: Apply `update_project_filtering.sql`

### Option A: Via Supabase Dashboard (Recommended) ✅

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor:**
   - Click "SQL Editor" in left sidebar
   - Click "New query"

3. **Copy Migration SQL:**
   ```bash
   # Location: supabase/migrations/update_project_filtering.sql
   ```

4. **Paste and Run:**
   - Paste the entire SQL content
   - Click "Run" (or Ctrl+Enter)
   - Wait for success message ✅

5. **Verify:**
   ```sql
   -- Check if columns exist
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'projects' 
   AND column_name IN ('min_year', 'suitable_majors', 'tags', 'skills_needed');
   ```

---

### Option B: Via Command Line (If you have psql)

```bash
# Connect to Supabase Postgres
psql "postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"

# Run migration
\i supabase/migrations/update_project_filtering.sql
```

---

### Option C: Via Node.js Script

```bash
cd supabase
node apply-migration.js update_project_filtering.sql
```

*Note: This will display the SQL for manual copying to dashboard*

---

## Expected Changes

After running the migration, the `projects` table should have:

### New Columns:
```
min_year              INTEGER (1-4)
suitable_majors       TEXT[] (array of major codes)
```

### Renamed Column:
```
tech_stack → tags     TEXT[] (raw tags from APIs)
```

### Existing Columns (unchanged):
```
skills_needed         TEXT[] (normalized skill names)
difficulty            TEXT (beginner/intermediate/advanced)
```

### New Indexes:
```
idx_projects_min_year
idx_projects_suitable_majors (GIN)
idx_projects_difficulty
idx_projects_skills_needed (GIN)
```

---

## Troubleshooting

### Error: "column already exists"
The migration uses `IF NOT EXISTS` - safe to re-run.

### Error: "column tech_stack does not exist"
You may have already renamed it. Check:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name IN ('tech_stack', 'tags');
```

### Error: Permission denied
Make sure you're using the **Service Role Key** (not anon key).

---

## Next Steps

After migration is applied:

1. ✅ Port skill utilities to TypeScript prefetcher
2. ✅ Add Supabase integration to prefetcher
3. ✅ Test fetching and storing projects
