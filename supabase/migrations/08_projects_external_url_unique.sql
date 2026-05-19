-- Migration: 08_projects_external_url_unique.sql
-- Intent: enforce uniqueness on projects.external_url for type='external' rows
-- so the prefetcher can never insert a duplicate URL. Partial index because
-- type='university' projects legitimately have NULL external_url; only rows
-- with a non-null external_url participate in the uniqueness check.

BEGIN;

CREATE UNIQUE INDEX projects_external_url_unique
  ON projects (external_url)
  WHERE external_url IS NOT NULL;

COMMIT;
