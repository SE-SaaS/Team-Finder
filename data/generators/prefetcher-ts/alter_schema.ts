import { supabase } from "./src/supabaseClient";

console.log('\n🔧 Altering courses table schema...\n');

async function alterSchema() {
  // We need to use raw SQL to alter the column type
  // Supabase doesn't allow ALTER TABLE through the client, so we'll document it
  
  console.log('⚠️  DATABASE SCHEMA CHANGE REQUIRED\n');
  console.log('Run this SQL in Supabase SQL Editor:\n');
  console.log('─'.repeat(60));
  console.log(`
-- Step 1: Add new TEXT[] column
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS unlocks_skills_names TEXT[];

-- Step 2: Copy data (convert empty arrays)
UPDATE courses 
SET unlocks_skills_names = ARRAY[]::TEXT[]
WHERE unlocks_skills IS NULL;

-- Step 3: Drop old column  
ALTER TABLE courses
DROP COLUMN IF EXISTS unlocks_skills;

-- Step 4: Rename new column
ALTER TABLE courses
RENAME COLUMN unlocks_skills_names TO unlocks_skills;

-- Step 5: Add comment
COMMENT ON COLUMN courses.unlocks_skills IS 
  'Skill names that this course unlocks (e.g., {C++,Java,Python})';

-- Verify
SELECT code, name, unlocks_skills 
FROM courses 
LIMIT 5;
  `);
  console.log('─'.repeat(60));
  console.log('\n📋 After running the SQL above, run:');
  console.log('   npx ts-node migrate_course_skills.ts\n');
}

alterSchema();
