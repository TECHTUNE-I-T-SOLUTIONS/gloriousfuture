-- Migration: Add difficulty level, age group, and category to public_quizzes
-- Purpose: Enable filtering quizzes by difficulty and class level for primary school students

ALTER TABLE public.public_quizzes 
ADD COLUMN IF NOT EXISTS difficulty_level text DEFAULT 'easy' CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'mixed'));

ALTER TABLE public.public_quizzes 
ADD COLUMN IF NOT EXISTS age_group text DEFAULT 'all' CHECK (age_group IN ('6-8', '8-10', '10-12', '12-14', 'all'));

ALTER TABLE public.public_quizzes 
ADD COLUMN IF NOT EXISTS target_class text CHECK (target_class IN ('Creche', 'Pre-Nursery', 'Nursery One', 'Nursery Two', 'Primary One', 'Primary Two', 'Primary Three', 'Primary Four', 'Primary Five'));

ALTER TABLE public.public_quizzes 
ADD COLUMN IF NOT EXISTS subject_area text;

ALTER TABLE public.public_quizzes 
ADD COLUMN IF NOT EXISTS knowledge_use_rate numeric DEFAULT 0;

ALTER TABLE public.public_quizzes 
ADD COLUMN IF NOT EXISTS average_completion_time integer;

-- Add index for easier filtering
CREATE INDEX IF NOT EXISTS idx_public_quizzes_difficulty ON public.public_quizzes(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_public_quizzes_age_group ON public.public_quizzes(age_group);
CREATE INDEX IF NOT EXISTS idx_public_quizzes_target_class ON public.public_quizzes(target_class);
CREATE INDEX IF NOT EXISTS idx_public_quizzes_subject_area ON public.public_quizzes(subject_area);

-- Add index for published public quizzes
CREATE INDEX IF NOT EXISTS idx_public_quizzes_published_public ON public.public_quizzes(is_published, is_public);
