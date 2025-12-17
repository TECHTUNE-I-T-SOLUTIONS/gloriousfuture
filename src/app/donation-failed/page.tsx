'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import CustomHeader from '@/components/CustomHeader'
import CustomFooter from '@/components/CustomFooter'

function DonationFailedContent() {
  const searchParams = useSearchParams()
  const reference = searchParams?.get('reference')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto px-4 py-20 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-12 text-center"
      >
        {/* Error Icon */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-6 flex justify-center"
        >
          <XCircle className="w-20 h-20 text-red-500" />
        </motion.div>

        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Payment Failed
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
          Unfortunately, your donation could not be processed
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          {reference && (
            <>
              Transaction Reference: <span className="font-mono font-semibold">{reference}</span>
            </>
          )}
        </p>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-bold text-red-800 dark:text-red-300 mb-3">
            What you can do:
          </h3>
          <ul className="text-sm text-red-700 dark:text-red-200 space-y-2">
            <li>• Check that your payment details are correct</li>
            <li>• Ensure you have sufficient funds</li>
            <li>• Try a different payment method</li>
            <li>• Contact your bank if the issue persists</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              href="/donation"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-lg"
            >
              Try Again
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-8 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </motion.div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-8">
          Need help? Contact us at support@gloriousfutureacademy.com
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function DonationFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
      <CustomHeader />
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
        <DonationFailedContent />
      </Suspense>
      <CustomFooter />
    </div>
  )
}
