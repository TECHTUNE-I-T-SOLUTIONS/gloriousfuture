import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseCookie } from "cookie";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

type Pupil = { id: string; class: string; uin: string }
type ClassRow = { id: string; name: string }
type Exam = { id: string; exam_title: string; subject: string; questions: unknown; created_at?: string; duration?: number; class_id?: string }
type Attempt = { exam_id: string; score?: number; submitted_at?: string; pupil_id?: string }

export async function GET(req: NextRequest) {
  // Read session cookie to identify pupil
  let sessionCookie = req.cookies.get("session")?.value;
  if (!sessionCookie) {
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const cookies = parseCookie(cookieHeader);
      sessionCookie = cookies.session;
    }
  }
  if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let sessionData: unknown;
  try {
    sessionData = JSON.parse(sessionCookie);
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  const sessionUin = (sessionData as { uin?: string }).uin;
  if (!sessionUin) return NextResponse.json({ error: "Session missing UIN" }, { status: 400 });

  // Fetch pupil record to get class (text) and pupil id
  const { data: pupil, error: pupilErr } = await supabase.from("pupils").select("id, class, uin").eq("uin", sessionUin).single();
  if (pupilErr || !pupil) return NextResponse.json({ error: "Pupil not found" }, { status: 404 });

  const pupilClassName = (pupil as Pupil).class;

  // Find the class id from classes table using the class name
  const { data: classRow, error: classErr } = await supabase.from("classes").select("id, name").eq("name", pupilClassName).maybeSingle();
  if (classErr) return NextResponse.json({ error: classErr.message }, { status: 500 });

  if (!classRow || !classRow.id) {
    // No matching class => no exams for this pupil
    return NextResponse.json([], { status: 200 });
  }

  // Fetch exams for the class
  const { data: exams, error: examsErr } = await supabase.from("cbt_exams").select("*").eq("class_id", classRow.id).order("created_at", { ascending: false });
  if (examsErr) return NextResponse.json({ error: examsErr.message }, { status: 500 });

  const examIds = (exams || []).map((e: Exam) => e.id).filter(Boolean);

  // Fetch attempts for this pupil on these exams (if the attempts table exists)
  let attemptsMap: Record<string, Attempt> = {};
  if (examIds.length > 0) {
    const { data: attempts } = await supabase
      .from("cbt_exam_attempts")
      .select("exam_id, score, submitted_at")
      .in("exam_id", examIds)
      .eq("pupil_id", pupil.id);
    if (attempts && Array.isArray(attempts)) {
      attemptsMap = attempts.reduce((acc: Record<string, Attempt>, a: Attempt) => ({ ...acc, [String(a.exam_id)]: a }), {} as Record<string, Attempt>);
    }
  }

  // Map exams to include taken flag and attempt info
  const mapped = (exams || []).map((ex: Exam) => ({
    ...ex,
    class_name: (classRow as ClassRow).name,
    taken: !!attemptsMap[ex.id],
    attempt: attemptsMap[ex.id] ?? null,
  }));

  return NextResponse.json(mapped ?? [], { status: 200 });
}
