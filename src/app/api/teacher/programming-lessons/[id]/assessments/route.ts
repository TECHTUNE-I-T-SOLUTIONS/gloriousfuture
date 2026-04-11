import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params

    const { data: assessments } = await supabase
      .from('programming_assessments')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: false })

    return NextResponse.json(assessments || [])
  } catch (error) {
    console.error('Error fetching assessments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params
    const body = await request.json()

    const {
      title,
      description,
      assessment_type,
      passing_score,
      max_score,
      questions,
    } = body as Record<string, unknown>

    if (!title || !assessment_type) {
      return NextResponse.json(
        { error: "Title and assessment type are required" },
        { status: 400 }
      )
    }

    if (!questions || (Array.isArray(questions) && questions.length === 0)) {
      return NextResponse.json(
        { error: "At least one question is required" },
        { status: 400 }
      )
    }

    const { data: assessment, error } = await supabase
      .from('programming_assessments')
      .insert({
        lesson_id: lessonId,
        title,
        description: description || null,
        assessment_type,
        passing_score: passing_score || 70,
        max_score: max_score || 100,
        questions: questions || [],
        is_published: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating assessment:', error)
      return NextResponse.json(
        { error: 'Failed to create assessment' },
        { status: 500 }
      )
    }

    return NextResponse.json(assessment, { status: 201 })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
