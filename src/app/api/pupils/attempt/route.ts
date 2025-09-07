import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const examId = searchParams.get('examId')
    if (!examId) return NextResponse.json({ success: false, error: 'Missing examId' }, { status: 400 })

    // validate examId is a UUID to avoid DB type errors (e.g. ?examId=0)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(examId)) {
      return NextResponse.json({ success: false, error: 'Invalid examId format; expected UUID' }, { status: 400 })
    }

    // read session cookie
    const cookie = req.headers.get('cookie') || ''
    const match = cookie.match(/session=([^;]+)/)
    if (!match) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })

    const sessionVal = decodeURIComponent(match[1])
    let session
  try {
      session = JSON.parse(sessionVal)
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 })
    }

    // find pupil by uin
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: pupils, error: pErr } = await supabase
      .from('pupils')
      .select('*')
      .eq('uin', session.uin)
      .limit(1)

    if (pErr) throw pErr
    const pupil = pupils?.[0]
    if (!pupil) return NextResponse.json({ success: false, error: 'Pupil not found' }, { status: 404 })

    // try cbt_exam_attempts first
  const { data: attempts, error: aErr } = await supabase
      .from('cbt_exam_attempts')
      .select('*, cbt_exams(*)')
      .eq('exam_id', examId)
      .eq('pupil_id', pupil.id)
      .limit(1)

    if (aErr && aErr.code !== 'PGRST116') {
      // unexpected error
      throw aErr
    }

    if (attempts && attempts.length > 0) {
  const at = attempts[0] as Record<string, unknown>
      try {
  const atRec = at as Record<string, unknown>
  const cbtExams = atRec?.cbt_exams as Record<string, unknown> | undefined
  const classId = (cbtExams && typeof cbtExams.class_id === 'string') ? (cbtExams.class_id as string) : (typeof atRec.class_id === 'string' ? (atRec.class_id as string) : null)
  if (classId) {
          const { data: cls } = await supabase.from('classes').select('name').eq('id', classId).maybeSingle()
          if (cls && typeof (cls as Record<string, unknown>).name === 'string') at.class_name = String((cls as Record<string, unknown>).name)
        }
      } catch (e) {
        // non-fatal
        console.warn('Failed to resolve class name for attempt', e)
      }
      return NextResponse.json({ success: true, attempt: at })
    }

    // fallback to exam_results
  const { data: results, error: rErr } = await supabase
      .from('exam_results')
      .select('*')
      .eq('pupil_id', pupil.id)
      .eq('cbt_exam_id', examId)
      .limit(1)

    if (rErr) throw rErr
    if (results && results.length > 0) {
  const resRow = results[0] as Record<string, unknown>
      try {
        // If exam_results stores cbt_exam_id, resolve the related exam and class name
        const examRef = resRow?.cbt_exam_id ?? null
        let classId: string | null = null
        if (examRef) {
          const { data: examRow } = await supabase.from('cbt_exams').select('class_id').eq('id', examRef).maybeSingle()
          if (examRow && typeof (examRow as Record<string, unknown>).class_id === 'string') classId = String((examRow as Record<string, unknown>).class_id)
        } else {
          if (resRow && typeof (resRow as Record<string, unknown>).class_id === 'string') classId = String((resRow as Record<string, unknown>).class_id)
        }
        if (classId) {
          const { data: cls } = await supabase.from('classes').select('name').eq('id', classId).maybeSingle()
          if (cls && typeof (cls as Record<string, unknown>).name === 'string') (resRow as Record<string, unknown>).class_name = String((cls as Record<string, unknown>).name)
        }
      } catch (e) {
        console.warn('Failed to resolve class name for exam_results row', e)
      }
      return NextResponse.json({ success: true, attempt: resRow })
    }

    return NextResponse.json({ success: false, error: 'No attempt found' }, { status: 404 })
  } catch (err) {
    console.error('Attempt fetch error', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
