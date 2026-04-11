import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get('assessmentId')
    const lessonId = searchParams.get('lessonId')
    const moduleId = searchParams.get('moduleId')

    let query = supabase
      .from('programming_assessment_submissions')
      .select('*')

    if (assessmentId) {
      query = query.eq('assessment_id', assessmentId)
    }
    if (lessonId) {
      query = query.eq('lesson_id', lessonId)
    }
    if (moduleId) {
      query = query.eq('module_id', moduleId)
    }

    const { data: submissions, error } = await query.order('submitted_at', { ascending: false })

    if (error) {
      console.error('Error fetching submissions:', error)
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
    }

    return NextResponse.json(submissions || [])
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
