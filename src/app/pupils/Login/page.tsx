"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, User, Lock, GraduationCap, AlertCircle } from "lucide-react"
import CustomHeader from "@/components/CustomHeader"
import CustomFooter from "@/components/CustomFooter"

export default function PupilLoginPage() {
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
        if (res.ok) router.push("/pupils/pupil-dashboard")
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

    // Validate pupil UIN format
    const pupilPattern = /^GFA-P-\d{3,}$/i
    if (!pupilPattern.test(uin.trim())) {
      setAlert({ message: "Please enter a valid Pupil UIN (e.g. GFA-P-0123).", type: "warning" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/pupils/login", {
        method: "POST",
        body: JSON.stringify({ uin, password }),
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        // Verify session role after login
        const sessionRes = await fetch('/api/auth/session', { credentials: 'include' })
        if (!sessionRes.ok) {
          setAlert({ message: 'Login succeeded but session verification failed.', type: 'warning' })
          return
        }
        const sessionBody = await sessionRes.json().catch(() => ({}))
        const sessionUin = sessionBody?.session?.uin
        if (typeof sessionUin === 'string' && sessionUin.startsWith('GFA-P-')) {
          setAlert({ message: "Login successful!", type: "success" })
          setTimeout(() => router.push("/pupils/pupil-dashboard"), 800)
        } else if (typeof sessionUin === 'string' && sessionUin.startsWith('GFA-T-')) {
          // If teacher session accidentally present, force logout and ask user to login again
          await fetch('/api/auth/logout', { method: 'POST' })
          setAlert({ message: 'Detected teacher session. You have been logged out. Please login with pupil credentials.', type: 'error' })
        } else {
          setAlert({ message: 'Login succeeded but session role mismatch.', type: 'warning' })
        }
      } else {
        setAlert({ message: "Invalid UIN or Password", type: "error" })
      }
    } catch (err) {
      console.error(err)
      setAlert({ message: "Network error. Please try again.", type: "error" })
    }
    setLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-indigo-600/80 to-indigo-900 flex items-center justify-center p-4">
      <CustomHeader />
      {/* Alert */}
      {alert && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div
            className={`p-4 rounded-lg shadow-lg border flex items-center gap-3 ${
              alert.type === "error"
                ? "bg-destructive text-destructive-foreground border-destructive"
                : alert.type === "success"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : alert.type === "warning"
                    ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                    : "bg-blue-50 text-blue-800 border-blue-200"
            }`}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{alert.message}</p>
            <button onClick={() => setAlert(null)} className="ml-auto text-current hover:opacity-70">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-card p-6 rounded-xl shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Signing in...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="bg-stone-300/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground mb-2">Pupil Login</h1>
            <p className="text-gray-900">Access your learning dashboard</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="uin" className="text-sm font-medium text-card-foreground">
                Pupil ID (UIN)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="uin"
                  type="text"
                  value={uin}
                  onChange={(e) => setUIN(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                  placeholder="Enter your Pupil ID"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-card-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-12 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {/* Links */}
            <div className="space-y-3 text-center">
              <Link
                href="/pupils/forgotpassword"
                className="block text-sm text-gray-900 hover:text-primary transition-colors"
              >
                Forgot your password?
              </Link>
              <div className="text-sm text-gray-900">
                Don&apos;t have an account?{" "}
                <Link
                  href="/pupils/signup"
                  className="text-gray-900 hover:text-primary/80 font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-100 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Your information is secure and protected
          </p>
        </div>
      </div>
      </div>
      <CustomFooter />
    </>
  )
}
