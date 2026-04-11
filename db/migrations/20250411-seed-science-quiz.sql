-- Seed file: Science Quiz (Easy, Ages 8-12)

BEGIN;

INSERT INTO public.public_quizzes (
  title, description, is_published, is_public, time_per_question, difficulty_level, age_group, tags
) VALUES (
  'Science Explorer', 
  'Discover the wonders of biology, physics, and chemistry with fun science questions.',
  true, true, 20, 'easy', '8-12',
  ARRAY['science', 'biology', 'nature', 'learning']
);

INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds, explanation)
VALUES
  ((SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'What do plants need to grow?', 1, 20, 'Plants need sunlight, water, and nutrients from soil to grow and survive.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'How many bones does a human adult have?', 2, 20, 'An adult human has 206 bones. Babies are born with more bones that fuse together as they grow.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'What is the process by which plants make food?', 3, 20, 'Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to make food (glucose).'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'What gas do humans breathe in?', 4, 20, 'Humans breathe in oxygen, which is essential for life. We breathe out carbon dioxide.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'What is the largest organ in the human body?', 5, 20, 'The skin is the largest organ of the human body, covering and protecting everything inside.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'Are all bacteria harmful?', 6, 20, 'No, not all bacteria are harmful. Some bacteria help us digest food, make yogurt, and fight off disease.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'What do most animals eat?', 7, 20, 'Most animals are either herbivores (eat plants), carnivores (eat meat), or omnivores (eat both).'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'How long does it take Earth to orbit the Sun?', 8, 20, 'It takes Earth 365.25 days (one year) to complete one orbit around the Sun.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'What is the freezing point of water?', 9, 20, 'Water freezes at 0 degrees Celsius (32 degrees Fahrenheit).'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'What are the three states of matter?', 10, 20, 'The three states of matter are solid, liquid, and gas.')
;

WITH quiz_questions AS (
  SELECT id, order_index FROM public.public_quiz_questions 
  WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer')
  ORDER BY order_index
)
INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index) VALUES
  -- Q1: What plants need
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'Sunlight, water, and nutrients', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'Only water', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'Only sunlight', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'Only nutrients', false, 4),
  
  -- Q2: Bones in adult
  ((SELECT id FROM quiz_questions WHERE order_index = 2), '206', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), '186', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), '250', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), '100', false, 4),
  
  -- Q3: Process of making food
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Photosynthesis', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Respiration', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Digestion', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Fermentation', false, 4),
  
  -- Q4: Gas humans breathe in
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Oxygen', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Carbon dioxide', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Nitrogen', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Hydrogen', false, 4),
  
  -- Q5: Largest organ
  ((SELECT id FROM quiz_questions WHERE order_index = 5), 'Skin', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), 'Heart', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), 'Brain', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), 'Liver', false, 4),
  
  -- Q6: Bacteria harmful
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'No, some are helpful', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Yes, all are harmful', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Maybe sometimes', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'We don''t know', false, 4),
  
  -- Q7: What animals eat
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Plants, meat, or both', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Only plants', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Only meat', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Air', false, 4),
  
  -- Q8: Earth orbit time
  ((SELECT id FROM quiz_questions WHERE order_index = 8), '365 days', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), '200 days', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), '500 days', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), '24 hours', false, 4),
  
  -- Q9: Freezing point
  ((SELECT id FROM quiz_questions WHERE order_index = 9), '0 degrees Celsius', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), '10 degrees Celsius', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), '-10 degrees Celsius', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), '100 degrees Celsius', false, 4),
  
  -- Q10: States of matter
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Solid, liquid, gas', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Solid and liquid', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Liquid and gas', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Only solid', false, 4);

UPDATE public.public_quizzes 
SET total_questions = (SELECT COUNT(*) FROM public.public_quiz_questions WHERE quiz_id = public.public_quizzes.id)
WHERE title = 'Science Explorer';

COMMIT;
