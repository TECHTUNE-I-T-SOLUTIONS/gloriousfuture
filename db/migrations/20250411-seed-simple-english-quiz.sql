-- Seed file: Simple English Quiz (Medium, Ages 8-10)
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
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') as id, 'Which sentence is correct?' as question_text, 1 as order_index, 25 as time_limit_seconds, 'Correct grammar uses proper subject-verb agreement.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Simple English'), 'What is an adjective?' as question_text, 2 as order_index, 25 as time_limit_seconds, 'An adjective is a word that describes a noun.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Simple English'), 'Choose the correct spelling.' as question_text, 3 as order_index, 25 as time_limit_seconds, 'Correct spelling is important in writing.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Simple English'), 'What is a sentence?' as question_text, 4 as order_index, 25 as time_limit_seconds, 'A sentence is a group of words with a subject and verb.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Simple English'), 'Which word means happy?' as question_text, 5 as order_index, 25 as time_limit_seconds, 'Synonyms are words with the same or similar meaning.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Simple English'), 'What is a verb?' as question_text, 6 as order_index, 25 as time_limit_seconds, 'A verb is a word that shows action or state of being.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Simple English'), 'Choose the opposite of big.' as question_text, 7 as order_index, 25 as time_limit_seconds, 'Antonyms are words with opposite meanings.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Simple English'), 'What is a noun?' as question_text, 8 as order_index, 25 as time_limit_seconds, 'A noun is a word that names a person, place, or thing.' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 1) as question_id, 'She is going to school' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 1), 'She are going to school', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 1), 'She be going to school', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 1), 'She go to school', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 2), 'A word that describes a noun', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 2), 'A word that shows action', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 2), 'A word that replaces a noun', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 2), 'A word used before a noun', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 3), 'Beautiful', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 3), 'Beautifull', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 3), 'Beautful', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 3), 'Beautyful', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 4), 'A group of words with subject and verb', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 4), 'Just a few words', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 4), 'Only adjectives', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 4), 'A list of words', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 5), 'Joyful', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 5), 'Sad', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 5), 'Angry', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 5), 'Afraid', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 6), 'A word that shows action', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 6), 'A word that describes', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 6), 'A word that names', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 6), 'A word used before', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 7), 'Small', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 7), 'Huge', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 7), 'Giant', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 7), 'Large', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 8), 'A word that names a person, place, or thing', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 8), 'A word that describes', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 8), 'A word that shows action', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Simple English') AND order_index = 8), 'A word that replaces', false, 4
) AS options;

UPDATE public.public_quizzes 
SET total_questions = 8
WHERE title = 'Simple English';

COMMIT;
