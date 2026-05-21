-- Migration: 11_projects_difficulty_nullable.sql
-- Intent: difficulty is now an optional, source-derived label. Some sources
-- (HuggingFace Models/Datasets/Spaces) have no native difficulty signal, so
-- their rows store NULL. The label is computed by the prefetcher's
-- per-source scorer; downstream filters can either include or skip NULL.

BEGIN;

ALTER TABLE projects ALTER COLUMN difficulty DROP NOT NULL;

COMMIT;
