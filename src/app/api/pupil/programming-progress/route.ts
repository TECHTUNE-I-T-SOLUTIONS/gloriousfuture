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
    const pupilUin = session.uin

    const { data: pupil } = await supabase
      .from('pupils')
      .select('id')
      .eq('uin', pupilUin)
      .single()

    if (!pupil) {
      return NextResponse.json({ error: 'Pupil not found' }, { status: 404 })
    }

    // Get all progress entries for this pupil
    const { data: progress } = await supabase
      .from('programming_pupil_progress')
      .select('*')
      .eq('pupil_id', pupil.id)
      .order('started_at', { ascending: false })

    return NextResponse.json(progress || [])
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
