-- ============================================
-- Migration 06: Allow authenticated users to create external projects
-- ============================================
-- The original INSERT policy on `projects` only allowed type = 'university'.
-- This blocked the Create Project form whenever a user picked "External".
--
-- This migration replaces that policy with a unified one that allows any
-- project type, while still enforcing that creator_id matches the
-- authenticated user (preventing impersonation).
-- ============================================

DROP POLICY IF EXISTS "Authenticated users can create university projects" ON projects;

CREATE POLICY "Authenticated users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = creator_id);
