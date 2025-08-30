-- Ensure helper extensions (pgcrypto for gen_random_uuid, optionally pg_cron)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- If you have / want pg_cron available you can enable it; if not, ignore the pg_cron lines
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 1) Alerts: add all_classes column
ALTER TABLE public.alerts
ADD COLUMN IF NOT EXISTS all_classes boolean NOT NULL DEFAULT false;

-- 2) Create join table for alert -> class mapping
CREATE TABLE IF NOT EXISTS public.alert_classes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL,
  class_id uuid NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT alert_classes_pkey PRIMARY KEY (id)
);

-- Foreign keys (separate to avoid issues when objects created in different orders)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'alert_classes_alert_id_fkey'
  ) THEN
    ALTER TABLE public.alert_classes
      ADD CONSTRAINT alert_classes_alert_id_fkey FOREIGN KEY (alert_id) REFERENCES public.alerts (id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'alert_classes_class_id_fkey'
  ) THEN
    ALTER TABLE public.alert_classes
      ADD CONSTRAINT alert_classes_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes (id) ON DELETE CASCADE;
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_alert_classes_alert_id ON public.alert_classes (alert_id);
CREATE INDEX IF NOT EXISTS idx_alert_classes_class_id ON public.alert_classes (class_id);

-- 3) View: active alerts expanded with teacher name and class list
CREATE OR REPLACE VIEW public.v_active_alerts AS
SELECT
  a.id,
  a.teacher_id,
  t.full_name AS teacher_name,
  a.message,
  a.start_time,
  a.end_time,
  a.all_classes,
  COALESCE(
    json_agg(json_build_object('id', c.id, 'name', c.name)) FILTER (WHERE c.id IS NOT NULL),
    '[]'::json
  ) AS classes
FROM public.alerts a
LEFT JOIN public.teachers t ON t.id = a.teacher_id
LEFT JOIN public.alert_classes ac ON ac.alert_id = a.id
LEFT JOIN public.classes c ON c.id = ac.class_id
WHERE a.end_time >= now()
GROUP BY a.id, t.full_name;

-- 4) Cleanup helper: delete expired alerts (call manually or schedule)
CREATE OR REPLACE FUNCTION public.cleanup_expired_alerts()
RETURNS void LANGUAGE sql AS $$
  DELETE FROM public.alerts WHERE end_time < now();
$$;

-- Optional: schedule cleanup via pg_cron (if pg_cron is available in your DB)
-- This will run every hour; adjust cron expression as needed.
-- NOTE: uncomment and run only if pg_cron is installed and you want DB-level schedule.
-- SELECT cron.schedule('cleanup_expired_alerts', '0 * * * *', $$SELECT public.cleanup_expired_alerts();$$);

-- 5) Blogs: add counters and reactions tables for likes/comments
-- Add counters to blogs if not present
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS likes_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comments_count integer NOT NULL DEFAULT 0;

-- blog_likes table: prevents duplicate likes per user
CREATE TABLE IF NOT EXISTS public.blog_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  blog_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT blog_likes_pkey PRIMARY KEY (id)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'blog_likes_blog_id_user_id_key'
  ) THEN
    ALTER TABLE public.blog_likes
      ADD CONSTRAINT blog_likes_blog_id_user_id_key UNIQUE (blog_id, user_id);
  END IF;
END$$;

ALTER TABLE public.blog_likes
  ADD CONSTRAINT blog_likes_blog_fk FOREIGN KEY (blog_id) REFERENCES public.blogs (id) ON DELETE CASCADE;

-- associate user_id with users table if you have users table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='users' AND table_schema='public') THEN
    BEGIN
      ALTER TABLE public.blog_likes
        ADD CONSTRAINT blog_likes_user_fk FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;
    EXCEPTION WHEN undefined_object THEN
      -- ignore if users table doesn't exist or FK can't be created now
      NULL;
    END;
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON public.blog_likes (blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON public.blog_likes (user_id);

-- blog_comments table
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  blog_id uuid NOT NULL,
  user_id uuid NULL,
  author_name text NOT NULL,
  content text NOT NULL,
  parent_id uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT blog_comments_pkey PRIMARY KEY (id)
);

ALTER TABLE public.blog_comments
  ADD CONSTRAINT blog_comments_blog_fk FOREIGN KEY (blog_id) REFERENCES public.blogs (id) ON DELETE CASCADE;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='users' AND table_schema='public') THEN
    BEGIN
      ALTER TABLE public.blog_comments
        ADD CONSTRAINT blog_comments_user_fk FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE SET NULL;
    EXCEPTION WHEN undefined_object THEN
      NULL;
    END;
  END IF;
END$$;

-- parent comment FK (self-reference)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'blog_comments_parent_fk'
  ) THEN
    ALTER TABLE public.blog_comments
      ADD CONSTRAINT blog_comments_parent_fk FOREIGN KEY (parent_id) REFERENCES public.blog_comments (id) ON DELETE CASCADE;
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON public.blog_comments (blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON public.blog_comments (user_id);

-- 6) Triggers to maintain likes_count and comments_count on blogs

-- likes counter function
CREATE OR REPLACE FUNCTION public.blogs_increment_likes()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.blogs SET likes_count = COALESCE(likes_count,0) + 1 WHERE id = NEW.blog_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.blogs SET likes_count = GREATEST(COALESCE(likes_count,0) - 1, 0) WHERE id = OLD.blog_id;
    RETURN OLD;
  END IF;
END;
$$;

-- comments counter function
CREATE OR REPLACE FUNCTION public.blogs_increment_comments()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.blogs SET comments_count = COALESCE(comments_count,0) + 1 WHERE id = NEW.blog_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.blogs SET comments_count = GREATEST(COALESCE(comments_count,0) - 1, 0) WHERE id = OLD.blog_id;
    RETURN OLD;
  END IF;
END;
$$;

-- attach triggers (safe to recreate)
DROP TRIGGER IF EXISTS trg_blog_likes_after_insert ON public.blog_likes;
DROP TRIGGER IF EXISTS trg_blog_likes_after_delete ON public.blog_likes;
CREATE TRIGGER trg_blog_likes_after_insert
AFTER INSERT ON public.blog_likes
FOR EACH ROW EXECUTE FUNCTION public.blogs_increment_likes();

CREATE TRIGGER trg_blog_likes_after_delete
AFTER DELETE ON public.blog_likes
FOR EACH ROW EXECUTE FUNCTION public.blogs_increment_likes();

DROP TRIGGER IF EXISTS trg_blog_comments_after_insert ON public.blog_comments;
DROP TRIGGER IF EXISTS trg_blog_comments_after_delete ON public.blog_comments;
CREATE TRIGGER trg_blog_comments_after_insert
AFTER INSERT ON public.blog_comments
FOR EACH ROW EXECUTE FUNCTION public.blogs_increment_comments();

CREATE TRIGGER trg_blog_comments_after_delete
AFTER DELETE ON public.blog_comments
FOR EACH ROW EXECUTE FUNCTION public.blogs_increment_comments();

-- 7) Convenience view combining blog + counts + recent comments (fixed version)
CREATE OR REPLACE VIEW public.v_blogs_summary AS
SELECT
  b.id,
  b.title,
  b.content,
  b.author_id,
  b.created_at,
  COALESCE(b.likes_count,0) AS likes_count,
  COALESCE(b.comments_count,0) AS comments_count
FROM public.blogs b;

-- Final note: if you want to enforce that alerts for 'all_classes' don't have entries in alert_classes,
-- you can create a trigger to clean up conflicting rows; left as optional.
