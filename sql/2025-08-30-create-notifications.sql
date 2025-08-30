-- Notifications table and triggers for Glorious Future Academy
-- Run in Supabase SQL Editor

-- 1) Create notifications table
create table if not exists public.notifications (
  id uuid not null default gen_random_uuid(),
  recipient_role text null, -- 'teacher' | 'pupil' | null for broadcast
  recipient_id uuid null,  -- teacher id or pupil id when specific
  class_id uuid null,      -- class scope when relevant
  type text not null,      -- 'alert' | 'assignment' | 'exam_result' | 'message' | 'payment' | 'blog_comment' | etc
  payload jsonb null,      -- details about the notification (links, ids, message text)
  is_read boolean not null default false,
  created_at timestamp without time zone not null default now(),
  constraint notifications_pkey primary key (id)
) tablespace pg_default;

create index if not exists idx_notifications_recipient on public.notifications using btree (recipient_role, recipient_id);
create index if not exists idx_notifications_class_id on public.notifications using btree (class_id);
create index if not exists idx_notifications_is_read on public.notifications using btree (is_read);

-- 2) Function helpers to insert notifications
create or replace function public.notify_insert(
  _type text,
  _payload jsonb,
  _recipient_role text,
  _recipient_id uuid,
  _class_id uuid
) returns void language plpgsql as $$
begin
  insert into public.notifications(type, payload, recipient_role, recipient_id, class_id)
  values (_type, _payload, _recipient_role, _recipient_id, _class_id);
end;
$$;

-- 3) Trigger examples: alerts -> notifications
-- When an alert is created that targets all_classes=true, create notifications for all teachers and/or pupils (use recipient_role=null for broadcast or null with class_id for class-specific)
create or replace function public.trg_alerts_after_insert() returns trigger language plpgsql as $$
begin
  if (new.all_classes) then
    -- broadcast to pupils (recipient_role = 'pupil', recipient_id = null, class_id = null)
    perform public.notify_insert('alert', jsonb_build_object('message', new.message, 'alert_id', new.id), 'pupil', null, null);
    -- broadcast to teachers as well
    perform public.notify_insert('alert', jsonb_build_object('message', new.message, 'alert_id', new.id), 'teacher', null, null);
  else
    -- create entry per class in alert_classes so pupils/teachers of that class can see
    insert into public.notifications(type, payload, recipient_role, recipient_id, class_id)
    select 'alert', jsonb_build_object('message', a.message, 'alert_id', a.id), 'pupil', null, ac.class_id
    from alert_classes ac
    join alerts a on a.id = ac.alert_id
    where ac.alert_id = new.id;
  end if;
  return null;
end;
$$;

create trigger trg_alerts_after_insert
after insert on public.alerts
for each row
execute function public.trg_alerts_after_insert();

-- 4) Trigger: assignments -> notify class pupils and the teacher
create or replace function public.trg_assignments_after_insert() returns trigger language plpgsql as $$
begin
  -- notify pupils in class
  perform public.notify_insert('assignment', jsonb_build_object('title', new.title, 'assignment_id', new.id), 'pupil', null, new.class_id);
  -- notify the teacher who created it (recipient_role='teacher', recipient_id = teacher_id)
  if new.teacher_id is not null then
    perform public.notify_insert('assignment', jsonb_build_object('title', new.title, 'assignment_id', new.id), 'teacher', new.teacher_id, new.class_id);
  end if;
  return null;
end;
$$;

create trigger trg_assignments_after_insert
after insert on public.assignments
for each row
execute function public.trg_assignments_after_insert();

-- 5) Trigger: exam_results -> notify pupil and teacher
create or replace function public.trg_exam_results_after_insert() returns trigger language plpgsql as $$
begin
  if new.pupil_id is not null then
    perform public.notify_insert('exam_result', jsonb_build_object('score', new.score, 'subject', new.subject, 'exam_result_id', new.id), 'pupil', new.pupil_id, null);
  end if;
  if new.teacher_id is not null then
    perform public.notify_insert('exam_result', jsonb_build_object('score', new.score, 'subject', new.subject, 'exam_result_id', new.id), 'teacher', new.teacher_id, null);
  end if;
  return null;
end;
$$;

create trigger trg_exam_results_after_insert
after insert on public.exam_results
for each row
execute function public.trg_exam_results_after_insert();

-- 6) Trigger: messages -> notify recipient
create or replace function public.trg_messages_after_insert() returns trigger language plpgsql as $$
begin
  if new.teacher_id is not null then
    perform public.notify_insert('message', jsonb_build_object('message', new.message, 'message_id', new.id), 'teacher', new.teacher_id, null);
  end if;
  if new.pupil_id is not null then
    perform public.notify_insert('message', jsonb_build_object('message', new.message, 'message_id', new.id), 'pupil', new.pupil_id, null);
  end if;
  return null;
end;
$$;

create trigger trg_messages_after_insert
after insert on public.messages
for each row
execute function public.trg_messages_after_insert();

-- 7) Trigger: blog_comments -> notify blog author (teacher or pupil)
create or replace function public.trg_blog_comments_after_insert() returns trigger language plpgsql as $$
declare
  v_author_role text;
  v_author_uin text;
  v_author_id uuid;
begin
  select author_role, author_id into v_author_role, v_author_id from blogs where id = new.blog_id;
  if v_author_id is not null then
    if v_author_role = 'teacher' then
      perform public.notify_insert('blog_comment', jsonb_build_object('blog_id', new.blog_id, 'comment_id', new.id, 'author_name', new.author_name), 'teacher', v_author_id, null);
    else
      perform public.notify_insert('blog_comment', jsonb_build_object('blog_id', new.blog_id, 'comment_id', new.id, 'author_name', new.author_name), 'pupil', v_author_id, null);
    end if;
  end if;
  return null;
end;
$$;

create trigger trg_blog_comments_after_insert
after insert on public.blog_comments
for each row
execute function public.trg_blog_comments_after_insert();

-- 8) Example seed: two initial notifications
insert into public.notifications(type, payload, recipient_role, recipient_id, class_id, is_read)
values
('alert', jsonb_build_object('message','Welcome teachers: system notifications are enabled','note','Teacher broadcast'), 'teacher', null, null, false),
('alert', jsonb_build_object('message','Welcome pupils: check your dashboard for messages','note','Pupil broadcast'), 'pupil', null, null, false);

-- End of script
