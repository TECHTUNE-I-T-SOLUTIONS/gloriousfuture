import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const idsParam = url.searchParams.get('ids')
    if (!idsParam) return NextResponse.json({ success: false, error: 'ids query param required' }, { status: 400 })
    const ids = idsParam.split(',').map((s) => s.trim()).filter(Boolean)
    if (ids.length === 0) return NextResponse.json({ success: false, error: 'no ids provided' }, { status: 400 })

  const { data, error } = await supabase.from('pupils').select('id, full_name, profile_picture, uin').in('id', ids)
    if (error) {
      console.error('failed to fetch pupils by ids', error)
      return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 })
    }
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: (err as Error).message || String(err) }, { status: 500 })
  }
}
