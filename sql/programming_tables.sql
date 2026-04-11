create table public.programming_assessment_submissions (
  id uuid not null default gen_random_uuid (),
  assessment_id uuid not null,
  pupil_id uuid not null,
  lesson_id uuid not null,
  course_id uuid not null,
  answers jsonb not null,
  code_submission text null,
  score numeric null,
  is_passed boolean null,
  feedback jsonb null,
  ai_feedback text null,
  submitted_at timestamp with time zone not null default now(),
  auto_marked_at timestamp with time zone null,
  reviewed_by_teacher uuid null,
  reviewed_at timestamp with time zone null,
  attempts integer not null default 1,
  created_at timestamp with time zone not null default now(),
  constraint programming_assessment_submissions_pkey primary key (id),
  constraint programming_assessment_submissions_assessment_fkey foreign KEY (assessment_id) references programming_assessments (id) on delete CASCADE,
  constraint programming_assessment_submissions_course_fkey foreign KEY (course_id) references programming_courses (id) on delete CASCADE,
  constraint programming_assessment_submissions_lesson_fkey foreign KEY (lesson_id) references programming_lessons (id) on delete CASCADE,
  constraint programming_assessment_submissions_pupil_fkey foreign KEY (pupil_id) references pupils (id) on delete CASCADE,
  constraint programming_assessment_submissions_reviewer_fkey foreign KEY (reviewed_by_teacher) references teachers (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists idx_programming_assessment_submissions_assessment on public.programming_assessment_submissions using btree (assessment_id) TABLESPACE pg_default;

create index IF not exists idx_programming_assessment_submissions_pupil on public.programming_assessment_submissions using btree (pupil_id) TABLESPACE pg_default;

create index IF not exists idx_programming_assessment_submissions_lesson on public.programming_assessment_submissions using btree (lesson_id) TABLESPACE pg_default;

create index IF not exists idx_programming_assessment_submissions_course on public.programming_assessment_submissions using btree (course_id) TABLESPACE pg_default;

create index IF not exists idx_programming_assessment_submissions_pupil_assessment on public.programming_assessment_submissions using btree (pupil_id, assessment_id) TABLESPACE pg_default;

create index IF not exists idx_programming_assessment_submissions_submitted on public.programming_assessment_submissions using btree (submitted_at) TABLESPACE pg_default;


create table public.programming_assessments (
  id uuid not null default gen_random_uuid (),
  lesson_id uuid not null,
  title text not null,
  description text null,
  assessment_type text not null,
  questions jsonb not null,
  passing_score numeric not null default 70,
  max_score numeric not null default 100,
  order_index integer null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint programming_assessments_pkey primary key (id),
  constraint programming_assessments_lesson_fkey foreign KEY (lesson_id) references programming_lessons (id) on delete CASCADE,
  constraint programming_assessments_assessment_type_check check (
    (
      assessment_type = any (
        array[
          'multiple_choice'::text,
          'code_completion'::text,
          'free_coding'::text,
          'true_false'::text,
          'matching'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_programming_assessments_lesson on public.programming_assessments using btree (lesson_id) TABLESPACE pg_default;

create index IF not exists idx_programming_assessments_type on public.programming_assessments using btree (assessment_type) TABLESPACE pg_default;


create table public.programming_courses (
  id uuid not null default gen_random_uuid (),
  teacher_id uuid null,
  title text not null,
  description text null,
  difficulty_level text not null,
  age_group text not null,
  subject_id uuid null,
  class_ids uuid[] null default array[]::uuid[],
  image_url text null,
  is_published boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint programming_courses_pkey primary key (id),
  constraint programming_courses_subject_fkey foreign KEY (subject_id) references subjects (id) on delete set null,
  constraint programming_courses_teacher_fkey foreign KEY (teacher_id) references teachers (id) on delete CASCADE,
  constraint programming_courses_age_group_check check (
    (
      age_group = any (
        array[
          '6-10'::text,
          '11-15'::text,
          '16-18'::text,
          'all'::text
        ]
      )
    )
  ),
  constraint programming_courses_difficulty_level_check check (
    (
      difficulty_level = any (
        array[
          'beginner'::text,
          'intermediate'::text,
          'advanced'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_programming_courses_teacher on public.programming_courses using btree (teacher_id) TABLESPACE pg_default;

create index IF not exists idx_programming_courses_published on public.programming_courses using btree (is_published) TABLESPACE pg_default;

create index IF not exists idx_programming_courses_difficulty on public.programming_courses using btree (difficulty_level) TABLESPACE pg_default;

create index IF not exists idx_programming_courses_age_group on public.programming_courses using btree (age_group) TABLESPACE pg_default;


create table public.programming_lesson_attachments (
  id uuid not null default gen_random_uuid (),
  lesson_id uuid not null,
  filename character varying(255) not null,
  file_url text not null,
  file_size_bytes integer null,
  file_type character varying(50) null,
  created_at timestamp with time zone null default now(),
  constraint programming_lesson_attachments_pkey primary key (id),
  constraint programming_lesson_attachments_lesson_id_fkey foreign KEY (lesson_id) references programming_lessons (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_lesson_attachments_lesson on public.programming_lesson_attachments using btree (lesson_id) TABLESPACE pg_default;



create table public.programming_lesson_completion (
  id uuid not null default gen_random_uuid (),
  pupil_id uuid not null,
  lesson_id uuid not null,
  course_id uuid not null,
  completed_at timestamp with time zone not null default now(),
  time_spent_seconds integer null,
  constraint programming_lesson_completion_pkey primary key (id),
  constraint programming_lesson_completion_course_fkey foreign KEY (course_id) references programming_courses (id) on delete CASCADE,
  constraint programming_lesson_completion_lesson_fkey foreign KEY (lesson_id) references programming_lessons (id) on delete CASCADE,
  constraint programming_lesson_completion_pupil_fkey foreign KEY (pupil_id) references pupils (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_programming_lesson_completion_pupil on public.programming_lesson_completion using btree (pupil_id) TABLESPACE pg_default;

create index IF not exists idx_programming_lesson_completion_lesson on public.programming_lesson_completion using btree (lesson_id) TABLESPACE pg_default;

create index IF not exists idx_programming_lesson_completion_pupil_lesson on public.programming_lesson_completion using btree (pupil_id, lesson_id) TABLESPACE pg_default;

create index IF not exists idx_programming_lesson_completion_course on public.programming_lesson_completion using btree (course_id) TABLESPACE pg_default;


create table public.programming_lessons (
  id uuid not null default gen_random_uuid (),
  module_id uuid not null,
  title text not null,
  content text not null,
  content_rich_html text null,
  code_example text null,
  code_language text null default 'javascript'::text,
  order_index integer not null,
  learning_objectives text[] null default array[]::text[],
  estimated_duration_minutes integer null,
  has_assessment boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  video_url text null,
  video_size_mb numeric(5, 2) null,
  video_duration_seconds integer null,
  tutorial_steps jsonb null,
  starter_code text null,
  expected_output text null,
  language character varying(50) null default 'javascript'::character varying,
  constraint programming_lessons_pkey primary key (id),
  constraint programming_lessons_module_fkey foreign KEY (module_id) references programming_modules (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_programming_lessons_module on public.programming_lessons using btree (module_id) TABLESPACE pg_default;

create index IF not exists idx_programming_lessons_order on public.programming_lessons using btree (module_id, order_index) TABLESPACE pg_default;

create index IF not exists idx_programming_lessons_has_assessment on public.programming_lessons using btree (has_assessment) TABLESPACE pg_default;



create table public.programming_modules (
  id uuid not null default gen_random_uuid (),
  course_id uuid not null,
  title text not null,
  description text null,
  order_index integer not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint programming_modules_pkey primary key (id),
  constraint programming_modules_course_fkey foreign KEY (course_id) references programming_courses (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_programming_modules_course on public.programming_modules using btree (course_id) TABLESPACE pg_default;

create index IF not exists idx_programming_modules_order on public.programming_modules using btree (course_id, order_index) TABLESPACE pg_default;



create table public.programming_practice_submissions (
  id uuid not null default gen_random_uuid (),
  lesson_id uuid not null,
  pupil_id uuid not null,
  code text not null,
  output text null,
  error text null,
  is_correct boolean null default false,
  execution_time_ms integer null,
  submitted_at timestamp with time zone null default now(),
  created_at timestamp with time zone null default now(),
  constraint programming_practice_submissions_pkey primary key (id),
  constraint programming_practice_submissions_lesson_id_fkey foreign KEY (lesson_id) references programming_lessons (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_practice_submissions_lesson on public.programming_practice_submissions using btree (lesson_id) TABLESPACE pg_default;

create index IF not exists idx_practice_submissions_pupil on public.programming_practice_submissions using btree (pupil_id) TABLESPACE pg_default;



create table public.programming_pupil_progress (
  id uuid not null default gen_random_uuid (),
  pupil_id uuid not null,
  course_id uuid not null,
  current_module_id uuid null,
  current_lesson_id uuid null,
  total_lessons_completed integer not null default 0,
  total_assessments_passed integer not null default 0,
  course_completion_percentage numeric not null default 0,
  started_at timestamp with time zone not null default now(),
  last_accessed_at timestamp with time zone not null default now(),
  completed_at timestamp with time zone null,
  constraint programming_pupil_progress_pkey primary key (id),
  constraint programming_pupil_progress_course_fkey foreign KEY (course_id) references programming_courses (id) on delete CASCADE,
  constraint programming_pupil_progress_lesson_fkey foreign KEY (current_lesson_id) references programming_lessons (id) on delete set null,
  constraint programming_pupil_progress_module_fkey foreign KEY (current_module_id) references programming_modules (id) on delete set null,
  constraint programming_pupil_progress_pupil_fkey foreign KEY (pupil_id) references pupils (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_programming_pupil_progress_pupil on public.programming_pupil_progress using btree (pupil_id) TABLESPACE pg_default;

create index IF not exists idx_programming_pupil_progress_course on public.programming_pupil_progress using btree (course_id) TABLESPACE pg_default;

create index IF not exists idx_programming_pupil_progress_pupil_course on public.programming_pupil_progress using btree (pupil_id, course_id) TABLESPACE pg_default;




