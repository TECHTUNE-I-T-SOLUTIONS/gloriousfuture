"use client"
import React, { useState, useEffect } from 'react'
import DonationModal from '@/components/DonationModal'
// importing this module triggers installation of the canvas sanitizer in the browser
import '../lib/canvasColorSanitizerClient'

export default function ClientStartup() {
  const [showDonationModal, setShowDonationModal] = useState(false)

  useEffect(() => {
    // Check if user has seen the modal today
    const lastModalDate = localStorage.getItem('donationModalLastShown')
    const today = new Date().toDateString()

    // Show modal after 8 seconds (after homepage content has loaded)
    // Only show once per day
    if (lastModalDate !== today) {
      const timer = setTimeout(() => {
        setShowDonationModal(true)
        localStorage.setItem('donationModalLastShown', today)
      }, 8000)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <React.Fragment>
      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
      />
    </React.Fragment>
  )
}
