-- Add difficulty_level and age_group columns to public_quizzes table if they don't exist
ALTER TABLE public.public_quizzes
ADD COLUMN IF NOT EXISTS difficulty_level text DEFAULT 'easy' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
ADD COLUMN IF NOT EXISTS age_group text DEFAULT '8-12' CHECK (age_group IN ('8-10', '10-12', '8-12', 'all'));

-- Create index for better query performance on filters
CREATE INDEX IF NOT EXISTS idx_public_quizzes_difficulty_level ON public.public_quizzes(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_public_quizzes_age_group ON public.public_quizzes(age_group);
CREATE INDEX IF NOT EXISTS idx_public_quizzes_is_published ON public.public_quizzes(is_published);
