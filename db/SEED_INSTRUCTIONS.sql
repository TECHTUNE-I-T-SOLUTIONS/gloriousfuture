-- ============================================================
-- COMPLETE 1000-QUESTION QUIZ - EXECUTION MASTER SCRIPT
-- ============================================================
-- HOW TO USE THIS SCRIPT:
--
-- This file provides the sequence for running all 5 parts.
-- You have 2 options:
--
-- OPTION 1: Run each part individually (Recommended)
-- ============================================================
--
-- Step 1: Run seed_quiz_part1_q1-200.sql
--   - Questions 1-200 (Basic Knowledge)
--   - Wait for: "Part 1 complete" message
--   - Adds: 200 questions + 800 options
--
-- Step 2: Run seed_quiz_part2_q201-400.sql
--   - Questions 201-400 (STEM Foundations)
--   - Wait for: "Part 2 complete" message
--   - Adds: 200 questions + 800 options
--
-- Step 3: Run seed_quiz_part3_q401-600.sql
--   - Questions 401-600 (Culture & Arts)
--   - Wait for: "Part 3 complete" message
--   - Adds: 200 questions + 800 options
--
-- Step 4: Run seed_quiz_part4_q601-800.sql
--   - Questions 601-800 (Advanced Knowledge)
--   - Wait for: "Part 4 complete" message
--   - Adds: 200 questions + 800 options
--
-- Step 5: Run seed_quiz_part5_q801-1000.sql
--   - Questions 801-1000 (Modern Studies)
--   - Wait for: "Part 5 complete" message
--   - Adds: 200 questions + 800 options
--
-- After all 5 complete: 1000 questions + 4000 options ✓
--
-- ============================================================
-- OPTION 2: Run all parts via terminal/CLI (requires Supabase CLI)
-- ============================================================
--
-- supabase db push  (if needed)
--
-- For each part:
-- supabase sql < seed_quiz_part1_q1-200.sql
-- supabase sql < seed_quiz_part2_q201-400.sql
-- supabase sql < seed_quiz_part3_q401-600.sql
-- supabase sql < seed_quiz_part4_q601-800.sql
-- supabase sql < seed_quiz_part5_q801-1000.sql
--
-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
--
-- Verify quiz exists:
SELECT 
  id, title, created_at,
  (SELECT COUNT(*) FROM public.public_quiz_questions WHERE quiz_id = public.public_quizzes.id) as total_questions
FROM public.public_quizzes 
WHERE title = 'Pupil Enlightenment — General Knowledge';
--
-- Verify question count by part:
SELECT 
  CASE 
    WHEN order_index BETWEEN 1 AND 200 THEN 'Part 1 (Q1-200)'
    WHEN order_index BETWEEN 201 AND 400 THEN 'Part 2 (Q201-400)'
    WHEN order_index BETWEEN 401 AND 600 THEN 'Part 3 (Q401-600)'
    WHEN order_index BETWEEN 601 AND 800 THEN 'Part 4 (Q601-800)'
    WHEN order_index BETWEEN 801 AND 1000 THEN 'Part 5 (Q801-1000)'
  END as part,
  COUNT(*) as question_count,
  COUNT(*) * 4 as total_options
FROM public.public_quiz_questions 
WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Pupil Enlightenment — General Knowledge')
GROUP BY part
ORDER BY part;
--
-- Verify total count:
SELECT 
  (SELECT COUNT(*) FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Pupil Enlightenment — General Knowledge')) as total_questions,
  (SELECT COUNT(*) FROM public.public_quiz_options WHERE question_id IN (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Pupil Enlightenment — General Knowledge'))) as total_options;
--
-- Delete and restart (if needed):
DELETE FROM public.public_quiz_options 
WHERE question_id IN (
  SELECT id FROM public.public_quiz_questions 
  WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Pupil Enlightenment — General Knowledge')
);

DELETE FROM public.public_quiz_questions 
WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Pupil Enlightenment — General Knowledge');
--
-- ============================================================
-- NOTE: This file is documentation + SQL reference only.
-- Actual seed data is in the individual part files:
--   - seed_quiz_part1_q1-200.sql
--   - seed_quiz_part2_q201-400.sql
--   - seed_quiz_part3_q401-600.sql
--   - seed_quiz_part4_q601-800.sql
--   - seed_quiz_part5_q801-1000.sql
-- ============================================================
