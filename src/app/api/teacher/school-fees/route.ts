import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    const { data, error } = await supabase.from('school_fees').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: (err as Error).message })
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get('session')?.value
    if (!cookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const session = JSON.parse(cookie)
    const uin = session?.uin
    if (typeof uin !== 'string' || !uin.startsWith('GFA-T-')) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

  const { class_ids, amount, session: schoolSession, term1_amount, term2_amount, term3_amount } = await req.json()
  if (!Array.isArray(class_ids) || typeof schoolSession !== 'string') return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })

    // resolve teacher id
    const { data: t } = await supabase.from('teachers').select('id').eq('uin', uin).single()
    const teacherId = t?.id || null

  // resolve class ids to class names (school_fees.class is varchar(50) per schema)
  const classRes = await supabase.from('classes').select('id, name').in('id', class_ids)
  const classRows = classRes.data as { id: string; name: string }[] | null
  const classErr = classRes.error
  if (classErr) throw classErr
  // determine stored amount: if specific term amounts supplied, compute total amount
  const t1 = typeof term1_amount === 'number' ? term1_amount : null
  const t2 = typeof term2_amount === 'number' ? term2_amount : null
  const t3 = typeof term3_amount === 'number' ? term3_amount : null
  const computedAmount = (t1 ?? 0) + (t2 ?? 0) + (t3 ?? 0)
  const inserts = (classRows || []).map((r) => ({ class: r.name, amount: computedAmount || (typeof amount === 'number' ? amount : 0), session: schoolSession, term1_amount: t1, term2_amount: t2, term3_amount: t3, created_by: teacherId }))
  if (inserts.length === 0) return NextResponse.json({ success: false, error: 'No matching classes found' }, { status: 400 })
  const { error } = await supabase.from('school_fees').upsert(inserts, { onConflict: 'class' })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
  const { id, amount, session: schoolSession, term1_amount, term2_amount, term3_amount } = body || {}
  if (!id || typeof schoolSession !== 'string') return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })

  const updatePayload: Record<string, unknown> = { session: schoolSession }
  if (typeof amount === 'number') updatePayload.amount = amount
  if (typeof term1_amount === 'number') updatePayload.term1_amount = term1_amount
  if (typeof term2_amount === 'number') updatePayload.term2_amount = term2_amount
  if (typeof term3_amount === 'number') updatePayload.term3_amount = term3_amount

  const { error } = await supabase.from('school_fees').update(updatePayload).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })

    const { error } = await supabase.from('school_fees').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 })
  }
}
