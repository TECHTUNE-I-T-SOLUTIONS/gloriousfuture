"use client"

import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import { motion } from "framer-motion"
import { User, Settings, LogOut, Menu } from "lucide-react"
import Image from "next/image"
import NotificationsDropdown from "../NotificationsDropdown"
import { useRouter } from "next/navigation"
import ConfirmModal from "@/components/ConfirmModal"
export default function TeacherHeader({
  text,
  setIsSidebarOpen,
}: {
  text: string
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>
}) {
  const [teacherName, setTeacherName] = useState("Loading...")
  const [profilePicture, setProfilePicture] = useState("/default-profile.png")
  const [uin, setUIN] = useState("N/A")
  const [showDropdown, setShowDropdown] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const router = useRouter()
  const [, setUnreadCount] = useState<number>(0) // only using the setter; omit unreadCount to avoid unused var

  useEffect(() => {
  const fetchSessionAndTeacherDetails = async () => {
      try {
  const sessionRes = await fetch("/api/auth/session", { credentials: "include" })
        if (!sessionRes.ok) throw new Error("Unauthorized session")

        const sessionData = await sessionRes.json()
        if (!sessionData.session || !sessionData.session.uin) {
          throw new Error("Session missing UIN")
        }

  const teacherRes = await fetch(`/api/teacher/details?uin=${sessionData.session.uin}`, { credentials: "include" })
        if (!teacherRes.ok) throw new Error("Failed to fetch teacher details")

        const teacherData = await teacherRes.json()
        if (teacherData.success) {
          setTeacherName(teacherData.name || "Teacher")
          setUIN(teacherData.uin || "N/A")
          setProfilePicture(teacherData.profile_picture || "/default-profile.png")
        }
        // fetch unread notifications count (no-store) and tolerate non-OK
        try {
          const notifRes = await fetch('/api/notifications', { credentials: 'include', cache: 'no-store' })
          if (notifRes.ok) {
            const nb = await notifRes.json().catch(() => ({}))
            setUnreadCount(nb.unread_count || 0)
          } else {
            setUnreadCount(0)
          }
        } catch {
          setUnreadCount(0)
        }
      } catch (error) {
        console.error("Error fetching teacher details:", error)
      }
    }

    fetchSessionAndTeacherDetails()
    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchSessionAndTeacherDetails()
    }
    document.addEventListener('visibilitychange', onVisibility)
    // listen for optimistic mark-read events to update unread count immediately
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail
        if (detail && Array.isArray(detail.ids)) {
          setUnreadCount((c) => Math.max(0, c - detail.ids.length))
        }
  } catch { }
    }
    window.addEventListener('notifications-mark-read', handler)
    return () => {
      window.removeEventListener('notifications-mark-read', handler)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 h-20 bg-indigo-800 border-b border-border shadow-sm z-50"
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left Section - Logo and Title */}
        <div className="flex items-center space-x-4">
          {/* Hamburger for mobile */}
          <button
            aria-label="Toggle sidebar"
            onClick={() => setIsSidebarOpen((s) => !s)}
            className="mr-2 p-2 md:hidden rounded-md hover:bg-muted transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-700 rounded-full flex items-center justify-center">
              <Image src="/logo.png" alt="School Logo" width={32} height={32} className="rounded-full" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground text-orange-400">Glorious Future Academy</h1>
              <p className="text-sm text-stone-100">{text}</p>
            </div>
          </motion.div>
        </div>

        {/* Right Section - User Info and Actions */}
        <div className="flex items-center space-x-4">
          <NotificationsDropdown />

          {/* User Profile Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-orange-400">{teacherName}</p>
                <p className="text-xs text-stone-100">UIN: {uin}</p>
              </div>
              <div className="relative">
                <Image
                  src={profilePicture || "/placeholder.svg"}
                  alt="Profile Picture"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-primary/20 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>
              </div>
            </motion.button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg py-2 z-50"
              >
                <div className="px-4 py-3 border-b border-border">
                  <p className="font-semibold text-foreground">{teacherName}</p>
                  <p className="text-sm text-stone-800">{uin}</p>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      router.push("/teacher/teacher-dashboard/Profile")
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      router.push("/teacher/preferences")
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Preferences</span>
                  </button>
                  <hr className="my-2 border-border" />
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />}

      {/* Logout confirmation modal */}
      <ConfirmModal
        open={showLogoutModal}
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        busy={false}
        onConfirm={async () => {
          try {
            const res = await fetch("/api/teacher/logout", { method: "POST", credentials: "include" })
            if (res.ok) {
              setShowLogoutModal(false)
              // redirect to teacher landing (login) page
              router.push("/teacher")
            } else {
              console.error("Logout failed")
            }
          } catch (err) {
            console.error("Error during logout", err)
          }
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </motion.header>
  )
}
