import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('public_quizzes')
      .select('id, title, description, time_per_question, total_questions, thumbnail_url')
      .eq('is_published', true)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error('Error listing public quizzes', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
