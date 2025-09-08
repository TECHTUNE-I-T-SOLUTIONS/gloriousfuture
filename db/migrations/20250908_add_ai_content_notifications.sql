-- Function to create notifications when AI generates content
CREATE OR REPLACE FUNCTION notify_ai_content_generated()
RETURNS TRIGGER AS $$
DECLARE
    teacher_name TEXT;
    content_type_text TEXT;
    class_name TEXT;
BEGIN
    -- Get teacher name
    SELECT COALESCE(full_name, uin) INTO teacher_name
    FROM teachers
    WHERE id = NEW.teacher_id;

    -- Get class name
    SELECT name INTO class_name
    FROM classes
    WHERE id = NEW.class_id;

    -- Determine content type text
    IF TG_TABLE_NAME = 'cbt_exams' THEN
        content_type_text := 'CBT Exam';
    ELSIF TG_TABLE_NAME = 'assignments' THEN
        content_type_text := 'Assignment';
    ELSIF TG_TABLE_NAME = 'tests_quizzes' THEN
        content_type_text := 'Test/Quiz';
    ELSE
        content_type_text := 'Content';
    END IF;

    -- Create notification for teacher
    INSERT INTO notifications (
        recipient_role,
        recipient_id,
        class_id,
        type,
        payload,
        created_at
    ) VALUES (
        'teacher',
        NEW.teacher_id,
        NEW.class_id,
        'ai_content_generated',
        jsonb_build_object(
            'content_type', content_type_text,
            'title', COALESCE(NEW.title, NEW.exam_title),
            'subject', COALESCE(NEW.subject, ''),
            'class_name', class_name,
            'teacher_name', teacher_name,
            'table_name', TG_TABLE_NAME,
            'record_id', NEW.id
        ),
        NOW()
    );

    -- Create notifications for pupils in the class
    INSERT INTO notifications (
        recipient_role,
        recipient_id,
        class_id,
        type,
        payload,
        created_at
    )
    SELECT
        'pupil',
        p.id,
        NEW.class_id,
        'new_content_available',
        jsonb_build_object(
            'content_type', content_type_text,
            'title', COALESCE(NEW.title, NEW.exam_title),
            'subject', COALESCE(NEW.subject, ''),
            'class_name', class_name,
            'teacher_name', teacher_name,
            'due_date', CASE
                WHEN TG_TABLE_NAME = 'assignments' THEN NEW.due_date
                WHEN TG_TABLE_NAME = 'tests_quizzes' THEN NEW.due_date
                ELSE NULL
            END
        ),
        NOW()
    FROM pupils p
    WHERE p.class_id = NEW.class_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
DROP TRIGGER IF EXISTS trg_ai_content_cbt_exams ON cbt_exams;
CREATE TRIGGER trg_ai_content_cbt_exams
    AFTER INSERT ON cbt_exams
    FOR EACH ROW
    EXECUTE FUNCTION notify_ai_content_generated();

DROP TRIGGER IF EXISTS trg_ai_content_assignments ON assignments;
CREATE TRIGGER trg_ai_content_assignments
    AFTER INSERT ON assignments
    FOR EACH ROW
    EXECUTE FUNCTION notify_ai_content_generated();

DROP TRIGGER IF EXISTS trg_ai_content_tests_quizzes ON tests_quizzes;
CREATE TRIGGER trg_ai_content_tests_quizzes
    AFTER INSERT ON tests_quizzes
    FOR EACH ROW
    EXECUTE FUNCTION notify_ai_content_generated();
