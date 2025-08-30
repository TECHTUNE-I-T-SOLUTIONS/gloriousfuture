import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get('session')?.value
    if (!cookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const session = JSON.parse(cookie)
    const uin = session?.uin
  // role not required here; we use UIN to resolve identity
    if (typeof uin !== 'string') return NextResponse.json({ error: 'Invalid session' }, { status: 400 })

    // pagination params
    const url = new URL(req.url)
    const page = Number(url.searchParams.get('page') || '1')
    const per_page = Math.min(Number(url.searchParams.get('per_page') || '20'), 100)
    const offset = (Math.max(page, 1) - 1) * per_page

    // helper to return consistent response
    type NotificationRow = { id: string; type: string; payload: Record<string, unknown> | null; is_read: boolean; created_at: string }
    const buildResponse = (rows: NotificationRow[], total: number, unreadCount: number) => {
      return NextResponse.json({ notifications: rows || [], total: total || 0, page, per_page, unread_count: unreadCount || 0 })
    }

    // Teacher
    if (uin.startsWith('GFA-T-')) {
  const { data: t } = await supabase.from('teachers').select('id').eq('uin', uin).single()
  const teacherId = t?.id
      if (!teacherId) return NextResponse.json({ notifications: [], total: 0, unread_count: 0 })

      // fetch relevant notifications: broadcast (recipient_role IS NULL) OR recipient_role='teacher' with recipient_id null or matching teacher
  const { data, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .or(`recipient_role.is.null,recipient_role.eq.teacher`)
        .order('created_at', { ascending: false })
        .range(offset, offset + per_page - 1)

      // compute unread count filtered for teacher
  const { count: unreadCount } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .or(`recipient_role.is.null,recipient_role.eq.teacher`)
        .or(`recipient_id.is.null,recipient_id.eq.${teacherId}`)
        .eq('is_read', false)

      return buildResponse(data || [], count || 0, unreadCount || 0)
    }

    // Pupil
    if (uin.startsWith('GFA-P-')) {
      const { data: p } = await supabase.from('pupils').select('id, class').eq('uin', uin).single()
      const pupilId = p?.id
      const pupilClass = p?.class
      if (!pupilId) return NextResponse.json({ notifications: [], total: 0, unread_count: 0 })

      // fetch notifications for pupil more precisely by combining targeted queries
      const results: NotificationRow[] = []

      // 1) broadcast (recipient_role IS NULL)
      const { data: b } = await supabase.from('notifications').select('*').is('recipient_role', null).order('created_at', { ascending: false })
      if (b) results.push(...(b as NotificationRow[]))

      // 2) notifications explicitly for this pupil
      const { data: rp } = await supabase.from('notifications').select('*').eq('recipient_role', 'pupil').eq('recipient_id', pupilId).order('created_at', { ascending: false })
      if (rp) results.push(...(rp as NotificationRow[]))

      // 3) class-specific notifications
      if (pupilClass) {
        const { data: rc } = await supabase.from('notifications').select('*').eq('class_id', pupilClass).order('created_at', { ascending: false })
        if (rc) results.push(...(rc as NotificationRow[]))
      }

      // 4) role='pupil' with recipient_id IS NULL (class-level or broadcast style entries)
      const { data: rpn } = await supabase.from('notifications').select('*').eq('recipient_role', 'pupil').is('recipient_id', null).order('created_at', { ascending: false })
      if (rpn) results.push(...(rpn as NotificationRow[]))

      // dedupe by id and sort
      const map = new Map<string, NotificationRow>()
      results.forEach((r) => map.set(r.id, r))
      const deduped = Array.from(map.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      const totalCount = deduped.length
      const pageSlice = deduped.slice(offset, offset + per_page)

      // unread count for this pupil
      const { count: unreadCount } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .or(`recipient_role.is.null,recipient_role.eq.pupil`)
        .or(`recipient_id.is.null,recipient_id.eq.${pupilId},class_id.eq.${pupilClass}`)
        .eq('is_read', false)

      return buildResponse(pageSlice || [], totalCount || 0, unreadCount || 0)
    }

    return NextResponse.json({ notifications: [], total: 0, unread_count: 0 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { mark_read_ids } = body || {}
    if (!Array.isArray(mark_read_ids)) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

    // Mark notifications read
    const { error } = await supabase.from('notifications').update({ is_read: true }).in('id', mark_read_ids)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
