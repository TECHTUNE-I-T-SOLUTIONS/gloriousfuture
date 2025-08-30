"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  User,
  Mail,
  Lock,
  BookOpen,
  Calendar,
  Upload,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Copy,
  AlertCircle,
} from "lucide-react"
import CustomHeader from "@/components/CustomHeader"
import CustomFooter from "@/components/CustomFooter"

export default function TeacherSignupPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    class_taught: "",
    years_of_experience: "",
    uin: "",
    profile_picture: null as File | null,
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error" | "info" | "warning"; message: string } | null>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        setAlert({ message: "File size must be less than 5MB", type: "error" })
        return
      }
      setFormData({ ...formData, profile_picture: file })
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const checkPasswordStrength = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
  }

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        if (!formData.full_name.trim() || !formData.username.trim() || !formData.email.trim()) {
          setAlert({ message: "Please fill in all required fields.", type: "warning" })
          return false
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          setAlert({ message: "Please enter a valid email address.", type: "error" })
          return false
        }
        break
      case 2:
        if (!formData.class_taught.trim() || !formData.years_of_experience.trim()) {
          setAlert({ message: "Please fill in all teaching details.", type: "warning" })
          return false
        }
        if (isNaN(Number(formData.years_of_experience)) || Number(formData.years_of_experience) < 0) {
          setAlert({ message: "Please enter a valid number for years of experience.", type: "error" })
          return false
        }
        break
      case 3:
        if (formData.password !== formData.confirmPassword) {
          setAlert({ message: "Passwords do not match!", type: "error" })
          return false
        }
        if (!checkPasswordStrength(formData.password)) {
          setAlert({
            message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character.",
            type: "warning",
          })
          return false
        }
        break
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleSignup = async () => {
    setLoading(true)

    const fd = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "confirmPassword" && value !== null) {
        fd.append(key, value as string | File)
      }
    })

    try {
      const res = await fetch("/api/teacher/signup", { method: "POST", body: fd })
      const result = await res.json()
      if (res.ok) {
        setFormData({ ...formData, uin: result.uin || "" })
        setStep(5)
      } else {
        setAlert({ message: result.error || result.message || "Signup failed. Please try again.", type: "error" })
      }
    } catch {
      setAlert({ message: "Network error. Please try again.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const copyUIN = () => {
    navigator.clipboard.writeText(formData.uin)
    setAlert({ message: "UIN copied to clipboard!", type: "info" })
  }

  return (
    <>
      <CustomHeader />   
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-indigo-600/80 to-indigo-900 flex items-center justify-center p-4">
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
            <p className="mt-2 text-sm text-gray-500">Creating account...</p>
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
            <h1 className="text-2xl font-bold text-card-foreground mb-2">Teacher Registration</h1>
            <p className="text-gray-500">Join our School&apos;s platform</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step >= s ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">Personal Information</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Username *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                      placeholder="Choose a username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">Teaching Details</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Subject/Class Taught *</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      name="class_taught"
                      value={formData.class_taught}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                      placeholder="e.g., Mathematics, Primary 3"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Years of Experience *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      name="years_of_experience"
                      type="number"
                      min="0"
                      value={formData.years_of_experience}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                      placeholder="Years of teaching experience"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Profile Picture (Optional)</label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="profile-upload-teacher"
                      />
                      <label
                        htmlFor="profile-upload-teacher"
                        className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        {preview ? (
                          <img
                            src={preview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Upload className="w-6 h-6 text-gray-500" />
                        )}
                      </label>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Upload a profile picture</p>
                      <p className="text-xs text-gray-500">Max size: 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 bg-secondary/20 text-secondary-foreground font-semibold rounded-lg border border-secondary/30 hover:bg-secondary/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">Create Password</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Create Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                      placeholder="Create a strong password"
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>Password must contain:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                    <li>One special character</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 bg-secondary/20 text-secondary-foreground font-semibold rounded-lg border border-secondary/30 hover:bg-secondary/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 text-center">
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto" />
                  <h3 className="text-lg font-semibold text-card-foreground">Ready to Create Account</h3>
                  <p className="text-gray-500">
                    Click below to generate your unique teacher ID and complete registration.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-secondary/20 text-secondary-foreground font-semibold rounded-lg border border-secondary/30 hover:bg-secondary/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleSignup}
                    className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors"
                  >
                    Generate Teacher ID
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6 text-center">
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto animate-pulse" />
                  <h3 className="text-lg font-semibold text-card-foreground">Registration Successful!</h3>
                  <p className="text-gray-500">Your Teacher ID (UIN):</p>

                  <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                    <p className="text-2xl font-bold text-primary font-mono">{formData.uin}</p>
                  </div>

                  <p className="text-sm text-gray-500">
                    Please save this ID safely. You&apos;ll need it to log in to your account.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={copyUIN}
                    className="w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg shadow-md hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" /> Copy Teacher ID
                  </button>
                  <button
                    onClick={() => router.push("/teacher/login")}
                    className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors"
                  >
                    Continue to Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Already have account link */}
        {step < 5 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-100">
              Already have an account?{" "}
              <Link href="/teacher/login" className="text-gray-100 hover:text-gray-300 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        )}

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
