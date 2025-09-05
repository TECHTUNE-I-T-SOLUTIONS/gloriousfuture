-- Trigger function: keep pupils.class (text) in sync from pupils.class_id on insert or update
-- Ensures legacy APIs that depend on pupils.class continue to work while class_id is the canonical key

BEGIN;

CREATE OR REPLACE FUNCTION trg_sync_pupils_class_from_class_id()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  cls_name text;
BEGIN
  -- If new.class_id is set, try resolve to classes.name
  IF NEW.class_id IS NOT NULL THEN
    SELECT name INTO cls_name FROM classes WHERE id = NEW.class_id LIMIT 1;
    IF FOUND THEN
      NEW.class := cls_name;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Attach the trigger to pupils for INSERT and UPDATE
DROP TRIGGER IF EXISTS sync_pupils_class_from_class_id ON pupils;
CREATE TRIGGER sync_pupils_class_from_class_id
BEFORE INSERT OR UPDATE ON pupils
FOR EACH ROW EXECUTE FUNCTION trg_sync_pupils_class_from_class_id();

COMMIT;

-- Note: run this once after adding the class_id column and backfilling. This keeps text column in sync
-- when class_id changes via application code.
