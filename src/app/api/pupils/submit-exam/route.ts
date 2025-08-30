import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { examId, answers } = await req.json();

    const sessionCookie = req.cookies.get("session")?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    let sessionData: unknown = null;
    try {
      sessionData = JSON.parse(sessionCookie)
    } catch {
      /* ignore */
    }
    const sessionObj = sessionData as { uin?: string; role?: string } | null;
    if (!sessionObj?.uin || sessionObj.role !== "pupil") {
      return NextResponse.json({ success: false, error: "Must be authenticated pupil" }, { status: 401 });
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // Resolve pupil id from UIN
  const { data: pupil, error: pupilErr } = await supabase.from("pupils").select("id").eq("uin", sessionObj!.uin).maybeSingle();
    if (pupilErr || !pupil) return NextResponse.json({ success: false, error: "Pupil not found" }, { status: 400 });

    // Fetch exam with questions and teacher_id & subject
    const { data: exam, error: examErr } = await supabase.from("cbt_exams").select("questions, teacher_id, subject").eq("id", examId).maybeSingle();
    if (examErr || !exam) return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });

    // Normalize and score
    const questions: unknown[] = (exam.questions || []) as unknown[];
    let correctCount = 0;
    questions.forEach((q: unknown, index: number) => {
      const qobj = q as { correctAnswer?: string }
      // support both options-array and options-object shapes
      const correct = qobj.correctAnswer
      const given = answers?.[index]
      if (typeof correct !== "undefined" && given === correct) correctCount++
    });

    const total = Math.max(questions.length, 1);
    const percent = Math.round((correctCount / total) * 100);

    // Insert into exam_results (schema expects teacher_id, pupil_id, subject, score)
    const payload = {
      teacher_id: exam.teacher_id || null,
  pupil_id: pupil.id,
  subject: exam.subject || "",
  score: percent,
  cbt_exam_id: examId,
    };

    const { error: insertErr } = await supabase.from("exam_results").insert([payload]);
    if (insertErr) {
      console.error("Insert exam_results error", insertErr);
      return NextResponse.json({ success: false, error: "Failed to save results" }, { status: 500 });
    }

    // Also record a detailed attempt in cbt_exam_attempts for auditing
    try {
      await supabase.from("cbt_exam_attempts").insert([{ exam_id: examId, pupil_id: pupil.id, teacher_id: exam.teacher_id || null, score: percent, answers: answers }]);
    } catch (e) {
      console.warn("Failed to insert cbt_exam_attempts", e);
      // non-fatal
    }

    return NextResponse.json({ success: true, score: percent }, { status: 200 });
  } catch (err) {
    console.error("Submit exam error", err);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}
