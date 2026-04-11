-- Seed file: General Knowledge Quiz (Easy, Ages 8-10)
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
  '8-10',
  ARRAY['general', 'knowledge', 'fun', 'trivia']
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
  time_limit_seconds,
  explanation
FROM (
  SELECT
    (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') as id,
    'What is the capital of France?' as question_text,
    1 as order_index,
    20 as time_limit_seconds,
    'Paris is the capital and largest city of France, located in northern France.' as explanation
  UNION ALL
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'How many continents are there?', 2, 20, 'There are 7 continents: Africa, Antarctica, Asia, Europe, North America, Oceania, and South America.'
  UNION ALL
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'What is the largest planet in our solar system?', 3, 20, 'Jupiter is the largest planet in our solar system, about 11 times wider than Earth.'
  UNION ALL
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'What color are most tree leaves?', 4, 20, 'Most tree leaves are green because they contain chlorophyll, which helps plants make food from sunlight.'
  UNION ALL
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'How many sides does a triangle have?', 5, 20, 'A triangle has 3 sides and 3 angles.'
  UNION ALL
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'What is the fastest land animal?', 6, 20, 'The cheetah is the fastest land animal, reaching speeds up to 70 mph (112 km/h).'
  UNION ALL
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'Which ocean is the largest?', 7, 20, 'The Pacific Ocean is the largest ocean on Earth.'
  UNION ALL
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'What does a bee collect from flowers?', 8, 20, 'Bees collect nectar and pollen from flowers, which they use to make honey.'
  UNION ALL
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'How many legs does an insect have?', 9, 20, 'Insects have 6 legs, which is one characteristic that defines them.'
  UNION ALL
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge'), 'What is the main ingredient in bread?', 10, 20, 'Flour is the main ingredient in bread, usually made from wheat.'
) AS questions;

-- Insert options
INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) 
SELECT question_id, option_text, is_correct, order_index FROM (
  -- Q1: Capital of France
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 1) as question_id, 'Paris' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 1), 'London', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 1), 'Berlin', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 1), 'Madrid', false, 4
  
  -- Q2: Continents
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 2), '7', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 2), '5', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 2), '8', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 2), '6', false, 4
  
  -- Q3: Largest planet
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 3), 'Jupiter', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 3), 'Saturn', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 3), 'Neptune', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 3), 'Uranus', false, 4
  
  -- Q4: Tree leaves color
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 4), 'Green', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 4), 'Red', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 4), 'Yellow', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 4), 'Brown', false, 4
  
  -- Q5: Triangle sides
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 5), '3', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 5), '4', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 5), '5', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 5), '6', false, 4
  
  -- Q6: Fastest animal
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 6), 'Cheetah', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 6), 'Lion', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 6), 'Horse', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 6), 'Greyhound', false, 4
  
  -- Q7: Largest ocean
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 7), 'Pacific Ocean', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 7), 'Atlantic Ocean', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 7), 'Indian Ocean', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 7), 'Arctic Ocean', false, 4
  
  -- Q8: Bee collects
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 8), 'Nectar and pollen', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 8), 'Leaves', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 8), 'Seeds', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 8), 'Water', false, 4
  
  -- Q9: Insect legs
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 9), '6', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 9), '4', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 9), '8', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 9), '10', false, 4
  
  -- Q10: Bread ingredient
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 10), 'Flour', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 10), 'Sugar', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 10), 'Butter', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'General Knowledge Challenge') AND order_index = 10), 'Eggs', false, 4
) AS options;

-- Update total questions
UPDATE public.public_quizzes 
SET total_questions = 10
WHERE title = 'General Knowledge Challenge';

COMMIT;
