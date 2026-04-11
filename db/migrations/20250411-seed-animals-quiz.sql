-- Seed file: Animals Around Us Quiz (Easy, Ages 6-8)
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
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') as id, 'What sound does a cat make?' as question_text, 1 as order_index, 20 as time_limit_seconds, 'A cat says "meow" which is used to communicate with humans.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us'), 'What sound does a dog make?' as question_text, 2 as order_index, 20 as time_limit_seconds, 'A dog barks to express emotions and communicate.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us'), 'What does a cow eat?' as question_text, 3 as order_index, 20 as time_limit_seconds, 'Cows eat grass and hay. They are herbivores.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us'), 'What color are most frogs?' as question_text, 4 as order_index, 20 as time_limit_seconds, 'Most frogs are green to help them blend in with plants in nature.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us'), 'How many legs does a fish have?' as question_text, 5 as order_index, 20 as time_limit_seconds, 'Fish do not have legs. They have fins to swim in water.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us'), 'What sound does a cow make?' as question_text, 6 as order_index, 20 as time_limit_seconds, 'A cow says "moo" to communicate and call its calves.' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 1) as question_id, 'Meow' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 1), 'Bark', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 1), 'Chirp', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 1), 'Hiss', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 2), 'Bark', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 2), 'Meow', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 2), 'Moo', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 2), 'Squeak', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 3), 'Grass and hay', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 3), 'Meat', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 3), 'Fish', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 3), 'Nuts', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 4), 'Green', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 4), 'Blue', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 4), 'Red', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 4), 'Yellow', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 5), 'No legs, they have fins', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 5), '2 legs', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 5), '4 legs', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 5), '6 legs', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 6), 'Moo', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 6), 'Meow', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 6), 'Bark', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Animals Around Us') AND order_index = 6), 'Hiss', false, 4
) AS options;

UPDATE public.public_quizzes 
SET total_questions = 6
WHERE title = 'Animals Around Us';

COMMIT;
