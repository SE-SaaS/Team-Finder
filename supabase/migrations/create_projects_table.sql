-- Drop existing tables if they exist (CASCADE will drop policies too)
DROP TABLE IF EXISTS project_applications CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Projects Table (University + External)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Project Type
  type TEXT NOT NULL CHECK (type IN ('university', 'external')),

  -- Basic Info
  title TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Common Fields
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  tech_stack TEXT[] NOT NULL, -- Array of technologies

  -- Skills (for external projects)
  skills_needed TEXT[], -- Array of skill names

  -- University Project Specific Fields
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team_size INTEGER, -- Max team members
  deadline TIMESTAMP WITH TIME ZONE,
  university TEXT, -- JU, HU
  major TEXT, -- Target major/specialization

  -- External Project Specific Fields
  source TEXT, -- 'github', 'kaggle', 'ai_generated'
  external_url TEXT, -- Link to original project
  specialization TEXT, -- Target specialization for AI-generated

  -- Status
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'closed')),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members Junction Table
CREATE TABLE IF NOT EXISTS project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Project Applications Table
CREATE TABLE IF NOT EXISTS project_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, applicant_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_university ON projects(university);
CREATE INDEX IF NOT EXISTS idx_projects_creator ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_applications_project ON project_applications(project_id);
CREATE INDEX IF NOT EXISTS idx_project_applications_applicant ON project_applications(applicant_id);

-- RLS Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_applications ENABLE ROW LEVEL SECURITY;

-- Everyone can read projects
CREATE POLICY "Projects are viewable by everyone"
  ON projects FOR SELECT
  USING (true);

-- Only authenticated users can create university projects
CREATE POLICY "Authenticated users can create university projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = creator_id AND type = 'university');

-- Project creators can update their own projects
CREATE POLICY "Creators can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = creator_id);

-- Project creators can delete their own projects
CREATE POLICY "Creators can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = creator_id);

-- Project members policies
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

-- Project applications policies
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
