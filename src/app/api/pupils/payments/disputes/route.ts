import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { payment_id, pupil_id, uin, reason, details } = body || {}
    if (!payment_id || (!pupil_id && !uin) || !reason) return NextResponse.json({ error: 'payment_id, pupil_id/uin and reason required' }, { status: 400 })

    // insert dispute record
    const disputeRow = {
      payment_id,
      pupil_id: pupil_id || null,
      uin: uin || null,
      reason: String(reason),
      details: details ? String(details) : null,
      status: 'open',
    }
    const { data, error } = await supabase.from('payment_disputes').insert(disputeRow).select('*').maybeSingle()
    if (error) {
      console.error('disputes insert error', error)
      return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
    }

  // notifications are created by DB triggers (migration), return the dispute row
  return NextResponse.json({ dispute: data })
  } catch (err: unknown) {
    console.error('disputes POST error', err)
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const uin = searchParams.get('uin')
    const payment_id = searchParams.get('payment_id')
    const pupil_id = searchParams.get('pupil_id')

    let query = supabase.from('payment_disputes').select('*')
    if (payment_id) query = query.eq('payment_id', payment_id)
    if (uin) query = query.eq('uin', uin)
    if (pupil_id) query = query.eq('pupil_id', pupil_id)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
    return NextResponse.json({ disputes: data || [] })
  } catch (err: unknown) {
    console.error('disputes GET error', err)
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 })
  }
}
