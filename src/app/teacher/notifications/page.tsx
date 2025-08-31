"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TeacherNotificationsPageRedirect() {
  const router = useRouter()

  useEffect(() => {
    try {
      window.dispatchEvent(new CustomEvent('teacher-set-active-page', { detail: { page: 'notifications' } }))
    } catch {}
    // navigate to dashboard root which will render the notifications in-dashboard
    router.replace('/teacher/teacher-dashboard')
  }, [router])

  return null
}
