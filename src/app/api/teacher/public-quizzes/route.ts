import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('public_quizzes')
      .select('id, title, description, is_published, is_public, time_per_question, total_questions, thumbnail_url, created_at')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error('Error listing teacher quizzes', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      is_published = false,
      is_public = true,
      time_per_question = 30,
      tags = [],
      difficulty = null,
      thumbnail_url = null,
      questions = [],
    } = body as any

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const { data: quiz, error: insertQuizErr } = await supabase
      .from('public_quizzes')
      .insert({
        teacher_id: null,
        title,
        description,
        is_published,
        is_public,
        time_per_question,
        total_questions: Array.isArray(questions) ? questions.length : 0,
        tags,
        difficulty,
        thumbnail_url,
      })
      .select()
      .single()

    if (insertQuizErr || !quiz) {
      return NextResponse.json({ error: insertQuizErr?.message ?? 'Failed to create quiz' }, { status: 400 })
    }

    // insert questions and options
    if (Array.isArray(questions) && questions.length > 0) {
      for (let qi = 0; qi < questions.length; qi++) {
        const q = questions[qi]
        const { data: qInsert, error: qErr } = await supabase
          .from('public_quiz_questions')
          .insert({
            quiz_id: quiz.id,
            question_text: q.question_text,
            order_index: qi + 1,
            time_limit_seconds: q.time_limit_seconds ?? null,
            explanation: q.explanation ?? null,
          })
          .select()
          .single()

        if (qErr || !qInsert) continue

        if (Array.isArray(q.options)) {
          for (let oi = 0; oi < q.options.length; oi++) {
            const opt = q.options[oi]
            await supabase.from('public_quiz_options').insert({
              question_id: qInsert.id,
              option_text: opt.option_text,
              is_correct: !!opt.is_correct,
              order_index: oi + 1,
            })
          }
        }
      }
    }

    return NextResponse.json(quiz)
  } catch (err) {
    console.error('Error creating quiz', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
