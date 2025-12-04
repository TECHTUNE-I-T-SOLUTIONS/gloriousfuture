import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface SubmitBody {
  assessment_id: string
  answers: Record<string, string>
}

export async function POST(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  try {
    const { lessonId } = await params
    if (!lessonId) {
      return NextResponse.json({ error: "lessonId is required" }, { status: 400 })
    }

    const body = (await request.json()) as SubmitBody
    const { assessment_id, answers } = body
    if (!assessment_id || !answers) {
      return NextResponse.json({ error: "assessment_id and answers are required" }, { status: 400 })
    }

    // Fetch assessment & lesson chain (module -> course)
    const { data: assessment, error: assessError } = await supabase
      .from("programming_assessments")
      .select("id, lesson_id, questions, passing_score")
      .eq("id", assessment_id)
      .single()

    if (assessError || !assessment || assessment.lesson_id !== lessonId) {
      return NextResponse.json({ error: "Assessment not found for lesson" }, { status: 404 })
    }

    const { data: lesson, error: lessonError } = await supabase
      .from("programming_lessons")
      .select("id, module_id")
      .eq("id", lessonId)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    const { data: module, error: moduleError } = await supabase
      .from("programming_modules")
      .select("id, course_id")
      .eq("id", lesson.module_id)
      .single()

    if (moduleError || !module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    // Normalize questions array
    // Use unknown[] and narrow as needed
    let questions: unknown[] = []
    if (assessment.questions) {
      if (Array.isArray(assessment.questions)) {
        questions = assessment.questions as unknown[]
      } else {
        try {
          questions = JSON.parse(String(assessment.questions))
        } catch {
          questions = []
        }
      }
    }

    // Basic scoring: look for question.correct_option_id matching submitted answers
    let correct = 0
    questions.forEach((rawQ, idx) => {
      const q = (rawQ as unknown) as Record<string, unknown>
      const answerKey = `question-${idx}`
      const submitted = answers[answerKey]
      const correctId = (q.correct_option_id || q.correctOptionId) as string | undefined
      if (submitted && correctId && submitted === correctId) {
        correct += 1
      }
    })

    const total = questions.length || 0
    const rawScore = total === 0 ? 0 : (correct / total) * 100
    const passingScore = typeof assessment.passing_score === "number" ? Number(assessment.passing_score) : 70
    const is_passed = rawScore >= passingScore

    // Simple feedback object
    const feedback: Record<string, unknown> = {
      total_questions: total,
      correct_answers: correct,
      passing_score: passingScore,
      hints: !is_passed ? "Review the lesson content and retry." : "Great job! Proceed to the next lesson." ,
    }

    // Get pupil auth user
    const { data: { user } } = await supabase.auth.getUser()

    let submissionRecord: Record<string, unknown> | null = null
    if (user) {
      const { data: inserted, error: insertError } = await supabase
        .from("programming_assessment_submissions")
        .insert({
          assessment_id: assessment.id,
            pupil_id: user.id,
            lesson_id: lessonId,
            course_id: module.course_id,
            answers,
            score: rawScore,
            is_passed,
            feedback,
        })
        .select()
        .limit(1)
        .maybeSingle()

      if (!insertError && inserted) {
        submissionRecord = inserted
      }
    }

    return NextResponse.json({
      id: submissionRecord?.id || null,
      assessment_id,
      lesson_id: lessonId,
      score: rawScore,
      is_passed,
      feedback,
      submitted_at: new Date().toISOString(),
    })
  } catch (err: unknown) {
    console.error("Error submitting assessment:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
