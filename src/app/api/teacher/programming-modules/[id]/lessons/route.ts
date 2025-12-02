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

    const { data: lesson, error } = await supabase
      .from('programming_lessons')
      .insert({
        module_id: moduleId,
        title: body.title,
        content: body.content,
        content_rich_html: body.content_rich_html || null,
        code_example: body.code_example || null,
        code_language: body.code_language || 'javascript',
        order_index: body.order_index || 1,
        learning_objectives: body.learning_objectives || [],
        estimated_duration_minutes: body.estimated_duration_minutes || null,
        has_assessment: body.has_assessment || false,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
