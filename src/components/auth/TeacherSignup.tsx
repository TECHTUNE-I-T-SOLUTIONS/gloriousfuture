"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import CustomLoader from "@/components/CustomLoader"
import CustomAlert from "@/components/CustomAlert"
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Calendar,
  Upload,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Copy,
  X,
} from "lucide-react"

export default function TeacherSignup() {
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

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      {loading && <CustomLoader />}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <GraduationCap className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Teacher Registration</h1>
            <p className="text-gray-500">Join our educational platform</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className={`w-3 h-3 rounded-full transition-all duration-300 ${step >= s ? "bg-primary" : "bg-border"}`} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input name="full_name" value={formData.full_name} onChange={handleChange} className="teacher-input pl-10" placeholder="Enter your full name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Username *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input name="username" value={formData.username} onChange={handleChange} className="teacher-input pl-10" placeholder="Choose a username" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} className="teacher-input pl-10" placeholder="Enter your email" />
                  </div>
                </div>

                <button onClick={nextStep} className="teacher-button-primary">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Class Taught *</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input name="class_taught" value={formData.class_taught} onChange={handleChange} className="teacher-input pl-10" placeholder="e.g., Mathematics, Grade 10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Years of Experience *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input name="years_of_experience" type="number" min="0" value={formData.years_of_experience} onChange={handleChange} className="teacher-input pl-10" placeholder="Years of teaching experience" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="profile-upload-teacher" />
                      <label htmlFor="profile-upload-teacher" className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                        {preview ? (<img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover rounded-lg" />) : (<Upload className="w-6 h-6 text-gray-500" />)}
                      </label>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Upload a profile picture (optional)</p>
                      <p className="text-xs text-gray-500">Max size: 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 px-6 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"><ArrowLeft className="w-4 h-4 mr-2" /> Back</button>
                  <button onClick={nextStep} className="flex-1 teacher-button-primary">Next <ArrowRight className="w-4 h-4 ml-2" /></button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Create Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} className="teacher-input pl-10 pr-10" placeholder="Create a strong password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-foreground">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} className="teacher-input pl-10 pr-10" placeholder="Confirm your password" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-foreground">{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
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
                  <button onClick={() => setStep(2)} className="flex-1 py-3 px-6 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"><ArrowLeft className="w-4 h-4 mr-2" /> Back</button>
                  <button onClick={nextStep} className="flex-1 teacher-button-primary">Next <ArrowRight className="w-4 h-4 ml-2" /></button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 text-center">
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto" />
                  <h3 className="text-lg font-semibold text-foreground">Ready to Create Account</h3>
                  <p className="text-gray-500">Click below to generate your unique identification number and complete registration.</p>
                </div>

                <div className="flex space-x-3">
                  <button onClick={() => setStep(3)} className="flex-1 py-3 px-6 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"><ArrowLeft className="w-4 h-4 mr-2" /> Back</button>
                  <button onClick={handleSignup} className="flex-1 teacher-button-primary">Generate UIN</button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 text-center">
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto animate-pulse-subtle" />
                  <h3 className="text-lg font-semibold text-foreground">Registration Successful!</h3>
                  <p className="text-gray-500">Your Unique Identification Number:</p>

                  <div className="bg-muted rounded-lg p-4 border-2 border-primary/20">
                    <p className="text-2xl font-bold text-primary font-mono">{formData.uin}</p>
                  </div>

                  <p className="text-sm text-gray-500">Please save this UIN safely. You&apos;ll need it to log in to your account.</p>
                </div>

                <div className="space-y-3">
                  <button onClick={copyUIN} className="teacher-button-secondary"><Copy className="w-4 h-4 mr-2" /> Copy UIN</button>
                  <button onClick={() => router.push('/teacher/Login')} className="teacher-button-primary">Continue to Login</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button aria-label="Close" onClick={() => router.push('/teacher/Login')} className="absolute top-4 right-4 text-gray-500 hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
        </div>
      </motion.div>
    </div>
  )
}
