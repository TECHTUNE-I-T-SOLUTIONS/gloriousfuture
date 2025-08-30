import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GET /api/teacher/exam-attempts?examId=<id>&limit=20&offset=0
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
  let examId = searchParams.get('examId')
    const resultId = searchParams.get('resultId')
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    // If caller provided resultId (exam_results.id) prefer that and try to resolve cbt_exam_id
    if (!examId && resultId) {
      // try to read cbt_exam_id from exam_results (may not exist)
      try {
        const { data: row, error: rowErr } = await supabase.from('exam_results').select('cbt_exam_id').eq('id', resultId).maybeSingle()
        if (rowErr) {
          // if column does not exist, surface helpful message
          if (String(rowErr.message || rowErr).includes('column') && String(rowErr.message || rowErr).includes('cbt_exam_id')) {
            // Helpful remediation text for DB owners: suggest ALTER TABLE SQL
            const migrationHint = "ALTER TABLE exam_results ADD COLUMN IF NOT EXISTS cbt_exam_id uuid;";
            return NextResponse.json({ success: false, error: 'exam_results.cbt_exam_id column does not exist on the database. Run the migration to add the column and backfill if needed.', migrationHint }, { status: 400 })
          }
          throw rowErr
        }
        if (row && typeof (row as Record<string, unknown>)['cbt_exam_id'] === 'string') {
          examId = String((row as Record<string, unknown>)['cbt_exam_id'])
        } else {
          return NextResponse.json({ success: false, error: 'Could not resolve cbt_exam_id from exam_results row' }, { status: 404 })
        }
      } catch (err) {
        console.error('Failed to resolve cbt_exam_id from exam_results', err)
        return NextResponse.json({ success: false, error: 'Failed to resolve exam id from exam_results' }, { status: 500 })
      }
    }

    if (!examId) return NextResponse.json({ success: false, error: 'Missing examId' }, { status: 400 })

  // validate UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(examId)) return NextResponse.json({ success: false, error: 'examId must be a valid UUID' }, { status: 400 })

    // Optionally verify teacher session if needed (omitted for brevity)

    const start = offset
    const end = offset + limit - 1
    // select full pupil record to avoid referencing unknown column names (use pupils(*) to get all fields)
    // Primary attempt fetch (including nested pupil record)
    const attemptRes = await supabase
      .from('cbt_exam_attempts')
      .select('id, exam_id, pupil_id, score, submitted_at, answers, pupils(*)')
      .eq('exam_id', examId)
      .order('submitted_at', { ascending: false })
      .range(start, end)

    if (attemptRes.error) {
      // log the supabase error for debugging
      console.error('Supabase attempt fetch error', attemptRes.error)
      return NextResponse.json({ success: false, error: String(attemptRes.error.message || attemptRes.error) }, { status: 500 })
    }

  const data = attemptRes.data || []

    // Try to obtain total count. If the first call didn't return count, perform a head request to get exact count.
    let total = 0
    try {
      const countRes = await supabase
        .from('cbt_exam_attempts')
        .select('id', { head: true, count: 'exact' })
        .eq('exam_id', examId)

      if (countRes.error) {
        console.warn('Supabase count fallback error', countRes.error)
        total = data.length
      } else if (typeof countRes.count === 'number') {
        total = countRes.count
      } else {
        total = data.length
      }
    } catch (countErr) {
      console.warn('Count fallback exception', countErr)
      total = data.length
    }

    // optional debug flag to help diagnose empty pages
    const debug = searchParams.get('debug') === '1'
    if (debug) {
      return NextResponse.json({ success: true, attempts: data, total, debug: { returnedCount: data.length, firstId: data[0]?.id ?? null } })
    }

    return NextResponse.json({ success: true, attempts: data, total })
  } catch (err) {
    console.error('Exam attempts error', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
