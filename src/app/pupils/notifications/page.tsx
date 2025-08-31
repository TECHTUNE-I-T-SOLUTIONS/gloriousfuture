"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PupilNotificationsPageRedirect() {
  const router = useRouter()

  useEffect(() => {
    try {
      window.dispatchEvent(new CustomEvent('pupil-set-active-page', { detail: { page: 'notifications' } }))
    } catch {}
    // navigate to dashboard root which will render the notifications in-dashboard
    router.replace('/pupils/pupil-dashboard')
  }, [router])

  return null
}
