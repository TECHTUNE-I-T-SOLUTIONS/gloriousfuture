"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FiMenu, FiX, FiHome, FiUsers, FiBookOpen, FiUser, FiInfo, FiPhone, FiMail } from "react-icons/fi"

const CustomHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [sessionRoles, setSessionRoles] = useState<{ pupil?: boolean; teacher?: boolean }>({})
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // check session once to toggle CTA
    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        // API may return { uin, session, user }
        const uin = data?.uin || data?.session?.uin || data?.user?.uin || data?.user?.id
        if (typeof uin === 'string') {
          if (uin.startsWith('GFA-P-')) setSessionRoles({ pupil: true })
          if (uin.startsWith('GFA-T-')) setSessionRoles({ teacher: true })
        }
      })
      .catch(() => {})
  }, [])

  const navLinks = [
    { href: "/", label: "Home", icon: <FiHome className="w-4 h-4" /> },
    { href: "/pupils", label: "Pupils", icon: <FiUsers className="w-4 h-4" /> },
    { href: "/teacher", label: "Teachers", icon: <FiUser className="w-4 h-4" /> },
    { href: "/blog", label: "Blog", icon: <FiBookOpen className="w-4 h-4" /> },
    { href: "/about", label: "About", icon: <FiInfo className="w-4 h-4" /> },
  ]

  const contactLinks = [
    { href: "tel:+2348035770623", label: "Call", icon: <FiPhone className="w-4 h-4 text-indigo-900" /> },
    { href: "mailto:christgloriousfuture@gmail.com", label: "Email", icon: <FiMail className="w-4 h-4 text-indigo-900" /> },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-gradient from-indigo-300/95 backdrop-blur-md shadow-lg border-b border-border"
        : "bg-indigo-300/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16 lg:h-20">
        <motion.div
        className="flex items-center space-x-3"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        >
        <div className="relative">
          <Image
          src="/apple-touch-icon.png"
          alt="Glorious Future Academy Logo"
          width={48}
          height={48}
          className="rounded-lg shadow-md"
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/90 to-indigo-900/90 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg lg:text-xl font-bold text-primary leading-tight">
          Glorious Future
          <span className="block text-sm lg:text-base font-medium text-orange-900">Academy</span>
          </h1>
        </div>
        </motion.div>

        <nav className="hidden lg:flex items-center space-x-1">
        {navLinks.map(({ href, label, icon }, index) => (
          <motion.div
          key={href}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          >
          <Link
            href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            pathname === href
              ? "bg-indigo-500 text-primary-foreground shadow-md"
              : "text-foreground hover:bg-accent/10 hover:text-accent"
            }`}
          >
            {icon}
            <span>{label}</span>
          </Link>
          </motion.div>
        ))}
        </nav>

        <div className="flex items-center space-x-2">
        {/* Contact links for desktop */}
        <div className="hidden xl:flex items-center space-x-2">
          {contactLinks.map(({ href, label, icon }) => (
          <motion.a
            key={href}
            href={href}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-indigo-900 hover:text-accent transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {icon}
            <span className="hidden 2xl:inline">{label}</span>
          </motion.a>
          ))}
        </div>

        {/* CTA Button: Enroll or Dashboard when session exists */}
        <motion.div className="hidden md:block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {!sessionRoles.pupil && !sessionRoles.teacher ? (
            <Link
              href="/pupils"
              className="px-4 py-2 bg-indigo-700 text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200 animate-glow"
            >
              Enroll Now
            </Link>
          ) : sessionRoles.pupil && !sessionRoles.teacher ? (
            <Link
              href="/pupils/pupil-dashboard"
              className="px-4 py-2 bg-indigo-700 text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200"
            >
              Dashboard
            </Link>
          ) : sessionRoles.teacher && !sessionRoles.pupil ? (
            <Link
              href="/teacher/teacher-dashboard"
              className="px-4 py-2 bg-indigo-700 text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200"
            >
              Dashboard
            </Link>
          ) : (
            // both present: show small dropdown
            <div className="relative inline-block">
              <button className="px-4 py-2 bg-indigo-700 text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200">
                Dashboard ▾
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 z-50">
                <Link href="/pupils/pupil-dashboard" className="block px-4 py-2 text-sm hover:bg-slate-100">
                  Pupil Dashboard
                </Link>
                <Link href="/teacher/teacher-dashboard" className="block px-4 py-2 text-sm hover:bg-slate-100">
                  Teacher Dashboard
                </Link>
              </div>
            </div>
          )}
        </motion.div>

        {/* Mobile menu button */}
        <motion.button
          className="lg:hidden p-2 rounded-lg text-foreground hover:bg-accent/10 transition-colors duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle Menu"
        >
          <AnimatePresence mode="wait">
          {menuOpen ? (
            <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            >
            <FiX className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
            key="menu"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            >
            <FiMenu className="w-6 h-6" />
            </motion.div>
          )}
          </AnimatePresence>
        </motion.button>
        </div>
      </div>
      </div>

      <AnimatePresence>
      {menuOpen && (
        <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="lg:hidden bg-indigo-400/60 backdrop-blur-md border-t border-border"
        >
        <div className="px-4 py-6 space-y-4">
          {/* Navigation Links */}
          <div className="space-y-2">
          {navLinks.map(({ href, label, icon }, index) => (
            <motion.div
            key={href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            >
            <Link
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
              pathname === href
                ? "bg-indigo-500 text-primary-foreground font-bold shadow-md"
                : "text-foreground font-bold hover:bg-accent/90 hover:text-indigo-800"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {icon}
              <span>{label}</span>
            </Link>
            </motion.div>
          ))}
          </div>

          {/* Contact Links */}
          <div className="pt-4 border-t border-border">
          <div className="flex justify-center space-x-4">
            {contactLinks.map(({ href, label, icon }) => (
            <motion.a
              key={href}
              href={href}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-800 hover:text-indigo-900 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {icon}
              <span>{label}</span>
            </motion.a>
            ))}
          </div>
          </div>

          {/* CTA Button */}
          <motion.div
          className="pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          >
          <Link
            href="/pupils"
            className="block w-full px-4 py-3 bg-indigo-700 text-white rounded-lg font-medium text-center shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Enroll Now
          </Link>
          </motion.div>
        </div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.header>
  )
}

export default CustomHeader
