import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id') || url.pathname.split('/').pop()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const { data, error } = await supabase.from('payment_dispute_replies').select('*').eq('dispute_id', id).order('created_at', { ascending: true })
    if (error) throw error
    return NextResponse.json({ replies: data || [] })
  } catch (err) {
    console.error('dispute replies GET error', err)
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dispute_id, author_role, author_id, message } = body || {}
    if (!dispute_id || !author_role || !message) return NextResponse.json({ error: 'dispute_id, author_role and message required' }, { status: 400 })
    const insert = { dispute_id, author_role, author_id: author_id || null, message }
    const { data, error } = await supabase.from('payment_dispute_replies').insert(insert).select('*').maybeSingle()
    if (error) throw error
    // rely on DB triggers to notify pupil/teachers on dispute updates if needed
    return NextResponse.json({ success: true, reply: data })
  } catch (err) {
    console.error('dispute replies POST error', err)
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, reply_message, author_role, author_id } = body || {}
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const updates: Record<string, unknown> = {}
    if (status) updates.status = status
    const { error } = await supabase.from('payment_disputes').update(updates).eq('id', id)
    if (error) throw error
    // optionally add a reply when teacher responds
    let reply = null
    if (reply_message && author_role) {
      const { data: r, error: rerr } = await supabase.from('payment_dispute_replies').insert({ dispute_id: id, author_role, author_id: author_id || null, message: reply_message }).select('*').maybeSingle()
      if (rerr) console.error('failed to insert dispute reply', rerr)
      else reply = r
    }
    return NextResponse.json({ success: true, reply })
  } catch (err) {
    console.error('disputes [id] PATCH error', err)
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 })
  }
}
