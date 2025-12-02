-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.ai_file_uploads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  extracted_text text,
  uploaded_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ai_file_uploads_pkey PRIMARY KEY (id),
  CONSTRAINT ai_file_uploads_teacher_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id)
);
CREATE TABLE public.ai_generated_content (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  file_upload_id uuid,
  content_type text NOT NULL,
  title text NOT NULL,
  subject text NOT NULL,
  class_id uuid,
  school_session_id uuid,
  generated_data jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ai_generated_content_pkey PRIMARY KEY (id),
  CONSTRAINT ai_generated_content_teacher_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id),
  CONSTRAINT ai_generated_content_file_upload_fkey FOREIGN KEY (file_upload_id) REFERENCES public.ai_file_uploads(id),
  CONSTRAINT ai_generated_content_class_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id),
  CONSTRAINT ai_generated_content_school_session_fkey FOREIGN KEY (school_session_id) REFERENCES public.school_session(id)
);
CREATE TABLE public.alert_classes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL,
  class_id uuid NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT alert_classes_pkey PRIMARY KEY (id),
  CONSTRAINT alert_classes_alert_id_fkey FOREIGN KEY (alert_id) REFERENCES public.alerts(id),
  CONSTRAINT alert_classes_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id)
);
CREATE TABLE public.alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  teacher_id uuid,
  message text NOT NULL,
  start_time timestamp without time zone NOT NULL,
  end_time timestamp without time zone NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  all_classes boolean NOT NULL DEFAULT false,
  CONSTRAINT alerts_pkey PRIMARY KEY (id),
  CONSTRAINT alerts_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id)
);
CREATE TABLE public.assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  teacher_id uuid,
  class_id uuid,
  title text NOT NULL,
  description text,
  due_date timestamp without time zone NOT NULL,
  CONSTRAINT assignments_pkey PRIMARY KEY (id),
  CONSTRAINT assignments_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id),
  CONSTRAINT assignments_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id)
);
CREATE TABLE public.blog_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  blog_id uuid NOT NULL,
  user_id uuid,
  author_name text NOT NULL,
  content text NOT NULL,
  parent_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT blog_comments_pkey PRIMARY KEY (id),
  CONSTRAINT blog_comments_blog_fk FOREIGN KEY (blog_id) REFERENCES public.blogs(id),
  CONSTRAINT blog_comments_user_fk FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT blog_comments_parent_fk FOREIGN KEY (parent_id) REFERENCES public.blog_comments(id)
);
CREATE TABLE public.blog_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  blog_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT blog_likes_pkey PRIMARY KEY (id),
  CONSTRAINT blog_likes_blog_fk FOREIGN KEY (blog_id) REFERENCES public.blogs(id),
  CONSTRAINT blog_likes_user_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.blogs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid,
  author_name text NOT NULL,
  author_role text NOT NULL CHECK (author_role = ANY (ARRAY['teacher'::text, 'pupil'::text])),
  created_at timestamp without time zone DEFAULT now(),
  image_url text,
  likes_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  CONSTRAINT blogs_pkey PRIMARY KEY (id),
  CONSTRAINT blogs_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id)
);
CREATE TABLE public.cbt_exam_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL,
  pupil_id uuid NOT NULL,
  teacher_id uuid,
  score integer,
  answers jsonb,
  submitted_at timestamp without time zone DEFAULT now(),
  CONSTRAINT cbt_exam_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT cbt_exam_attempts_exam_fkey FOREIGN KEY (exam_id) REFERENCES public.cbt_exams(id),
  CONSTRAINT cbt_exam_attempts_pupil_fkey FOREIGN KEY (pupil_id) REFERENCES public.pupils(id)
);
CREATE TABLE public.cbt_exams (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  teacher_id uuid,
  class_id uuid,
  exam_title text NOT NULL,
  subject text NOT NULL,
  questions jsonb NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  duration integer DEFAULT 0,
  school_session_id uuid,
  CONSTRAINT cbt_exams_pkey PRIMARY KEY (id),
  CONSTRAINT cbt_exams_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id),
  CONSTRAINT cbt_exams_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id),
  CONSTRAINT cbt_exams_school_session_id_fkey FOREIGN KEY (school_session_id) REFERENCES public.school_session(id)
);
CREATE TABLE public.classes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  CONSTRAINT classes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.exam_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  teacher_id uuid,
  pupil_id uuid,
  subject text NOT NULL,
  score integer CHECK (score >= 0 AND score <= 100),
  cbt_exam_id uuid,
  CONSTRAINT exam_results_pkey PRIMARY KEY (id),
  CONSTRAINT exam_results_pupil_id_fkey FOREIGN KEY (pupil_id) REFERENCES public.pupils(id),
  CONSTRAINT exam_results_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  teacher_id uuid,
  pupil_id uuid,
  message text NOT NULL,
  timestamp timestamp without time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_pupil_id_fkey FOREIGN KEY (pupil_id) REFERENCES public.pupils(id),
  CONSTRAINT messages_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id)
);
CREATE TABLE public.migration_unmatched_pupil_classes (
  pupil_id uuid NOT NULL,
  class_text text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT migration_unmatched_pupil_classes_pkey PRIMARY KEY (pupil_id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recipient_role text,
  recipient_id uuid,
  class_id uuid,
  type text NOT NULL,
  payload jsonb,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id)
);
CREATE TABLE public.payment_disputes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL,
  pupil_id uuid,
  uin character varying,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'open'::text,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT payment_disputes_pkey PRIMARY KEY (id),
  CONSTRAINT payment_disputes_payment_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pupil_id uuid,
  user_id uuid,
  email text,
  class character varying,
  uin character varying,
  profile_picture text,
  amount numeric,
  payment_reference text UNIQUE,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'paid'::text, 'disputed'::text])),
  payment_method text,
  session character varying,
  paid_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  terms jsonb,
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_pupil_id_fkey FOREIGN KEY (pupil_id) REFERENCES public.pupils(id)
);
CREATE TABLE public.paystack_response_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  source text NOT NULL,
  payment_id uuid,
  reference text,
  http_status integer,
  raw_response jsonb,
  note text,
  CONSTRAINT paystack_response_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.pupils (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  guardian_name text NOT NULL,
  guardian_contact text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  phone_number text NOT NULL,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  father_name text NOT NULL,
  mother_name text NOT NULL,
  class text NOT NULL CHECK (class = ANY (ARRAY['Creche'::text, 'Pre-Nursery'::text, 'Nursery One'::text, 'Nursery Two'::text, 'Primary One'::text, 'Primary Two'::text, 'Primary Three'::text, 'Primary Four'::text, 'Primary Five'::text])),
  uin text NOT NULL UNIQUE,
  profile_picture text,
  password text NOT NULL DEFAULT ''::text,
  class_id uuid,
  CONSTRAINT pupils_pkey PRIMARY KEY (id),
  CONSTRAINT pupils_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT pupils_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id)
);
CREATE TABLE public.school_fees (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  class character varying NOT NULL UNIQUE,
  amount numeric NOT NULL,
  session character varying NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  created_by uuid,
  term1_amount numeric,
  term2_amount numeric,
  term3_amount numeric,
  CONSTRAINT school_fees_pkey PRIMARY KEY (id),
  CONSTRAINT school_fees_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.teachers(id)
);
CREATE TABLE public.school_session (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session character varying NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  created_by uuid,
  CONSTRAINT school_session_pkey PRIMARY KEY (id)
);
CREATE TABLE public.submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL,
  text_submission text,
  file_url text,
  submitted_at timestamp without time zone DEFAULT now(),
  pupil_id uuid,
  grade integer CHECK (grade >= 0 AND grade <= 100),
  feedback text,
  CONSTRAINT submissions_pkey PRIMARY KEY (id),
  CONSTRAINT submissions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id),
  CONSTRAINT submissions_pupil_id_fkey FOREIGN KEY (pupil_id) REFERENCES public.pupils(id)
);
CREATE TABLE public.teachers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  class_taught text NOT NULL,
  years_of_experience integer NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  email text NOT NULL,
  password text NOT NULL,
  username text NOT NULL,
  full_name text NOT NULL,
  profile_picture text,
  uin text NOT NULL,
  CONSTRAINT teachers_pkey PRIMARY KEY (id),
  CONSTRAINT teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.test_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL,
  pupil_id uuid NOT NULL,
  answers jsonb,
  score numeric,
  submitted_at timestamp with time zone DEFAULT now(),
  CONSTRAINT test_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT test_submissions_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests_quizzes(id),
  CONSTRAINT test_submissions_pupil_id_fkey FOREIGN KEY (pupil_id) REFERENCES public.pupils(id)
);
CREATE TABLE public.tests_quizzes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  due_date date,
  class_id uuid,
  teacher_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  questions jsonb DEFAULT '[]'::jsonb,
  school_session_id uuid,
  CONSTRAINT tests_quizzes_pkey PRIMARY KEY (id),
  CONSTRAINT tests_quizzes_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id),
  CONSTRAINT tests_quizzes_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id),
  CONSTRAINT tests_quizzes_school_session_id_fkey FOREIGN KEY (school_session_id) REFERENCES public.school_session(id)
);
CREATE TABLE public.timetable (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  teacher_id uuid,
  class_id uuid,
  subject text NOT NULL,
  day text CHECK (day = ANY (ARRAY['Monday'::text, 'Tuesday'::text, 'Wednesday'::text, 'Thursday'::text, 'Friday'::text, 'Saturday'::text, 'Sunday'::text])),
  time time without time zone NOT NULL,
  CONSTRAINT timetable_pkey PRIMARY KEY (id),
  CONSTRAINT timetable_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id),
  CONSTRAINT timetable_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['teacher'::text, 'pupil'::text])),
  uin text NOT NULL UNIQUE,
  created_at timestamp without time zone DEFAULT now(),
  username text,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- ------------------------------------------------------------
-- Subjects table (primary-school subjects)
-- ------------------------------------------------------------
CREATE TABLE public.subjects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code varchar(32) NOT NULL,
  name text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT subjects_pkey PRIMARY KEY (id)
);

-- seed common primary/elementary subjects (kindergarten -> Primary 6)
INSERT INTO public.subjects (code, name) VALUES
('ENG','English Language'),
('MAT','Mathematics'),
('SCI','Basic Science'),
('SOC','Social Studies'),
('ICT','Computer Studies'),
('MUS','Music'),
('ART','Art & Craft'),
('PE','Physical Education'),
('GEO','Geography'),
('HIS','History'),
('RSL','Religious/Values Education'),
('CIV','Civic Education');

-- ------------------------------------------------------------
-- Add subject_id columns (nullable) and foreign keys where appropriate
-- We keep any existing `subject` text columns to avoid breaking reads, but add
-- subject_id to unify references going forward.
-- ------------------------------------------------------------
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS subject_id uuid;
ALTER TABLE public.assignments ADD CONSTRAINT IF NOT EXISTS assignments_subject_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);

ALTER TABLE public.tests_quizzes ADD COLUMN IF NOT EXISTS subject_id uuid;
ALTER TABLE public.tests_quizzes ADD CONSTRAINT IF NOT EXISTS tests_quizzes_subject_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);

ALTER TABLE public.cbt_exams ADD COLUMN IF NOT EXISTS subject_id uuid;
ALTER TABLE public.cbt_exams ADD CONSTRAINT IF NOT EXISTS cbt_exams_subject_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);

ALTER TABLE public.exam_results ADD COLUMN IF NOT EXISTS subject_id uuid;
ALTER TABLE public.exam_results ADD CONSTRAINT IF NOT EXISTS exam_results_subject_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);

-- best-effort backfill: where a text `subject` column exists try to match to seeded subjects
-- NOTE: these updates are tolerant; if no exact match is found the subject_id will remain NULL
UPDATE public.cbt_exams SET subject_id = s.id FROM public.subjects s WHERE lower(cbt_exams.subject) = lower(s.name);
UPDATE public.exam_results SET subject_id = s.id FROM public.subjects s WHERE lower(exam_results.subject) = lower(s.name);
UPDATE public.tests_quizzes SET subject_id = s.id FROM public.subjects s WHERE lower(tests_quizzes.title) = lower(s.name) OR lower(tests_quizzes.description) = lower(s.name);

-- ------------------------------------------------------------
-- Final results table
-- Stores aggregated per-pupil final results for a class, produced by the teacher via a batch job
-- results jsonb structure: { "<subject name>": { score: <number>, grade: "A|B|..." }, ... }
-- ------------------------------------------------------------
CREATE TABLE public.final_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  teacher_id uuid,
  class_id uuid NOT NULL,
  pupil_id uuid NOT NULL,
  school_session_id uuid,
  term varchar(32),
  average numeric,
  grade varchar(2),
  results jsonb,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT final_results_pkey PRIMARY KEY (id)
);

-- optional indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_final_results_class_id ON public.final_results(class_id);
CREATE INDEX IF NOT EXISTS idx_final_results_pupil_id ON public.final_results(pupil_id);
