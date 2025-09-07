"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"

type Notification = {
  id: string
  type: string
  payload: Record<string, unknown> | null
  is_read: boolean
  created_at: string
}

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications?page=1&per_page=10', { credentials: 'include', cache: 'no-store' })
      if (!res.ok) throw new Error('failed')
      const body = await res.json()
      setItems(body.notifications || [])
      setUnread(body.unread_count || 0)
    } catch (err) {
      console.error('failed to load notifications', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const onVisibility = () => { if (document.visibilityState === 'visible') fetchNotifications() }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const markRead = async (ids: string[]) => {
    try {
      const res = await fetch('/api/notifications', { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mark_read_ids: ids }) })
      if (!res.ok) throw new Error('failed to mark')
      // optimistic UI
      setItems((prev) => prev.map((it) => (ids.includes(it.id) ? { ...it, is_read: true } : it)))
      setUnread((u) => Math.max(0, u - ids.length))
      // notify other components
      window.dispatchEvent(new CustomEvent('notifications-mark-read', { detail: { ids } }))
    } catch (err) {
      console.error(err)
    }
  }

  const payloadToString = (p: Record<string, unknown> | null) => {
    if (!p) return ''
    if (typeof p === 'object') {
      const obj = p as Record<string, unknown>
      // Prefer a human-friendly summary if present
      const summary = obj['summary']
      if (typeof summary === 'string' && summary.trim()) return summary
      const title = obj['title']
      if (typeof title === 'string' && title.trim()) return title
      // Common fallbacks
      const testId = obj['test_id']
      if (typeof testId === 'string') return `Test: ${testId}`
      const assignmentTitle = obj['assignment_title']
      if (typeof assignmentTitle === 'string') return assignmentTitle
      const fullName = obj['full_name']
      if (typeof fullName === 'string') return fullName
      const pupilName = obj['pupil_name']
      if (typeof pupilName === 'string') return pupilName
      // Pick the first string-ish value we can find
      const vals = Object.values(obj).filter((v) => typeof v === 'string') as string[]
      if (vals.length) return vals[0].slice(0, 200)
      // Last resort — small JSON preview
      try { return JSON.stringify(obj).slice(0, 200) } catch { return '' }
    }
    return String(p)
  }

  const prettifyType = (t: string | undefined) => {
    if (!t) return ''
    return t.replace(/[_\.]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }


  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) fetchNotifications() }}
        className="relative p-2 text-black hover:text-foreground transition-colors rounded-lg hover:bg-muted"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && <span className="absolute -top-2 -right-2 min-w-[18px] h-4 px-1 bg-destructive text-white text-xs rounded-full flex items-center justify-center">{unread}</span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-auto bg-popover border border-border rounded-lg shadow-lg py-2 z-50">
          <div className="px-3 py-2 flex items-center justify-between border-b border-border">
            <strong>Notifications</strong>
            <div className="space-x-2">
              <button className="text-sm text-black" onClick={() => markRead(items.filter(i => !i.is_read).map(i => i.id))}>
                Mark all read
              </button>
            </div>
          </div>
          <div>
            {loading && <div className="p-3 text-sm text-black">Loading...</div>}
            {!loading && items.length === 0 && <div className="p-3 text-sm">No notifications</div>}
            {items.map((n) => (
              <div key={n.id} className={`px-3 py-2 border-b border-border ${n.is_read ? 'bg-background' : 'bg-surface'}`}>
                <div className="flex items-start justify-between">
                  <div className="text-sm">
                    <div className="font-medium">{prettifyType(n.type)}</div>
                    <div className="text-xs text-black">{payloadToString(n.payload)}</div>
                    <div className="text-xs text-muted">{new Date(n.created_at).toLocaleString()}</div>
                  </div>
                  {!n.is_read && (
                    <button
                      className="text-xs text-primary ml-3"
                      onClick={(e) => { e.stopPropagation(); markRead([n.id]) }}
                    >
                      Mark
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
