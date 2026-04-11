-- Seed file: Basic Arithmetic Quiz (Medium, Ages 8-10)
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
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') as id, 'What is 7 + 8?' as question_text, 1 as order_index, 20 as time_limit_seconds, '7 + 8 = 15. Count on from 7 eight times.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic'), 'What is 15 - 6?' as question_text, 2 as order_index, 20 as time_limit_seconds, '15 - 6 = 9. Subtraction is removing items.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic'), 'What is 3 × 4?' as question_text, 3 as order_index, 20 as time_limit_seconds, '3 × 4 = 12. Multiplication is repeated addition.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic'), 'What is 20 ÷ 5?' as question_text, 4 as order_index, 20 as time_limit_seconds, '20 ÷ 5 = 4. Division is sharing equally.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic'), 'What is 12 + 13?' as question_text, 5 as order_index, 20 as time_limit_seconds, '12 + 13 = 25. Adding two-digit numbers.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic'), 'What is 25 - 9?' as question_text, 6 as order_index, 20 as time_limit_seconds, '25 - 9 = 16. Subtracting from a two-digit number.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic'), 'What is 6 × 7?' as question_text, 7 as order_index, 20 as time_limit_seconds, '6 × 7 = 42. Learning multiplication tables.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic'), 'What is 36 ÷ 6?' as question_text, 8 as order_index, 20 as time_limit_seconds, '36 ÷ 6 = 6. Division is the opposite of multiplication.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic'), 'What is 50 - 23?' as question_text, 9 as order_index, 20 as time_limit_seconds, '50 - 23 = 27. Subtraction with larger numbers.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic'), 'What is 8 × 8?' as question_text, 10 as order_index, 20 as time_limit_seconds, '8 × 8 = 64. Squaring a number.' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 1) as question_id, '15' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 1), '14', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 1), '16', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 1), '13', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 2), '9' as question_id, true as option_text, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 2), '8', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 2), '10', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 2), '7', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 3), '12', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 3), '11', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 3), '13', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 3), '10', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 4), '4', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 4), '5', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 4), '3', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 4), '6', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 5), '25', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 5), '24', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 5), '26', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 5), '23', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 6), '16', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 6), '15', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 6), '17', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 6), '14', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 7), '42', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 7), '41', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 7), '43', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 7), '40', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 8), '6', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 8), '5', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 8), '7', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 8), '4', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 9), '27', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 9), '26', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 9), '28', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 9), '25', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 10), '64', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 10), '63', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 10), '65', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Basic Arithmetic') AND order_index = 10), '60', false, 4
) AS options;

UPDATE public.public_quizzes 
SET total_questions = 10
WHERE title = 'Basic Arithmetic';

COMMIT;
