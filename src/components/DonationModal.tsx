'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { X, Heart, Gift, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  useEffect(() => {
    if (!isOpen) return
  }, [isOpen])

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 12 },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal - Compact Version */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-indigo-100 dark:border-indigo-900">
              {/* Compact Header */}
              <div className="relative h-40 sm:h-48 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
                {/* Animated background blobs */}
                <motion.div
                  className="absolute -top-16 -left-16 w-32 h-32 bg-indigo-400/30 rounded-full blur-2xl"
                  animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-16 -right-16 w-32 h-32 bg-pink-400/30 rounded-full blur-2xl"
                  animate={{ x: [0, -20, 0], y: [0, -15, 0] }}
                  transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                />

                {/* Close button */}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-3 right-3 z-10 p-1.5 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm transition"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>

                {/* Header content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-2"
                  >
                    <Heart className="w-12 h-12 text-red-300 fill-red-300 mx-auto drop-shadow-lg" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg"
                  >
                    Make a Difference!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xs sm:text-sm text-indigo-100 drop-shadow-md mt-1"
                  >
                    Support our students&apos; future
                  </motion.p>
                </div>
              </div>

              {/* Compact Content */}
              <motion.div
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
                className="p-4 sm:p-5 space-y-3"
              >
                {/* Campus highlight - condensed */}
                <motion.div
                  variants={itemVariants}
                  className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700"
                >
                  <p className="text-xs sm:text-sm text-gray-800 dark:text-white leading-tight">
                    <span className="font-bold block mb-1">🏫 New Campus</span>
                    IBA transformer area, Oro, Kwara State
                  </p>
                </motion.div>

                {/* Quick benefits - compact */}
                <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-700">
                    <div className="text-xl mb-0.5">📚</div>
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">Learning</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-700">
                    <div className="text-xl mb-0.5">🏗️</div>
                    <p className="text-xs font-semibold text-purple-900 dark:text-purple-300">Infra</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-700">
                    <div className="text-xl mb-0.5">🌟</div>
                    <p className="text-xs font-semibold text-pink-900 dark:text-pink-300">Future</p>
                  </div>
                </motion.div>

                {/* Main message - concise */}
                <motion.p
                  variants={itemVariants}
                  className="text-center text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-medium leading-tight"
                >
                  Help us build world-class facilities for our students!
                </motion.p>

                {/* CTA Buttons - stacked on mobile */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-2 pt-2"
                >
                  <Link
                    href="/donation"
                    onClick={onClose}
                    className="flex-1 relative group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg transition-all shadow-lg flex items-center justify-center gap-1 text-sm"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Donate</span>
                      <ArrowRight className="w-3 h-3 hidden sm:inline" />
                    </motion.div>
                  </Link>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all text-sm"
                  >
                    Later
                  </motion.button>
                </motion.div>

                {/* Trust badge */}
                <motion.p
                  variants={itemVariants}
                  className="text-xs text-gray-500 dark:text-gray-400 text-center"
                >
                  🔒 Secure via Paystack
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
