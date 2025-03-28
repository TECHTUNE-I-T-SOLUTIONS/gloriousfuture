import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// POST: Create CBT Exam
export async function POST(req: Request) {
  try {
    const { examTitle, subject, classId, teacherId, questions } = await req.json();

    const { data, error } = await supabase
      .from("cbt_exams")
      .insert([{ exam_title: examTitle, subject, class_id: classId, teacher_id: teacherId, questions }]);

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
  const { id, exam_title, subject, questions } = await req.json();
  await supabase.from("cbt_exams").update({ exam_title, subject, questions }).eq("id", id);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await supabase.from("cbt_exams").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
