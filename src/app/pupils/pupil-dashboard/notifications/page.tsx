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

export default function PupilDashboardNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [page, setPage] = useState(1)
  const [perPage] = useState(20)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // inform parent Sidebar to set active item
    try {
      window.dispatchEvent(new CustomEvent('pupil-set-active-page', { detail: { page: 'notifications' } }))
    } catch {}

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
    try {
      const res = await fetch('/api/notifications', { method: 'POST', body: JSON.stringify({ mark_read_ids: ids }), headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
      if (res.ok) {
        setNotifications((prev) => prev.map(n => ids.includes(n.id) ? { ...n, is_read: true } : n))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const onNotificationClick = async (n: Notification) => {
    if (!n.is_read) await markRead([n.id])
    const payload = n.payload || {}
    if (typeof payload['assignment_id'] === 'string' || typeof payload['assignment_id'] === 'number') return window.location.href = `/pupils/assignments/${payload['assignment_id']}`
    if (typeof payload['message_id'] === 'string' || typeof payload['message_id'] === 'number') return window.location.href = `/pupils/messages/${payload['message_id']}`
    if (typeof payload['blog_id'] === 'string' || typeof payload['blog_id'] === 'number') return window.location.href = `/pupils/blog/${payload['blog_id']}`
  }

  const payloadMessage = (p?: Payload) => {
    if (!p) return ''
    const keys = ['message', 'note', 'text'] as const
    for (const k of keys) {
      const val = p[k]
      if (typeof val === 'string') return val
    }
    return JSON.stringify(p)
  }

  return (
    <div className="space-y-6">
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
    </div>
  )
}
