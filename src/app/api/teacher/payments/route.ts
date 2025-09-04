import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
  // local types
  type PupilRow = { id?: string; full_name?: string | null; profile_picture?: string | null }
    if (id) {
      const includePupil = url.searchParams.get('includePupil')
      // fetch the payment row first
      const { data: rowData, error: rowErr } = await supabase.from('payments').select('*').eq('id', id).limit(1).maybeSingle()
      if (rowErr) throw rowErr
  const row = rowData as Record<string, unknown> | null
      if (includePupil) {
        // prefer pupil_id if available, otherwise try user_id
        const pupilId = row?.pupil_id || row?.user_id || null
        if (pupilId) {
          const { data: pupil, error: pupilError } = await supabase.from('pupils').select('id, full_name, profile_picture').eq('id', pupilId).limit(1).maybeSingle()
          if (pupilError) throw pupilError
          const pupilRec = pupil as PupilRow | null
          const pupil_name = pupilRec?.full_name || null
          const profile_picture = pupilRec?.profile_picture || (row && (row.profile_picture as string | null)) || null
          const out = { ...(row || {}), pupil_name, profile_picture }
          return NextResponse.json({ success: true, data: out })
        }
        // fallback: return row with any existing profile_picture
        return NextResponse.json({ success: true, data: { ...(row || {}), pupil_name: null, profile_picture: row?.profile_picture || null } })
      }
      return NextResponse.json({ success: true, data: row })
    }

    // filtering / pagination for teacher listing
  const page = Number(url.searchParams.get('page') || '1')
  const perPage = Math.min(200, Number(url.searchParams.get('perPage') || '10'))
  const qParam = url.searchParams.get('q')
    const cls = url.searchParams.get('class')
    const status = url.searchParams.get('status')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')
    const sort = url.searchParams.get('sort') || 'created_at'
    const order = url.searchParams.get('order') === 'asc' ? { ascending: true } : { ascending: false }

    const includePupilList = url.searchParams.get('includePupil')
    // request total count with exact counting
    let base = includePupilList
      ? supabase.from('payments').select('*, pupils:pupil_id (id, full_name, profile_picture)', { count: 'exact' })
      : supabase.from('payments').select('*', { count: 'exact' })

    // Apply search across common fields
    if (qParam && qParam.trim()) {
      const q = qParam.trim()
      // build OR filters; include pupils.full_name when joined
      const ors = [
        `payment_reference.ilike.%${q}%`,
        `class.ilike.%${q}%`,
        `uin.ilike.%${q}%`,
        `email.ilike.%${q}%`,
      ]
      if (includePupilList) {
        ors.push(`pupils.full_name.ilike.%${q}%`)
      }
      base = base.or(ors.join(','))
    }

    if (cls) base = base.eq('class', cls)
    if (status) base = base.eq('status', status)
    if (from) base = base.gte('created_at', from)
    if (to) base = base.lte('created_at', to)
    base = base.order(sort, order).range((page - 1) * perPage, page * perPage - 1)
    const { data, error, count } = await base
    if (error) throw error
    // if we joined pupils, map each row to include pupil_name/profile_picture for ease of consumption
    const total = typeof count === 'number' ? count : Array.isArray(data) ? data.length : 0
    if (includePupilList && Array.isArray(data)) {
      const mapped = (data as Record<string, unknown>[]).map((r) => {
        const pupil = (r as Record<string, unknown>)['pupils'] as Record<string, unknown> | null
        const pupil_name = pupil ? (pupil['full_name'] as string | null) : null
        const profile_picture = pupil ? (pupil['profile_picture'] as string | null) : ((r as Record<string, unknown>)['profile_picture'] as string | null)
        return { ...r, pupil_name, profile_picture }
      })
      return NextResponse.json({ success: true, data: mapped, meta: { page, perPage, total } })
    }
    return NextResponse.json({ success: true, data, meta: { page, perPage, total } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: (err as Error).message })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status } = body || {}
    if (!id || typeof status !== 'string') return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    const { error } = await supabase.from('payments').update({ status }).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pupilId, amount, session, terms, class: className, note } = body || {}
    if (!pupilId || !amount || !session) return NextResponse.json({ success: false, error: 'pupilId, amount and session required' }, { status: 400 })

    // fetch pupil to populate details
  type PupilSimple = { id?: string; full_name?: string; email?: string; uin?: string; class?: string; user_id?: string | null; profile_picture?: string | null }
  const { data: p, error: pe } = await supabase.from('pupils').select('id, full_name, email, uin, class, user_id, profile_picture').eq('id', pupilId).limit(1).maybeSingle()
  if (pe) throw pe
  const pupil = (p as PupilSimple) || null

    const insert = {
      pupil_id: pupil?.id || pupilId,
      user_id: pupil?.user_id ?? null,
      email: pupil?.email ?? null,
  class: (className || pupil?.class) ?? null,
      uin: pupil?.uin ?? null,
      profile_picture: pupil?.profile_picture ?? null,
      amount: Number(amount),
      status: 'paid',
      payment_method: 'cash',
      payment_reference: `cash-${Date.now()}`,
      terms: Array.isArray(terms) ? terms : (terms ? [terms] : null),
      session,
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      note: note ?? null,
    }

    const { data, error } = await supabase.from('payments').insert(insert).select('*').maybeSingle()
    if (error) return NextResponse.json({ success: false, error }, { status: 500 })
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('teacher payments POST error', err)
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 })
  }
}
