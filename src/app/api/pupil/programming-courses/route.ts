import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    // Get all published programming courses
    const { data: courses } = await supabase
      .from('programming_courses')
      .select(`
        id,
        title,
        description,
        difficulty_level,
        age_group,
        is_published,
        created_at,
        programming_modules(count)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    return NextResponse.json(courses || [])
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
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
    const { course_id } = body

    // Check if already enrolled
    const { data: existingProgress } = await supabase
      .from('programming_pupil_progress')
      .select('id')
      .eq('pupil_id', pupil.id)
      .eq('course_id', course_id)
      .single()

    if (existingProgress) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 })
    }

    // Create new progress entry
    const { data: progress, error } = await supabase
      .from('programming_pupil_progress')
      .insert({
        pupil_id: pupil.id,
        course_id,
        course_completion_percentage: 0,
        total_lessons_completed: 0,
        total_assessments_passed: 0,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error enrolling in course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
