import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (id) {
      const { data, error } = await supabase.from('payments').select('*').eq('id', id).single()
      if (error) throw error
      return NextResponse.json({ success: true, data })
    }
    const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(200)
    if (error) throw error
    return NextResponse.json({ success: true, data })
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
