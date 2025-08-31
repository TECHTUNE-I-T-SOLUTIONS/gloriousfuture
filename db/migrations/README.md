Usage:

- Apply the SQL migration file `2025-08-31-create-school-session.sql` to your Postgres database (Supabase) using psql or the Supabase SQL editor.
- The migration creates a `school_session` table used to store the currently active session.

SQL example to run in Supabase SQL editor:

-- create table
CREATE TABLE public.school_session (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session varchar(50) NOT NULL,
  active boolean NOT NULL DEFAULT false,
  created_at timestamptz NULL DEFAULT now(),
  created_by uuid NULL,
  PRIMARY KEY (id)
);

-- mark a session active
INSERT INTO public.school_session (session, active) VALUES ('2025/2026', true);

Notes:
- The API `GET /api/teacher/school-session` returns the latest session.
- The API `PUT /api/teacher/school-session` sets the provided session as active; it requires a teacher session cookie.
