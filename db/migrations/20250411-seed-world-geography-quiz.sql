-- Seed file: World Geography Quiz (Medium, Ages 10-12)
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
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') as id, 'Which is the largest continent?' as question_text, 1 as order_index, 25 as time_limit_seconds, 'Asia is the largest continent by area and population.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'World Geography'), 'What is the capital of France?' as question_text, 2 as order_index, 25 as time_limit_seconds, 'Paris is the capital and largest city of France.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'World Geography'), 'Which river is the longest in Europe?' as question_text, 3 as order_index, 25 as time_limit_seconds, 'The Volga River in Russia is the longest river in Europe.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'World Geography'), 'What is the capital of Spain?' as question_text, 4 as order_index, 25 as time_limit_seconds, 'Madrid is the capital and largest city of Spain.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'World Geography'), 'Which mountain is the highest in Africa?' as question_text, 5 as order_index, 25 as time_limit_seconds, 'Mount Kilimanjaro in Tanzania is the highest mountain in Africa.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'World Geography'), 'What is the capital of India?' as question_text, 6 as order_index, 25 as time_limit_seconds, 'New Delhi is the capital of India, located in the north.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'World Geography'), 'Which country is known as the Land of the Rising Sun?' as question_text, 7 as order_index, 25 as time_limit_seconds, 'Japan is called the Land of the Rising Sun because of its eastern location.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'World Geography'), 'What is the smallest country in the world?' as question_text, 8 as order_index, 25 as time_limit_seconds, 'Vatican City is the smallest country, located within Rome.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'World Geography'), 'Which desert covers most of Algeria?' as question_text, 9 as order_index, 25 as time_limit_seconds, 'The Sahara Desert covers most of northern Africa including Algeria.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'World Geography'), 'What is the capital of Canada?' as question_text, 10 as order_index, 25 as time_limit_seconds, 'Ottawa is the capital of Canada.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'World Geography'), 'Which ocean is the largest?' as question_text, 11 as order_index, 25 as time_limit_seconds, 'The Pacific Ocean is the largest ocean in the world.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'World Geography'), 'What is the capital of Egypt?' as question_text, 12 as order_index, 25 as time_limit_seconds, 'Cairo is the capital and largest city of Egypt.' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 1) as question_id, 'Asia' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 1), 'Africa', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 1), 'Europe', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 1), 'South America', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 2), 'Paris', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 2), 'Lyon', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 2), 'Marseille', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 2), 'Nice', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 3), 'Volga River', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 3), 'Danube River', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 3), 'Rhine River', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 3), 'Thames River', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 4), 'Madrid', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 4), 'Barcelona', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 4), 'Valencia', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 4), 'Bilbao', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 5), 'Mount Kilimanjaro', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 5), 'Mount Kenya', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 5), 'Mount Cameroon', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 5), 'Mount Atlas', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 6), 'New Delhi', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 6), 'Mumbai', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 6), 'Bangalore', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 6), 'Kolkata', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 7), 'Japan', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 7), 'China', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 7), 'South Korea', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 7), 'Thailand', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 8), 'Vatican City', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 8), 'Monaco', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 8), 'San Marino', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 8), 'Liechtenstein', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 9), 'Sahara Desert', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 9), 'Arabian Desert', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 9), 'Gobi Desert', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 9), 'Kalahari Desert', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 10), 'Ottawa', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 10), 'Toronto', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 10), 'Vancouver', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 10), 'Montreal', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 11), 'Pacific Ocean', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 11), 'Atlantic Ocean', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 11), 'Indian Ocean', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 11), 'Arctic Ocean', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 12), 'Cairo', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 12), 'Alexandria', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 12), 'Giza', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'World Geography') AND order_index = 12), 'Luxor', false, 4
) AS options;

UPDATE public.public_quizzes 
SET total_questions = 12
WHERE title = 'World Geography';

COMMIT;
