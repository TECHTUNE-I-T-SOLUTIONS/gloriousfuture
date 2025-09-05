-- Update submissions trigger function to notify both teacher and pupil on submission
CREATE OR REPLACE FUNCTION trg_submissions_after_insert_fn() RETURNS trigger AS $$
DECLARE
  assignment_row assignments%ROWTYPE;
  teacher_row teachers%ROWTYPE;
  pupil_row pupils%ROWTYPE;
  payload jsonb;
BEGIN
  SELECT * INTO assignment_row FROM assignments WHERE id = NEW.assignment_id LIMIT 1;
  IF NOT FOUND THEN RETURN NEW; END IF;

  IF assignment_row.teacher_id IS NOT NULL THEN
    SELECT * INTO teacher_row FROM teachers WHERE id = assignment_row.teacher_id LIMIT 1;
  END IF;
  IF NEW.pupil_id IS NOT NULL THEN
    SELECT * INTO pupil_row FROM pupils WHERE id = NEW.pupil_id LIMIT 1;
  END IF;

  payload := jsonb_build_object(
    'submission_id', COALESCE(NEW.id::text, ''),
    'assignment_id', COALESCE(NEW.assignment_id::text, ''),
    'assignment_title', COALESCE(assignment_row.title, ''),
    'pupil', jsonb_build_object(
      'id', COALESCE(pupil_row.id::text, COALESCE(NEW.pupil_id::text, '')),
      'full_name', COALESCE(pupil_row.full_name, ''),
      'uin', COALESCE(pupil_row.uin, '')
    ),
    'text_submission_preview', left(coalesce(NEW.text_submission, ''), 300),
    'file_url', COALESCE(NEW.file_url, ''),
    'submitted_at', to_char(COALESCE(NEW.submitted_at, now()), 'YYYY-MM-DD"T"HH24:MI:SS'),
    'link', COALESCE('/teacher/assignments/' || COALESCE(NEW.assignment_id::text,'') || '/submissions/' || COALESCE(NEW.id::text,''), '')
  );

  -- notify the teacher
  IF teacher_row IS NOT NULL AND teacher_row.id IS NOT NULL THEN
    INSERT INTO notifications (recipient_role, recipient_id, class_id, type, payload, is_read, created_at)
    VALUES ('teacher', teacher_row.id, assignment_row.class_id, 'submission.created', payload, false, now());
  END IF;

  -- also insert a confirmation/record for the pupil who submitted (so they will see it in their notifications)
  IF pupil_row IS NOT NULL AND pupil_row.id IS NOT NULL THEN
    INSERT INTO notifications (recipient_role, recipient_id, class_id, type, payload, is_read, created_at)
    VALUES (
      'pupil',
      pupil_row.id,
      assignment_row.class_id,
      'submission.received',
      jsonb_build_object(
        'submission_id', COALESCE(NEW.id::text, ''),
        'assignment_id', COALESCE(NEW.assignment_id::text, ''),
        'assignment_title', COALESCE(assignment_row.title, ''),
        'text_submission_preview', left(coalesce(NEW.text_submission, ''), 300),
        'file_url', COALESCE(NEW.file_url, ''),
        'submitted_at', to_char(COAALESCE(NEW.submitted_at, now()), 'YYYY-MM-DD"T"HH24:MI:SS'),
        'link', COALESCE('/pupils/assignments/' || COALESCE(NEW.assignment_id::text,''), '')
      ),
      false,
      now()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger binding
DROP TRIGGER IF EXISTS trg_submissions_after_insert ON submissions;
CREATE TRIGGER trg_submissions_after_insert
  AFTER INSERT ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION trg_submissions_after_insert_fn();

-- End
