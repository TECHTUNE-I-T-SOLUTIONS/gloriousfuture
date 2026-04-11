-- Seed file: English Language Quiz (Easy, Ages 8-10)
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
  'English Language Adventure',
  'Test your English skills with grammar, spelling, vocabulary, and punctuation questions.',
  true,
  true,
  20,
  'easy',
  '8-10',
  ARRAY['english', 'spelling', 'grammar', 'learning']
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
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') as id, 'Which word is spelled correctly?' as question_text, 1 as order_index, 20 as time_limit_seconds, 'Receive is spelled R-E-C-E-I-V-E. Remember: "i" before "e" except after "c".' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'What is the past tense of "go"?' as question_text, 2 as order_index, 20 as time_limit_seconds, 'The past tense of "go" is "went". This is an irregular verb.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'Which sentence is correct?' as question_text, 3 as order_index, 20 as time_limit_seconds, '"She is going to the park" uses correct subject-verb agreement.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'What does "synonym" mean?' as question_text, 4 as order_index, 20 as time_limit_seconds, 'A synonym is a word with the same or similar meaning as another word. For example, "happy" and "joyful".' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'Which punctuation mark is used at the end of a question?' as question_text, 5 as order_index, 20 as time_limit_seconds, 'A question mark (?) is used at the end of a question.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'What is a noun?' as question_text, 6 as order_index, 20 as time_limit_seconds, 'A noun is a word that names a person, place, thing, or idea. For example: teacher, school, book, happiness.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'How many vowels are there in the English alphabet?' as question_text, 7 as order_index, 20 as time_limit_seconds, 'There are 5 vowels: A, E, I, O, and U.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'What is a verb?' as question_text, 8 as order_index, 20 as time_limit_seconds, 'A verb is a word that shows action or a state of being. For example: run, jump, is, are.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'Choose the correct spelling of a color.' as question_text, 9 as order_index, 20 as time_limit_seconds, 'Purple is spelled P-U-R-P-L-E.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'What does "antonym" mean?' as question_text, 10 as order_index, 20 as time_limit_seconds, 'An antonym is a word with the opposite meaning. For example, "hot" and "cold".' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 1) as question_id, 'Receive' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 1), 'Recieve', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 1), 'Receve', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 1), 'Receeve', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 2), 'Went', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 2), 'Goed', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 2), 'Goes', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 2), 'Gooed', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 3), 'She is going to the park', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 3), 'She are going to the park', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 3), 'She go to the park', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 3), 'Her is going to the park', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 4), 'A word with the same or similar meaning', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 4), 'A word with opposite meaning', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 4), 'A word that starts with S', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 4), 'A fancy word', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 5), '?', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 5), '.', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 5), '!', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 5), ',', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 6), 'A word that names a person, place, thing, or idea', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 6), 'A word that shows action', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 6), 'A word that describes something', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 6), 'A word used before a noun', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 7), '5', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 7), '6', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 7), '4', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 7), '7', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 8), 'A word that shows action or state of being', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 8), 'A word used before a noun', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 8), 'A word that describes action', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 8), 'A word with two meanings', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 9), 'Purple', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 9), 'Purpel', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 9), 'Purpol', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 9), 'Pruple', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 10), 'A word with opposite meaning', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 10), 'A word with similar meaning', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 10), 'A word that rhymes', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure') AND order_index = 10), 'A word with letter A', false, 4
) AS options;

UPDATE public.public_quizzes 
SET total_questions = 10
WHERE title = 'English Language Adventure';

COMMIT;
