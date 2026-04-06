-- Update project filtering for year-based and major-based recommendations
-- Key principle: Show projects students CAN LEARN FROM, not just what they already know

-- ============================================
-- 1. Add year filtering columns
-- ============================================

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS min_year INTEGER DEFAULT 1 CHECK (min_year >= 1 AND min_year <= 4),
ADD COLUMN IF NOT EXISTS suitable_majors TEXT[] DEFAULT '{}';

-- ============================================
-- 2. Rename tech_stack to tags for clarity
-- ============================================

-- tags: Raw tags from external APIs (e.g., ['reactjs', 'python', 'docker'])
-- skills_needed: Matched skill names (e.g., ['React', 'Python', 'Docker'])
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'tech_stack'
  ) THEN
    ALTER TABLE projects RENAME COLUMN tech_stack TO tags;
  END IF;
END $$;

-- ============================================
-- 3. Update difficulty column constraint
-- ============================================

-- Ensure difficulty uses correct values (already exists, just verify)
-- DO NOT add skill_difficulty - we already have difficulty!

-- ============================================
-- 4. Create indexes for fast filtering
-- ============================================

CREATE INDEX IF NOT EXISTS idx_projects_min_year ON projects(min_year);
CREATE INDEX IF NOT EXISTS idx_projects_suitable_majors ON projects USING GIN(suitable_majors);
CREATE INDEX IF NOT EXISTS idx_projects_difficulty ON projects(difficulty);
CREATE INDEX IF NOT EXISTS idx_projects_skills_needed ON projects USING GIN(skills_needed);

-- ============================================
-- 5. Add helpful comments
-- ============================================

COMMENT ON COLUMN projects.min_year IS 'Minimum year level (1-4). Year 1 students see Year 1 projects only, Year 3 sees Year 1-3.';
COMMENT ON COLUMN projects.suitable_majors IS 'Major codes like [''CS'', ''AI'', ''DS'']. Empty array = suitable for all majors.';
COMMENT ON COLUMN projects.tags IS 'Raw tags from external sources (e.g., [''reactjs'', ''typescript'', ''mongodb''])';
COMMENT ON COLUMN projects.skills_needed IS 'Normalized skill names (e.g., [''React'', ''TypeScript'', ''MongoDB''])';
COMMENT ON COLUMN projects.difficulty IS 'Overall project difficulty: beginner (Y1), intermediate (Y2), advanced (Y3-4)';

-- ============================================
-- 6. Example filtering queries
-- ============================================

-- Filter projects for a Year 2 CS student:
-- SELECT * FROM projects
-- WHERE min_year <= 2                      -- Not too advanced
--   AND (suitable_majors = '{}' OR 'CS' = ANY(suitable_majors))  -- Relevant major
--   AND status = 'open'
--   AND type = 'external'
-- ORDER BY min_year ASC, created_at DESC;

-- Find projects to learn a specific skill:
-- SELECT * FROM projects
-- WHERE 'React' = ANY(skills_needed)
--   AND min_year <= 3
--   AND status = 'open';

-- Important: We DON'T filter by whether student has all skills!
-- Projects are for LEARNING, not just applying existing knowledge.
