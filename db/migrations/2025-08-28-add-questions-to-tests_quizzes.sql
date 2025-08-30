-- Add questions jsonb column to tests_quizzes so teachers can store structured questions
ALTER TABLE IF EXISTS tests_quizzes
  ADD COLUMN IF NOT EXISTS questions jsonb DEFAULT '[]'::jsonb;

-- Optional: create a GIN index for querying inside questions
CREATE INDEX IF NOT EXISTS idx_tests_quizzes_questions_gin ON tests_quizzes USING gin (questions jsonb_path_ops);
