-- Create courses table for dynamic course management
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  university TEXT NOT NULL,
  major TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1 AND year <= 4),
  semester INTEGER NOT NULL CHECK (semester IN (1, 2)),
  credit_hours INTEGER,
  prerequisite_ids TEXT[] DEFAULT '{}',
  unlocks_skills INTEGER[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_courses_university_major ON public.courses(university, major);
CREATE INDEX IF NOT EXISTS idx_courses_year_semester ON public.courses(year, semester);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read courses (public data)
CREATE POLICY "Courses are viewable by everyone"
  ON public.courses
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert/update (for admin later)
CREATE POLICY "Only authenticated users can modify courses"
  ON public.courses
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Add comment
COMMENT ON TABLE public.courses IS 'Stores all courses for each university and major with prerequisites and skill unlocks';
