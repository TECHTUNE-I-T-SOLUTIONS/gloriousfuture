-- Seed file: History Quiz (Medium, Ages 10-12)
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
  'History Legends',
  'Journey through time and learn about important historical events, ancient civilizations, and famous figures.',
  true,
  true,
  25,
  'medium',
  '10-12',
  ARRAY['history', 'events', 'civilizations', 'learning']
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
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') as id, 'In which year did Columbus reach the Americas?' as question_text, 1 as order_index, 25 as time_limit_seconds, 'Christopher Columbus reached the Americas in 1492, marking the beginning of European exploration and colonization.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'Which ancient civilization built the pyramids?' as question_text, 2 as order_index, 25 as time_limit_seconds, 'The ancient Egyptians built the pyramids as tombs for their pharaohs over 4,000 years ago.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'Who was the first president of the United States?' as question_text, 3 as order_index, 25 as time_limit_seconds, 'George Washington was the first president of the United States, serving from 1789 to 1797.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'Which empire built the Great Wall of China?' as question_text, 4 as order_index, 25 as time_limit_seconds, 'The Great Wall of China was built over centuries by various Chinese dynasties to protect against invasions.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'In which year did World War II end?' as question_text, 5 as order_index, 25 as time_limit_seconds, 'World War II ended in 1945 with the surrender of Japan in September.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'Who wrote the Declaration of Independence?' as question_text, 6 as order_index, 25 as time_limit_seconds, 'Thomas Jefferson was the primary author of the Declaration of Independence, adopted in 1776.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'Which ancient city was destroyed by the eruption of Mount Vesuvius?' as question_text, 7 as order_index, 25 as time_limit_seconds, 'Pompeii was destroyed in 79 AD by the eruption of Mount Vesuvius, preserving the city in volcanic ash.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'Who was the longest-reigning British monarch before Queen Elizabeth II?' as question_text, 8 as order_index, 25 as time_limit_seconds, 'King George III reigned for 59 years (1760-1820), the longest reign before Queen Victoria.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'Which Renaissance artist painted the Mona Lisa?' as question_text, 9 as order_index, 25 as time_limit_seconds, 'Leonardo da Vinci, the famous Renaissance artist, painted the Mona Lisa during the early 1500s.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'In which year did man first walk on the moon?' as question_text, 10 as order_index, 25 as time_limit_seconds, 'Neil Armstrong became the first human to walk on the moon on July 20, 1969.' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 1) as question_id, '1492' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 1), '1400', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 1), '1500', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 1), '1420', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 2), 'Ancient Egyptians', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 2), 'Ancient Greeks', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 2), 'Romans', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 2), 'Aztecs', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 3), 'George Washington', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 3), 'Thomas Jefferson', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 3), 'Benjamin Franklin', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 3), 'John Adams', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 4), 'Chinese dynasties', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 4), 'Ancient Romans', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 4), 'Persians', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 4), 'Mongols', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 5), '1945', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 5), '1944', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 5), '1946', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 5), '1943', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 6), 'Thomas Jefferson', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 6), 'George Washington', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 6), 'John Adams', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 6), 'Benjamin Franklin', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 7), 'Pompeii', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 7), 'Rome', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 7), 'Athens', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 7), 'Naples', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 8), 'King George III', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 8), 'King Edward VII', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 8), 'King Henry VIII', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 8), 'King Charles II', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 9), 'Leonardo da Vinci', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 9), 'Michelangelo', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 9), 'Raphael', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 9), 'Donatello', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 10), '1969', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 10), '1968', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 10), '1970', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends') AND order_index = 10), '1971', false, 4
) AS options;

UPDATE public.public_quizzes 
SET total_questions = 10
WHERE title = 'History Legends';

COMMIT;
