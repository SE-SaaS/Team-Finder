-- Migration: 10_projects_metadata_difficulty.sql
-- Intent: support the new prefetcher design.
--   source_metadata holds heterogeneous per-source fields (HF lastModified,
--   GitHub size, Kaggle usability, etc.) without forcing 30 nullable columns.
--   popularity_score / primary_language / last_activity_at are extracted as
--   typed columns because they are queried across sources at filter time.
--   difficulty_score is the 0-100 numeric output of the new per-source
--   difficulty formula; the existing difficulty column keeps the label.

BEGIN;

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS source_metadata     jsonb,
  ADD COLUMN IF NOT EXISTS popularity_score    integer,
  ADD COLUMN IF NOT EXISTS primary_language    text,
  ADD COLUMN IF NOT EXISTS last_activity_at    timestamptz,
  ADD COLUMN IF NOT EXISTS difficulty_score    integer;

ALTER TABLE projects
  DROP CONSTRAINT IF EXISTS projects_popularity_score_check,
  DROP CONSTRAINT IF EXISTS projects_difficulty_score_check;

ALTER TABLE projects
  ADD CONSTRAINT projects_popularity_score_check
    CHECK (popularity_score IS NULL OR (popularity_score >= 0 AND popularity_score <= 100)),
  ADD CONSTRAINT projects_difficulty_score_check
    CHECK (difficulty_score IS NULL OR (difficulty_score >= 0 AND difficulty_score <= 100));

CREATE INDEX IF NOT EXISTS projects_difficulty_score_idx
  ON projects (difficulty_score)
  WHERE difficulty_score IS NOT NULL;

CREATE INDEX IF NOT EXISTS projects_primary_language_idx
  ON projects (primary_language)
  WHERE primary_language IS NOT NULL;

COMMIT;
