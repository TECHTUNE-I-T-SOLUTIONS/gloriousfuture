import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const subaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(subaseUrl, supabaseKey)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params

    const { data, error } = await supabase
      .from('programming_lessons')
      .select('*')
      .eq('id', lessonId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params
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
      code_example,
      code_language,
      learning_objectives,
      estimated_duration_minutes,
      has_assessment,
    } = body as Record<string, unknown>

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (content_rich_html !== undefined) updateData.content_rich_html = content_rich_html
    if (video_url !== undefined) updateData.video_url = video_url
    if (tutorial_steps !== undefined) updateData.tutorial_steps = tutorial_steps
    if (starter_code !== undefined) updateData.starter_code = starter_code
    if (expected_output !== undefined) updateData.expected_output = expected_output
    if (language !== undefined) updateData.language = language
    if (code_language !== undefined) updateData.code_language = code_language
    if (code_example !== undefined) updateData.code_example = code_example
    if (learning_objectives !== undefined) updateData.learning_objectives = learning_objectives
    if (estimated_duration_minutes !== undefined) updateData.estimated_duration_minutes = estimated_duration_minutes
    if (has_assessment !== undefined) updateData.has_assessment = has_assessment

    const { data, error } = await supabase
      .from('programming_lessons')
      .update(updateData)
      .eq('id', lessonId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params

    const { error } = await supabase
      .from('programming_lessons')
      .delete()
      .eq('id', lessonId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
