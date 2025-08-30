"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, Lock, AlertCircle, CheckCircle } from "lucide-react"
import CustomHeader from "@/components/CustomHeader"
import CustomFooter from "@/components/CustomFooter"

export default function TeacherForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async () => {
    if (!email.trim()) {
      setAlert({ message: "Please enter your email address.", type: "warning" })
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setAlert({ message: "Please enter a valid email address.", type: "error" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/teacher/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setEmailSent(true)
        setAlert({ message: "Reset instructions sent if that account exists", type: "success" })
      } else {
        setAlert({ message: "Unable to send reset instructions", type: "error" })
      }
    } catch {
      setAlert({ message: "Network error. Please try again.", type: "error" })
    }
    setLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  return (
    <>
      <CustomHeader />
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-indigo-600/80 to-indigo-900 flex items-center justify-center p-4">
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
            <p className="mt-2 text-sm text-gray-500">Sending reset instructions...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground mb-2">Reset Password</h1>
            <p className="text-gray-500">
              {emailSent ? "Check your email for reset instructions" : "Enter your email to reset your password"}
            </p>
          </div>

          {!emailSent ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-card-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg shadow-md hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Sending..." : "Send Reset Instructions"}
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-card-foreground">Instructions Sent!</h3>
                  <p className="text-gray-500">
                    If an account with that email exists, you&apos;ll receive password reset instructions shortly.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                <p className="text-sm text-gray-500">
                  Didn&apos;t receive the email? Check your spam folder or try again with a different email address.
                </p>
              </div>

              <button
                onClick={() => {
                  setEmailSent(false)
                  setEmail("")
                  setAlert(null)
                }}
                className="w-full py-3 bg-secondary/20 text-secondary-foreground font-semibold rounded-lg border border-secondary/30 hover:bg-secondary/30 transition-colors"
              >
                Try Different Email
              </button>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/teacher/login"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
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
