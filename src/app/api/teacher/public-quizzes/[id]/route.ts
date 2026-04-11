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
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })

    const { data: questions } = await supabase
      .from('public_quiz_questions')
      .select('*')
      .eq('quiz_id', id)
      .order('order_index', { ascending: true })

    // fetch options for all questions
    const questionIds = (questions || []).map((q: any) => q.id)
    const { data: options } = await supabase
      .from('public_quiz_options')
      .select('*')
      .in('question_id', questionIds)
      .order('order_index', { ascending: true })

    // attach options to questions
    const questionsWithOptions = (questions || []).map((q: any) => ({
      ...q,
      options: (options || []).filter((o: any) => o.question_id === q.id),
    }))

    return NextResponse.json({ quiz, questions: questionsWithOptions })
  } catch (err) {
    console.error('Error fetching quiz', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const body = await request.json()

    const updates: any = {}
    for (const key of ['title', 'description', 'is_published', 'is_public', 'time_per_question', 'tags', 'difficulty', 'thumbnail_url']) {
      if (key in body) updates[key] = (body as any)[key]
    }
    if (Object.keys(updates).length > 0) {
      await supabase.from('public_quizzes').update(updates).eq('id', id)
    }

    // replace questions if provided
    if (Array.isArray(body.questions)) {
      // delete existing questions (options will cascade)
      await supabase.from('public_quiz_questions').delete().eq('quiz_id', id)

      // insert new ones
      for (let qi = 0; qi < body.questions.length; qi++) {
        const q = body.questions[qi]
        const { data: qInsert } = await supabase
          .from('public_quiz_questions')
          .insert({ quiz_id: id, question_text: q.question_text, order_index: qi + 1, time_limit_seconds: q.time_limit_seconds ?? null, explanation: q.explanation ?? null })
          .select()
          .single()

        if (!qInsert) continue
        if (Array.isArray(q.options)) {
          for (let oi = 0; oi < q.options.length; oi++) {
            const opt = q.options[oi]
            await supabase.from('public_quiz_options').insert({ question_id: qInsert.id, option_text: opt.option_text, is_correct: !!opt.is_correct, order_index: oi + 1 })
          }
        }
      }

      // update total_questions using exact count
      const { error: countErr, count } = await supabase
        .from('public_quiz_questions')
        .select('*', { count: 'exact', head: true })
        .eq('quiz_id', id)
      if (!countErr) {
        await supabase.from('public_quizzes').update({ total_questions: count ?? 0 }).eq('id', id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error updating quiz', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const { error } = await supabase.from('public_quizzes').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error deleting quiz', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
