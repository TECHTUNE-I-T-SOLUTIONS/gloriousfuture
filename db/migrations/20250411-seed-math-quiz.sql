-- Seed file: Mathematics Quiz (Easy-Medium, Ages 8-12)

BEGIN;

-- Insert the quiz
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
) VALUES
  ((SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'What is 12 + 18?', 1, 25, '12 + 18 = 30. Add the tens (10 + 10 = 20) and the ones (2 + 8 = 10).'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'What is 9 × 7?', 2, 25, '9 × 7 = 63. Multiplication means repeated addition.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'What is 50 ÷ 5?', 3, 25, '50 ÷ 5 = 10. Division is the opposite of multiplication.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'What is 25% of 100?', 4, 25, '25% of 100 = 25. Percent means "out of 100", so 25/100 = 25.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'How many sides does a square have?', 5, 25, 'A square has 4 equal sides and 4 right angles (90 degrees each).'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'What is the perimeter of a square with side 5cm?', 6, 25, 'Perimeter = 4 × side = 4 × 5 = 20cm. The perimeter is the distance around an object.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'What is 100 - 37?', 7, 25, '100 - 37 = 63. Subtraction is the opposite of addition.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'How many minutes are in 2 hours?', 8, 25, 'There are 60 minutes in 1 hour, so 2 hours = 2 × 60 = 120 minutes.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'What is the area of a rectangle with length 6cm and width 4cm?', 9, 25, 'Area = length × width = 6 × 4 = 24 square cm.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery'), 'Which number is the largest?', 10, 25, 'Compare carefully: 347 is larger than 274, 198, and 256.')
;

-- Insert options for math questions
WITH quiz_questions AS (
  SELECT id, order_index FROM public.public_quiz_questions 
  WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Mathematics Mastery')
  ORDER BY order_index
)
INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) VALUES
  -- Q1: 12 + 18
  ((SELECT id FROM quiz_questions WHERE order_index = 1), '30', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), '29', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), '31', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), '32', false, 4),
  
  -- Q2: 9 × 7
  ((SELECT id FROM quiz_questions WHERE order_index = 2), '63', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), '62', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), '56', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), '72', false, 4),
  
  -- Q3: 50 ÷ 5
  ((SELECT id FROM quiz_questions WHERE order_index = 3), '10', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), '8', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), '9', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), '11', false, 4),
  
  -- Q4: 25% of 100
  ((SELECT id FROM quiz_questions WHERE order_index = 4), '25', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), '50', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), '75', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), '100', false, 4),
  
  -- Q5: Sides of square
  ((SELECT id FROM quiz_questions WHERE order_index = 5), '4', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), '3', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), '5', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), '6', false, 4),
  
  -- Q6: Perimeter of square
  ((SELECT id FROM quiz_questions WHERE order_index = 6), '20cm', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), '15cm', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), '25cm', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), '10cm', false, 4),
  
  -- Q7: 100 - 37
  ((SELECT id FROM quiz_questions WHERE order_index = 7), '63', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), '62', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), '64', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), '65', false, 4),
  
  -- Q8: Minutes in 2 hours
  ((SELECT id FROM quiz_questions WHERE order_index = 8), '120', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), '100', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), '110', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), '130', false, 4),
  
  -- Q9: Area of rectangle
  ((SELECT id FROM quiz_questions WHERE order_index = 9), '24 square cm', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), '20 square cm', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), '30 square cm', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), '28 square cm', false, 4),
  
  -- Q10: Largest number
  ((SELECT id FROM quiz_questions WHERE order_index = 10), '347', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), '274', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), '198', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), '256', false, 4);

-- Update total questions
UPDATE public.public_quizzes 
SET total_questions = (
  SELECT COUNT(*) FROM public.public_quiz_questions 
  WHERE quiz_id = public.public_quizzes.id
)
WHERE title = 'Mathematics Mastery';

COMMIT;
