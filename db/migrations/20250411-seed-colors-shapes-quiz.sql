-- Seed file: Colors & Shapes Quiz (Easy, Ages 6-8)
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
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') as id, 'What color is the sky on a sunny day?' as question_text, 1 as order_index, 15 as time_limit_seconds, 'The sky appears blue due to the scattering of blue light waves.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes'), 'Which shape has 4 equal sides and 4 corners?' as question_text, 2 as order_index, 15 as time_limit_seconds, 'A square has 4 equal sides and 4 corners. All sides are the same length.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes'), 'What color do you get when you mix red and yellow?' as question_text, 3 as order_index, 15 as time_limit_seconds, 'When you mix red and yellow, you get orange.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes'), 'How many sides does a triangle have?' as question_text, 4 as order_index, 15 as time_limit_seconds, 'A triangle has 3 sides and 3 corners.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes'), 'Which shape is round with no corners?' as question_text, 5 as order_index, 15 as time_limit_seconds, 'A circle is round and has no corners or sides.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes'), 'What color is grass?' as question_text, 6 as order_index, 15 as time_limit_seconds, 'Grass is green because it contains chlorophyll.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes'), 'How many corners does a rectangle have?' as question_text, 7 as order_index, 15 as time_limit_seconds, 'A rectangle has 4 corners like a square, but the sides are not all equal.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes'), 'What color is snow?' as question_text, 8 as order_index, 15 as time_limit_seconds, 'Snow appears white because it reflects light.' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 1) as question_id, 'Blue' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 1), 'Green', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 1), 'Purple', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 1), 'Red', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 2), 'Square', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 2), 'Circle', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 2), 'Triangle', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 2), 'Star', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 3), 'Orange', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 3), 'Purple', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 3), 'Brown', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 3), 'Pink', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 4), '3', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 4), '4', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 4), '5', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 4), '6', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 5), 'Circle', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 5), 'Square', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 5), 'Triangle', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 5), 'Diamond', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 6), 'Green', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 6), 'Blue', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 6), 'Brown', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 6), 'Yellow', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 7), '4', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 7), '3', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 7), '5', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 7), '6', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 8), 'White', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 8), 'Light blue', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 8), 'Gray', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Colors & Shapes') AND order_index = 8), 'Light gray', false, 4
) AS options;

UPDATE public.public_quizzes 
SET total_questions = 8
WHERE title = 'Colors & Shapes';

COMMIT;
