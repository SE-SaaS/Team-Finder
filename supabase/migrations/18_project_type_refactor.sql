-- Migration 18: Project type semantic change
-- Changes `type` from source (university | external)
-- to nature (code | research | theory | design | data | other)

UPDATE projects SET type = 'external' WHERE type = 'university';

ALTER TABLE projects DROP CONSTRAINT projects_type_check;

UPDATE projects SET type = 'code' WHERE type = 'external';

ALTER TABLE projects ADD CONSTRAINT projects_type_check
CHECK (type IN ('code', 'research', 'theory', 'design', 'data', 'other'));
