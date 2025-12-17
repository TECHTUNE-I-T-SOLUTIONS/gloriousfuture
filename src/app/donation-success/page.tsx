'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Home } from 'lucide-react'
import Link from 'next/link'
import CustomHeader from '@/components/CustomHeader'
import CustomFooter from '@/components/CustomFooter'

function DonationSuccessContent() {
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
        className="mt-16 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-12 text-center"
      >
        {/* Success Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-6 flex justify-center"
        >
          <CheckCircle className="w-20 h-20 text-green-500" />
        </motion.div>

        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Thank You! 🎉
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
          Your donation has been received successfully
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          {reference && (
            <>
              Transaction Reference: <span className="font-mono font-semibold">{reference}</span>
            </>
          )}
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-bold text-green-800 dark:text-green-300 mb-3">
            What happens next?
          </h3>
          <ul className="text-sm text-green-700 dark:text-green-200 space-y-2">
            <li>✓ A confirmation email will be sent to you shortly</li>
            <li>✓ Your donation will support our new campus facilities</li>
            <li>✓ You&apos;ll receive periodic updates on facility improvements</li>
            <li>✓ Thank you for being part of our journey!</li>
          </ul>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-lg"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </motion.div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-8">
          For any questions, please contact us at christgloriousfutureacademy@gmail.com
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function DonationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800">
      <CustomHeader />
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
        <DonationSuccessContent />
      </Suspense>
      <CustomFooter />
    </div>
  )
}
