import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("session")?.value;
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let session: unknown = null;
  try { session = JSON.parse(sessionCookie) } catch { /* ignore */ }
  const sessionObj = session as { uin?: string; role?: string } | null;

    if (sessionObj?.role === "pupil") {
      // resolve pupil id
      const { data: pupil } = await supabase.from("pupils").select("id").eq("uin", sessionObj!.uin).maybeSingle();
      if (!pupil) return NextResponse.json([], { status: 200 });
      const { data, error } = await supabase.from("exam_results").select("subject, score, teacher_id, pupil_id").eq("pupil_id", pupil.id);
      if (error) return NextResponse.json({ error }, { status: 500 });
      return NextResponse.json(data ?? [], { status: 200 });
    }

    if (sessionObj?.role === "teacher") {
      const { data: teacher } = await supabase.from("teachers").select("id").eq("uin", sessionObj!.uin).maybeSingle();
      if (!teacher) return NextResponse.json([], { status: 200 });
      const { data, error } = await supabase.from("exam_results").select("subject, score, pupil_id").eq("teacher_id", teacher.id);
      if (error) return NextResponse.json({ error }, { status: 500 });
      return NextResponse.json(data ?? [], { status: 200 });
    }

    // default: return empty for anonymous or unknown roles
    return NextResponse.json([], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
