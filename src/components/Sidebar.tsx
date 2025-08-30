"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ConfirmModal from "@/components/ConfirmModal"
import {
  FaHome,
  FaBook,
  FaBell,
  FaCalendarAlt,
  FaFileAlt,
  FaUser,
  FaLaptopCode,
  FaClipboardCheck,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"

type SidebarProps = {
  setActivePage: (page: string) => void
  onToggle?: (isOpen: boolean) => void
}

export default function Sidebar({ setActivePage, onToggle }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [activePage, setActivePageState] = useState("dashboard")
  const [isMobile, setIsMobile] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setIsOpen(false)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
  const handler = () => {
      // event from header to toggle sidebar on mobile
      if (!isMobile) return
      // toggle or open
      setIsOpen(true)
    }
    window.addEventListener("pupil-sidebar-toggle", handler as EventListener)
    return () => window.removeEventListener("pupil-sidebar-toggle", handler as EventListener)
  }, [isMobile])

  useEffect(() => {
    const setPage = (e: Event) => {
      const detail = (e as CustomEvent)?.detail
      if (detail && typeof detail.page === "string") {
        setActivePageState(detail.page)
        if (typeof setActivePage === "function") setActivePage(detail.page)
        if (isMobile) setIsOpen(false)
      }
    }
    window.addEventListener("pupil-set-active-page", setPage as EventListener)
    return () => window.removeEventListener("pupil-set-active-page", setPage as EventListener)
  }, [isMobile, setActivePage])

  // hide teacher-only menu items when a pupil session is present
  const [isPupilSession, setIsPupilSession] = useState(false)
  useEffect(() => {
    try {
      const cookie = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('session='))
      if (!cookie) return
      const raw = decodeURIComponent(cookie.split('=')[1] || '')
      // session cookie may be a JSON string or encoded JSON; try parse
      let parsed: unknown = raw
      try { parsed = JSON.parse(raw) } catch { /* ignore parse errors */ }
      // session may be { uin: 'GFA-P-000', ... } or a JSON string inside
      let uin: string | undefined
      if (parsed && typeof parsed === 'object' && 'uin' in (parsed as Record<string, unknown>)) {
        const maybe = (parsed as Record<string, unknown>)['uin']
        if (typeof maybe === 'string') uin = maybe
      } else if (typeof parsed === 'string') {
        uin = parsed
      }
      if (typeof uin === 'string' && uin.startsWith('GFA-P-')) setIsPupilSession(true)
    } catch (err) {
      console.warn('Could not determine session role from cookie', err)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && typeof onToggle === "function") {
      onToggle(isOpen)
    }
  }, [isOpen, onToggle])

  const handlePageChange = (page: string) => {
    setActivePageState(page)
    setActivePage(page)
    if (isMobile) setIsOpen(false)
  }

  const menuItems = [
    { id: "dashboard", icon: FaHome, label: "Dashboard", color: "text-blue-600" },
    { id: "assignments", icon: FaBook, label: "Assignments", color: "text-green-600" },
  { id: "notifications", icon: FaBell, label: "Notifications", color: "text-pink-600" },
    { id: "timetable", icon: FaCalendarAlt, label: "Timetable", color: "text-yellow-600" },
    { id: "exam-results", icon: FaFileAlt, label: "Exam Results", color: "text-purple-600" },
    { id: "profile", icon: FaUser, label: "Profile", color: "text-gray-600" },
    // teacher-only items: hide when a pupil is logged in
    ...(isPupilSession ? [] : [
      { id: "cbt-exams", icon: FaLaptopCode, label: "CBT Exams", color: "text-red-600" },
      { id: "tests", icon: FaClipboardCheck, label: "Tests & Quizzes", color: "text-orange-600" },
      { id: "payments", icon: FaFileAlt, label: "Payments", color: "text-teal-600" },
    ]),
  ]

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          width: isOpen ? (isMobile ? "280px" : "260px") : "70px",
          x: isMobile && !isOpen ? "-100%" : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed left-0 top-16 md:top-20 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]
          bg-white/95 backdrop-blur-md border-r border-slate-200/50 shadow-lg
          flex flex-col z-50 overflow-hidden
          ${isMobile ? "w-70" : ""}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200/50">
          {isOpen && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-semibold text-slate-800"
            >
              Navigation
            </motion.h2>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 ml-auto"
          >
            {isOpen ? (
              <FaChevronLeft className="w-4 h-4 text-slate-600" />
            ) : (
              <FaChevronRight className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={<item.icon />}
              label={item.label}
              isOpen={isOpen}
              isActive={activePage === item.id}
              color={item.color}
              onClick={() => handlePageChange(item.id)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200/50">
          <button
            onClick={() => setShowLogoutModal(true)}
            aria-label="Logout"
            className={`
            flex items-center w-full p-3 rounded-xl
            hover:bg-red-50 hover:text-red-600 
            text-slate-600 transition-all duration-200
            group
            ${!isOpen ? "justify-center" : "space-x-3"}
          `}
          >
            <FaSignOutAlt className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {isOpen && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium">
                Logout
              </motion.span>
            )}
          </button>
        </div>

        <ConfirmModal
          open={showLogoutModal}
          title="Confirm Logout"
          description="Are you sure you want to log out?"
          confirmText="Yes, Logout"
          cancelText="Cancel"
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={async () => {
            try {
              await fetch("/api/pupils/logout", {
                method: "POST",
                credentials: "include",
              })
              setShowLogoutModal(false)
              router.push("/pupils")
            } catch (err) {
              console.error("Logout failed", err)
              setShowLogoutModal(false)
              router.push("/pupils")
            }
          }}
        />
      </motion.div>
    </>
  )
}

function SidebarItem({
  icon,
  label,
  isOpen,
  isActive,
  color,
  onClick,
}: {
  icon: React.JSX.Element
  label: string
  isOpen: boolean
  isActive: boolean
  color: string
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-center w-full p-3 rounded-xl transition-all duration-200
        ${!isOpen ? "justify-center" : "space-x-3"}
        ${
          isActive
            ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
            : "hover:bg-slate-50 text-slate-600 hover:text-slate-800"
        }
        group relative overflow-hidden
      `}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      <div
        className={`
        w-5 h-5 flex-shrink-0 transition-all duration-200
        ${isActive ? color : "text-slate-500"}
        group-hover:scale-110
      `}
      >
        {icon}
      </div>

      {isOpen && (
        <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="font-medium truncate">
          {label}
        </motion.span>
      )}

      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
        >
          {label}
        </motion.div>
      )}
    </motion.button>
  )
}
