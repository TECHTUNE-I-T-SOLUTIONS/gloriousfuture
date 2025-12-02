-- Migration: Add subjects table, subject_id FKs, and final_results with visibility
-- Run this as a migration using your DB tooling. This file is standalone and does not modify other schema files.

-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Seed common subjects (adjust as needed)
INSERT INTO public.subjects (name)
VALUES
  ('Mathematics'),
  ('English Studies'),
  ('Basic Science'),
  ('Basic Science and Technology'),
  ('Social Studies'),
  ('Nigerian Languages'),
  ('Nigerian History'),
  ('Physical Education'),
  ('Physical and Health Education'),
  ('CRS'),
  ('Social and Citizenship Studies'),
  ('Cultural and Creative Arts'),
    ('Agricultural Science'),
    ('Basic Digital Literacy'),
    ('Pre-vocational Studies'),
    ('French'),
    ('Numeracy'),
    ('Literacy'),
    ('Poems'),
    ('Oral Conversations'),
    ('Picture Reading'),
    ('Social Habits'),
    ('Health Habits'),
    ('Programming')
ON CONFLICT (name) DO NOTHING;

-- Add subject_id columns (nullable) and foreign keys where appropriate
ALTER TABLE IF EXISTS public.assignments ADD COLUMN IF NOT EXISTS subject_id uuid;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'assignments_subject_fkey') THEN
    ALTER TABLE IF EXISTS public.assignments
      ADD CONSTRAINT assignments_subject_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE SET NULL;
  END IF;
END
$$;

ALTER TABLE IF EXISTS public.tests_quizzes ADD COLUMN IF NOT EXISTS subject_id uuid;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tests_quizzes_subject_fkey') THEN
    ALTER TABLE IF EXISTS public.tests_quizzes
      ADD CONSTRAINT tests_quizzes_subject_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE SET NULL;
  END IF;
END
$$;

ALTER TABLE IF EXISTS public.cbt_exams ADD COLUMN IF NOT EXISTS subject_id uuid;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cbt_exams_subject_fkey') THEN
    ALTER TABLE IF EXISTS public.cbt_exams
      ADD CONSTRAINT cbt_exams_subject_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE SET NULL;
  END IF;
END
$$;

ALTER TABLE IF EXISTS public.exam_results ADD COLUMN IF NOT EXISTS subject_id uuid;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exam_results_subject_fkey') THEN
    ALTER TABLE IF EXISTS public.exam_results
      ADD CONSTRAINT exam_results_subject_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE SET NULL;
  END IF;
END
$$;

-- Create final_results table with visibility flag
CREATE TABLE IF NOT EXISTS public.final_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid,
  class_id uuid,
  pupil_id uuid,
  average numeric,
  grade text,
  results jsonb,
  -- component_maxima stores class maxima per subject at computation time, e.g. {"Mathematics": {"exam_max": 95, "test_max": 90, "assignment_max": 100}}
  component_maxima jsonb,
  visible_to_pupils boolean NOT NULL DEFAULT false,
  computed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_final_results_teacher ON public.final_results (teacher_id);
CREATE INDEX IF NOT EXISTS idx_final_results_class ON public.final_results (class_id);
CREATE INDEX IF NOT EXISTS idx_final_results_pupil ON public.final_results (pupil_id);
-- GIN indexes to allow efficient JSONB queries on results/component_maxima
CREATE INDEX IF NOT EXISTS idx_final_results_results_gin ON public.final_results USING gin (results jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_final_results_component_maxima_gin ON public.final_results USING gin (component_maxima jsonb_path_ops);

-- Best-effort exact-match backfill for existing text subjects
-- NOTE: these will only populate rows where a case-insensitive exact match exists
UPDATE public.cbt_exams SET subject_id = s.id FROM public.subjects s WHERE lower(cbt_exams.subject) = lower(s.name) AND cbt_exams.subject_id IS NULL;
UPDATE public.exam_results SET subject_id = s.id FROM public.subjects s WHERE lower(exam_results.subject) = lower(s.name) AND exam_results.subject_id IS NULL;
UPDATE public.tests_quizzes SET subject_id = s.id FROM public.subjects s WHERE (lower(tests_quizzes.title) = lower(s.name) OR lower(tests_quizzes.description) = lower(s.name)) AND tests_quizzes.subject_id IS NULL;
-- assignments may have subject stored in a free-text field; check description for simple matches
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'assignments' AND column_name = 'subject'
  ) THEN
    UPDATE public.assignments SET subject_id = s.id
    FROM public.subjects s
    WHERE lower(COALESCE(assignments.subject, '')) = lower(s.name)
      AND assignments.subject_id IS NULL;
  END IF;
END
$$;

-- Note: `gen_random_uuid()` requires the pgcrypto extension. If your database does not have it enabled, run:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- End migration
