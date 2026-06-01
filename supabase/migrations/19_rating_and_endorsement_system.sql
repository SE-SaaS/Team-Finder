-- 19_rating_and_endorsement_system.sql
-- Adds skill endorsements, peer project ratings, and rating disputes.
-- compute_trust_score is defined before adjust_rating_weight because that
-- trigger calls it directly.

-- ============================================
-- 1. skill_endorsements
-- ============================================
CREATE TABLE IF NOT EXISTS skill_endorsements (
  id               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  endorser_user_id UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endorsed_user_id UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id         INTEGER NOT NULL REFERENCES skills(id)   ON DELETE CASCADE,
  note             TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT skill_endorsements_no_self CHECK (endorser_user_id <> endorsed_user_id),
  CONSTRAINT skill_endorsements_unique  UNIQUE (endorser_user_id, endorsed_user_id, skill_id)
);

ALTER TABLE skill_endorsements ENABLE ROW LEVEL SECURITY;

-- SELECT: open to all
CREATE POLICY skill_endorsements_select
  ON skill_endorsements FOR SELECT
  USING (true);

-- INSERT: caller must be the endorser
CREATE POLICY skill_endorsements_insert
  ON skill_endorsements FOR INSERT
  WITH CHECK (endorser_user_id = auth.uid());

-- DELETE: caller must be the endorser
CREATE POLICY skill_endorsements_delete
  ON skill_endorsements FOR DELETE
  USING (endorser_user_id = auth.uid());

-- ============================================
-- 2. project_contributions
-- ============================================
CREATE TABLE IF NOT EXISTS project_contributions (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID         NOT NULL REFERENCES projects(id)  ON DELETE CASCADE,
  rated_by      UUID         NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  rated_user_id UUID         NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  rating        NUMERIC(3,2) NOT NULL CHECK (rating >= 0 AND rating <= 1),
  weight        NUMERIC(5,4) NOT NULL DEFAULT 1.0000,
  note          TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT contributions_no_self_rate CHECK (rated_by <> rated_user_id),
  CONSTRAINT contributions_unique       UNIQUE (project_id, rated_by, rated_user_id)
);

ALTER TABLE project_contributions ENABLE ROW LEVEL SECURITY;

-- SELECT: open to all
CREATE POLICY contributions_select
  ON project_contributions FOR SELECT
  USING (true);

-- INSERT: caller must be the rater, and both rater and rated must be project members
CREATE POLICY contributions_insert
  ON project_contributions FOR INSERT
  WITH CHECK (
    rated_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = project_contributions.project_id
        AND pm.user_id    = project_contributions.rated_by
    )
    AND EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = project_contributions.project_id
        AND pm.user_id    = project_contributions.rated_user_id
    )
  );

-- No UPDATE or DELETE policies -- rows are immutable once inserted.

-- ============================================
-- 3. rating_disputes
-- ============================================
CREATE TABLE IF NOT EXISTS rating_disputes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES project_contributions(id) ON DELETE CASCADE,
  disputed_by     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason          TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'resolved', 'rejected')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT disputes_unique UNIQUE (contribution_id, disputed_by)
);

ALTER TABLE rating_disputes ENABLE ROW LEVEL SECURITY;

-- SELECT: only the user who filed the dispute sees it
CREATE POLICY disputes_select
  ON rating_disputes FOR SELECT
  USING (disputed_by = auth.uid());

-- INSERT: caller must be the disputer
CREATE POLICY disputes_insert
  ON rating_disputes FOR INSERT
  WITH CHECK (disputed_by = auth.uid());

-- ============================================
-- 4. compute_trust_score(p_user_id UUID)
-- Must be defined before adjust_rating_weight which calls it.
-- Returns a value in [0.0, 1.0]:
--   40% from endorsements received (capped at 20)
--   60% from weighted average rating received (already 0-1)
-- Users with no history default to 0.5 (neutral weight).
-- ============================================
CREATE OR REPLACE FUNCTION compute_trust_score(p_user_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_endorsement_count INTEGER;
  v_avg_rating        NUMERIC;
  v_score             NUMERIC;
BEGIN
  SELECT COUNT(*)
    INTO v_endorsement_count
    FROM skill_endorsements
   WHERE endorsed_user_id = p_user_id;

  SELECT COALESCE(AVG(rating * weight), 0.5)
    INTO v_avg_rating
    FROM project_contributions
   WHERE rated_user_id = p_user_id;

  v_score :=
      (LEAST(v_endorsement_count, 20)::NUMERIC / 20.0) * 0.4
    + v_avg_rating                                      * 0.6;

  RETURN GREATEST(0.0, LEAST(1.0, v_score));
END;
$$;

-- ============================================
-- 5. check_project_completed() + trigger
-- Ratings are only accepted once a project reaches 'completed' status.
-- ============================================
CREATE OR REPLACE FUNCTION check_project_completed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status TEXT;
BEGIN
  SELECT status INTO v_status
    FROM projects
   WHERE id = NEW.project_id;

  IF v_status IS NULL THEN
    RAISE EXCEPTION 'project % does not exist', NEW.project_id;
  END IF;

  IF v_status <> 'completed' THEN
    RAISE EXCEPTION
      'ratings can only be submitted for completed projects (current status: %)',
      v_status;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_check_project_completed
  BEFORE INSERT ON project_contributions
  FOR EACH ROW EXECUTE FUNCTION check_project_completed();

-- ============================================
-- 6. adjust_rating_weight() + trigger
-- Sets weight = 0.5 + trust_score, giving range [0.5, 1.5].
-- Runs after check_project_completed so only valid rows reach it.
-- ============================================
CREATE OR REPLACE FUNCTION adjust_rating_weight()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_trust NUMERIC;
BEGIN
  v_trust    := compute_trust_score(NEW.rated_by);
  NEW.weight := 0.5 + v_trust;  -- [0.5, 1.5]
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_adjust_rating_weight
  BEFORE INSERT ON project_contributions
  FOR EACH ROW EXECUTE FUNCTION adjust_rating_weight();

-- ============================================
-- 7. check_shared_project() + trigger
-- Prevents endorsements between users who have never shared a project.
-- ============================================
CREATE OR REPLACE FUNCTION check_shared_project()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM project_members pm_endorser
      JOIN project_members pm_endorsed
        ON pm_endorser.project_id = pm_endorsed.project_id
     WHERE pm_endorser.user_id = NEW.endorser_user_id
       AND pm_endorsed.user_id = NEW.endorsed_user_id
  ) THEN
    RAISE EXCEPTION
      'skill endorsements require both users to share at least one project';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_check_shared_project
  BEFORE INSERT ON skill_endorsements
  FOR EACH ROW EXECUTE FUNCTION check_shared_project();
