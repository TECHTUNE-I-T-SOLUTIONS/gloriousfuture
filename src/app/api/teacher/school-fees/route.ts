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

    const { class_ids, amount, session: schoolSession } = await req.json()
    if (!Array.isArray(class_ids) || typeof amount !== 'number' || typeof schoolSession !== 'string') return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })

    // resolve teacher id
    const { data: t } = await supabase.from('teachers').select('id').eq('uin', uin).single()
    const teacherId = t?.id || null

  // resolve class ids to class names (school_fees.class is varchar(50) per schema)
  const classRes = await supabase.from('classes').select('id, name').in('id', class_ids)
  const classRows = classRes.data as { id: string; name: string }[] | null
  const classErr = classRes.error
  if (classErr) throw classErr
  const inserts = (classRows || []).map((r) => ({ class: r.name, amount, session: schoolSession, created_by: teacherId }))
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
    const { id, amount, session: schoolSession } = body || {}
    if (!id || typeof amount !== 'number' || typeof schoolSession !== 'string') return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })

    const { error } = await supabase.from('school_fees').update({ amount, session: schoolSession }).eq('id', id)
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
