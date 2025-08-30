"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  BookOpen,
  Calendar,
  FileText,
  User,
  Laptop,
  ClipboardCheck,
  LogOut,
  Edit,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  setActivePage: (page: string) => void
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
  activePage?: string
}

export default function TeacherSidebar({ setActivePage, isSidebarOpen, setIsSidebarOpen, activePage = "dashboard" }: SidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  // Sidebar is now controlled by parent via setActivePage; parent should pass current active page state via calls
  // We'll derive active state by asking parent to set it; keep no internal activePage state to avoid desync
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [setIsSidebarOpen])

  const handlePageChange = (page: string) => {
    setActivePage(page)
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/teacher/logout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        router.push("/teacher")
      } else {
        console.error("Logout failed")
      }
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const sidebarItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "assignments", icon: BookOpen, label: "Assignments" },
    { id: "timetable", icon: Calendar, label: "Timetable" },
    { id: "exam-results", icon: FileText, label: "Results" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "cbt-exams", icon: Laptop, label: "CBT Exams" },
    { id: "tests", icon: ClipboardCheck, label: "Tests & Quizzes" },
    { id: "create-blog", icon: Edit, label: "Create Blog" },
  { id: "create-alert", icon: Bell, label: "Create Alert" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? "280px" : "80px",
          x: isSidebarOpen || window.innerWidth >= 768 ? 0 : -280,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-20 h-[calc(100vh-5rem)] bg-sidebar border-r border-sidebar-border shadow-lg z-50 flex flex-col"
      >
        {/* Toggle Button */}
        <div className="p-4 border-b border-sidebar-border">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            {isSidebarOpen ? (
              <>
                <ChevronLeft className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isOpen={isSidebarOpen}
              isActive={activePage === item.id}
              onClick={() => handlePageChange(item.id)}
            />
          ))}

          {/* Logout Button */}
          <SidebarItem
            icon={LogOut}
            label="Logout"
            isOpen={isSidebarOpen}
            isActive={false}
            onClick={() => setShowLogoutModal(true)}
            variant="danger"
          />
        </nav>

        {/* Footer */}
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 border-t border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/60 text-center">Teacher Dashboard v2.0</p>
          </motion.div>
        )}
      </motion.aside>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-popover border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl"
            >
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                  <LogOut className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Confirm Logout</h3>
                <p className="text-gray-500">Are you sure you want to log out of your account?</p>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 py-2 px-4 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-2 px-4 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  isOpen: boolean
  isActive: boolean
  onClick: () => void
  variant?: "default" | "danger"
}

function SidebarItem({ icon: Icon, label, isOpen, isActive, onClick, variant = "default" }: SidebarItemProps) {
  const baseClasses = "w-full flex items-center p-3 rounded-lg transition-all duration-200 relative group"
  const variantClasses = {
    default: isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
      : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
    danger: "text-destructive hover:bg-destructive/10 hover:text-destructive",
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />

      <AnimatePresence>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="ml-3 font-medium text-sm"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {/* Tooltip for collapsed state */}
      {!isOpen && (
        <>
          {/* overlay to capture hover/focus across the whole button */}
          <span
        className="absolute inset-0"
        aria-hidden="true"
        onMouseEnter={(e) => {
          // remove any existing tooltip first
          const removeTooltip = () => {
            const old = document.querySelector('div[data-sidebar-tooltip="1"]')
            if (!old) return
            const cleanup = (old as HTMLElement & { __sidebarTooltipCleanup?: () => void }).__sidebarTooltipCleanup
            if (cleanup) {
          window.removeEventListener("scroll", cleanup, true)
          window.removeEventListener("resize", cleanup)
            }
            old.remove()
          }

          removeTooltip()

          const target = e.currentTarget as HTMLElement
          const rect = target.getBoundingClientRect()
          const tip = document.createElement("div")
          tip.setAttribute("data-sidebar-tooltip", "1")
          tip.textContent = label

          Object.assign(tip.style, {
            position: "fixed",
            top: `${rect.top + rect.height / 2}px`, // center vertically
            left: `${rect.right + 8}px`, // gap to the right
            transform: "translateY(-50%)",
            background: "var(--popover)", // uses design tokens if available
            color: "var(--popover-foreground)",
            padding: "6px 8px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            fontSize: "12px",
            whiteSpace: "nowrap",
            zIndex: "9999",
            pointerEvents: "none",
            transition: "opacity 120ms ease",
            opacity: "1",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          })

          // cleanup on scroll/resize (use capture for scroll so it fires reliably)
          const cleanup = () => removeTooltip()
          ;(tip as HTMLElement & { __sidebarTooltipCleanup?: () => void }).__sidebarTooltipCleanup = cleanup
          window.addEventListener("scroll", cleanup, true)
          window.addEventListener("resize", cleanup)

          document.body.appendChild(tip)
        }}
        onMouseLeave={() => {
          const old = document.querySelector('div[data-sidebar-tooltip="1"]')
          if (!old) return
          const cleanup = (old as HTMLElement & { __sidebarTooltipCleanup?: () => void }).__sidebarTooltipCleanup
          if (cleanup) {
            window.removeEventListener("scroll", cleanup, true)
            window.removeEventListener("resize", cleanup)
          }
          old.remove()
        }}
        onFocus={(e) => {
          // mimic hover behavior for keyboard focus
          const target = e.currentTarget as HTMLElement
          const rect = target.getBoundingClientRect()
          const removeTooltip = () => {
            const old = document.querySelector('div[data-sidebar-tooltip="1"]')
            if (!old) return
            const cleanup = (old as HTMLElement & { __sidebarTooltipCleanup?: () => void }).__sidebarTooltipCleanup
            if (cleanup) {
          window.removeEventListener("scroll", cleanup, true)
          window.removeEventListener("resize", cleanup)
            }
            old.remove()
          }
          removeTooltip()

          const tip = document.createElement("div")
          tip.setAttribute("data-sidebar-tooltip", "1")
          tip.textContent = label
          Object.assign(tip.style, {
            position: "fixed",
            top: `${rect.top + rect.height / 2}px`,
            left: `${rect.right + 8}px`,
            transform: "translateY(-50%)",
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            padding: "6px 8px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            fontSize: "12px",
            whiteSpace: "nowrap",
            zIndex: "9999",
            pointerEvents: "none",
            opacity: "1",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          })
          const cleanup = () => removeTooltip()
          ;(tip as HTMLElement & { __sidebarTooltipCleanup?: () => void }).__sidebarTooltipCleanup = cleanup
          window.addEventListener("scroll", cleanup, true)
          window.addEventListener("resize", cleanup)
          document.body.appendChild(tip)
        }}
        onBlur={() => {
          const old = document.querySelector('div[data-sidebar-tooltip="1"]')
          if (!old) return
          const cleanup = (old as HTMLElement & { __sidebarTooltipCleanup?: () => void }).__sidebarTooltipCleanup
          if (cleanup) {
            window.removeEventListener("scroll", cleanup, true)
            window.removeEventListener("resize", cleanup)
          }
          old.remove()
        }}
          />
        </>
      )}

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute right-2 w-2 h-2 bg-sidebar-accent-foreground rounded-full"
        />
      )}
    </motion.button>
  )
}
