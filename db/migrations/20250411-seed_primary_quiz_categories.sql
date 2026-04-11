-- Migration: Create primary school quiz categories with starter data
-- Purpose: Provide pre-configured quiz categories for ages 6-12 (Primary classes)

-- Sample Easy Quizzes (Ages 6-8)
INSERT INTO public.public_quizzes (title, description, difficulty_level, age_group, target_class, subject_area, is_published, is_public, time_per_question, total_questions)
VALUES 
  ('Colors & Shapes', 'Learn about colors and basic shapes', 'easy', '6-8', 'Nursery Two', 'General Knowledge', true, true, 15, 8),
  ('Numbers 1-10', 'Count and identify numbers', 'easy', '6-8', 'Nursery Two', 'Mathematics', true, true, 15, 8),
  ('Animals Around Us', 'Identify common animals and their sounds', 'easy', '6-8', 'Creche', 'Science', true, true, 20, 6)
ON CONFLICT DO NOTHING;

-- Sample Medium Quizzes (Ages 8-10)
INSERT INTO public.public_quizzes (title, description, difficulty_level, age_group, target_class, subject_area, is_published, is_public, time_per_question, total_questions)
VALUES 
  ('Basic Arithmetic', 'Addition and subtraction basics', 'medium', '8-10', 'Primary One', 'Mathematics', true, true, 20, 10),
  ('My Environment', 'Understanding our surroundings', 'medium', '8-10', 'Primary Two', 'Science', true, true, 20, 10),
  ('Simple English', 'Vocabulary and sentence structure', 'medium', '8-10', 'Primary Two', 'English', true, true, 25, 8)
ON CONFLICT DO NOTHING;

-- Sample Medium-Hard Quizzes (Ages 10-12)
INSERT INTO public.public_quizzes (title, description, difficulty_level, age_group, target_class, subject_area, is_published, is_public, time_per_question, total_questions)
VALUES 
  ('World Geography', 'Countries, continents, and landmarks', 'medium', '10-12', 'Primary Three', 'Social Studies', true, true, 25, 12),
  ('Science Facts', 'Biology, Physics, and Chemistry basics', 'medium', '10-12', 'Primary Three', 'Science', true, true, 25, 12),
  ('Math Challenges', 'Multiplication and division', 'hard', '10-12', 'Primary Four', 'Mathematics', true, true, 30, 15)
ON CONFLICT DO NOTHING;

-- Sample Hard Quizzes (Ages 11-12+)
INSERT INTO public.public_quizzes (title, description, difficulty_level, age_group, target_class, subject_area, is_published, is_public, time_per_question, total_questions)
VALUES 
  ('Advanced Science', 'Deep dive into scientific concepts', 'hard', '12-14', 'Primary Five', 'Science', true, true, 30, 20),
  ('Literary Quiz', 'Stories, poetry, and literature', 'hard', '12-14', 'Primary Five', 'English', true, true, 30, 12),
  ('Historical Events', 'Important moments in history', 'hard', '10-12', 'Primary Four', 'Social Studies', true, true, 30, 15)
ON CONFLICT DO NOTHING;

-- Note: All existing questions should be updated to set appropriate difficulty levels
-- Run this after populating questions: UPDATE public.public_quizzes SET knowledge_use_rate = 0 WHERE knowledge_use_rate IS NULL;
