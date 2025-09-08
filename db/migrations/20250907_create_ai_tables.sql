-- Migration: create tables and storage for AI features
-- Create storage bucket for file uploads (public to avoid RLS issues)
INSERT INTO storage.buckets (id, name, "public") VALUES ('ai_uploads', 'ai_uploads', true);

-- Table for AI file uploads
CREATE TABLE ai_file_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL, -- Supabase storage path
  file_type text NOT NULL, -- e.g., 'pdf', 'txt', 'docx'
  extracted_text text NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ai_file_uploads_teacher_fkey FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE CASCADE
);

-- Table for AI generated content
CREATE TABLE ai_generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  file_upload_id uuid NULL,
  content_type text NOT NULL, -- 'exam', 'test', 'assignment', 'quiz'
  title text NOT NULL,
  subject text NOT NULL,
  class_id uuid NULL,
  school_session_id uuid NULL,
  generated_data jsonb NOT NULL, -- JSON structure for questions, description, etc.
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ai_generated_content_teacher_fkey FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE CASCADE,
  CONSTRAINT ai_generated_content_file_upload_fkey FOREIGN KEY (file_upload_id) REFERENCES ai_file_uploads (id) ON DELETE SET NULL,
  CONSTRAINT ai_generated_content_class_fkey FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE SET NULL,
  CONSTRAINT ai_generated_content_school_session_fkey FOREIGN KEY (school_session_id) REFERENCES school_session (id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_ai_file_uploads_teacher_id ON ai_file_uploads (teacher_id);
CREATE INDEX idx_ai_generated_content_teacher_id ON ai_generated_content (teacher_id);
CREATE INDEX idx_ai_generated_content_content_type ON ai_generated_content (content_type);
CREATE INDEX idx_ai_generated_content_class_id ON ai_generated_content (class_id);
