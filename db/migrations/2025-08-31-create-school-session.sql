-- SQL migration: create a small school_session table to track the active session
CREATE TABLE IF NOT EXISTS public.school_session (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session character varying(50) NOT NULL,
  active boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
  created_by uuid NULL,
  CONSTRAINT school_session_pkey PRIMARY KEY (id),
  CONSTRAINT school_session_session_key UNIQUE (session)
);

-- optional index for quick lookup
CREATE INDEX IF NOT EXISTS idx_school_session_active ON public.school_session(active);

-- example insert
-- INSERT INTO public.school_session (session, active) VALUES ('2024/2025', true);
