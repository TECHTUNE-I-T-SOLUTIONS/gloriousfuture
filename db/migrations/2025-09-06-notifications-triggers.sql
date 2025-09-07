-- Migration: add trigger functions to insert notifications for tests, assignments, and submission score updates

-- Create or replace functions (idempotent)
CREATE OR REPLACE FUNCTION notify_on_new_test() RETURNS trigger LANGUAGE plpgsql AS $func$
DECLARE
  class_uuid uuid;
  payload jsonb;
BEGIN
  -- notify pupils in the class and the class teacher (class-scoped notification)
  class_uuid := NEW.class_id;
  payload := jsonb_build_object('test_id', NEW.id, 'title', NEW.title, 'due_date', NEW.due_date);
  INSERT INTO notifications (recipient_role, recipient_id, class_id, type, payload)
    VALUES ('class', NULL, class_uuid, 'new_test', payload);
  RETURN NEW;
END;
$func$;

CREATE OR REPLACE FUNCTION notify_on_new_assignment() RETURNS trigger LANGUAGE plpgsql AS $func$
DECLARE
  class_uuid uuid;
  payload jsonb;
BEGIN
  class_uuid := NEW.class_id;
  payload := jsonb_build_object('assignment_id', NEW.id, 'title', NEW.title, 'due_date', NEW.due_date);
  INSERT INTO notifications (recipient_role, recipient_id, class_id, type, payload)
    VALUES ('class', NULL, class_uuid, 'new_assignment', payload);
  RETURN NEW;
END;
$func$;

CREATE OR REPLACE FUNCTION notify_on_submission_insert() RETURNS trigger LANGUAGE plpgsql AS $func$
DECLARE
  payload jsonb;
  v_class uuid;
BEGIN
  payload := jsonb_build_object('submission_id', NEW.id, 'assignment_id', NEW.assignment_id, 'pupil_id', NEW.pupil_id);
  SELECT class_id INTO v_class FROM assignments WHERE id = NEW.assignment_id;
  -- notify the teacher(s) for the class - class-scoped
  INSERT INTO notifications (recipient_role, recipient_id, class_id, type, payload)
    VALUES ('teacher', NULL, v_class, 'new_submission', payload);
  RETURN NEW;
END;
$func$;

CREATE OR REPLACE FUNCTION notify_on_test_submission_score_update() RETURNS trigger LANGUAGE plpgsql AS $func$
DECLARE
  payload jsonb;
  t_rec RECORD;
BEGIN
  -- fetch test info
  SELECT id, class_id, teacher_id INTO t_rec FROM tests_quizzes WHERE id = NEW.test_id;
  payload := jsonb_build_object('submission_id', NEW.id, 'test_id', NEW.test_id, 'pupil_id', NEW.pupil_id, 'score', NEW.score);
  -- notify the pupil directly
  INSERT INTO notifications (recipient_role, recipient_id, class_id, type, payload)
    VALUES ('pupil', NEW.pupil_id, t_rec.class_id, 'score_updated', payload);
  -- also notify the teacher(s) for context
  INSERT INTO notifications (recipient_role, recipient_id, class_id, type, payload)
    VALUES ('teacher', t_rec.teacher_id, t_rec.class_id, 'score_updated', payload);
  RETURN NEW;
END;
$func$;

-- Attach triggers (use DROP IF EXISTS then CREATE to make idempotent)
DROP TRIGGER IF EXISTS trg_tests_quizzes_after_insert ON tests_quizzes;
CREATE TRIGGER trg_tests_quizzes_after_insert AFTER INSERT ON tests_quizzes FOR EACH ROW EXECUTE FUNCTION notify_on_new_test();

DROP TRIGGER IF EXISTS trg_assignments_after_insert ON assignments;
CREATE TRIGGER trg_assignments_after_insert AFTER INSERT ON assignments FOR EACH ROW EXECUTE FUNCTION notify_on_new_assignment();

DROP TRIGGER IF EXISTS trg_submissions_after_insert ON submissions;
CREATE TRIGGER trg_submissions_after_insert AFTER INSERT ON submissions FOR EACH ROW EXECUTE FUNCTION notify_on_submission_insert();

DROP TRIGGER IF EXISTS trg_test_submissions_score_update ON test_submissions;
CREATE TRIGGER trg_test_submissions_score_update AFTER UPDATE OF score ON test_submissions FOR EACH ROW WHEN (OLD.score IS DISTINCT FROM NEW.score) EXECUTE FUNCTION notify_on_test_submission_score_update();
