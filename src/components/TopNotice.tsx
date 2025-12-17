'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

export default function TopNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white py-4 px-4 shadow-lg z-40 relative"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 flex-wrap">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex-shrink-0"
        >
          <MapPin className="w-5 h-5 text-yellow-300" />
        </motion.div>
        <p className="text-sm md:text-base font-semibold text-center">
          🎉 Exciting News! We&apos;re now at our beautiful new permanent site:
          <span className="block md:inline md:ml-2 font-bold text-yellow-200">
            IBA transformer area, IBA village, Ijomu Road, Oro, Kwara State
          </span>
        </p>
      </div>
    </motion.div>
  )
}
