-- Migration: create triggers to notify teachers and pupils when payment_disputes are inserted or updated
-- Assumptions: notifications table exists (see provided schema). This trigger will populate recipient_role, recipient_id (when known), type, payload, is_read, created_at. class_id will be left NULL if not available.

-- Function to run on insert of a dispute
CREATE OR REPLACE FUNCTION notify_on_dispute_insert() RETURNS trigger AS $$
DECLARE
  pay_row jsonb;
  pupil_row jsonb;
  payload jsonb;
BEGIN
  -- gather payment and pupil context where possible
  SELECT to_jsonb(p) INTO pay_row FROM payments p WHERE p.id = NEW.payment_id LIMIT 1;
  IF NEW.pupil_id IS NOT NULL THEN
    SELECT to_jsonb(u) INTO pupil_row FROM pupils u WHERE u.id = NEW.pupil_id LIMIT 1;
  ELSE
    pupil_row := NULL;
  END IF;

  payload := jsonb_build_object(
    'event', 'dispute_created',
    'dispute', to_jsonb(NEW),
    'payment', pay_row,
    'pupil', pupil_row
  );

  -- notify teachers (broadcast for teachers role)
  INSERT INTO notifications (recipient_role, recipient_id, class_id, type, payload, is_read, created_at)
  VALUES ('teacher', NULL, NULL, 'payment_dispute', payload, false, now());

  -- notify affected pupil (if known)
  IF NEW.pupil_id IS NOT NULL THEN
    INSERT INTO notifications (recipient_role, recipient_id, class_id, type, payload, is_read, created_at)
    VALUES ('pupil', NEW.pupil_id, NULL, 'payment_dispute', payload, false, now());
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to run on update (status change or details change)
CREATE OR REPLACE FUNCTION notify_on_dispute_update() RETURNS trigger AS $$
DECLARE
  pay_row jsonb;
  pupil_row jsonb;
  payload jsonb;
  changed boolean := false;
BEGIN
  -- only notify when status changed or details changed
  IF (NEW.status IS DISTINCT FROM OLD.status) OR (NEW.details IS DISTINCT FROM OLD.details) THEN
    changed := true;
  END IF;
  IF NOT changed THEN
    RETURN NEW;
  END IF;

  SELECT to_jsonb(p) INTO pay_row FROM payments p WHERE p.id = NEW.payment_id LIMIT 1;
  IF NEW.pupil_id IS NOT NULL THEN
    SELECT to_jsonb(u) INTO pupil_row FROM pupils u WHERE u.id = NEW.pupil_id LIMIT 1;
  ELSE
    pupil_row := NULL;
  END IF;

  payload := jsonb_build_object(
    'event', 'dispute_updated',
    'changed_fields', jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)),
    'dispute', to_jsonb(NEW),
    'payment', pay_row,
    'pupil', pupil_row
  );

  -- notify teachers
  INSERT INTO notifications (recipient_role, recipient_id, class_id, type, payload, is_read, created_at)
  VALUES ('teacher', NULL, NULL, 'payment_dispute_update', payload, false, now());

  -- notify pupil
  IF NEW.pupil_id IS NOT NULL THEN
    INSERT INTO notifications (recipient_role, recipient_id, class_id, type, payload, is_read, created_at)
    VALUES ('pupil', NEW.pupil_id, NULL, 'payment_dispute_update', payload, false, now());
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trg_notify_dispute_insert ON payment_disputes;
CREATE TRIGGER trg_notify_dispute_insert
AFTER INSERT ON payment_disputes
FOR EACH ROW EXECUTE FUNCTION notify_on_dispute_insert();

DROP TRIGGER IF EXISTS trg_notify_dispute_update ON payment_disputes;
CREATE TRIGGER trg_notify_dispute_update
AFTER UPDATE ON payment_disputes
FOR EACH ROW EXECUTE FUNCTION notify_on_dispute_update();
