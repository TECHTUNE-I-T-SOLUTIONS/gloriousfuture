"use client"

import React, { useEffect, useState } from 'react'
import AnimatedHeader from '@/components/AnimatedHeader'
import Sidebar from '@/components/Sidebar'

export default function PupilNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [sidebarWidth, setSidebarWidth] = useState<number>(260)
  const [activePage, setActivePage] = useState('notifications')

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications', { credentials: 'include' })
        if (res.ok) {
          const body = await res.json()
          setNotifications(body.notifications || [])
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchNotifications()
  }, [])

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

  function handleSidebarToggle(isOpen: boolean) {
    setSidebarWidth(isOpen ? 260 : 70)
  }

  return (
    <div className="min-h-screen">
      <AnimatedHeader text="Notifications" />
      <Sidebar setActivePage={() => {}} onToggle={handleSidebarToggle} />

      <main className={`pt-20 ${sidebarWidth === 260 ? 'ml-[260px]' : 'ml-[70px]'} p-6 max-w-5xl`}>
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <div className="space-y-3">
          {notifications.length === 0 && <p className="text-sm text-muted">No notifications</p>}
          {notifications.map((n) => (
            <div key={n.id} className={`p-4 rounded-lg border ${n.is_read ? 'bg-white/70' : 'bg-yellow-50'} flex justify-between items-start`}>
              <div>
                <p className="font-medium">{n.type}</p>
                <p className="text-sm text-muted mt-1">{n.payload?.message || JSON.stringify(n.payload)}</p>
                <p className="text-xs text-muted mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                {!n.is_read && <button onClick={() => markRead([n.id])} className="px-3 py-1 bg-green-500 text-white rounded">Mark Read</button>}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
