-- Seed file: History Quiz (Medium, Ages 10-12)

BEGIN;

INSERT INTO public.public_quizzes (
  title, description, is_published, is_public, time_per_question, difficulty_level, age_group, tags
) VALUES (
  'History Legends',
  'Explore important historical events, famous people, and civilizations throughout history.',
  true, true, 25, 'medium', '10-12',
  ARRAY['history', 'events', 'civilization', 'education']
);

INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds, explanation)
VALUES
  ((SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'In which year did Columbus reach the Americas?', 1, 25, 'Christopher Columbus reached the Americas in 1492, marking the beginning of European exploration.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'Who was the first President of the United States?', 2, 25, 'George Washington was the first President of the United States and is called the "Father of His Country".'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'What ancient wonder was built as a tomb in Egypt?', 3, 25, 'The Great Pyramid of Giza (Pyramid of Khufu) was built as a tomb for the pharaoh Khufu in ancient Egypt.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'Which empire built the Great Wall of China?', 4, 25, 'The Great Wall of China was built over many centuries by various Chinese dynasties, starting with the Ming Dynasty.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'In what year did the Titanic sink?', 5, 25, 'The Titanic, a famous ocean liner, sank in 1912 after hitting an iceberg in the North Atlantic Ocean.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'Who invented the printing press?', 6, 25, 'Johannes Gutenberg invented the printing press around 1440, revolutionizing the spread of information.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'What was the ancient Greek city-state famous for philosophy and democracy?', 7, 25, 'Athens was famous for developing democratic government and producing great philosophers like Socrates and Plato.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'Which continent is home to the oldest known civilization?', 8, 25, 'Asia is home to some of the world''s oldest civilizations, including Mesopotamia and the Indus Valley civilization.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'What was the primary religion of ancient Rome before Christianity?', 9, 25, 'Ancient Romans practiced polytheism, worshipping many gods including Jupiter, Mars, and Venus.'),
  ((SELECT id FROM public.public_quizzes WHERE title = 'History Legends'), 'Who was the famous Egyptian pharaoh who ruled during the New Kingdom?', 10, 25, 'Tutankhamun (King Tut) was a famous young pharaoh whose tomb was discovered with many treasures.')
;

WITH quiz_questions AS (
  SELECT id, order_index FROM public.public_quiz_questions 
  WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'History Legends')
  ORDER BY order_index
)
INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index) VALUES
  ((SELECT id FROM quiz_questions WHERE order_index = 1), '1492', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), '1450', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), '1600', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 1), '1776', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 2), 'George Washington', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), 'Thomas Jefferson', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), 'Abraham Lincoln', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 2), 'Benjamin Franklin', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Great Pyramid of Giza', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Sphinx', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Colosseum', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 3), 'Parthenon', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Ming Dynasty', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Han Dynasty', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Tang Dynasty', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 4), 'Zhou Dynasty', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 5), '1912', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), '1910', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), '1915', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 5), '1920', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Johannes Gutenberg', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Michelangelo', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Leonardo da Vinci', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 6), 'Galileo', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Athens', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Sparta', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Troy', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 7), 'Corinth', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'Asia', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'Africa', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'Europe', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 8), 'South America', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 9), 'Polytheism', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), 'Christianity', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), 'Judaism', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 9), 'Buddhism', false, 4),
  
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Tutankhamun (King Tut)', true, 1),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Ramesses II', false, 2),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Cleopatra', false, 3),
  ((SELECT id FROM quiz_questions WHERE order_index = 10), 'Thutmose III', false, 4);

UPDATE public.public_quizzes 
SET total_questions = (SELECT COUNT(*) FROM public.public_quiz_questions WHERE quiz_id = public.public_quizzes.id)
WHERE title = 'History Legends';

COMMIT;
