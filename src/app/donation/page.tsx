'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Heart, ArrowLeft, Loader, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import CustomHeader from '@/components/CustomHeader'
import CustomFooter from '@/components/CustomFooter'

interface DonationFormData {
  fullName: string
  email: string
  phone: string
  amount: string
  donationType: 'one-time' | 'recurring'
  message: string
}

export default function DonationPage() {
  const [formData, setFormData] = useState<DonationFormData>({
    fullName: '',
    email: '',
    phone: '',
    amount: '',
    donationType: 'one-time',
    message: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process donation')
      }

      // Redirect to Paystack payment page
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl
      } else {
        setSuccessMessage('Donation processed successfully!')
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          amount: '',
          donationType: 'one-time',
          message: '',
        })
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'An error occurred'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <CustomHeader />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-blue-300 via-purple-600 to-blue-500 text-white py-12 sm:py-16 overflow-hidden"
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />

          <div className="mt-26 max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex items-center gap-3 mb-4 sm:mb-6 justify-center">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-8 h-8 text-red-300 fill-red-300 drop-shadow-lg" />
              </motion.div>
              <span className="text-indigo-100 font-semibold text-sm sm:text-base">Make A Difference Today</span>
            </div>

            <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
              Support Our Mission
            </h1>

            <p className="text-center text-indigo-50 text-base sm:text-lg mb-6 drop-shadow-md max-w-2xl leading-relaxed">
              Help us build a world-class educational facility at our new campus in Oro, Kwara State. Your generous donation directly impacts students&apos; futures.
            </p>

            {/* Quick stats */}
            <motion.div
              className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-indigo-400/50"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">📚</div>
                <p className="text-xs sm:text-sm text-indigo-100 mt-1">Learning Resources</p>
              </motion.div>
              <motion.div variants={itemVariants} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">🏗️</div>
                <p className="text-xs sm:text-sm text-indigo-100 mt-1">Infrastructure</p>
              </motion.div>
              <motion.div variants={itemVariants} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">🎓</div>
                <p className="text-xs sm:text-sm text-indigo-100 mt-1">Scholarships</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Back button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-6 sm:gap-8"
          >
            {/* Left side - Info Panel */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 sticky top-24 border border-indigo-100 dark:border-indigo-900/30">
                <div className="flex items-center justify-center w-full">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-5">
                        <Heart className="w-7 h-7 text-white fill-white" />
                    </div>
                </div>

                <h2 className="text-center text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                  Your Impact
                </h2>

                {/* Impact items */}
                <div className="space-y-5">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📚</span>
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-sm">Learning Resources</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Quality textbooks and digital tools</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700/50 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🏗️</span>
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-sm">Infrastructure</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Modern facilities & labs</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700/50 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🎓</span>
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-sm">Scholarships</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Supporting deserving students</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700/50 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🌟</span>
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-sm">Student Programs</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Extra-curricular activities</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campus Info */}
                <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700/50">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                    📍 New Campus Location
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    IBA transformer area, IBA village, Ijomu Road, Oro, Kwara State
                  </p>
                </div>

                {/* Security badge */}
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700/50 flex items-center gap-2">
                  <span className="text-lg">🔒</span>
                  <p className="text-xs text-green-700 dark:text-green-300 font-semibold">
                    Secure Paystack Payment
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right side - Form */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-10 border border-indigo-100 dark:border-indigo-900/30">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    Make Your Donation
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Fill in your details below. All information is safe and secure.
                  </p>
                </div>

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-l-4 border-green-500 dark:border-green-600 rounded-lg text-green-700 dark:text-green-300 flex items-start gap-3"
                  >
                    <Heart className="w-5 h-5 fill-green-500 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">{successMessage}</p>
                    </div>
                  </motion.div>
                )}

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border-l-4 border-red-500 dark:border-red-600 rounded-lg text-red-700 dark:text-red-300 flex items-start gap-3"
                  >
                    <span className="text-xl flex-shrink-0">⚠️</span>
                    <div>
                      <p className="font-semibold text-sm">{errorMessage}</p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2.5 flex items-center gap-2">
                      <span>👤 Full Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2.5 flex items-center gap-2">
                      <span>📧 Email Address</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">We&apos;ll send a confirmation receipt</p>
                  </motion.div>

                  {/* Phone */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2.5 flex items-center gap-2">
                      <span>📱 Phone Number</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+234 XXX XXX XXXX"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </motion.div>

                  {/* Amount */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2.5 flex items-center gap-2">
                      <span>💵 Donation Amount</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-600 dark:text-gray-400 text-lg">₦</span>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="1000"
                        placeholder="Enter amount in Naira"
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                      Minimum: ₦1,000 | No maximum limit
                    </p>
                  </motion.div>

                  {/* Donation Type */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2.5 flex items-center gap-2">
                      <span>Donation Type</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.donationType === 'one-time'
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 hover:border-indigo-300'
                      }`}>
                        <input
                          type="radio"
                          name="donationType"
                          value="one-time"
                          checked={formData.donationType === 'one-time'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="font-semibold text-sm text-gray-800 dark:text-white">One-time</span>
                      </label>
                      <label className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.donationType === 'recurring'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 hover:border-purple-300'
                      }`}>
                        <input
                          type="radio"
                          name="donationType"
                          value="recurring"
                          checked={formData.donationType === 'recurring'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="font-semibold text-sm text-gray-800 dark:text-white">Monthly</span>
                      </label>
                    </div>
                  </motion.div>

                  {/* Message */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2.5 flex items-center gap-2">
                      <span>💬 Message (Optional)</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Share why you're supporting us... (e.g., In memory of... or Supporting education...)"
                      rows={3}
                      maxLength={500}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 text-right">
                      {formData.message.length}/500
                    </p>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={itemVariants}>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-300 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-500 text-white font-bold py-3.5 px-6 rounded-lg transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-5 h-5 fill-white" />
                          <span>Donate Now</span>
                          <ArrowRight className="w-4 h-4 hidden sm:inline" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>

                  {/* Security & Privacy */}
                  <motion.div
                    variants={itemVariants}
                    className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0">🔒</span>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white mb-1">
                          Your donation is 100% secure
                        </p>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          Processed through Paystack with industry-leading encryption. No sensitive data is stored on our servers.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <CustomFooter />
    </div>
  )
}
