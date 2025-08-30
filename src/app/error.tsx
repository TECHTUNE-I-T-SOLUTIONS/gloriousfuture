"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error('Unhandled error:', error)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Image src="/logo.png" alt="School Logo" width={64} height={64} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
        <p className="text-sm text-slate-600 mb-4">Don&apos;t panic — our team has been notified and we&apos;re already working on it.</p>
        <div className="text-left text-xs text-slate-500 mb-4 p-3 bg-slate-50 rounded">
          <strong>Error:</strong> {String(error?.message || 'Unknown error')}
        <div className="flex justify-center gap-3">
          <button onClick={() => reset()} className="px-4 py-2 bg-blue-600 text-white rounded">Try again</button>
          <Link href="/" className="px-4 py-2 border rounded text-slate-700">Go home</Link>
        </div>
        </div>
      </div>
    </div>
  )
}
