-- Seed file: Historical Events Quiz (Hard, Ages 10-12) - 15 questions
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
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') as id, 'In which year did the Titanic sink?' as question_text, 1 as order_index, 30 as time_limit_seconds, 'The Titanic sank on April 15, 1912, after hitting an iceberg.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events'), 'Who was the first President of the United States?' as question_text, 2 as order_index, 30 as time_limit_seconds, 'George Washington was the first US President from 1789-1797.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events'), 'When did the Berlin Wall fall?' as question_text, 3 as order_index, 30 as time_limit_seconds, 'The Berlin Wall fell in 1989, symbolizing the end of the Cold War.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events'), 'Who discovered America in 1492?' as question_text, 4 as order_index, 30 as time_limit_seconds, 'Christopher Columbus reached the Americas in 1492.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events'), 'In which year did the French Revolution begin?' as question_text, 5 as order_index, 30 as time_limit_seconds, 'The French Revolution began in 1789.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events'), 'Who was Marie Antoinette?' as question_text, 6 as order_index, 30 as time_limit_seconds, 'Marie Antoinette was the Queen of France during the Revolution.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events'), 'When did the Renaissance begin?' as question_text, 7 as order_index, 30 as time_limit_seconds, 'The Renaissance began in the 14th century in Italy.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events'), 'Who was Julius Caesar?' as question_text, 8 as order_index, 30 as time_limit_seconds, 'Julius Caesar was a Roman military general and statesman.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events'), 'When did the Roman Empire fall?' as question_text, 9 as order_index, 30 as time_limit_seconds, 'The Western Roman Empire fell in 476 AD.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events'), 'Who invented the printing press?' as question_text, 10 as order_index, 30 as time_limit_seconds, 'Johannes Gutenberg invented the printing press around 1440.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events'), 'When did the Industrial Revolution begin?' as question_text, 11 as order_index, 30 as time_limit_seconds, 'The Industrial Revolution began in the 18th century in Britain.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events'), 'Who was Cleopatra?' as question_text, 12 as order_index, 30 as time_limit_seconds, 'Cleopatra was the last active ruler of Ptolemaic Egypt.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events'), 'When was the Declaration of Independence signed?' as question_text, 13 as order_index, 30 as time_limit_seconds, 'The Declaration of Independence was signed on July 4, 1776.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events'), 'Who was the first Emperor of Rome?' as question_text, 14 as order_index, 30 as time_limit_seconds, 'Augustus (Octavian) was the first Emperor of Rome.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events'), 'When did World War I end?' as question_text, 15 as order_index, 30 as time_limit_seconds, 'World War I ended on November 11, 1918 (Armistice Day).' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 1) as question_id, '1912' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 1), '1905', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 1), '1920', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 1), '1898', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 2), 'George Washington', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 2), 'Thomas Jefferson', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 2), 'Benjamin Franklin', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 2), 'John Adams', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 3), '1989', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 3), '1961', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 3), '1975', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 3), '1985', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 4), 'Christopher Columbus', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 4), 'Leif Erikson', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 4), 'Ferdinand Magellan', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 4), 'Vasco da Gama', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 5), '1789', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 5), '1776', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 5), '1815', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 5), '1848', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 6), 'Queen of France during Revolution', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 6), 'French philosopher', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 6), 'General in Napoleon''s army', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 6), 'Russian princess', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 7), '14th century', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 7), '10th century', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 7), '18th century', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 7), 'Medieval period', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 8), 'Roman military general', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 8), 'Greek philosopher', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 8), 'Egyptian pharaoh', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 8), 'Carthaginian general', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 9), '476 AD', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 9), '400 AD', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 9), '550 AD', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 9), '300 AD', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 10), 'Johannes Gutenberg', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 10), 'Leonardo da Vinci', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 10), 'Benjamin Franklin', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 10), 'Thomas Edison', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 11), '18th century', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 11), '16th century', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 11), '20th century', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 11), '19th century', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 12), 'Last ruler of Ptolemaic Egypt', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 12), 'Roman Emperor', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 12), 'Greek general', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 12), 'Mesopotamian queen', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 13), 'July 4, 1776', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 13), 'July 4, 1775', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 13), 'July 4, 1777', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 13), 'July 4, 1778', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 14), 'Augustus (Octavian)', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 14), 'Julius Caesar', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 14), 'Mark Antony', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 14), 'Pompey', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 15), 'November 11, 1918', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 15), 'November 11, 1917', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 15), 'November 11, 1919', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Historical Events') AND order_index = 15), 'November 11, 1920', false, 4
) AS options;

UPDATE public.public_quizzes SET total_questions = 15 WHERE title = 'Historical Events';

COMMIT;
