-- Migration: add cbt_exam_id to exam_results (nullable) and create tests_quizzes + test_submissions tables
-- Run this in your Postgres/Supabase database. Review and backup before applying.

BEGIN;

-- 1) Add cbt_exam_id column to exam_results so rows can reference cbt_exams.id
ALTER TABLE IF EXISTS exam_results
  ADD COLUMN IF NOT EXISTS cbt_exam_id uuid;

-- Create an index to speed up lookups by exam id
CREATE INDEX IF NOT EXISTS idx_exam_results_cbt_exam_id ON exam_results(cbt_exam_id);

-- NOTE: If you have a way to map existing exam_results rows to cbt_exams (for example exam_results has a column exam_id or exam_title), do a BACKFILL here.
-- Example (CUSTOMIZE before running):
-- UPDATE exam_results er
-- SET cbt_exam_id = ce.id
-- FROM cbt_exams ce
-- WHERE er.some_identifier = ce.some_identifier;

-- 2) Create tests_quizzes table for teacher-managed tests/quizzes
CREATE TABLE IF NOT EXISTS tests_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  due_date date,
  class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  teacher_id uuid REFERENCES teachers(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tests_quizzes_class_id ON tests_quizzes(class_id);
CREATE INDEX IF NOT EXISTS idx_tests_quizzes_teacher_id ON tests_quizzes(teacher_id);

-- 3) Create test_submissions table to store pupil answers and scores for tests_quizzes
CREATE TABLE IF NOT EXISTS test_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL REFERENCES tests_quizzes(id) ON DELETE CASCADE,
  pupil_id uuid NOT NULL REFERENCES pupils(id) ON DELETE CASCADE,
  answers jsonb,
  score numeric,
  submitted_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_test_submissions_test_id ON test_submissions(test_id);
CREATE INDEX IF NOT EXISTS idx_test_submissions_pupil_id ON test_submissions(pupil_id);

COMMIT;
