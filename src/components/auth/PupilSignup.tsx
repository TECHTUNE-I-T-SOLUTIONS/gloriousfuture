"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import CustomAlert from "@/components/CustomAlert"
import CustomLoader from "@/components/CustomLoader"
// icons intentionally minimal here

const classOptions = [
  "Creche",
  "Nursery 1",
  "Nursery 2",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
]

export default function PupilSignup() {
  const [step, setStep] = useState(1)
  const [details, setDetails] = useState({
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
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setDetails((prev) => ({ ...prev, profile_picture: file }))
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

  const handlePasswordStep = () => {
    if (details.password !== details.confirmPassword) {
      setAlert({ message: "Passwords do not match!", type: "error" })
      return
    }

    if (!checkPasswordStrength(details.password)) {
      setAlert({ message: "Password must be at least 8 characters long and include letters, numbers and symbols.", type: "warning" })
      return
    }

    setStep(5)
  }

  const generateUIN = async () => {
    if (!details.classLevel) {
      setAlert({ message: "Please select a class before generating UIN!", type: "warning" })
      return
    }

    setLoading(true)
    const fd = new FormData()
    Object.entries(details).forEach(([key, value]) => {
      if (value !== null) fd.append(key, value as string | File)
    })

    try {
      const res = await fetch('/api/pupils/signup', { method: 'POST', body: fd })
      const data = await res.json()
      setLoading(false)
      if (res.ok) {
        setDetails({ ...details, uin: data.uin })
        setStep(6)
      } else {
        setAlert({ message: data.error || 'Signup failed', type: 'error' })
      }
    } catch {
      setLoading(false)
      setAlert({ message: 'Network error', type: 'error' })
    }
  }

  const copyUIN = () => {
    if (!details.uin) return
    navigator.clipboard.writeText(details.uin)
    setAlert({ message: 'UIN copied to clipboard!', type: 'info' })
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300">
      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      {loading && <CustomLoader />}

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="relative w-full max-w-lg">
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 overflow-hidden">
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Account</h2>
              <p className="text-slate-600">{['','Basic Information','Parent Information','Guardian Information','Create Password','Class & Profile','Registration Complete'][step]}</p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <input type="text" placeholder="Full Name" value={details.full_name} onChange={(e) => setDetails({ ...details, full_name: e.target.value })} className="w-full p-4 border-2 rounded-xl" />
                    <input type="text" placeholder="Phone Number" value={details.phone_number} onChange={(e) => setDetails({ ...details, phone_number: e.target.value })} className="w-full p-4 border-2 rounded-xl" />
                    <input type="email" placeholder="Email Address" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} className="w-full p-4 border-2 rounded-xl" />
                    <button onClick={() => setStep(2)} className="w-full py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl">Next</button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <input type="text" placeholder="Father's Name" value={details.father_name} onChange={(e) => setDetails({ ...details, father_name: e.target.value })} className="w-full p-4 border-2 rounded-xl" />
                    <input type="text" placeholder="Mother's Name" value={details.mother_name} onChange={(e) => setDetails({ ...details, mother_name: e.target.value })} className="w-full p-4 border-2 rounded-xl" />
                    <div className="flex space-x-3"><button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-200 rounded-xl">Back</button><button onClick={() => setStep(3)} className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl">Next</button></div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <input type="text" placeholder="Guardian's Name" value={details.guardian_name} onChange={(e) => setDetails({ ...details, guardian_name: e.target.value })} className="w-full p-4 border-2 rounded-xl" />
                    <input type="text" placeholder="Guardian's Contact" value={details.guardian_contact} onChange={(e) => setDetails({ ...details, guardian_contact: e.target.value })} className="w-full p-4 border-2 rounded-xl" />
                    <div className="flex space-x-3"><button onClick={() => setStep(2)} className="flex-1 py-4 bg-slate-200 rounded-xl">Back</button><button onClick={() => setStep(4)} className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl">Next</button></div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <input type="password" placeholder="Create Password" value={details.password} onChange={(e) => setDetails({ ...details, password: e.target.value })} className="w-full p-4 border-2 rounded-xl" />
                    <input type="password" placeholder="Confirm Password" value={details.confirmPassword} onChange={(e) => setDetails({ ...details, confirmPassword: e.target.value })} className="w-full p-4 border-2 rounded-xl" />
                    <div className="flex space-x-3"><button onClick={() => setStep(3)} className="flex-1 py-4 bg-slate-200 rounded-xl">Back</button><button onClick={handlePasswordStep} className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl">Next</button></div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-4">
                    <label className="sr-only" htmlFor="classLevel">Class</label>
                    <select id="classLevel" title="Class" aria-label="Class" value={details.classLevel} onChange={(e) => setDetails({ ...details, classLevel: e.target.value })} className="w-full p-4 border-2 rounded-xl">
                      <option value="">Select Class</option>
                      {classOptions.map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium" htmlFor="profile_upload">Upload Profile Picture</label>
                      <input id="profile_upload" aria-label="Profile picture" title="Profile picture" type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
                      {imagePreview && <div className="flex justify-center"><Image src={imagePreview} alt="Profile Preview" width={96} height={96} className="w-24 h-24 rounded-full" /></div>}
                    </div>
                    <div className="flex space-x-3"><button onClick={() => setStep(4)} className="flex-1 py-4 bg-slate-200 rounded-xl">Back</button><button onClick={generateUIN} className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl">Generate UIN</button></div>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-6 text-center">
                    <div className="p-6 bg-green-50 rounded-2xl border border-green-200"><div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center"><svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div><h3 className="text-lg font-semibold text-green-800 mb-2">Registration Successful!</h3><p className="text-sm text-green-600 mb-4">Your Unique Identification Number (UIN):</p><div className="bg-white rounded-xl p-4 border border-green-200"><p className="text-2xl font-bold text-slate-800 font-mono">{details.uin}</p></div></div>
                    <div className="space-y-3"><button onClick={copyUIN} className="w-full py-4 bg-blue-500 text-white rounded-xl">Copy to Clipboard</button><button onClick={() => router.push('/pupils/Login')} className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl">Continue to Login</button></div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
