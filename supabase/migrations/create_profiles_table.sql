-- Drop existing tables if they exist (CASCADE will drop policies too)
DROP TABLE IF EXISTS user_courses CASCADE;
DROP TABLE IF EXISTS user_skills CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Profiles Table
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
  semester INTEGER,

  -- Profile Info
  bio TEXT,
  avatar TEXT,
  avatar_color TEXT,
  availability TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills Table
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency TEXT CHECK (proficiency IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);

-- Courses Table
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_university ON profiles(university);
CREATE INDEX IF NOT EXISTS idx_profiles_major ON profiles(major);
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_user ON user_courses(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
-- Everyone can read all profiles (for team matching)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile (but NOT university, email, or verification_method)
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Prevent changing these locked fields
    university = (SELECT university FROM profiles WHERE id = auth.uid()) AND
    email = (SELECT email FROM profiles WHERE id = auth.uid()) AND
    verification_method = (SELECT verification_method FROM profiles WHERE id = auth.uid())
  );

-- Skills RLS Policies
CREATE POLICY "Skills are viewable by everyone"
  ON user_skills FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own skills"
  ON user_skills FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Courses RLS Policies
CREATE POLICY "Courses are viewable by everyone"
  ON user_courses FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own courses"
  ON user_courses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
