-- Add video and step-by-step tutorial support to programming_lessons
ALTER TABLE programming_lessons ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE programming_lessons ADD COLUMN IF NOT EXISTS video_size_mb NUMERIC(5,2);
ALTER TABLE programming_lessons ADD COLUMN IF NOT EXISTS video_duration_seconds INTEGER;
ALTER TABLE programming_lessons ADD COLUMN IF NOT EXISTS tutorial_steps JSONB; -- Array of step objects with title, description, code_snippet
ALTER TABLE programming_lessons ADD COLUMN IF NOT EXISTS starter_code TEXT; -- Pre-filled code for practice
ALTER TABLE programming_lessons ADD COLUMN IF NOT EXISTS expected_output TEXT; -- Expected output for code practice
ALTER TABLE programming_lessons ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'javascript'; -- Programming language

-- Create programming_practice_submissions table for tracking student code practice
CREATE TABLE IF NOT EXISTS programming_practice_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES programming_lessons(id) ON DELETE CASCADE,
  pupil_id UUID NOT NULL,
  code TEXT NOT NULL,
  output TEXT,
  error TEXT,
  is_correct BOOLEAN DEFAULT FALSE,
  execution_time_ms INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create programming_lesson_attachments for code samples, resources
CREATE TABLE IF NOT EXISTS programming_lesson_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES programming_lessons(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size_bytes INTEGER,
  file_type VARCHAR(50), -- 'code', 'resource', 'template'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_practice_submissions_lesson ON programming_practice_submissions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_practice_submissions_pupil ON programming_practice_submissions(pupil_id);
CREATE INDEX IF NOT EXISTS idx_lesson_attachments_lesson ON programming_lesson_attachments(lesson_id);
