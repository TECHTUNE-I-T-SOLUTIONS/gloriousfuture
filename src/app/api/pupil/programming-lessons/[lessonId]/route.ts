import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const sessionCookie = request.cookies.get('session')?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = JSON.parse(decodeURIComponent(sessionCookie))
    const pupilUin = session.uin

    if (!pupilUin) {
      return NextResponse.json({ error: 'Pupil UIN not found' }, { status: 400 })
    }

    const { lessonId } = await params
    const body = await request.json()
    const { time_spent_minutes, completed_at } = body as Record<string, unknown>

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      )
    }

    // Get or create progress record
    const { data: existingProgress } = await supabase
      .from('programming_lesson_progress')
      .select('id')
      .eq('lesson_id', lessonId)
      .eq('pupil_uin', pupilUin)
      .single()

    if (existingProgress) {
      // Update existing progress
      const { data: updatedProgress, error } = await supabase
        .from('programming_lesson_progress')
        .update({
          is_completed: true,
          completed_at: completed_at || new Date().toISOString(),
          time_spent_minutes: time_spent_minutes || 0,
        })
        .eq('id', existingProgress.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating lesson progress:', error)
        return NextResponse.json(
          { error: 'Failed to update progress' },
          { status: 500 }
        )
      }

      return NextResponse.json(updatedProgress)
    } else {
      // Create new progress record
      const { data: newProgress, error } = await supabase
        .from('programming_lesson_progress')
        .insert({
          lesson_id: lessonId,
          pupil_uin: pupilUin,
          is_completed: true,
          completed_at: completed_at || new Date().toISOString(),
          time_spent_minutes: time_spent_minutes || 0,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating lesson progress:', error)
        return NextResponse.json(
          { error: 'Failed to create progress' },
          { status: 500 }
        )
      }

      return NextResponse.json(newProgress, { status: 201 })
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const sessionCookie = request.cookies.get('session')?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = JSON.parse(decodeURIComponent(sessionCookie))
    const pupilUin = session.uin

    if (!pupilUin) {
      return NextResponse.json({ error: 'Pupil UIN not found' }, { status: 400 })
    }

    const { lessonId } = await params

    const { data: progress, error } = await supabase
      .from('programming_lesson_progress')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('pupil_uin', pupilUin)
      .single()

    if (error && (error as any).code !== 'PGRST116') {
      console.error('Error fetching lesson progress:', error)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    return NextResponse.json(progress || null)
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
