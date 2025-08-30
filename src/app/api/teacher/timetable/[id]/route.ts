import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getSessionFromReq(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const { parse } = await import("cookie");
  const cookies = parse(cookieHeader);
  if (!cookies.session) return null;
  try {
    return JSON.parse(cookies.session) as { uin?: string; role?: string } | null;
  } catch {
    return null;
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = getSupabase();
    if (!supabase)
      return NextResponse.json({ success: false, error: "Supabase not configured." }, { status: 500 });

    const session = await getSessionFromReq(req);
    if (!session || session.role !== "teacher" || !session.uin)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });

    // resolve teacher id
    const { data: teacherData, error: teacherErr } = await supabase.from("teachers").select("id").eq("uin", session.uin).single();
    if (teacherErr || !teacherData?.id) return NextResponse.json({ success: false, error: "Teacher not found" }, { status: 404 });
    const teacher_id = teacherData.id as string;

  // derive id from the request url path
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop() || null
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });

    // fetch existing row to verify ownership
    const { data: existing, error: getErr } = await supabase.from("timetable").select("id, teacher_id").eq("id", id).single();
    if (getErr || !existing) return NextResponse.json({ success: false, error: "Timetable entry not found" }, { status: 404 });
    if (existing.teacher_id !== teacher_id) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { subject, class_id, day, time } = await req.json();
    if (!subject || !class_id || !day || !time) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // validate class exists
    const { data: cls, error: clsErr } = await supabase.from("classes").select("id").eq("id", class_id).single();
    if (clsErr || !cls) return NextResponse.json({ success: false, error: "Invalid class_id" }, { status: 400 });

  const { error } = await supabase.from("timetable").update({ subject, class_id, day, time }).eq("id", id).select();
  if (error) throw error;

    // return the updated row joined with classes for client convenience
    const { data: updatedJoined, error: joinErr } = await supabase.from("timetable").select("*, classes(id, name)").eq("id", id).single();
    if (joinErr) throw joinErr;

    return NextResponse.json({ success: true, data: updatedJoined }, { status: 200 });
  } catch (error) {
    console.error("Error updating timetable entry:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = getSupabase();
    if (!supabase)
      return NextResponse.json({ success: false, error: "Supabase not configured." }, { status: 500 });

    const session = await getSessionFromReq(req);
    if (!session || session.role !== "teacher" || !session.uin)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });

    const { data: teacherData, error: teacherErr } = await supabase.from("teachers").select("id").eq("uin", session.uin).single();
    if (teacherErr || !teacherData?.id) return NextResponse.json({ success: false, error: "Teacher not found" }, { status: 404 });
    const teacher_id = teacherData.id as string;

  const url = new URL(req.url)
  const id = url.pathname.split('/').pop() || null
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });

    // fetch existing row to verify ownership
    const { data: existing, error: getErr } = await supabase.from("timetable").select("id, teacher_id").eq("id", id).single();
    if (getErr || !existing) return NextResponse.json({ success: false, error: "Timetable entry not found" }, { status: 404 });
    if (existing.teacher_id !== teacher_id) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { error } = await supabase.from("timetable").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting timetable entry:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
