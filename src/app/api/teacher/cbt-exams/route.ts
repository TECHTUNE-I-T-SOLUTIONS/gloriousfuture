import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// POST: Create CBT Exam
export async function POST(req: Request) {
  try {
  const body = await req.json();
  const exam_title = body.exam_title ?? body.examTitle;
  const subject = body.subject;
  const class_id = body.class_id ?? body.classId;
  const school_session_id = body.school_session_id ?? body.session ?? body.schoolSessionId ?? null;
  const teacher_id = body.teacher_id ?? body.teacherId;
  const questions = body.questions;
  const duration = typeof body.duration !== 'undefined' ? body.duration : undefined;

  const insertRow: Record<string, unknown> = { exam_title, subject, class_id, teacher_id, questions };
  if (school_session_id) insertRow.school_session_id = school_session_id;
  if (typeof duration !== "undefined") insertRow.duration = duration;

  const { data, error } = await supabase.from("cbt_exams").insert([insertRow]);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

// GET: Retrieve CBT Exams
export async function GET() {
  try {
    const { data, error } = await supabase.from("cbt_exams").select("*");

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  const id = body.id ?? body.examId;
  const exam_title = body.exam_title ?? body.examTitle;
  const subject = body.subject;
  const questions = body.questions;
  const duration = typeof body.duration !== 'undefined' ? body.duration : undefined;
  const payload: Record<string, unknown> = { exam_title, subject, questions };
  // allow updating exam's session association - include even if null to clear the association
  const school_session_id = body.school_session_id ?? body.session ?? body.schoolSessionId ?? null;
  payload.school_session_id = school_session_id; // Always include to allow clearing
  if (typeof duration !== "undefined") payload.duration = duration;
  await supabase.from("cbt_exams").update(payload).eq("id", id);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await supabase.from("cbt_exams").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
