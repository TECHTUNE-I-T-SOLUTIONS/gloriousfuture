import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { parseCookie } from "cookie";

// POST: Create a new assignment
export async function POST(req: Request) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 })

    // Extract session from cookies to determine the authenticated teacher
    const cookieHeader = req.headers.get("cookie") || ""
    const cookies = parseCookie(cookieHeader)
    if (!cookies.session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  type SessionLike = { uin?: string; role?: string }
  let session: SessionLike | null = null
    try {
      session = JSON.parse(cookies.session)
    } catch {
      return NextResponse.json({ success: false, error: "Invalid session cookie" }, { status: 400 })
    }

    if (!session || session.role !== "teacher" || !session.uin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

    // Resolve teacher id from teachers table using the session UIN
    const { data: teacherData, error: teacherErr } = await supabase
      .from("teachers")
      .select("id")
      .eq("uin", session.uin as string)
      .single()

    if (teacherErr || !teacherData?.id) {
      return NextResponse.json({ success: false, error: "Teacher not found" }, { status: 404 })
    }

    const teacher_id = teacherData.id as string

    const { title, description, due_date, class_id, questions, subject_id } = await req.json();

    // If questions provided by the frontend, store them inside the description as JSON.
    // The assignments table doesn't have a questions column; we normalize on read.
    const storedDescription = questions ? JSON.stringify({ questions }) : description ?? null

    // Validate provided class_id (ensure it exists)
    if (!class_id) {
      return NextResponse.json({ success: false, error: "class_id is required" }, { status: 400 })
    }

    const { data: classCheck, error: classErr } = await supabase.from("classes").select("id").eq("id", class_id).single()
    if (classErr || !classCheck) {
      return NextResponse.json({ success: false, error: "Invalid class_id" }, { status: 400 })
    }

    const insertObj: Record<string, unknown> = { teacher_id, title, description: storedDescription, due_date, class_id }
    if (subject_id) insertObj.subject_id = subject_id
    const { data, error } = await supabase
      .from("assignments")
      .insert([insertObj])
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

// GET: Retrieve assignments along with submitted assignments
export async function GET() {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 })

    const { data: assignments, error: assignmentsError } = await supabase.from("assignments").select("*")
    if (assignmentsError) throw assignmentsError

    // Fetch submissions and include related pupil info (id, full_name, uin, profile_picture)
    const { data: submissions, error: submissionsError } = await supabase
      .from("submissions")
      .select("id, assignment_id, pupil_id, submitted_at, file_url, text_submission, grade, feedback, pupil: pupils(id, full_name, uin, profile_picture)")

    if (submissionsError) throw submissionsError

    // Normalize assignments: if description contains { questions: [...] } JSON, expose questions array
    const normalized = (assignments || []).map((a: Record<string, unknown>) => {
      let questions: string[] = []
      try {
        const desc = a.description as unknown
        if (desc) {
          const parsed: unknown = typeof desc === "string" ? JSON.parse(desc as string) : desc
          if (parsed && typeof parsed === "object") {
            const p = parsed as Record<string, unknown>
            if (Array.isArray(p.questions)) {
              questions = p.questions as string[]
            }
          }
        }
      } catch {
        // ignore parse errors
      }
      return { ...a, questions }
    })

    // Normalize submissions: if a joined pupil object exists, expose it directly on the submission
    const normalizedSubmissions = (submissions || []).map((s: Record<string, unknown>) => {
      const copy = { ...s }
      if (copy.pupil && Array.isArray(copy.pupil) && copy.pupil.length > 0) {
        // supabase returns related rows as an array; take first
        copy.pupil = (copy.pupil as unknown[])[0]
      }
      return copy
    })

    return NextResponse.json({ assignments: normalized, submissions: normalizedSubmissions })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

// PATCH: Grade an assignment submission
export async function PATCH(req: Request) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 })

    const { submission_id, grade, feedback } = await req.json();

    const { data, error } = await supabase
      .from("submissions")
      .update({ grade, feedback })
      .eq("id", submission_id)

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

// PUT: Update an assignment (teacher must own the assignment)
export async function PUT(req: Request) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 })

    const cookieHeader = req.headers.get("cookie") || ""
    const cookies = parseCookie(cookieHeader)
    if (!cookies.session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

    let session: { uin?: string; role?: string } | null = null
    try {
      session = JSON.parse(cookies.session)
    } catch {
      return NextResponse.json({ success: false, error: "Invalid session cookie" }, { status: 400 })
    }
    if (!session || session.role !== "teacher" || !session.uin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })

    // resolve teacher id
    const { data: teacherData } = await supabase.from("teachers").select("id").eq("uin", session.uin).single()
    if (!teacherData?.id) return NextResponse.json({ success: false, error: "Teacher not found" }, { status: 404 })
    const teacher_id = teacherData.id as string

    const { id, title, description, due_date, class_id, questions, subject_id } = await req.json()
    if (!id) return NextResponse.json({ success: false, error: "Assignment id is required" }, { status: 400 })

    // verify ownership
    const { data: existing, error: getErr } = await supabase.from("assignments").select("id, teacher_id").eq("id", id).single()
    if (getErr || !existing) return NextResponse.json({ success: false, error: "Assignment not found" }, { status: 404 })
    if (existing.teacher_id !== teacher_id) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

    const storedDescription = questions ? JSON.stringify({ questions }) : description ?? null

    const updateObj: Record<string, unknown> = { title, description: storedDescription, due_date, class_id }
    if (subject_id) updateObj.subject_id = subject_id
    const { data, error } = await supabase
      .from("assignments")
      .update(updateObj)
      .eq("id", id)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) })
  }
}

// DELETE: Delete an assignment (teacher must own the assignment)
export async function DELETE(req: Request) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 })

    const cookieHeader = req.headers.get("cookie") || ""
    const cookies = parseCookie(cookieHeader)
    if (!cookies.session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

    let session: { uin?: string; role?: string } | null = null
    try {
      session = JSON.parse(cookies.session)
    } catch {
      return NextResponse.json({ success: false, error: "Invalid session cookie" }, { status: 400 })
    }
    if (!session || session.role !== "teacher" || !session.uin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })

    // resolve teacher id
    const { data: teacherData } = await supabase.from("teachers").select("id").eq("uin", session.uin).single()
    if (!teacherData?.id) return NextResponse.json({ success: false, error: "Teacher not found" }, { status: 404 })
    const teacher_id = teacherData.id as string

    // expect ?id= assignment id in query
    const url = new URL(req.url)
    const id = url.searchParams.get("id")
    if (!id) return NextResponse.json({ success: false, error: "Assignment id is required" }, { status: 400 })

    // verify ownership
    const { data: existing, error: getErr } = await supabase.from("assignments").select("id, teacher_id").eq("id", id).single()
    if (getErr || !existing) return NextResponse.json({ success: false, error: "Assignment not found" }, { status: 404 })
    if (existing.teacher_id !== teacher_id) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

    const { data, error } = await supabase.from("assignments").delete().eq("id", id).select()
    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) })
  }
}
