-- migration: create payment_disputes table

CREATE TABLE IF NOT EXISTS public.payment_disputes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL,
  pupil_id uuid NULL,
  uin varchar(20) NULL,
  reason text NOT NULL,
  details text NULL,
  status text NOT NULL DEFAULT 'open',
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  constraint payment_disputes_pkey PRIMARY KEY (id),
  constraint payment_disputes_payment_fkey FOREIGN KEY (payment_id) REFERENCES public.payments (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_payment_disputes_payment_id ON public.payment_disputes USING btree (payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_disputes_pupil_id ON public.payment_disputes USING btree (pupil_id);
