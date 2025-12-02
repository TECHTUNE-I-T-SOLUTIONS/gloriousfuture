import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = JSON.parse(decodeURIComponent(sessionCookie))
    const teacherUin = session.uin

    const { data: teacher } = await supabase
      .from('teachers')
      .select('id')
      .eq('uin', teacherUin)
      .single()

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    const { data: courses } = await supabase
      .from('programming_courses')
      .select(`
        id,
        title,
        description,
        difficulty_level,
        age_group,
        subject_id,
        is_published,
        created_at,
        updated_at,
        programming_modules(count),
        programming_pupil_progress(count)
      `)
      .eq('teacher_id', teacher.id)
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
    const teacherUin = session.uin

    const { data: teacher } = await supabase
      .from('teachers')
      .select('id')
      .eq('uin', teacherUin)
      .single()

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    const body = await request.json()

    const { data: course, error } = await supabase
      .from('programming_courses')
      .insert({
        teacher_id: teacher.id,
        title: body.title,
        description: body.description || null,
        difficulty_level: body.difficulty_level || 'beginner',
        age_group: body.age_group || '6-10',
        subject_id: body.subject_id || null,
        is_published: false,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
