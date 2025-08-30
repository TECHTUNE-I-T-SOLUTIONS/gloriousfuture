import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-pink-50 p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Image src="/logo.png" alt="School Logo" width={64} height={64} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Page not found</h1>
        <div className="flex justify-center gap-3">
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded">Return home</Link>
          <Link href="/" className="px-4 py-2 border rounded text-slate-700">Report issue</Link>
        </div>
      </div>
    </div>
  )
}
