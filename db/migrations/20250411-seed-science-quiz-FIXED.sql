-- Seed file: Science Quiz (Easy, Ages 8-10)
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
  'Science Explorer',
  'Discover the wonders of science with questions about nature, animals, and the environment.',
  true,
  true,
  20,
  'easy',
  '8-10',
  ARRAY['science', 'nature', 'biology', 'learning']
);

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
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') as id, 'What do plants need to grow?' as question_text, 1 as order_index, 20 as time_limit_seconds, 'Plants need sunlight, water, and nutrients (from soil) to grow and produce food.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'What is the process that plants use to make food?' as question_text, 2 as order_index, 20 as time_limit_seconds, 'Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to make their own food.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'How many bones does an adult human have?' as question_text, 3 as order_index, 20 as time_limit_seconds, 'An adult human body has 206 bones. Babies are born with more bones that fuse together as they grow.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'What is the largest organ in the human body?' as question_text, 4 as order_index, 20 as time_limit_seconds, 'The skin is the largest organ in the human body, covering and protecting all other organs.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'At what temperature does water freeze?' as question_text, 5 as order_index, 20 as time_limit_seconds, 'Water freezes at 0 degrees Celsius (32 degrees Fahrenheit).' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'What are the three states of matter?' as question_text, 6 as order_index, 20 as time_limit_seconds, 'The three states of matter are solid, liquid, and gas. Water is a good example: ice (solid), water (liquid), and steam (gas).' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'What gas do plants release during photosynthesis?' as question_text, 7 as order_index, 20 as time_limit_seconds, 'Plants release oxygen during photosynthesis, which is essential for most living things to breathe.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'What is the main source of energy for Earth?' as question_text, 8 as order_index, 20 as time_limit_seconds, 'The Sun is the main source of energy for Earth, providing light and heat for life.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'How many legs does a spider have?' as question_text, 9 as order_index, 20 as time_limit_seconds, 'Spiders have 8 legs, which makes them arachnids, different from insects which have 6 legs.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer'), 'What do carnivorous animals eat?' as question_text, 10 as order_index, 20 as time_limit_seconds, 'Carnivorous animals eat meat from other animals, such as lions eating zebras.' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 1) as question_id, 'Sunlight, water, and nutrients' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 1) as question_id, 'Just water' as option_text, false as is_correct, 2 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 1) as question_id, 'Just sunlight' as option_text, false as is_correct, 3 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 1) as question_id, 'Sugar and salt' as option_text, false as is_correct, 4 as order_index
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 2) as question_id, 'Photosynthesis' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 2) as question_id, 'Respiration' as option_text, false as is_correct, 2 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 2) as question_id, 'Digestion' as option_text, false as is_correct, 3 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 2) as question_id, 'Fermentation' as option_text, false as is_correct, 4 as order_index
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 3) as question_id, '206' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 3) as question_id, '186' as option_text, false as is_correct, 2 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 3) as question_id, '206' as option_text, false as is_correct, 3 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 3) as question_id, '300' as option_text, false as is_correct, 4 as order_index
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 4) as question_id, 'Skin' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 4) as question_id, 'Heart' as option_text, false as is_correct, 2 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 4) as question_id, 'Brain' as option_text, false as is_correct, 3 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 4) as question_id, 'Stomach' as option_text, false as is_correct, 4 as order_index
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 5) as question_id, '0°C' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 5) as question_id, '10°C' as option_text, false as is_correct, 2 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 5) as question_id, '-10°C' as option_text, false as is_correct, 3 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 5) as question_id, '32°C' as option_text, false as is_correct, 4 as order_index
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 6) as question_id, 'Solid, liquid, gas' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 6) as question_id, 'Solid, liquid, plasma' as option_text, false as is_correct, 2 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 6) as question_id, 'Liquid, gas, air' as option_text, false as is_correct, 3 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 6) as question_id, 'Hot, cold, warm' as option_text, false as is_correct, 4 as order_index
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 7) as question_id, 'Oxygen' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 7) as question_id, 'Carbon dioxide' as option_text, false as is_correct, 2 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 7) as question_id, 'Nitrogen' as option_text, false as is_correct, 3 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 7) as question_id, 'Hydrogen' as option_text, false as is_correct, 4 as order_index
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 8) as question_id, 'The Sun' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 8) as question_id, 'The Moon' as option_text, false as is_correct, 2 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 8) as question_id, 'The Ocean' as option_text, false as is_correct, 3 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 8) as question_id, 'Electricity' as option_text, false as is_correct, 4 as order_index
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 9) as question_id, '8' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 9) as question_id, '6' as option_text, false as is_correct, 2 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 9) as question_id, '10' as option_text, false as is_correct, 3 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 9) as question_id, '4' as option_text, false as is_correct, 4 as order_index
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 10) as question_id, 'Meat from other animals' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 10) as question_id, 'Only plants' as option_text, false as is_correct, 2 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 10) as question_id, 'Only insects' as option_text, false as is_correct, 3 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Explorer') AND order_index = 10) as question_id, 'Soil and rocks' as option_text, false as is_correct, 4 as order_index
) AS options;

UPDATE public.public_quizzes 
SET total_questions = 10
WHERE title = 'Science Explorer';

COMMIT;
