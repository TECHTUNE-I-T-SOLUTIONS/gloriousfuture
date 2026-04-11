-- Migration: Create tables for public quizzes
-- Run this in Supabase (psql or SQL editor)

CREATE TABLE IF NOT EXISTS public.public_quizzes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  teacher_id uuid NULL,
  title text NOT NULL,
  description text,
  is_published boolean NOT NULL DEFAULT false,
  is_public boolean NOT NULL DEFAULT true,
  time_per_question integer NOT NULL DEFAULT 30,
  total_questions integer NOT NULL DEFAULT 0,
  tags text[] DEFAULT ARRAY[]::text[],
  difficulty text,
  thumbnail_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT public_quizzes_pkey PRIMARY KEY (id),
  CONSTRAINT public_quizzes_teacher_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id)
);

CREATE TABLE IF NOT EXISTS public.public_quiz_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL,
  question_text text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  time_limit_seconds integer,
  explanation text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT public_quiz_questions_pkey PRIMARY KEY (id),
  CONSTRAINT public_quiz_questions_quiz_fkey FOREIGN KEY (quiz_id) REFERENCES public.public_quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.public_quiz_options (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL,
  option_text text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  CONSTRAINT public_quiz_options_pkey PRIMARY KEY (id),
  CONSTRAINT public_quiz_options_question_fkey FOREIGN KEY (question_id) REFERENCES public.public_quiz_questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.public_quiz_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  quiz_id uuid NULL,
  pupil_id uuid NULL,
  anonymous_session_id uuid NULL,
  score numeric,
  started_at timestamptz,
  completed_at timestamptz,
  answers jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT public_quiz_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT public_quiz_attempts_quiz_fkey FOREIGN KEY (quiz_id) REFERENCES public.public_quizzes(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_public_quiz_questions_quiz_id ON public.public_quiz_questions (quiz_id);
CREATE INDEX IF NOT EXISTS idx_public_quiz_options_question_id ON public.public_quiz_options (question_id);
CREATE INDEX IF NOT EXISTS idx_public_quizzes_published_public ON public.public_quizzes (is_published, is_public);

-- Trigger to keep updated_at current on update
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_timestamp ON public.public_quizzes;
CREATE TRIGGER trigger_update_timestamp
BEFORE UPDATE ON public.public_quizzes
FOR EACH ROW
EXECUTE PROCEDURE public.update_timestamp();
