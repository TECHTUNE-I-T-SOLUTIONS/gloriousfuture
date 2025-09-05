-- Add class_id column to pupils, backfill using classes.name, and add FK constraint
BEGIN;

-- 1. Add nullable class_id column
ALTER TABLE pupils
  ADD COLUMN IF NOT EXISTS class_id uuid;

-- 2. Backfill class_id from classes table by matching name (case-insensitive)
--    For rows that don't match, leave class_id NULL and insert into a log table for manual review
-- Create a log table for unmatched class texts
CREATE TABLE IF NOT EXISTS migration_unmatched_pupil_classes (
  pupil_id uuid PRIMARY KEY,
  class_text text,
  created_at timestamptz DEFAULT now()
);

-- Backfill
WITH matched AS (
  SELECT p.id as pupil_id, c.id as class_id
  FROM pupils p
  JOIN classes c ON lower(trim(c.name)) = lower(trim(p.class))
)
UPDATE pupils p
SET class_id = m.class_id
FROM matched m
WHERE p.id = m.pupil_id;

-- Insert unmatched rows into log for manual resolution
INSERT INTO migration_unmatched_pupil_classes(pupil_id, class_text)
SELECT p.id, p.class
FROM pupils p
WHERE p.class IS NOT NULL
  AND p.class <> ''
  AND p.id NOT IN (
    SELECT pupil_id FROM (
      SELECT p.id as pupil_id
      FROM pupils p
      JOIN classes c ON lower(trim(c.name)) = lower(trim(p.class))
    ) t
  )
ON CONFLICT (pupil_id) DO NOTHING;

-- 3. Add FK constraint (use ON DELETE SET NULL for safety)
ALTER TABLE pupils
  ADD CONSTRAINT IF NOT EXISTS pupils_class_id_fkey FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL;

COMMIT;

-- Verification queries (run after migration):
-- SELECT count(*) FROM pupils WHERE class_id IS NULL AND (class IS NULL OR class = '');
-- SELECT * FROM migration_unmatched_pupil_classes LIMIT 100; -- inspect and fix manually

-- Note: after review, you can DROP COLUMN pupils.class if you choose, but keep for compatibility until all code paths
-- have been updated to read/write class_id.
