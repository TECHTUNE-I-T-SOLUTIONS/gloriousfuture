"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, User, Lock, BookOpen, AlertCircle } from "lucide-react"
import CustomHeader from "@/components/CustomHeader"
import CustomFooter from "@/components/CustomFooter"

export default function TeacherLoginPage() {
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
        res
          .json()
          .then((body) => {
            const uin = body?.uin || body?.user?.uin || body?.user?.id
            if (typeof uin === "string" && uin.startsWith("GFA-T-")) {
              router.push("/teacher/teacher-dashboard")
            }
          })
          .catch(() => {})
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
        if (typeof returnedUin === "string" && returnedUin.startsWith("GFA-T-")) {
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
    <>
    <CustomHeader />
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
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
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground mb-2">Teacher Login</h1>
            <p className="text-gray-500">Access your teaching dashboard</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="uin" className="text-sm font-medium text-card-foreground">
                Teacher ID (UIN)
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
                  placeholder="Enter your Teacher ID"
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
                href="/teacher/forgotpassword"
                className="block text-sm text-gray-500 hover:text-primary transition-colors"
              >
                Forgot your password?
              </Link>
              <div className="text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/teacher/signup"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
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
