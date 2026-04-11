-- Seed file: Geography Quiz (Medium, Ages 10-12)

BEGIN;

INSERT INTO public.public_quizzes (
  title, description, is_published, is_public, time_per_question, difficulty_level, age_group, tags
) VALUES (
  'Geography Master',
  'Explore world capitals, continents, countries, and landmarks with these geography challenges.',
  true, true, 25, 'medium', '10-12',
  ARRAY['geography', 'world', 'capitals', 'countries']
);

INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds, explanation)
VALUES
  ((SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'What is the capital of Australia?', 1, 25, 'Canberra is the capital of Australia, located between Sydney and Melbourne.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'Which is the longest river in the world?', 2, 25, 'The Nile River in Africa is the longest river in the world at about 4,130 miles.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'What is the capital of Japan?', 3, 25, 'Tokyo is the capital of Japan and the largest metropolitan area in the world.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'Which country is known as the "Land of the Rising Sun"?', 4, 25, 'Japan is called the "Land of the Rising Sun" because the sun rises in the east and Japan is east of other Asian countries.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'What is the capital of Brazil?', 5, 25, 'Brasília is the capital of Brazil, built in the 1950s to replace Rio de Janeiro.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'Which mountain range is the tallest in the world?', 6, 25, 'The Himalayas contain the world''s highest mountains, including Mount Everest at 29,032 feet.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'What is the capital of Canada?', 7, 25, 'Ottawa is the capital of Canada, located in Ontario province.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'Which desert is the largest in the world?', 8, 25, 'The Antarctic Desert is the largest desert, but the Sahara is the largest hot desert in Africa.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'What is the capital of India?', 9, 25, 'New Delhi is the capital of India, located in the northern part of the country.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'Geography Master'), 'Which country is completely surrounded by South Africa?', 10, 25, 'Lesotho is a country completely surrounded by South Africa, located in southern Africa.')
;

WITH quiz_questions AS (
  SELECT id, order_index FROM public.public_quiz_questions 
  WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Geography Master')
  ORDER BY order_index
)
INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index) VALUES
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'Canberra', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'Sydney', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'Melbourne', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'Brisbane', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 2), 'Nile River', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), 'Amazon River', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), 'Yangtze River', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), 'Mississippi River', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Tokyo', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Osaka', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Kyoto', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Hiroshima', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Japan', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'China', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'South Korea', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Thailand', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 5), 'Brasília', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), 'Rio de Janeiro', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), 'São Paulo', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), 'Salvador', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Himalayas', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Rocky Mountains', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Alps', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Andes', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Ottawa', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Toronto', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Vancouver', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Montreal', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'Sahara Desert', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'Gobi Desert', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'Kalahari Desert', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'Arabian Desert', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 9), 'New Delhi', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), 'Mumbai', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), 'Bangalore', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), 'Chennai', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Lesotho', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Botswana', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Namibia', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Zimbabwe', false, 4);

UPDATE public.public_quizzes 
SET total_questions = (SELECT COUNT(*) FROM public.public_quiz_questions WHERE quiz_id = public.public_quizzes.id)
WHERE title = 'Geography Master';

COMMIT;
