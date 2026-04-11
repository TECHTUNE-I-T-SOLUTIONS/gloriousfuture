-- Seed file: Science Facts Quiz (Medium, Ages 10-12)
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
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') as id, 'What is the smallest unit of life?' as question_text, 1 as order_index, 25 as time_limit_seconds, 'The cell is the basic unit of all living things.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts'), 'How many bones does an adult human have?' as question_text, 2 as order_index, 25 as time_limit_seconds, 'An adult human has 206 bones in their body.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts'), 'What do plants use for photosynthesis?' as question_text, 3 as order_index, 25 as time_limit_seconds, 'Plants use sunlight, water, and carbon dioxide to make food.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts'), 'What is the hardest substance in the human body?' as question_text, 4 as order_index, 25 as time_limit_seconds, 'Tooth enamel is the hardest substance in the human body.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts'), 'What gas do we breathe out when we exhale?' as question_text, 5 as order_index, 25 as time_limit_seconds, 'We breathe out carbon dioxide which plants use.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts'), 'How fast does light travel through a vacuum?' as question_text, 6 as order_index, 25 as time_limit_seconds, 'Light travels at 300,000 kilometers per second.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts'), 'What is the most abundant element in the universe?' as question_text, 7 as order_index, 25 as time_limit_seconds, 'Hydrogen is the most abundant element in the universe.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts'), 'What is the process by which water turns into vapor?' as question_text, 8 as order_index, 25 as time_limit_seconds, 'Evaporation is when water changes from liquid to gas.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts'), 'How many chambers does a human heart have?' as question_text, 9 as order_index, 25 as time_limit_seconds, 'The human heart has 4 chambers: two atria and two ventricles.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts'), 'What is the speed of sound in air?' as question_text, 10 as order_index, 25 as time_limit_seconds, 'Sound travels at about 343 meters per second in air.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts'), 'What is photosynthesis?' as question_text, 11 as order_index, 25 as time_limit_seconds, 'Photosynthesis is how plants make food from sunlight.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts'), 'How many chambers does a fish heart have?' as question_text, 12 as order_index, 25 as time_limit_seconds, 'A fish heart has 2 chambers, simpler than mammals.' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 1) as question_id, 'Cell' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 1), 'Atom', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 1), 'Molecule', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 1), 'Organ', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 2), '206', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 2), '186', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 2), '226', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 2), '196', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 3), 'Sunlight, water, and carbon dioxide', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 3), 'Just soil and water', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 3), 'Only nitrogen', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 3), 'Oxygen alone', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 4), 'Tooth enamel', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 4), 'Bone', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 4), 'Skin', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 4), 'Hair', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 5), 'Carbon dioxide', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 5), 'Nitrogen', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 5), 'Oxygen', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 5), 'Hydrogen', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 6), '300,000 km/s', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 6), '100,000 km/s', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 6), '500,000 km/s', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 6), '50,000 km/s', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 7), 'Hydrogen', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 7), 'Helium', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 7), 'Carbon', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 7), 'Oxygen', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 8), 'Evaporation', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 8), 'Condensation', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 8), 'Freezing', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 8), 'Melting', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 9), '4 chambers', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 9), '2 chambers', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 9), '3 chambers', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 9), '6 chambers', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 10), '343 meters/second', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 10), '200 meters/second', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 10), '500 meters/second', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 10), '100 meters/second', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 11), 'How plants make food from sunlight', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 11), 'How animals breathe', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 11), 'How water freezes', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 11), 'How soil forms', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 12), '2 chambers', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 12), '3 chambers', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 12), '4 chambers', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Science Facts') AND order_index = 12), '5 chambers', false, 4
) AS options;

UPDATE public.public_quizzes 
SET total_questions = 12
WHERE title = 'Science Facts';

COMMIT;
