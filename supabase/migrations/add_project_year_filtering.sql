-- Add year-based filtering fields to projects table
-- This enables filtering projects by student year level and major

-- Add new columns
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS min_year INTEGER DEFAULT 1 CHECK (min_year >= 1 AND min_year <= 4),
ADD COLUMN IF NOT EXISTS suitable_majors TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS skill_difficulty TEXT DEFAULT 'beginner' CHECK (skill_difficulty IN ('beginner', 'intermediate', 'advanced'));

-- Create indexes for faster filtering
CREATE INDEX IF NOT EXISTS idx_projects_min_year ON projects(min_year);
CREATE INDEX IF NOT EXISTS idx_projects_suitable_majors ON projects USING GIN(suitable_majors);
CREATE INDEX IF NOT EXISTS idx_projects_skill_difficulty ON projects(skill_difficulty);

-- Add comments
COMMENT ON COLUMN projects.min_year IS 'Minimum student year level required (1-4)';
COMMENT ON COLUMN projects.suitable_majors IS 'Array of major codes this project suits (CS, AI, DS, etc.)';
COMMENT ON COLUMN projects.skill_difficulty IS 'Difficulty based on required skills';

-- Example query for filtering:
-- SELECT * FROM projects
-- WHERE 'AI' = ANY(suitable_majors)
--   AND min_year <= 3  -- Student is in year 3
--   AND status = 'open'
--   AND type = 'external';
