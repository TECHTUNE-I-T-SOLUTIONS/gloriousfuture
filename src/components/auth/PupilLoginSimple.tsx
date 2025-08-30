/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CustomAlert from "@/components/CustomAlert"
import CustomLoader from "@/components/CustomLoader"
import ParticlesBg from "@/components/ParticlesBg"

export default function PupilLoginSimple() {
  const [uin, setUIN] = useState("")
  const [password, setPassword] = useState("")
  const [alert, setAlert] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => { if (!mounted) return; if (res.ok) router.push('/pupils/pupil-dashboard') })
      .catch(() => {})
    return () => { mounted = false }
  }, [router])

  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/pupils/login', { method: 'POST', body: JSON.stringify({ uin, password }), headers: { 'Content-Type': 'application/json' } })
      if (res.ok) router.push('/pupils/pupil-dashboard')
      else setAlert({ message: 'Invalid credentials', type: 'error' })
    } catch (err) { setAlert({ message: 'Network error', type: 'error' }) }
    setLoading(false)
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4">
      <ParticlesBg />
      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      {loading && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"><div className="p-6 rounded-lg bg-transparent"><CustomLoader/></div></div>)}
      <div className="relative w-full max-w-md z-10">
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 overflow-hidden">
          <h1 className="text-2xl font-bold mb-4">Pupil Login</h1>
          <input value={uin} onChange={(e) => setUIN(e.target.value)} placeholder="UIN" className="w-full p-3 border rounded mb-3" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3 border rounded mb-3" />
          <button onClick={handleLogin} className="w-full py-3 bg-blue-600 text-white rounded">Sign in</button>
        </div>
      </div>
    </div>
  )
}
