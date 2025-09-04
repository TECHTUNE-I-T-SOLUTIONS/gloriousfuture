"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, User, Lock, LogIn } from "lucide-react"
import CustomAlert from "@/components/CustomAlert"
import CustomLoader from "@/components/CustomLoader"
import ParticlesBg from "@/components/ParticlesBg"

export default function TeacherLogin() {
  const [uin, setUIN] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => {
        if (!mounted) return
        if (!res.ok) return
        res.json().then((body) => {
          const uin = body?.uin || body?.user?.uin || body?.user?.id
          if (typeof uin === 'string' && uin.startsWith('GFA-T-')) router.push("/teacher/teacher-dashboard")
        }).catch(() => {})
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [router])

  const handleLogin = async () => {
    if (!uin.trim() || !password.trim()) {
      setAlert({ message: "Please fill in all fields.", type: "warning" })
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/teacher/login", {
        method: "POST",
        body: JSON.stringify({ uin, password }),
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        const body = await res.json().catch(() => ({}))
        const returnedUin = body?.uin || body?.user?.uin
        if (typeof returnedUin === 'string' && returnedUin.startsWith('GFA-T-')) {
          setAlert({ message: "Login Successful!", type: "success" })
          setTimeout(() => {
            router.push("/teacher/teacher-dashboard")
          }, 800)
        } else {
          setAlert({ message: "Login succeeded but account is not a teacher.", type: "warning" })
        }
      } else {
        setAlert({ message: "Invalid UIN or Password.", type: "error" })
      }
    } catch (error) {
      console.error(error)
      setAlert({ message: "Network error. Please try again.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4">
      <ParticlesBg />
      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="p-6 rounded-lg bg-transparent">
            <CustomLoader />
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-teal-50/50 rounded-3xl" />
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full blur-xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-full blur-xl" />

          <div className="relative z-10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <LogIn className="w-8 h-8 text-black" />
              </motion.div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Teacher Login</h1>
              <p className="text-sky-900">Access your teaching dashboard</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="uin" className="text-sm font-medium text-foreground">Unique Identification Number (UIN)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input id="uin" type="text" value={uin} onChange={(e) => setUIN(e.target.value)} onKeyPress={handleKeyPress} className="peer w-full p-4 border-2 border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 placeholder-transparent" placeholder="Enter your UIN" autoComplete="username" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={handleKeyPress} className="peer w-full p-4 border-2 border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 placeholder-transparent" placeholder="Enter your password" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleLogin} disabled={loading} className="w-full py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "Signing In..." : "Sign In"}</motion.button>

              <div className="text-center space-y-2">
                <button onClick={() => router.push('/teacher/Forgotpassword')} className="text-sm text-slate-500 hover:text-slate-700 hover:underline transition-colors">Forgot your password?</button>
                <div className="text-sm text-slate-600">Don&apos;t have an account? <button onClick={() => router.push('/teacher/Signup')} className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">Sign up here</button></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
