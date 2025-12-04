import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(_request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  try {
    const { lessonId } = await params
    if (!lessonId) {
      return NextResponse.json({ error: "lessonId is required" }, { status: 400 })
    }

    // Verify lesson exists & published via its course
    const { data: lesson, error: lessonError } = await supabase
      .from("programming_lessons")
      .select("id, module_id, has_assessment")
      .eq("id", lessonId)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }
    if (!lesson.has_assessment) {
      return NextResponse.json({ error: "Lesson has no assessment" }, { status: 404 })
    }

    // Fetch assessment
    const { data: assessment, error: assessError } = await supabase
      .from("programming_assessments")
      .select("id, lesson_id, title, description, questions, passing_score")
      .eq("lesson_id", lessonId)
      .limit(1)
      .maybeSingle()

    if (assessError || !assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    // Normalize questions array
    let questions: unknown[] = []
    if (assessment.questions) {
      if (Array.isArray(assessment.questions)) {
        questions = assessment.questions
      } else {
        try {
          questions = JSON.parse(String(assessment.questions))
        } catch {
          questions = []
        }
      }
    }

    return NextResponse.json({
      id: assessment.id,
      lesson_id: assessment.lesson_id,
      title: assessment.title,
      description: assessment.description,
      passing_score: assessment.passing_score ?? 70,
      questions,
    })
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
