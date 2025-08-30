-- Create test_submissions table and indexes
CREATE TABLE IF NOT EXISTS public.test_submissions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    test_id uuid NOT NULL,
    pupil_id uuid NOT NULL,
    answers jsonb NOT NULL,
    score numeric,
    submitted_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT test_submissions_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_test_submissions_test_id ON public.test_submissions USING btree (test_id);
CREATE INDEX IF NOT EXISTS idx_test_submissions_pupil_id ON public.test_submissions USING btree (pupil_id);
CREATE INDEX IF NOT EXISTS idx_test_submissions_submitted_at ON public.test_submissions USING btree (submitted_at);
