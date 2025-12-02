import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: lesson, error } = await supabase
      .from("programming_lessons")
      .select(
        `
        id,
        title,
        content,
        order_index,
        has_assessment,
        estimated_duration_minutes,
        module_id,
        video_url,
        video_size_mb,
        video_duration_seconds,
        tutorial_steps,
        starter_code,
        expected_output,
        language
      `
      )
      .eq("id", id)
      .single()

    if (error) throw error

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    return NextResponse.json(lesson)
  } catch (err: unknown) {
    console.error("Error fetching lesson details:", err)
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await request.json()

    // Validate video size if provided
    if (updates.video_size_mb && updates.video_size_mb > 50) {
      return NextResponse.json(
        { error: "Video size must be less than 50MB" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("programming_lessons")
      .update(updates)
      .eq("id", id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (err: unknown) {
    console.error("Error updating lesson:", err)
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    )
  }
}
