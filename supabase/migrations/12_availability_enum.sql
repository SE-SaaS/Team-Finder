-- Constrain profiles.availability to the four values understood by the
-- matching algorithm (frontend/src/algorithm/availScore.ts). Pre-existing
-- values were numeric strings (e.g. "20") which already scored 0 in matching,
-- so they're nulled out here -- users re-pick on next profile save.

UPDATE profiles
SET availability = NULL
WHERE availability IS NOT NULL
  AND availability NOT IN ('Full-time', 'Flexible', 'Evenings', 'Weekends');

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_availability_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_availability_check
  CHECK (availability IS NULL OR availability IN ('Full-time', 'Flexible', 'Evenings', 'Weekends'));
