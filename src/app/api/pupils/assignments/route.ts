import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parse } from 'cookie'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(req: Request) {
  try {
    // resolve pupil from session cookie
    const cookieHeader = req.headers.get('cookie') || ''
    const cookies = parse(cookieHeader)
    if (!cookies.session) return NextResponse.json([], { status: 200 })
    let session = null
    try { session = JSON.parse(cookies.session) } catch { return NextResponse.json([], { status: 200 }) }
    const lookups: Array<[string, string]> = []
    if (session?.id) lookups.push(['id', String(session.id)])
    if (session?.uin) lookups.push(['uin', String(session.uin)])
    if (session?.email) lookups.push(['email', String(session.email)])

    let pupil: Record<string, unknown> | null = null
    for (const [col, val] of lookups) {
      const { data: p, error } = await supabase.from('pupils').select('id, full_name, class').eq(col, val).maybeSingle()
      if (!error && p) { pupil = p as Record<string, unknown>; break }
    }
    if (!pupil) return NextResponse.json([], { status: 200 })

    // pupil.class is a text like 'Primary One' — find class id from classes table
    const { data: cls } = await supabase.from('classes').select('id').eq('name', pupil.class).maybeSingle()
    if (!cls || !cls.id) return NextResponse.json([], { status: 200 })

    const { data, error } = await supabase.from('assignments').select('*').eq('class_id', cls.id)
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
