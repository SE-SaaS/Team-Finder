-- ============================================
-- COMPLETE DATABASE RESET
-- Drop all tables and start fresh
-- ============================================

-- Drop all tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS assessment_results CASCADE;
DROP TABLE IF EXISTS user_courses CASCADE;
DROP TABLE IF EXISTS user_skills CASCADE;
DROP TABLE IF EXISTS skill_proficiencies CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS project_skills CASCADE;

-- Drop any custom types
DROP TYPE IF EXISTS skill_level CASCADE;
DROP TYPE IF EXISTS project_status CASCADE;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database reset complete. All tables dropped.';
END $$;
