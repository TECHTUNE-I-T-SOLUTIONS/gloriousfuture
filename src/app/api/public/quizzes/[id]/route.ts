import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const { data: quiz } = await supabase.from('public_quizzes').select('*').eq('id', id).single()
    if (!quiz || !quiz.is_published || !quiz.is_public) return NextResponse.json({ error: 'Quiz not found or not public' }, { status: 404 })

    const { data: questions } = await supabase
      .from('public_quiz_questions')
      .select('*')
      .eq('quiz_id', id)
      .order('order_index', { ascending: true })

    const questionIds = (questions || []).map((q: any) => q.id)
    const { data: options } = await supabase
      .from('public_quiz_options')
      .select('id, question_id, option_text, order_index, is_correct')
      .in('question_id', questionIds)
      .order('order_index', { ascending: true })

    const questionsWithOptions = (questions || []).map((q: any) => ({
      id: q.id,
      question_text: q.question_text,
      order_index: q.order_index,
      time_limit_seconds: q.time_limit_seconds,
      options: (options || []).filter((o: any) => o.question_id === q.id).map((o: any) => ({ id: o.id, option_text: o.option_text, order_index: o.order_index, is_correct: !!o.is_correct })),
    }))

    return NextResponse.json({ quiz: { id: quiz.id, title: quiz.title, description: quiz.description, time_per_question: quiz.time_per_question, total_questions: quiz.total_questions }, questions: questionsWithOptions })
  } catch (err) {
    console.error('Error fetching public quiz', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
