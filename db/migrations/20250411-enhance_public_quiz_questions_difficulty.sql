-- Migration: Add difficulty and cognitive level tracking to public_quiz_questions
-- Purpose: Track individual question difficulty and learning level

ALTER TABLE public.public_quiz_questions 
ADD COLUMN IF NOT EXISTS difficulty_level text DEFAULT 'easy' CHECK (difficulty_level IN ('easy', 'medium', 'hard'));

ALTER TABLE public.public_quiz_questions 
ADD COLUMN IF NOT EXISTS cognitive_level text DEFAULT 'recall' CHECK (cognitive_level IN ('recall', 'understand', 'apply', 'analyze', 'evaluate', 'create'));

ALTER TABLE public.public_quiz_questions 
ADD COLUMN IF NOT EXISTS learning_outcome text;

ALTER TABLE public.public_quiz_questions 
ADD COLUMN IF NOT EXISTS attempts_count integer DEFAULT 0;

ALTER TABLE public.public_quiz_questions 
ADD COLUMN IF NOT EXISTS correct_answer_count integer DEFAULT 0;

-- Add index for question difficulty analysis
CREATE INDEX IF NOT EXISTS idx_public_quiz_questions_difficulty ON public.public_quiz_questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_public_quiz_questions_cognitive ON public.public_quiz_questions(cognitive_level);
