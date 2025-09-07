
-- Migration: add school_session_id to cbt_exams (Postgres)
-- Adds an optional FK to school_session so exams can be associated with a session/term
BEGIN;

-- Add column if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='cbt_exams' AND column_name='school_session_id'
  ) THEN
    ALTER TABLE cbt_exams ADD COLUMN school_session_id uuid NULL;
  END IF;
END$$;

-- Create FK constraint if not present
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cbt_exams_school_session_id_fkey') THEN
    ALTER TABLE cbt_exams ADD CONSTRAINT cbt_exams_school_session_id_fkey FOREIGN KEY (school_session_id) REFERENCES school_session(id) ON DELETE SET NULL;
  END IF;
END$$;

-- Create index
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='idx_cbt_exams_school_session_id') THEN
    CREATE INDEX idx_cbt_exams_school_session_id ON cbt_exams(school_session_id);
  END IF;
END$$;

COMMIT;
