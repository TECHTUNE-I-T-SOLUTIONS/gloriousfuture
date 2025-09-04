import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GET /api/teacher/pupils?page=1&perPage=20&search=foo
export async function GET(req: Request) {
  const url = new URL(req.url)
  const page = Number(url.searchParams.get('page') || '1')
  const perPage = Number(url.searchParams.get('perPage') || '20')
  const search = url.searchParams.get('search') || ''
  const offset = (page - 1) * perPage

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  try {
    // build base query (pupils has full_name). Avoid using SQL aliasing inside the select string
    // because the PostgREST selector can be sensitive to spacing/formatting; instead select
    // the raw columns and map to `name` in JS below.
    let q = supabase.from('pupils').select('id,full_name,profile_picture,uin,email,created_at')
    if (search) {
      const like = `%${search}%`
      // search against full_name, uin, email
      q = supabase.from('pupils').select('id,full_name,profile_picture,uin,email,created_at').or(`full_name.ilike.${like},uin.ilike.${like},email.ilike.${like}`)
    }
    const { data: rows, error } = await q.range(offset, offset + perPage - 1)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    // best-effort total count: run a count query
    const countRes = await supabase.from('pupils').select('id', { count: 'exact', head: false })
    const total = (countRes && typeof (countRes.count) === 'number') ? countRes.count : (Array.isArray(rows) ? rows.length : 0)
  // normalize rows to include `name` for backwards-compat
  const normalized = (rows || []).map((r: Record<string, unknown>) => ({ ...r, name: (r.full_name as string) || '' }))
  return NextResponse.json({ data: normalized, page, perPage, total })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 })
  }
}
