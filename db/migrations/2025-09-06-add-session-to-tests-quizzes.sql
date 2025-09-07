-- Migration: add school_session_id to tests_quizzes
BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='tests_quizzes' AND column_name='school_session_id'
  ) THEN
    ALTER TABLE tests_quizzes ADD COLUMN school_session_id uuid NULL;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tests_quizzes_school_session_id_fkey') THEN
    ALTER TABLE tests_quizzes ADD CONSTRAINT tests_quizzes_school_session_id_fkey FOREIGN KEY (school_session_id) REFERENCES school_session(id) ON DELETE SET NULL;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='idx_tests_quizzes_school_session_id') THEN
    CREATE INDEX idx_tests_quizzes_school_session_id ON tests_quizzes(school_session_id);
  END IF;
END$$;

COMMIT;
