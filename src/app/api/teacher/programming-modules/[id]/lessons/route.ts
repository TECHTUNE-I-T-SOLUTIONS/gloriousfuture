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
    const { id: moduleId } = await params

    const { data: lessons } = await supabase
      .from('programming_lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index', { ascending: true })

    return NextResponse.json(lessons || [])
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: moduleId } = await params
    const body = await request.json()

    const {
      title,
      content,
      content_rich_html,
      video_url,
      tutorial_steps,
      starter_code,
      expected_output,
      language,
      code_language,
      code_example,
      order_index,
      learning_objectives,
      estimated_duration_minutes,
      has_assessment,
    } = body as Record<string, unknown>

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    const { data: lesson, error } = await supabase
      .from('programming_lessons')
      .insert({
        module_id: moduleId,
        title,
        content,
        content_rich_html: content_rich_html || null,
        video_url: video_url || null,
        tutorial_steps: tutorial_steps || null,
        starter_code: starter_code || null,
        expected_output: expected_output || null,
        language: language || code_language || 'javascript',
        code_example: code_example || starter_code || null,
        code_language: code_language || language || 'javascript',
        order_index: order_index || 1,
        learning_objectives: learning_objectives || [],
        estimated_duration_minutes: estimated_duration_minutes || null,
        has_assessment: has_assessment || false,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
