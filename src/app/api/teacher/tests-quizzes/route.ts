import { NextResponse } from "next/server";
import { parseCookie } from "cookie";
import { getSupabaseClient } from "@/lib/supabase";

// Use the server-side Supabase helper so we can read the session cookie and
// resolve the teacher id automatically instead of trusting the client.
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 });

    const { data, error } = await supabase.from("tests_quizzes").select("*");
    if (error) throw error;
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 });

    // Read session cookie to identify the teacher
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = parseCookie(cookieHeader);
    if (!cookies.session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    let sessCookie: { uin?: string; role?: string } | null = null;
    try {
      sessCookie = JSON.parse(cookies.session);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid session cookie" }, { status: 400 });
    }

    if (!sessCookie || sessCookie.role !== "teacher" || !sessCookie.uin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // Resolve teacher id from teachers table
  const { data: teacherData, error: teacherErr } = await supabase.from("teachers").select("id").eq("uin", sessCookie.uin).maybeSingle();
    if (teacherErr || !teacherData?.id) {
      return NextResponse.json({ success: false, error: "Teacher not found" }, { status: 404 });
    }
    const teacher_id = teacherData.id as string;

  const { title, description, due_date, class_id, questions, school_session_id, session, subject_id } = await req.json();

    // optional: validate class exists when provided
  if (class_id) {
      const { data: classCheck, error: classErr } = await supabase.from("classes").select("id").eq("id", class_id).maybeSingle();
      if (classErr) return NextResponse.json({ success: false, error: String(classErr) }, { status: 400 });
      if (!classCheck) return NextResponse.json({ success: false, error: "Invalid class_id" }, { status: 400 });
    }

  const insertRow: Record<string, unknown> = { title, description: description ?? null, due_date: due_date ?? null, class_id: class_id ?? null, teacher_id, questions: questions ?? [] };
  if (subject_id) insertRow.subject_id = subject_id
  const sess = school_session_id ?? session ?? null;
  if (sess) insertRow["school_session_id"] = sess;
  const { data, error } = await supabase.from("tests_quizzes").insert([insertRow]).single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 });

  const { id, title, description, due_date, class_id, questions, school_session_id, session, subject_id } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });

  const payload: Record<string, unknown> = { title, description: description ?? null, due_date: due_date ?? null, class_id: class_id ?? null, questions: questions ?? [] };
  if (subject_id) payload.subject_id = subject_id
  const sess2 = school_session_id ?? session ?? null;
  if (sess2) payload["school_session_id"] = sess2;

  const { error } = await supabase.from("tests_quizzes").update(payload).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });

    const { error } = await supabase.from("tests_quizzes").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
