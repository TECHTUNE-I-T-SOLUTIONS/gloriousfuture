"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Upload,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Copy,
  AlertCircle,
} from "lucide-react"

const classOptions = [
  "Creche",
  "Pre-Nursery",
  "Nursery One",
  "Nursery Two",
  "Primary One",
  "Primary Two",
  "Primary Three",
  "Primary Four",
  "Primary Five",
]

export default function PupilSignupPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    father_name: "",
    mother_name: "",
    guardian_name: "",
    guardian_contact: "",
    classLevel: "",
    password: "",
    confirmPassword: "",
    profile_picture: null as File | null,
    uin: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlert({ message: "File size must be less than 5MB", type: "error" })
        return
      }
      setFormData({ ...formData, profile_picture: file })
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
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
        if (!formData.full_name.trim() || !formData.phone_number.trim() || !formData.email.trim()) {
          setAlert({ message: "Please fill in all required fields.", type: "warning" })
          return false
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          setAlert({ message: "Please enter a valid email address.", type: "error" })
          return false
        }
        break
      case 2:
        if (!formData.father_name.trim() || !formData.mother_name.trim()) {
          setAlert({ message: "Please fill in parent information.", type: "warning" })
          return false
        }
        break
      case 3:
        if (!formData.guardian_name.trim() || !formData.guardian_contact.trim()) {
          setAlert({ message: "Please fill in guardian information.", type: "warning" })
          return false
        }
        break
      case 4:
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
      case 5:
        if (!formData.classLevel.trim()) {
          setAlert({ message: "Please select a class.", type: "warning" })
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

  const generateUIN = async () => {
    setLoading(true)
    const fd = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "confirmPassword" && value !== null) {
        fd.append(key, value as string | File)
      }
    })

    try {
      const res = await fetch("/api/pupils/signup", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok) {
        setFormData({ ...formData, uin: data.uin })
        setStep(7)
      } else {
        setAlert({ message: data.error || "Signup failed", type: "error" })
      }
    } catch {
      setAlert({ message: "Network error. Please try again.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const copyUIN = () => {
    if (!formData.uin) return
    navigator.clipboard.writeText(formData.uin)
    setAlert({ message: "UIN copied to clipboard!", type: "info" })
  }

  return (
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
            <p className="mt-2 text-sm text-gray-500">Creating account...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground mb-2">Pupil Registration</h1>
            <p className="text-gray-500">Join Glorious Future Academy learning platform</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
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
                <h3 className="text-lg font-semibold text-card-foreground">Basic Information</h3>
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
                  <label className="text-sm font-medium text-card-foreground">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                      placeholder="Enter phone number"
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
                      placeholder="Enter email address"
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
                <h3 className="text-lg font-semibold text-card-foreground">Parent Information</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Father&apos;s Name *</label>
                  <input
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                    placeholder="Enter father's name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Mother&apos;s Name *</label>
                  <input
                    name="mother_name"
                    value={formData.mother_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                    placeholder="Enter mother's name"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 bg-secondary/90 text-secondary-foreground font-semibold rounded-lg border border-secondary/30 hover:bg-secondary/30 transition-colors flex items-center justify-center gap-2"
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
                <h3 className="text-lg font-semibold text-card-foreground">Guardian Information</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Guardian&apos;s Name *</label>
                  <input
                    name="guardian_name"
                    value={formData.guardian_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                    placeholder="Enter guardian's name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Guardian&apos;s Contact *</label>
                  <input
                    name="guardian_contact"
                    value={formData.guardian_contact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                    placeholder="Enter guardian's contact"
                  />
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">Create Password</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Password *</label>
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
                    onClick={() => setStep(3)}
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

            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">Class & Profile</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Class *</label>
                  <select
                    name="classLevel"
                    value={formData.classLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                  >
                    <option value="">Select your class</option>
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Profile Picture (Optional)</label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="profile-upload"
                      />
                      <label
                        htmlFor="profile-upload"
                        className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview || "/placeholder.svg"}
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
                    onClick={() => setStep(4)}
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

            {step === 6 && (
              <div className="space-y-6 text-center">
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto" />
                  <h3 className="text-lg font-semibold text-card-foreground">Ready to Create Account</h3>
                  <p className="text-gray-500">
                    Click below to generate your unique pupil ID and complete registration.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(5)}
                    className="flex-1 py-3 bg-secondary/20 text-secondary-foreground font-semibold rounded-lg border border-secondary/30 hover:bg-secondary/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={generateUIN}
                    className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors"
                  >
                    Generate Pupil ID
                  </button>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-6 text-center">
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto animate-pulse" />
                  <h3 className="text-lg font-semibold text-card-foreground">Registration Successful!</h3>
                  <p className="text-gray-500">Your Pupil ID (UIN):</p>
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
                    <Copy className="w-4 h-4" /> Copy Pupil ID
                  </button>
                  <button
                    onClick={() => router.push("/pupils/login")}
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
        {step < 7 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/pupils/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        )}

        {/* Trust Badge */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Your information is secure and protected
          </p>
        </div>
      </div>
    </div>
  )
}
