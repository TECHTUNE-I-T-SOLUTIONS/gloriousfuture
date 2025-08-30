"use client"

import { motion } from "framer-motion"
import type { JSX } from "react" // Declare JSX import

export default function DashboardCard({
  title,
  icon,
  color,
}: {
  title: string
  icon: JSX.Element
  color: string
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -4,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl 
        transition-all duration-300 cursor-pointer group
        ${color} border border-white/20 backdrop-blur-sm
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6 flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl text-slate-700 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-300 truncate">
            {title}
          </h3>
          <p className="text-sm text-slate-600 opacity-80">Click to access</p>
        </div>

        <div className="flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
            <svg
              className="w-3 h-3 text-slate-700 group-hover:translate-x-0.5 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
