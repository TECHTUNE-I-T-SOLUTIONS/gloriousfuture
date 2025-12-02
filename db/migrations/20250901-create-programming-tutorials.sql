-- Migration: Create Programming Tutorials & Assessments System
-- This migration creates tables for programming courses, modules, lessons, assessments, and student progress

-- Drop existing tables if they exist (only for migration testing; comment out in production)
-- DROP TABLE IF EXISTS programming_assessment_submissions CASCADE;
-- DROP TABLE IF EXISTS programming_lessons CASCADE;
-- DROP TABLE IF EXISTS programming_modules CASCADE;
-- DROP TABLE IF EXISTS programming_courses CASCADE;

-- Create programming_courses table
CREATE TABLE IF NOT EXISTS public.programming_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid,
  title text NOT NULL,
  description text,
  difficulty_level text NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  age_group text NOT NULL CHECK (age_group IN ('6-10', '11-15', '16-18', 'all')),
  subject_id uuid,
  class_ids uuid[] DEFAULT ARRAY[]::uuid[],
  image_url text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT programming_courses_teacher_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE,
  CONSTRAINT programming_courses_subject_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_programming_courses_teacher ON public.programming_courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_programming_courses_published ON public.programming_courses(is_published);
CREATE INDEX IF NOT EXISTS idx_programming_courses_difficulty ON public.programming_courses(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_programming_courses_age_group ON public.programming_courses(age_group);

-- Create programming_modules table (chapters/sections within a course)
CREATE TABLE IF NOT EXISTS public.programming_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT programming_modules_course_fkey FOREIGN KEY (course_id) REFERENCES public.programming_courses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_programming_modules_course ON public.programming_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_programming_modules_order ON public.programming_modules(course_id, order_index);

-- Create programming_lessons table (individual lessons within modules)
CREATE TABLE IF NOT EXISTS public.programming_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  content_rich_html text,
  code_example text,
  code_language text DEFAULT 'javascript',
  order_index integer NOT NULL,
  learning_objectives text[] DEFAULT ARRAY[]::text[],
  estimated_duration_minutes integer,
  has_assessment boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT programming_lessons_module_fkey FOREIGN KEY (module_id) REFERENCES public.programming_modules(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_programming_lessons_module ON public.programming_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_programming_lessons_order ON public.programming_lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_programming_lessons_has_assessment ON public.programming_lessons(has_assessment);

-- Create programming_assessments table (quiz/tests at end of lessons)
CREATE TABLE IF NOT EXISTS public.programming_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  assessment_type text NOT NULL CHECK (assessment_type IN ('multiple_choice', 'code_completion', 'free_coding', 'true_false', 'matching')),
  questions jsonb NOT NULL,
  passing_score numeric NOT NULL DEFAULT 70,
  max_score numeric NOT NULL DEFAULT 100,
  order_index integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT programming_assessments_lesson_fkey FOREIGN KEY (lesson_id) REFERENCES public.programming_lessons(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_programming_assessments_lesson ON public.programming_assessments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_programming_assessments_type ON public.programming_assessments(assessment_type);

-- Create programming_pupil_progress table (track student progress through courses)
CREATE TABLE IF NOT EXISTS public.programming_pupil_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pupil_id uuid NOT NULL,
  course_id uuid NOT NULL,
  current_module_id uuid,
  current_lesson_id uuid,
  total_lessons_completed integer NOT NULL DEFAULT 0,
  total_assessments_passed integer NOT NULL DEFAULT 0,
  course_completion_percentage numeric NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_accessed_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT programming_pupil_progress_pupil_fkey FOREIGN KEY (pupil_id) REFERENCES public.pupils(id) ON DELETE CASCADE,
  CONSTRAINT programming_pupil_progress_course_fkey FOREIGN KEY (course_id) REFERENCES public.programming_courses(id) ON DELETE CASCADE,
  CONSTRAINT programming_pupil_progress_module_fkey FOREIGN KEY (current_module_id) REFERENCES public.programming_modules(id) ON DELETE SET NULL,
  CONSTRAINT programming_pupil_progress_lesson_fkey FOREIGN KEY (current_lesson_id) REFERENCES public.programming_lessons(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_programming_pupil_progress_pupil ON public.programming_pupil_progress(pupil_id);
CREATE INDEX IF NOT EXISTS idx_programming_pupil_progress_course ON public.programming_pupil_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_programming_pupil_progress_pupil_course ON public.programming_pupil_progress(pupil_id, course_id);

-- Create programming_assessment_submissions table (student answers to assessments)
CREATE TABLE IF NOT EXISTS public.programming_assessment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL,
  pupil_id uuid NOT NULL,
  lesson_id uuid NOT NULL,
  course_id uuid NOT NULL,
  answers jsonb NOT NULL,
  code_submission text,
  score numeric,
  is_passed boolean,
  feedback jsonb,
  ai_feedback text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  auto_marked_at timestamptz,
  reviewed_by_teacher uuid,
  reviewed_at timestamptz,
  attempts integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT programming_assessment_submissions_assessment_fkey FOREIGN KEY (assessment_id) REFERENCES public.programming_assessments(id) ON DELETE CASCADE,
  CONSTRAINT programming_assessment_submissions_pupil_fkey FOREIGN KEY (pupil_id) REFERENCES public.pupils(id) ON DELETE CASCADE,
  CONSTRAINT programming_assessment_submissions_lesson_fkey FOREIGN KEY (lesson_id) REFERENCES public.programming_lessons(id) ON DELETE CASCADE,
  CONSTRAINT programming_assessment_submissions_course_fkey FOREIGN KEY (course_id) REFERENCES public.programming_courses(id) ON DELETE CASCADE,
  CONSTRAINT programming_assessment_submissions_reviewer_fkey FOREIGN KEY (reviewed_by_teacher) REFERENCES public.teachers(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_programming_assessment_submissions_assessment ON public.programming_assessment_submissions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_programming_assessment_submissions_pupil ON public.programming_assessment_submissions(pupil_id);
CREATE INDEX IF NOT EXISTS idx_programming_assessment_submissions_lesson ON public.programming_assessment_submissions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_programming_assessment_submissions_course ON public.programming_assessment_submissions(course_id);
CREATE INDEX IF NOT EXISTS idx_programming_assessment_submissions_pupil_assessment ON public.programming_assessment_submissions(pupil_id, assessment_id);
CREATE INDEX IF NOT EXISTS idx_programming_assessment_submissions_submitted ON public.programming_assessment_submissions(submitted_at);

-- Create programming_lesson_completion table (track which lessons pupils have completed)
CREATE TABLE IF NOT EXISTS public.programming_lesson_completion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pupil_id uuid NOT NULL,
  lesson_id uuid NOT NULL,
  course_id uuid NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  time_spent_seconds integer,
  CONSTRAINT programming_lesson_completion_pupil_fkey FOREIGN KEY (pupil_id) REFERENCES public.pupils(id) ON DELETE CASCADE,
  CONSTRAINT programming_lesson_completion_lesson_fkey FOREIGN KEY (lesson_id) REFERENCES public.programming_lessons(id) ON DELETE CASCADE,
  CONSTRAINT programming_lesson_completion_course_fkey FOREIGN KEY (course_id) REFERENCES public.programming_courses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_programming_lesson_completion_pupil ON public.programming_lesson_completion(pupil_id);
CREATE INDEX IF NOT EXISTS idx_programming_lesson_completion_lesson ON public.programming_lesson_completion(lesson_id);
CREATE INDEX IF NOT EXISTS idx_programming_lesson_completion_pupil_lesson ON public.programming_lesson_completion(pupil_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_programming_lesson_completion_course ON public.programming_lesson_completion(course_id);

-- End migration
