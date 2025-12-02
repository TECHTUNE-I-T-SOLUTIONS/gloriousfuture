import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Function to calculate score based on assessment type and answers
function calculateScore(
  assessment: Record<string, unknown>,
  answers: Record<string, unknown>
): { score: number; passed: boolean; feedback: Record<string, unknown> } {
  const questions = (assessment.questions as unknown[]) || []
  let correctCount = 0
  const feedback: Record<string, unknown> = {}

  questions.forEach((question: unknown) => {
    const q = question as Record<string, unknown>
    const userAnswer = answers[q.id as string]
    const isCorrect = userAnswer === q.correct_answer

    if (isCorrect) {
      correctCount++
    }

    feedback[q.id as string] = {
      userAnswer,
      correct: q.correct_answer,
      isCorrect,
      explanation: q.explanation || '',
    }
  })

  const score = (correctCount / questions.length) * 100
  const passingScore = (assessment.passing_score as number) || 70
  const passed = score >= passingScore

  return { score, passed, feedback }
}

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = JSON.parse(decodeURIComponent(sessionCookie))
    const pupilUin = session.uin

    const { data: pupil } = await supabase
      .from('pupils')
      .select('id')
      .eq('uin', pupilUin)
      .single()

    if (!pupil) {
      return NextResponse.json({ error: 'Pupil not found' }, { status: 404 })
    }

    const body = await request.json()
    const { assessment_id, lesson_id, course_id, answers, code_submission } = body

    // Fetch assessment details
    const { data: assessment } = await supabase
      .from('programming_assessments')
      .select('*')
      .eq('id', assessment_id)
      .single()

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // Auto-mark the assessment
    const { score, passed, feedback } = calculateScore(assessment, answers)

    // Save submission
    const { data: submission, error } = await supabase
      .from('programming_assessment_submissions')
      .insert({
        assessment_id,
        pupil_id: pupil.id,
        lesson_id,
        course_id,
        answers,
        code_submission: code_submission || null,
        score,
        is_passed: passed,
        feedback,
        auto_marked_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Update lesson completion if passed
    if (passed) {
      // Check if lesson already completed
      const { data: completion } = await supabase
        .from('programming_lesson_completion')
        .select('id')
        .eq('pupil_id', pupil.id)
        .eq('lesson_id', lesson_id)
        .single()

      if (!completion) {
        await supabase
          .from('programming_lesson_completion')
          .insert({
            pupil_id: pupil.id,
            lesson_id,
            course_id,
          })
      }

      // Update pupil progress
      const { data: progress } = await supabase
        .from('programming_pupil_progress')
        .select('total_lessons_completed, total_assessments_passed')
        .eq('pupil_id', pupil.id)
        .eq('course_id', course_id)
        .single()

      if (progress) {
        const newLessonsCompleted = progress.total_lessons_completed + 1
        const newAssessmentsPassedCount = progress.total_assessments_passed + 1

        await supabase
          .from('programming_pupil_progress')
          .update({
            total_lessons_completed: newLessonsCompleted,
            total_assessments_passed: newAssessmentsPassedCount,
            course_completion_percentage: Math.min(100, (newLessonsCompleted / 10) * 100), // Rough estimate
          })
          .eq('pupil_id', pupil.id)
          .eq('course_id', course_id)
      }
    }

    return NextResponse.json({
      submission,
      score,
      passed,
      feedback,
    })
  } catch (error) {
    console.error('Error submitting assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
