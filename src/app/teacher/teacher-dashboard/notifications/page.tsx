"use client"

import React, { useEffect, useState } from 'react'

type Payload = { [k: string]: string | number | boolean | null | undefined | Record<string, unknown> }
type Notification = {
  id: string
  type: string
  payload?: Payload
  is_read: boolean
  created_at: string
}

export default function TeacherDashboardNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  // no local activePage needed; parent dashboard controls active page
  const [page, setPage] = useState(1)
  const [perPage] = useState(20)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // notify parent sidebar about active page via global event
    try { window.dispatchEvent(new CustomEvent('teacher-set-active-page', { detail: 'notifications' })) } catch {}
    const fetchNotifications = async (p = 1) => {
      try {
        const res = await fetch(`/api/notifications?page=${p}&per_page=${perPage}`, { credentials: 'include' })
        if (res.ok) {
          const body = await res.json()
          if (p === 1) setNotifications(body.notifications || [])
          else setNotifications((prev) => [...prev, ...(body.notifications || [])])
          setTotal(body.total || 0)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchNotifications(page)
  }, [page, perPage])

  const markRead = async (ids: string[]) => {
    // optimistic UI: mark locally and notify header
    setNotifications((prev) => prev.map(n => ids.includes(n.id) ? { ...n, is_read: true } : n))
    try {
      // notify header to decrement unread count optimistically
      try { window.dispatchEvent(new CustomEvent('notifications-mark-read', { detail: { ids } })) } catch {}

      const res = await fetch('/api/notifications', { method: 'POST', body: JSON.stringify({ mark_read_ids: ids }), headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
      if (!res.ok) {
        // revert on failure by refetching page
        const body = await res.json().catch(() => ({}))
        console.error('Failed to mark read', body)
        // refetch notifications to reconcile
        setNotifications([])
        const r = await fetch(`/api/notifications?page=1&per_page=20`, { credentials: 'include' })
        if (r.ok) {
          const b = await r.json()
          setNotifications(b.notifications || [])
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const onNotificationClick = async (n: Notification) => {
    // mark as read then navigate based on payload
  if (!n.is_read) await markRead([n.id])
    // simple routing logic: payload may include type-specific ids/paths
    const payload = n.payload || {}
    if (payload.assignment_id) return window.location.href = `/teacher/assignments/${payload.assignment_id}`
    if (payload.message_id) return window.location.href = `/teacher/messages/${payload.message_id}`
    if (payload.blog_id) return window.location.href = `/teacher/blog/${payload.blog_id}`
    // default: stay on notifications
  }

  const payloadMessage = (p?: Record<string, unknown>) => {
    if (!p) return ''
    const maybe = p as Payload
    const keys = ['message', 'note', 'text'] as const
    for (const k of keys) {
      const val = maybe[k]
      if (typeof val === 'string') return val
    }
    return JSON.stringify(p)
  }

  return (
    <main className="space-y-3">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <div className="space-y-3">
          {notifications.length === 0 && <p className="text-sm text-muted">No notifications</p>}
          {notifications.map((n) => (
            <div key={n.id} onClick={() => onNotificationClick(n)} className={`cursor-pointer p-4 rounded-lg border ${n.is_read ? 'bg-white/70' : 'bg-yellow-50'} flex justify-between items-start`}>
              <div>
                <p className="font-medium">{n.type}</p>
                <p className="text-sm text-muted mt-1">{payloadMessage(n.payload)}</p>
                <p className="text-xs text-muted mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                {!n.is_read && <button onClick={(e) => { e.stopPropagation(); markRead([n.id]) }} className="px-3 py-1 bg-green-500 text-white rounded">Mark Read</button>}
              </div>
            </div>
          ))}
          {notifications.length < total && (
            <div className="mt-4 text-center">
              <button
                onClick={async () => {
                  const next = page + 1
                  setPage(next)
                  try {
                    const res = await fetch(`/api/notifications?page=${next}&per_page=${perPage}`, { credentials: 'include' })
                    if (res.ok) {
                      const b = await res.json()
                      setNotifications((prev) => [...prev, ...(b.notifications || [])])
                      setTotal(b.total || 0)
                    }
                  } catch (err) {
                    console.error(err)
                  }
                }}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </main>
  )
}
