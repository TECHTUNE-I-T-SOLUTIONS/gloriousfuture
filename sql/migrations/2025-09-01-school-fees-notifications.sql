-- Migration: add per-term columns to school_fees, add terms to payments, and create notification trigger
-- Run this script on your Postgres / Supabase database (SQL editor). This is PostgreSQL (PSQL) syntax.

BEGIN;

-- 1) Add per-term amount columns to school_fees (if table exists)
ALTER TABLE IF EXISTS public.school_fees
  ADD COLUMN IF NOT EXISTS term1_amount numeric(10,2),
  ADD COLUMN IF NOT EXISTS term2_amount numeric(10,2),
  ADD COLUMN IF NOT EXISTS term3_amount numeric(10,2);

-- 2) Add terms jsonb column to payments
ALTER TABLE IF EXISTS public.payments
  ADD COLUMN IF NOT EXISTS terms jsonb;

-- 3) Backfill payments.terms from payments.term where present
UPDATE public.payments
SET terms = to_jsonb(array[term])
WHERE terms IS NULL AND term IS NOT NULL;

-- 4) Optional: create index to speed common queries
CREATE INDEX IF NOT EXISTS payments_session_uin_idx ON public.payments (session, uin);

-- 5) Create function and trigger to insert a notification when a payment becomes 'paid'
--    The trigger will insert a notification row with recipient_role='pupil' and recipient_id set to the payment.pupil_id

CREATE OR REPLACE FUNCTION public.notify_on_payment_paid()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  notif_payload jsonb;
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    IF (NEW.status IS NOT NULL AND LOWER(NEW.status) = 'paid' AND (OLD.status IS NULL OR LOWER(OLD.status) <> 'paid')) THEN
      -- try to resolve pupil full name for nicer notifications
      DECLARE
        v_pupil_name text;
      BEGIN
        v_pupil_name := NULL;
        IF NEW.pupil_id IS NOT NULL THEN
          SELECT full_name INTO v_pupil_name FROM public.pupils WHERE id = NEW.pupil_id LIMIT 1;
        END IF;

        notif_payload := jsonb_build_object(
          'payment_id', NEW.id,
          'amount', NEW.amount,
          'class', NEW.class,
          'session', NEW.session,
          -- prefer the new JSONB `terms` column; fall back to empty array if not present
          'terms', COALESCE(NEW.terms, '[]'::jsonb),
          'reference', NEW.payment_reference,
          'paid_at', to_char(COALESCE(NEW.paid_at, now()), 'YYYY-MM-DD HH24:MI:SS'),
          'pupil_name', COALESCE(v_pupil_name, NULL)
        );

        -- notify the pupil directly
        INSERT INTO public.notifications (recipient_role, recipient_id, class_id, type, payload)
        VALUES ('pupil', NEW.pupil_id, NULL, 'payment:received', notif_payload);

        -- also notify teachers (broadcast for now); include class name and payload so teachers can filter
        PERFORM public.notify_insert('payment:received', notif_payload, 'teacher', NULL, NULL);
      END;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Attach trigger
DROP TRIGGER IF EXISTS trg_notify_on_payment_paid ON public.payments;
CREATE TRIGGER trg_notify_on_payment_paid
AFTER UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_payment_paid();

COMMIT;

-- End of migration
