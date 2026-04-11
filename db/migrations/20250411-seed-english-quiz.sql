-- Seed file: English Language Arts Quiz (Easy, Ages 8-12)

BEGIN;

INSERT INTO public.public_quizzes (
  title, description, is_published, is_public, time_per_question, difficulty_level, age_group, tags
) VALUES (
  'English Language Adventure',
  'Improve your English skills with grammar, vocabulary, and reading comprehension questions.',
  true, true, 20, 'easy', '8-12',
  ARRAY['english', 'language', 'grammar', 'vocabulary']
);

INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds, explanation)
VALUES
  ((SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'Which word is spelled correctly?', 1, 20, 'Correct spelling is important for clear communication in writing.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'What is the plural of "child"?', 2, 20, 'The plural of "child" is "children", which is an irregular plural form.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'Which sentence is grammatically correct?', 3, 20, 'A subject and verb must agree in number and the sentence must have proper punctuation.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'What does the word "benevolent" mean?', 4, 20, 'Benevolent means kind, generous, and doing good for others.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'Which word rhymes with "blue"?', 5, 20, 'Words that rhyme have the same ending sound.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'What is the past tense of "go"?', 6, 20, '"Go" becomes "went" in the past tense, which is an irregular verb.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'What punctuation mark ends an exclamatory sentence?', 7, 20, 'An exclamation mark (!) is used to end sentences that express strong emotion or excitement.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'What is a noun?', 8, 20, 'A noun is a word that names a person, place, thing, or idea.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'Which is the longest word?', 9, 20, 'To find the longest word, count the number of letters in each option.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure'), 'What does "synonym" mean?', 10, 20, 'A synonym is a word that has the same or similar meaning as another word.')
;

WITH quiz_questions AS (
  SELECT id, order_index FROM public.public_quiz_questions 
  WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'English Language Adventure')
  ORDER BY order_index
)
INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index) VALUES
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'Recieve', false, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'Receive', true, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'Resieve', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), 'Recive', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 2), 'Childs', false, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), 'Children', true, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), 'Childes', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), 'Childern', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'She go to school', false, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'She goes to school', true, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'She gone to school', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'She going to school', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Lazy', false, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Kind and generous', true, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Angry', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Confused', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 5), 'Shoe', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), 'Blue', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), 'Blob', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), 'Bread', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Goed', false, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Going', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Went', true, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Goes', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Period', false, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Question mark', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Exclamation mark', true, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Comma', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'A word that describes action', false, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'A person, place, thing, or idea', true, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'A word that describes a noun', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'A connecting word', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 9), 'Cat', false, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), 'Encyclopedia', true, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), 'Dog', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), 'Book', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'A word opposite in meaning', false, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'A word similar in meaning', true, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'A word that rhymes', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'A word that sounds the same', false, 4);

UPDATE public.public_quizzes 
SET total_questions = (SELECT COUNT(*) FROM public.public_quiz_questions WHERE quiz_id = public.public_quizzes.id)
WHERE title = 'English Language Adventure';

COMMIT;
