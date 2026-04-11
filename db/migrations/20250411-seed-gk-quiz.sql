-- Seed file: General Knowledge Quiz (Easy, Ages 8-12)
-- This file seeds a complete general knowledge quiz with questions and options

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
  'General Knowledge Challenge',
  'Test your general knowledge with fun and interesting questions about the world around us.',
  true,
  true,
  20,
  'easy',
  '8-12',
  ARRAY['general', 'knowledge', 'fun', 'trivia']
) RETURNING id \gset quiz_gk_

-- Insert questions and options for General Knowledge Quiz
INSERT INTO public.public_quiz_questions (
  quiz_id,
  question_text,
  order_index,
  time_limit_seconds,
  explanation
) VALUES
  ((SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'What is the capital of France?', 1, 20, 'Paris is the capital and largest city of France, located in northern France.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'How many continents are there?', 2, 20, 'There are 7 continents: Africa, Antarctica, Asia, Europe, North America, Oceania, and South America.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'What is the largest planet in our solar system?', 3, 20, 'Jupiter is the largest planet in our solar system, about 11 times wider than Earth.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'What color are most tree leaves?', 4, 20, 'Most tree leaves are green because they contain chlorophyll, which helps plants make food from sunlight.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'How many sides does a triangle have?', 5, 20, 'A triangle has 3 sides and 3 angles.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'What is the fastest land animal?', 6, 20, 'The cheetah is the fastest land animal, reaching speeds up to 70 mph (112 km/h).'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'Which ocean is the largest?', 7, 20, 'The Pacific Ocean is the largest ocean on Earth.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'What does a bee collect from flowers?', 8, 20, 'Bees collect nectar and pollen from flowers, which they use to make honey.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'How many legs does an insect have?', 9, 20, 'Insects have 6 legs, which is one characteristic that defines them.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'What is the main ingredient in bread?', 10, 20, 'Flour is the main ingredient in bread, usually made from wheat.')
;

-- Get the latest inserted question IDs and insert options
WITH quiz_questions AS (
  SELECT id, order_index FROM public.public_quiz_questions 
  WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge')
  ORDER BY order_index
)
INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) VALUES
  -- Question 1: Capital of France
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'Paris', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'London', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'Berlin', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'Madrid', false, 4),
  
  -- Question 2: Number of continents
  ((SELECT id FROM quiz_questions WHERE order_index = 2), '7', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), '5', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), '8', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), '6', false, 4),
  
  -- Question 3: Largest planet
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Jupiter', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Saturn', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Neptune', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Uranus', false, 4),
  
  -- Question 4: Color of tree leaves
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Green', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Red', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Yellow', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Brown', false, 4),
  
  -- Question 5: Sides of triangle
  ((SELECT id FROM quiz_questions WHERE order_index = 5), '3', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), '4', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), '5', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), '6', false, 4),
  
  -- Question 6: Fastest land animal
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Cheetah', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Lion', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Horse', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Greyhound', false, 4),
  
  -- Question 7: Largest ocean
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Pacific Ocean', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Atlantic Ocean', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Indian Ocean', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Arctic Ocean', false, 4),
  
  -- Question 8: What bee collects
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'Nectar and pollen', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'Leaves', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'Seeds', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'Water', false, 4),
  
  -- Question 9: Legs of insect
  ((SELECT id FROM quiz_questions WHERE order_index = 9), '6', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), '4', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), '8', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), '10', false, 4),
  
  -- Question 10: Main ingredient in bread
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Flour', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Sugar', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Butter', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Eggs', false, 4);

-- Update total_questions count
UPDATE public.public_quizzes 
SET total_questions = (
  SELECT COUNT(*) FROM public.public_quiz_questions 
  WHERE quiz_id = public.public_quizzes.id
)
WHERE title = 'General Knowledge Challenge';

COMMIT;
