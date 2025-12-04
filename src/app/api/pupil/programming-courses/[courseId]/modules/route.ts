import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(_request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await params
    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 })
    }

    // Verify course exists & is published (for pupil access)
    const { data: course, error: courseError } = await supabase
      .from("programming_courses")
      .select("id, is_published")
      .eq("id", courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    if (!course.is_published) {
      return NextResponse.json({ error: "Course not published" }, { status: 403 })
    }

    const { data, error } = await supabase
      .from("programming_modules")
      .select("id, title, description, order_index")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true })

    if (error) {
      console.error("Error fetching modules:", error)
      return NextResponse.json({ error: "Failed to fetch modules" }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
