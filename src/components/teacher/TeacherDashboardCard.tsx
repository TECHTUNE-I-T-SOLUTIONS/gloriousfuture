"use client"

import { motion } from "framer-motion"
import type { JSX } from "react" // Import JSX to fix the undeclared variable error

interface TeacherDashboardCardProps {
  title: string
  onClick: () => void
  icon: JSX.Element
  description?: string
  count?: number
}

export default function TeacherDashboardCard({ title, onClick, icon, description, count }: TeacherDashboardCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -4,
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="p-2 teacher-card cursor-pointer group relative overflow-hidden"
    >
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        {/* Icon Container */}
        <motion.div
          whileHover={{ rotate: 5 }}
          className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300"
        >
          <div className="text-2xl">{icon}</div>
        </motion.div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          {description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}
        </div>

        {/* Count Badge */}
        {count !== undefined && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
          >
            {count > 99 ? "99+" : count}
          </motion.div>
        )}

        {/* Hover Arrow */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute bottom-4 right-4 text-primary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>

      {/* Subtle Border Animation */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300" />
    </motion.div>
  )
}
