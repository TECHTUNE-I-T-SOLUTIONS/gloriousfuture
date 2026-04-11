-- Seed file: Mathematics Quiz (Easy, Ages 8-10)
BEGIN;

INSERT INTO public.public_quizzes (
  title,
  description,
  is_published,
  is_public,
  time_per_question,
  difficulty_level,
  age_group,
  tags
) VALUES (
  'Mathematics Mastery',
  'Challenge your math skills with fun arithmetic, geometry, and number problems.',
  true,
  true,
  25,
  'easy',
  '8-10',
  ARRAY['math', 'arithmetic', 'learning', 'education']
);

-- Insert questions
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
  25,
  explanation
FROM (
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') as id, 'What is 12 + 18?', 1, 'When adding 12 + 18, first add the tens (10 + 10 = 20) and then add the ones (2 + 8 = 10). Total: 20 + 10 = 30.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'What is 9 × 7?', 2, 'Multiply 9 by 7 to get 63. Practice your times tables!' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'What is 50 ÷ 5?', 3, 'Division is the opposite of multiplication. 50 ÷ 5 = 10 because 5 × 10 = 50.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'What is 25% of 100?', 4, 'Percent means "out of 100". 25% = 25/100 = 0.25 × 100 = 25.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'How many sides does a square have?', 5, 'A square has 4 equal sides and 4 right angles (90 degrees each).' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'What is the perimeter of a square with side 5cm?', 6, 'Perimeter = 4 × side = 4 × 5 = 20cm. Perimeter is the distance around an object.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'What is 100 - 37?', 7, 'Subtract: 100 - 37 = 63. Check: 37 + 63 = 100 ✓' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'How many minutes are in 2 hours?', 8, 'There are 60 minutes in 1 hour, so 2 hours = 2 × 60 = 120 minutes.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'What is the area of a rectangle with length 6cm and width 4cm?', 9, 'Area = length × width = 6 × 4 = 24 square cm.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'Which number is the largest: 347, 274, 198, or 256?', 10, 'Compare the hundreds digit first: 347 has the highest hundreds digit (3), so 347 is largest.' as explanation
) AS questions;

-- Insert options
INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 1), '30', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 1), '29', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 1), '31', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 1), '32', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 2), '63', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 2), '62', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 2), '56', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 2), '72', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 3), '10', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 3), '8', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 3), '9', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 3), '11', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 4), '25', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 4), '50', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 4), '75', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 4), '100', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 5), '4', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 5), '3', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 5), '5', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 5), '6', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 6), '20 cm', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 6), '15 cm', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 6), '25 cm', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 6), '10 cm', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 7), '63', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 7), '62', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 7), '64', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 7), '65', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 8), '120', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 8), '100', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 8), '110', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 8), '130', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 9), '24 square cm', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 9), '20 square cm', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 9), '30 square cm', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 9), '28 square cm', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 10), '347', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 10), '274', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 10), '198', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery') AND order_index = 10), '256', false, 4
) AS options;

UPDATE public.public_quizzes 
SET total_questions = 10
WHERE title = 'Mathematics Mastery';

COMMIT;
