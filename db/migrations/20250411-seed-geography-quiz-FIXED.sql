-- Seed file: Geography Quiz (Medium, Ages 10-12)
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
  'Geography Master',
  'Explore the world and test your knowledge of countries, capitals, rivers, mountains, and landscapes.',
  true,
  true,
  25,
  'medium',
  '10-12',
  ARRAY['geography', 'countries', 'capitals', 'learning']
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
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') as id, 'Which is the longest river in the world?' as question_text, 1 as order_index, 25 as time_limit_seconds, 'The Nile River in Africa is the longest river in the world at about 4,135 miles (6,650 km).' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'What is the capital of Australia?' as question_text, 2 as order_index, 25 as time_limit_seconds, 'Canberra is the capital of Australia, not Sydney or Melbourne.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'Which is the largest desert in the world?' as question_text, 3 as order_index, 25 as time_limit_seconds, 'Antarctica is technically the largest desert in the world, being extremely cold and dry.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'In which country is the Sahara Desert located?' as question_text, 4 as order_index, 25 as time_limit_seconds, 'The Sahara Desert covers much of North Africa, spanning multiple countries including Egypt, Libya, Sudan, and Algeria.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'What is the capital of Japan?' as question_text, 5 as order_index, 25 as time_limit_seconds, 'Tokyo is the capital and largest city of Japan.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'Which mountain range is the longest in the world?' as question_text, 6 as order_index, 25 as time_limit_seconds, 'The Mid-Ocean Ridge is the longest mountain range in the world, located underwater. On land, the Andes is the longest.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'How many continents are there?' as question_text, 7 as order_index, 25 as time_limit_seconds, 'There are 7 continents: Africa, Antarctica, Asia, Europe, North America, Oceania, and South America.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'Which country has the most islands?' as question_text, 8 as order_index, 25 as time_limit_seconds, 'Sweden has the most islands of any country with around 50,000 islands.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'What is the capital of Brazil?' as question_text, 9 as order_index, 25 as time_limit_seconds, 'Brasília is the capital of Brazil, built in 1960 as a planned city.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'Which ocean is the deepest?' as question_text, 10 as order_index, 25 as time_limit_seconds, 'The Pacific Ocean is the deepest ocean, with the Mariana Trench reaching 36,070 feet (10,994 m).' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 1) as question_id, 'Nile River' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 1), 'Amazon River', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 1), 'Yangtze River', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 1), 'Mississippi River', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 2), 'Canberra', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 2), 'Sydney', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 2), 'Melbourne', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 2), 'Brisbane', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 3), 'Antarctica', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 3), 'Sahara', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 3), 'Karakum', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 3), 'Gobi', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 4), 'Multiple countries in North Africa', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 4), 'Only Egypt', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 4), 'Only Algeria', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 4), 'Middle East', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 5), 'Tokyo', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 5), 'Kyoto', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 5), 'Osaka', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 5), 'Yokohama', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 6), 'The Andes (on land)', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 6), 'The Rockies', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 6), 'The Himalayas', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 6), 'The Alps', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 7), '7', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 7), '5', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 7), '6', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 7), '8', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 8), 'Sweden', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 8), 'Finland', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 8), 'Norway', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 8), 'Denmark', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 9), 'Brasília', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 9), 'Rio de Janeiro', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 9), 'São Paulo', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 9), 'Salvador', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 10), 'Pacific Ocean', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 10), 'Atlantic Ocean', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 10), 'Indian Ocean', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master') AND order_index = 10), 'Arctic Ocean', false, 4
) AS options;

UPDATE public.public_quizzes 
SET total_questions = 10
WHERE title = 'Geography Master';

COMMIT;
