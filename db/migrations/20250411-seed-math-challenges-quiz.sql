-- Seed file: Math Challenges Quiz (Hard, Ages 10-12) - 15 questions
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
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') as id, 'What is 12 × 15?' as question_text, 1 as order_index, 30 as time_limit_seconds, '12 × 15 = 180. Use: 12 × 10 + 12 × 5.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges'), 'What is 144 ÷ 12?' as question_text, 2 as order_index, 30 as time_limit_seconds, '144 ÷ 12 = 12.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges'), 'What is 25% of 80?' as question_text, 3 as order_index, 30 as time_limit_seconds, '25% of 80 = 20. That is 1/4 of 80.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges'), 'What is the square root of 169?' as question_text, 4 as order_index, 30 as time_limit_seconds, '√169 = 13 because 13 × 13 = 169.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges'), 'What is 0.5 + 0.75?' as question_text, 5 as order_index, 30 as time_limit_seconds, '0.5 + 0.75 = 1.25.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges'), 'What is 99 - 45 + 30?' as question_text, 6 as order_index, 30 as time_limit_seconds, '99 - 45 + 30 = 84. Calculate left to right.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges'), 'What is 2³ (2 to the power of 3)?' as question_text, 7 as order_index, 30 as time_limit_seconds, '2³ = 8 because 2 × 2 × 2 = 8.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges'), 'What is 3/4 of 100?' as question_text, 8 as order_index, 30 as time_limit_seconds, '3/4 × 100 = 75.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges'), 'What is 15% of 200?' as question_text, 9 as order_index, 30 as time_limit_seconds, '15% of 200 = 30.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges'), 'What is the perimeter of a square with side 5cm?' as question_text, 10 as order_index, 30 as time_limit_seconds, 'Perimeter = 4 × 5 = 20cm.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges'), 'What is 7² (7 squared)?' as question_text, 11 as order_index, 30 as time_limit_seconds, '7² = 49 because 7 × 7 = 49.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges'), 'What is 250 ÷ 5 + 50?' as question_text, 12 as order_index, 30 as time_limit_seconds, '250 ÷ 5 + 50 = 50 + 50 = 100.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges'), 'What is 1/2 + 1/3?' as question_text, 13 as order_index, 30 as time_limit_seconds, '1/2 + 1/3 = 3/6 + 2/6 = 5/6.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges'), 'What is 50% of 360?' as question_text, 14 as order_index, 30 as time_limit_seconds, '50% of 360 = 180.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges'), 'What is the area of a rectangle 6cm × 8cm?' as question_text, 15 as order_index, 30 as time_limit_seconds, 'Area = 6 × 8 = 48 cm².' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 1) as question_id, '180' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 1), '175', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 1), '185', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 1), '190', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 2), '12' as question_id, true as option_text, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 2), '11', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 2), '13', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 2), '10', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 3), '20' as question_id, true as option_text, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 3), '25', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 3), '30', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 3), '15', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 4), '13' as question_id, true as option_text, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 4), '12', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 4), '14', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 4), '15', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 5), '1.25' as question_id, true as option_text, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 5), '1.2', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 5), '1.35', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 5), '2.0', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 6), '84' as question_id, true as option_text, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 6), '80', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 6), '85', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 6), '75', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 7), '8' as question_id, true as option_text, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 7), '6', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 7), '9', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 7), '4', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 8), '75' as question_id, true as option_text, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 8), '80', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 8), '70', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 8), '65', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 9), '30' as question_id, true as option_text, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 9), '25', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 9), '35', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 9), '40', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 10), '20cm' as question_id, true as option_text, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 10), '15cm', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 10), '25cm', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 10), '10cm', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 11), '49' as question_id, true as option_text, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 11), '48', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 11), '50', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 11), '47', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 12), '100' as question_id, true as option_text, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 12), '95', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 12), '105', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 12), '90', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 13), '5/6' as question_id, true as option_text, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 13), '2/5', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 13), '3/4', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 13), '1', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 14), '180' as question_id, true as option_text, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 14), '170', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 14), '190', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 14), '160', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 15), '48 cm²' as question_id, true as option_text, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 15), '45 cm²', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 15), '50 cm²', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Math Challenges') AND order_index = 15), '40 cm²', false, 4
) AS options;

UPDATE public.public_quizzes SET total_questions = 15 WHERE title = 'Math Challenges';

COMMIT;
