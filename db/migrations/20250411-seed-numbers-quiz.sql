-- Seed file: Numbers 1-10 Quiz (Easy, Ages 6-8)
BEGIN;

INSERT INTO public.public_quiz_questions (
  quiz_id,
  question_text,
  order_index,
  time_limit_seconds,
  explanation
) SELECT
  id,
  question_text,
  order_index,
  time_limit_seconds,
  explanation
FROM (
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') as id, 'What comes after 3?' as question_text, 1 as order_index, 15 as time_limit_seconds, 'When counting, 4 comes after 3.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10'), 'How many fingers do you have on one hand?' as question_text, 2 as order_index, 15 as time_limit_seconds, 'Most people have 5 fingers on one hand.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10'), 'What is 2 + 3?' as question_text, 3 as order_index, 15 as time_limit_seconds, '2 + 3 = 5. This is basic addition.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10'), 'How many days are in a week?' as question_text, 4 as order_index, 15 as time_limit_seconds, 'There are 7 days in a week.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10'), 'What number comes before 8?' as question_text, 5 as order_index, 15 as time_limit_seconds, '7 comes before 8 when counting.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10'), 'How many legs does a dog have?' as question_text, 6 as order_index, 15 as time_limit_seconds, 'A dog has 4 legs.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10'), 'What is 5 + 5?' as question_text, 7 as order_index, 15 as time_limit_seconds, '5 + 5 = 10. This makes a complete set.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10'), 'How many wheels does a bicycle have?' as question_text, 8 as order_index, 15 as time_limit_seconds, 'A bicycle has 2 wheels.' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 1) as question_id, '4' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 1), '2', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 1), '5', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 1), '6', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 2), '5', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 2), '4', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 2), '6', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 2), '10', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 3), '5', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 3), '6', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 3), '4', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 3), '7', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 4), '7', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 4), '5', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 4), '8', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 4), '6', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 5), '7', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 5), '6', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 5), '9', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 5), '5', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 6), '4', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 6), '3', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 6), '5', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 6), '2', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 7), '10', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 7), '8', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 7), '9', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 7), '11', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 8), '2', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 8), '3', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 8), '1', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Numbers 1-10') AND order_index = 8), '4', false, 4
) AS options;

UPDATE public.public_quizzes 
SET total_questions = 8
WHERE title = 'Numbers 1-10';

COMMIT;
