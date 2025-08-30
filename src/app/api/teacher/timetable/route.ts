import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ success: false, error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 })

    // derive session from cookies to determine teacher
    const cookieHeader = req.headers.get("cookie") || ""
    const { parse } = await import("cookie")
    const cookies = parse(cookieHeader)
    if (!cookies.session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

    let session: { uin?: string; role?: string } | null = null
    try {
      session = JSON.parse(cookies.session)
    } catch {
      return NextResponse.json({ success: false, error: "Invalid session cookie" }, { status: 400 })
    }

    if (!session || session.role !== "teacher" || !session.uin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

    // resolve teacher id from teachers table
    const { data: teacherData, error: teacherErr } = await supabase.from("teachers").select("id").eq("uin", session.uin).single()
    if (teacherErr || !teacherData?.id) {
      return NextResponse.json({ success: false, error: "Teacher not found" }, { status: 404 })
    }
    const teacher_id = teacherData.id as string

    const { subject, class_id, day, time } = await req.json()
    if (!subject || !class_id || !day || !time) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // validate class_id exists
    const { data: classCheck, error: classErr } = await supabase.from("classes").select("id").eq("id", class_id).single()
    if (classErr || !classCheck) {
      return NextResponse.json({ success: false, error: "Invalid class_id" }, { status: 400 })
    }

    const { data, error } = await supabase.from("timetable").insert([{ teacher_id, subject, class_id, day, time }]).select()
    if (error) throw error

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("Error inserting timetable entry:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ success: false, error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 })

    // derive session from cookies to determine teacher
    const cookieHeader = req.headers.get("cookie") || ""
    const { parse } = await import("cookie")
    const cookies = parse(cookieHeader)
    if (!cookies.session) return NextResponse.json([], { status: 200 })

    let session: { uin?: string; role?: string } | null = null
    try {
      session = JSON.parse(cookies.session)
    } catch {
      return NextResponse.json([], { status: 200 })
    }

    if (!session || session.role !== "teacher" || !session.uin) {
      // not a teacher — return empty list for safety
      return NextResponse.json([], { status: 200 })
    }

    // resolve teacher record
    const { data: teacherData, error: teacherErr } = await supabase.from("teachers").select("id, class_taught").eq("uin", session.uin).single()
    if (teacherErr || !teacherData) {
      return NextResponse.json([], { status: 200 })
    }

    const url = new URL(req.url)
    const all = url.searchParams.get("all") === "1" || url.searchParams.get("all") === "true"

    let data, error
    if (all) {
      // return all timetable entries created by this teacher (across classes)
      ;({ data, error } = await supabase
        .from("timetable")
        .select("*, classes(id, name)")
        .eq("teacher_id", teacherData.id)
        .order("day", { ascending: true })
        .order("time", { ascending: true }))
    } else {
      // default: return timetable for the class the teacher teaches
      let classId: string | null = null
      const taught = teacherData.class_taught
      if (taught) {
        const { data: classById } = await supabase.from("classes").select("id, name").eq("id", taught).single()
        if (classById?.id) classId = classById.id
        else {
          const { data: classByName } = await supabase.from("classes").select("id, name").eq("name", taught).single()
          if (classByName?.id) classId = classByName.id
        }
      }

      if (!classId) {
        return NextResponse.json([], { status: 200 })
      }

      ;({ data, error } = await supabase
        .from("timetable")
        .select("*, classes(id, name)")
        .eq("class_id", classId)
        .order("day", { ascending: true })
        .order("time", { ascending: true }))
    }

    if (error) throw error

    return NextResponse.json(data ?? [], { status: 200 })
  } catch (error) {
    console.error("Error fetching timetable:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
