import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: submissionId } = await params
    const body = await request.json()

    const {
      teacher_feedback,
      teacher_score,
      status,
      marked_at,
    } = body as Record<string, unknown>

    const updateData: Record<string, unknown> = {}

    if (teacher_feedback !== undefined) {
      updateData.teacher_feedback = teacher_feedback
    }
    if (teacher_score !== undefined) {
      updateData.teacher_score = teacher_score
    }
    if (status !== undefined) {
      updateData.status = status
    }
    if (marked_at !== undefined) {
      updateData.marked_at = marked_at
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      )
    }

    const { data: submission, error } = await supabase
      .from('programming_assessment_submissions')
      .update(updateData)
      .eq('id', submissionId)
      .select()
      .single()

    if (error) {
      console.error('Error updating submission:', error)
      return NextResponse.json(
        { error: 'Failed to update submission' },
        { status: 500 }
      )
    }

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: submissionId } = await params

    const { data: submission, error } = await supabase
      .from('programming_assessment_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (error) {
      console.error('Error fetching submission:', error)
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
