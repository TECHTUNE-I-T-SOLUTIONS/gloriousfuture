-- ============================================================
-- CLEANUP SCRIPT: Delete all 1000 seeded questions
-- Use this BEFORE running the new seed files to start fresh
-- ============================================================

DO $$
DECLARE
  v_quiz_id uuid;
  v_questions_deleted int;
  v_options_deleted int;
BEGIN
  -- Get the quiz ID
  SELECT id INTO v_quiz_id FROM public.public_quizzes 
  WHERE title = 'Pupil Enlightenment — General Knowledge' LIMIT 1;
  
  IF v_quiz_id IS NULL THEN
    RAISE NOTICE 'ERROR: Quiz "Pupil Enlightenment — General Knowledge" not found.';
    RETURN;
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '====== CLEANUP: Removing 1000 Questions ======';
  RAISE NOTICE 'Quiz ID: %', v_quiz_id;
  RAISE NOTICE '';

  -- Count questions before deletion
  SELECT COUNT(*) INTO v_questions_deleted 
  FROM public.public_quiz_questions 
  WHERE quiz_id = v_quiz_id;
  
  RAISE NOTICE 'Questions to delete: %', v_questions_deleted;

  -- Delete options first (foreign key constraint)
  DELETE FROM public.public_quiz_options 
  WHERE question_id IN (
    SELECT id FROM public.public_quiz_questions 
    WHERE quiz_id = v_quiz_id
  );
  
  GET DIAGNOSTICS v_options_deleted = ROW_COUNT;
  RAISE NOTICE 'Deleted options: %', v_options_deleted;

  -- Delete questions
  DELETE FROM public.public_quiz_questions 
  WHERE quiz_id = v_quiz_id;
  
  GET DIAGNOSTICS v_questions_deleted = ROW_COUNT;
  RAISE NOTICE 'Deleted questions: %', v_questions_deleted;

  RAISE NOTICE '';
  RAISE NOTICE '✓ CLEANUP COMPLETE!';
  RAISE NOTICE '';
  RAISE NOTICE 'Removed:';
  RAISE NOTICE '  - Questions: %', v_questions_deleted;
  RAISE NOTICE '  - Options: %', v_options_deleted;
  RAISE NOTICE '';
  RAISE NOTICE 'Quiz is now ready for new seed data.';
  RAISE NOTICE '';
END $$;

-- Verify cleanup
SELECT 
  'After Cleanup' as status,
  (SELECT COUNT(*) FROM public.public_quiz_questions 
   WHERE quiz_id = (SELECT id FROM public.public_quizzes 
   WHERE title = 'Pupil Enlightenment — General Knowledge')) as remaining_questions,
  (SELECT COUNT(*) FROM public.public_quiz_options 
   WHERE question_id IN (SELECT id FROM public.public_quiz_questions 
   WHERE quiz_id = (SELECT id FROM public.public_quizzes 
   WHERE title = 'Pupil Enlightenment — General Knowledge'))) as remaining_options;
