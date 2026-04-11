-- Seed file: My Environment Quiz (Medium, Ages 8-10)
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
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') as id, 'What do plants need to grow?' as question_text, 1 as order_index, 20 as time_limit_seconds, 'Plants need sunlight, water, and soil to grow healthy.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'My Environment'), 'Which animal is a mammal?' as question_text, 2 as order_index, 20 as time_limit_seconds, 'Mammals are animals that have fur and feed milk to their young.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'My Environment'), 'What is a natural resource?' as question_text, 3 as order_index, 20 as time_limit_seconds, 'Natural resources are materials from nature we use like water, wood, and minerals.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'My Environment'), 'Which weather is caused by water in the air?' as question_text, 4 as order_index, 20 as time_limit_seconds, 'Rain is formed when water vapor in clouds condenses.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'My Environment'), 'What helps plants breathe?' as question_text, 5 as order_index, 20 as time_limit_seconds, 'Stomata are tiny pores on plant leaves that help them breathe and exchange gases.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'My Environment'), 'Which is a source of renewable energy?' as question_text, 6 as order_index, 20 as time_limit_seconds, 'Solar energy from the sun is a renewable source that does not run out.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'My Environment'), 'What do we breathe in from the air?' as question_text, 7 as order_index, 20 as time_limit_seconds, 'We breathe oxygen from the air to survive.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'My Environment'), 'What is decomposition?' as question_text, 8 as order_index, 20 as time_limit_seconds, 'Decomposition is when dead plants and animals break down in soil.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'My Environment'), 'Which habitat is cold and icy?' as question_text, 9 as order_index, 20 as time_limit_seconds, 'The Arctic and Antarctic regions are cold, icy habitats.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'My Environment'), 'What is pollution?' as question_text, 10 as order_index, 20 as time_limit_seconds, 'Pollution is when harmful substances damage the air, water, or soil.' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (
  question_id,
  option_text,
  is_correct,
  order_index
) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 1) as question_id, 'Sunlight, water, and soil' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 1), 'Wind and snow', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 1), 'Only water', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 1), 'Rain and clouds', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 2), 'Lion', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 2), 'Snake', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 2), 'Fish', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 2), 'Bird', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 3), 'Materials from nature we use', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 3), 'Plastic products', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 3), 'Factory waste', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 3), 'Pollution', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 4), 'Rain', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 4), 'Snow', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 4), 'Wind', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 4), 'Lightning', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 5), 'Stomata', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 5), 'Roots', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 5), 'Seeds', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 5), 'Stems', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 6), 'Solar energy', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 6), 'Coal energy', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 6), 'Oil energy', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 6), 'Gas energy', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 7), 'Oxygen', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 7), 'Carbon dioxide', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 7), 'Nitrogen', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 7), 'Hydrogen', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 8), 'When dead things break down', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 8), 'When animals eat', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 8), 'When it rains', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 8), 'When plants grow', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 9), 'Arctic and Antarctic', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 9), 'Desert', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 9), 'Rainforest', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 9), 'Savanna', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 10), 'Harmful substances damaging environment', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 10), 'Clean air', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 10), 'Fresh water', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'My Environment') AND order_index = 10), 'Green plants', false, 4
) AS options;

UPDATE public.public_quizzes 
SET total_questions = 10
WHERE title = 'My Environment';

COMMIT;
