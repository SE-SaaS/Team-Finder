-- ============================================
-- CREATE ALL TABLES FROM SCRATCH
-- Profiles, Courses, Skills, User Relations
-- ============================================

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Info
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  username TEXT,

  -- University Info (LOCKED - cannot be changed after creation)
  university TEXT NOT NULL CHECK (university IN ('University of Jordan', 'Hashemite University')),
  verification_method TEXT NOT NULL DEFAULT 'email_domain',
  major TEXT,
  specialization TEXT,
  year INTEGER,
  semester INTEGER CHECK (semester IN (1, 2)),

  -- Profile Info
  bio TEXT,
  avatar TEXT,
  avatar_color TEXT,
  availability TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  university TEXT NOT NULL,
  major TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1 AND year <= 4),
  semester INTEGER NOT NULL CHECK (semester IN (1, 2)),
  credit_hours INTEGER,
  prerequisite_ids TEXT[] DEFAULT '{}',
  unlocks_skills TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('completed', 'in_progress', 'planned')),
  grade TEXT,
  semester TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_code)
);

-- ============================================
-- USER SKILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency TEXT CHECK (proficiency IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);


-- ============================================
-- SKILLS TABLE (Master Skills List)
-- ============================================
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SKILL PROFICIENCIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS skill_proficiencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  rating INTEGER CHECK (rating >= 0 AND rating <= 100),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- ============================================
-- ASSESSMENT RESULTS TABLE (Skill Exams)
-- ============================================
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  original_difficulty TEXT NOT NULL,
  adjusted_difficulty TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  retake_allowed_at TIMESTAMPTZ,
  taken_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('university', 'external')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  tech_stack TEXT[] NOT NULL,
  skills_needed TEXT[],

  -- University project fields
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team_size INTEGER,
  deadline TIMESTAMPTZ,
  university TEXT,
  major TEXT,

  -- External project fields
  source TEXT,
  external_url TEXT UNIQUE,
  specialization TEXT,

  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECT MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- ============================================
-- PROJECT APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS project_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, applicant_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_university ON profiles(university);
CREATE INDEX IF NOT EXISTS idx_profiles_major ON profiles(major);
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_user ON user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_university_major ON courses(university, major);
CREATE INDEX IF NOT EXISTS idx_courses_year_semester ON courses(year, semester);
CREATE INDEX IF NOT EXISTS idx_skill_proficiencies_user ON skill_proficiencies(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user ON assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_university ON projects(university);
CREATE INDEX IF NOT EXISTS idx_projects_creator ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_applications_project ON project_applications(project_id);
CREATE INDEX IF NOT EXISTS idx_project_applications_applicant ON project_applications(applicant_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_proficiencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_applications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - PROFILES
-- ============================================
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    university = (SELECT university FROM profiles WHERE id = auth.uid()) AND
    email = (SELECT email FROM profiles WHERE id = auth.uid()) AND
    verification_method = (SELECT verification_method FROM profiles WHERE id = auth.uid())
  );

-- ============================================
-- RLS POLICIES - USER SKILLS
-- ============================================
CREATE POLICY "Skills are viewable by everyone"
  ON user_skills FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own skills"
  ON user_skills FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - USER COURSES
-- ============================================
CREATE POLICY "Courses are viewable by everyone"
  ON user_courses FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own courses"
  ON user_courses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - COURSES (PUBLIC DATA)
-- ============================================
CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can modify courses"
  ON courses FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- RLS POLICIES - SKILLS
-- ============================================
CREATE POLICY "Skills are viewable by everyone"
  ON skills FOR SELECT
  USING (true);

-- ============================================
-- RLS POLICIES - SKILL PROFICIENCIES
-- ============================================
CREATE POLICY "Proficiencies are viewable by everyone"
  ON skill_proficiencies FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own proficiencies"
  ON skill_proficiencies FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - ASSESSMENT RESULTS
-- ============================================
CREATE POLICY "Users can view their own assessment results"
  ON assessment_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessment results"
  ON assessment_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - PROJECTS
-- ============================================
CREATE POLICY "Projects are viewable by everyone"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create university projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = creator_id AND type = 'university');

CREATE POLICY "Creators can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = creator_id);

-- ============================================
-- RLS POLICIES - PROJECT MEMBERS
-- ============================================
CREATE POLICY "Project members are viewable by everyone"
  ON project_members FOR SELECT
  USING (true);

CREATE POLICY "Project owners can manage members"
  ON project_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = project_members.project_id
      AND pm.user_id = auth.uid()
      AND pm.role = 'owner'
    )
  );

-- ============================================
-- RLS POLICIES - PROJECT APPLICATIONS
-- ============================================
CREATE POLICY "Users can view their own applications"
  ON project_applications FOR SELECT
  USING (auth.uid() = applicant_id OR
         EXISTS (
           SELECT 1 FROM projects p
           WHERE p.id = project_applications.project_id
           AND p.creator_id = auth.uid()
         ));

CREATE POLICY "Users can create applications"
  ON project_applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Project owners can update applications"
  ON project_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_applications.project_id
      AND p.creator_id = auth.uid()
    )
  );

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE profiles IS 'User profiles with university verification';
COMMENT ON TABLE courses IS 'All courses for each university and major with prerequisites and skill unlocks';
COMMENT ON TABLE user_courses IS 'User completed/in-progress courses';
COMMENT ON TABLE user_skills IS 'User selected skills';
COMMENT ON TABLE skills IS 'Master skills catalog';
COMMENT ON TABLE skill_proficiencies IS 'User skill proficiency levels with ratings';
COMMENT ON TABLE assessment_results IS 'Skill exam results and retake tracking';
COMMENT ON TABLE projects IS 'University and external projects for team matching';
COMMENT ON TABLE project_members IS 'Team members for each project';
COMMENT ON TABLE project_applications IS 'Applications to join projects';
COMMENT ON COLUMN courses.unlocks_skills IS 'Array of skill names (e.g., {C++, Java, Python}) that this course unlocks';
