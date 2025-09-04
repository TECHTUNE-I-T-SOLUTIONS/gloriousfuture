"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { motion } from "framer-motion"
import Image from "next/image"

interface AnimatedHeaderProps {
  text: string
}

export default function AnimatedHeader({ text }: AnimatedHeaderProps) {
  const [pupilName, setPupilName] = useState("")
  const [profilePicture, setProfilePicture] = useState("/default-profile.png")
  const [uin, setUIN] = useState("")
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/pupils/details?self=1", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setPupilName(data.full_name)
        setProfilePicture(data.profile_picture || "/default-profile.png")
        setUIN(data.uin || "")
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    // fetch unread notifications count for pupil header and poll periodically
    let mounted = true
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/notifications', { credentials: 'include' })
        const body = await res.json().catch(() => ({}))
        if (!mounted) return
        const n = body && body.unread_count != null ? Number(body.unread_count) : 0
        if (!Number.isNaN(n) && n >= 0) setUnreadCount(n)
      } catch {
        // ignore network errors
      }
    }
    fetchCount()
    const id = setInterval(fetchCount, 15000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail
        if (detail && Array.isArray(detail.ids)) {
          setUnreadCount((c) => Math.max(0, c - detail.ids.length))
        }
      } catch {}
    }
    window.addEventListener('notifications-mark-read', handler)
    return () => window.removeEventListener('notifications-mark-read', handler)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full h-16 md:h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm z-50"
    >
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left Section - Logo and School Info */}
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="relative">
            <Image
              src="/logo.png"
              alt="School Logo"
              width={40}
              height={40}
              className="rounded-xl shadow-md md:w-12 md:h-12"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl opacity-20 blur-sm" />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">Glorious Future Academy</h1>
            <p className="text-xs md:text-sm text-slate-600 font-medium">{text}</p>
          </div>

          {/* Mobile - Show only school name */}
          <div className="sm:hidden">
            <h1 className="text-base font-bold text-slate-800">GFA</h1>
          </div>
        </motion.div>

        {/* Right Section - User Profile */}
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* User Info - Hidden on mobile */}
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{pupilName || "Student"}</p>
            {uin && <p className="text-xs text-slate-500 font-medium">UIN: {uin}</p>}
          </div>

          {/* Profile Picture */}
          <div className="relative">
            <Image
              src={profilePicture || "/placeholder.svg"}
              alt="Profile Picture"
              width={36}
              height={36}
              className="rounded-full border-2 border-white shadow-md md:w-10 md:h-10"
            />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full opacity-60 blur-sm" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full md:w-3.5 md:h-3.5" />
          </div>

            {/* Notifications Bell */}
            <button
              aria-label="Notifications"
              className="relative ml-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => {
                try {
                  window.dispatchEvent(new CustomEvent('pupil-set-active-page', { detail: { page: 'notifications' } }))
                } catch {
                  router.push('/pupils/pupil-dashboard/notifications')
                }
              }}
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </button>

          {/* Mobile Menu Button */}
          <button
            aria-label="Open navigation menu"
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => {
              // dispatch event so sidebar can open on mobile
              try {
                window.dispatchEvent(new CustomEvent("pupil-sidebar-toggle", { detail: { toggle: true } }))
              } catch {
                // ignore
              }
            }}
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </motion.div>
      </div>
    </motion.header>
  )
}
