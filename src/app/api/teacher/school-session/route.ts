import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const all = url.searchParams.get('all')
    // if caller asked for all sessions return them (including inactive)
    if (all && (all === '1' || all.toLowerCase() === 'true')) {
      const { data, error } = await supabase.from('school_session').select('*').order('created_at', { ascending: false })
      if (error) {
        console.error('failed to fetch sessions', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }
      return NextResponse.json({ success: true, data })
    }

    // prefer the active session; fallback to most recently created
    const { data: active } = await supabase.from('school_session').select('*').eq('active', true).limit(1).maybeSingle()
    if (active) return NextResponse.json({ success: true, data: active })

    const { data: latest } = await supabase.from('school_session').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle()
    return NextResponse.json({ success: true, data: latest })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookie = req.cookies.get('session')?.value
    if (!cookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const session = JSON.parse(cookie)
    const uin = session?.uin
    if (typeof uin !== 'string' || !uin.startsWith('GFA-T-')) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const { session: newSession } = await req.json()
    if (!newSession || typeof newSession !== 'string') return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })

    // deactivate all existing sessions first
    const { error: deactErr } = await supabase.from('school_session').update({ active: false }).neq('session', newSession)
    if (deactErr) {
      console.error('failed to deactivate sessions', deactErr)
      return NextResponse.json({ success: false, error: 'failed to deactivate sessions' }, { status: 500 })
    }

    // upsert this session as active. requires a UNIQUE constraint on session column.
    const { error: upsertErr } = await supabase.from('school_session').upsert({ session: newSession, active: true, created_by: session?.id || null }, { onConflict: 'session' })
    if (upsertErr) {
      console.error('failed to upsert session', upsertErr)
      return NextResponse.json({ success: false, error: upsertErr.message || 'failed to upsert session' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 })
  }
}
