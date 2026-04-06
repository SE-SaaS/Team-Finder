-- ============================================
-- Migration: Update courses.unlocks_skills from INTEGER[] to TEXT[]
-- Change from numeric skill IDs to skill names for better maintainability
-- ============================================

-- Step 1: Add new column with TEXT[] type
ALTER TABLE courses
ADD COLUMN unlocks_skills_new TEXT[];

-- Step 2: Drop the old INTEGER[] column
ALTER TABLE courses
DROP COLUMN IF EXISTS unlocks_skills;

-- Step 3: Rename new column to unlocks_skills
ALTER TABLE courses
RENAME COLUMN unlocks_skills_new TO unlocks_skills;

-- Step 4: Add comment explaining the format
COMMENT ON COLUMN courses.unlocks_skills IS 'Array of skill names (e.g., {C++, Java, Python}) that this course unlocks';

-- ============================================
-- Update specific courses with correct skill mappings
-- Based on actual course content
-- ============================================

-- Introduction to Programming → C++
UPDATE courses
SET unlocks_skills = ARRAY['C++']
WHERE name ILIKE '%Introduction to Programming%'
   OR name ILIKE '%Intro to Programming%'
   OR code ILIKE '%1904102%';

-- Data Structures → C++
UPDATE courses
SET unlocks_skills = ARRAY['C++']
WHERE name ILIKE '%Data Structure%'
   OR code ILIKE '%1904222%';

-- Object Oriented Programming → Java (NOT Spring Boot)
UPDATE courses
SET unlocks_skills = ARRAY['Java']
WHERE name ILIKE '%Object%Oriented%'
   OR name ILIKE '%OOP%'
   OR code ILIKE '%1904231%';

-- Applied Statistics → R
UPDATE courses
SET unlocks_skills = ARRAY['R']
WHERE name ILIKE '%Applied Statistics%'
   OR name ILIKE '%Statistics%'
   OR code ILIKE '%1902211%';

-- ============================================
-- Verification
-- ============================================

-- Show updated courses
SELECT code, name, unlocks_skills
FROM courses
WHERE unlocks_skills IS NOT NULL
ORDER BY year, semester, code;
