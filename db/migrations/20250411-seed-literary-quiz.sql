-- Seed file: Literary Quiz (Hard, Ages 12-14) - 12 questions
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
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') as id, 'Who wrote "Romeo and Juliet"?' as question_text, 1 as order_index, 30 as time_limit_seconds, 'William Shakespeare is the famous playwright of "Romeo and Juliet".' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz'), 'What is a metaphor?' as question_text, 2 as order_index, 30 as time_limit_seconds, 'A metaphor is a comparison between two things without using "like" or "as".' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz'), 'Who wrote "Pride and Prejudice"?' as question_text, 3 as order_index, 30 as time_limit_seconds, 'Jane Austen wrote "Pride and Prejudice".' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz'), 'What is the main character of "Harry Potter" series?' as question_text, 4 as order_index, 30 as time_limit_seconds, 'Harry Potter is the main character of the series by J.K. Rowling.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz'), 'What is an oxymoron?' as question_text, 5 as order_index, 30 as time_limit_seconds, 'An oxymoron combines contradictory terms like "sweet sorrow".' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz'), 'Who wrote "1984"?' as question_text, 6 as order_index, 30 as time_limit_seconds, 'George Orwell wrote the dystopian novel "1984".' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz'), 'What is alliteration?' as question_text, 7 as order_index, 30 as time_limit_seconds, 'Alliteration is repetition of beginning sounds in nearby words.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz'), 'Who wrote "The Great Gatsby"?' as question_text, 8 as order_index, 30 as time_limit_seconds, 'F. Scott Fitzgerald wrote "The Great Gatsby".' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz'), 'What is the climax of a story?' as question_text, 9 as order_index, 30 as time_limit_seconds, 'The climax is the turning point of highest tension in the story.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz'), 'Who wrote "Jane Eyre"?' as question_text, 10 as order_index, 30 as time_limit_seconds, 'Charlotte Brontë wrote "Jane Eyre".' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz'), 'What is irony?' as question_text, 11 as order_index, 30 as time_limit_seconds, 'Irony is when the outcome is opposite of what is expected.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz'), 'Who wrote "Moby Dick"?' as question_text, 12 as order_index, 30 as time_limit_seconds, 'Herman Melville wrote "Moby Dick".' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 1) as question_id, 'William Shakespeare' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 1), 'Christopher Marlowe', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 1), 'Ben Jonson', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 1), 'John Webster', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 2), 'Comparison without "like" or "as"', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 2), 'Comparison with "like" or "as"', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 2), 'Opposite meaning', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 2), 'Repeated sounds', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 3), 'Jane Austen', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 3), 'Emily Brontë', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 3), 'Charlotte Brontë', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 3), 'Anne Brontë', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 4), 'Harry Potter', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 4), 'Ron Weasley', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 4), 'Hermione Granger', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 4), 'Albus Dumbledore', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 5), 'Contradictory terms together', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 5), 'Comparison', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 5), 'Repeated sounds', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 5), 'Opposite meaning', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 6), 'George Orwell', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 6), 'Aldous Huxley', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 6), 'Ray Bradbury', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 6), 'Philip K. Dick', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 7), 'Repetition of beginning sounds', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 7), 'Repetition of ending sounds', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 7), 'Comparison of two things', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 7), 'Opposite meaning', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 8), 'F. Scott Fitzgerald', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 8), 'Ernest Hemingway', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 8), 'Sinclair Lewis', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 8), 'William Faulkner', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 9), 'Turning point of highest tension', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 9), 'Introduction of characters', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 9), 'Resolution of conflict', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 9), 'Setting of the story', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 10), 'Charlotte Brontë', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 10), 'Emily Brontë', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 10), 'Anne Brontë', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 10), 'Jane Austen', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 11), 'Opposite of what is expected', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 11), 'Comparison', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 11), 'Contradictory terms', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 11), 'Repeated sounds', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 12), 'Herman Melville', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 12), 'Mark Twain', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 12), 'Jack London', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Literary Quiz') AND order_index = 12), 'Nathaniel Hawthorne', false, 4
) AS options;

UPDATE public.public_quizzes SET total_questions = 12 WHERE title = 'Literary Quiz';

COMMIT;
