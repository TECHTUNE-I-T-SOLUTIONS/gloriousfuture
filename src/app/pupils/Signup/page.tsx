"use client";

import { useState } from "react";
import ParticlesBg from "@/components/ParticlesBg";
import CustomAlert from "@/components/CustomAlert";
import CustomLoader from "@/components/CustomLoader";

const classOptions = [
  "Creche", "Nursery 1", "Nursery 2",
  "Primary 1", "Primary 2", "Primary 3",
  "Primary 4", "Primary 5", "Primary 6"
];

export default function Signup({ onSwitch }: { onSwitch: (view: "login" | "signup" | "forgot") => void }) {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    father_name: "",
    mother_name: "",
    guardian_name: "", // New guardian field
    guardian_contact: "", // New guardian field
    classLevel: "",
    password: "",
    confirmPassword: "",
    profile_picture: null as File | null,
    uin: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle Image Upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDetails((prev) => ({ ...prev, profile_picture: file }));

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Password Strength Check
  const checkPasswordStrength = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  // Proceed to next step with password validation
  const handlePasswordStep = () => {
    if (details.password !== details.confirmPassword) {
      setAlert({ message: "Passwords do not match!", type: "error" });
      return;
    }

    if (!checkPasswordStrength(details.password)) {
      setAlert({ message: "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character.", type: "warning" });
      return;
    }

    setStep(5);
  };

  // Generate UIN
  const generateUIN = async () => {
    if (!details.classLevel) {
      setAlert({ message: "Please select a class before generating UIN!", type: "warning" });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    Object.entries(details).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, value);
      }
    });

    if (details.profile_picture) {
      formData.append("profile_picture", details.profile_picture);
    }

    const res = await fetch("/api/pupils/signup", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setDetails({ ...details, uin: data.uin });
      setStep(6);
    } else {
      setAlert({ message: data.error || "Signup failed. Please try again.", type: "error" });
    }
  };

  // Copy UIN to clipboard
  const copyUIN = () => {
    if (!details.uin) return;
    navigator.clipboard.writeText(details.uin);
    setAlert({ message: "UIN copied to clipboard!", type: "info" });
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen z-50">
      {/* Particle Background */}
      <ParticlesBg />

      {/* Show Alert */}
      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      {/* Show Loader */}
      {loading && <CustomLoader />}

      {/* Signup Card */}
      <div className="relative p-8 rounded-xl bg-transparent shadow-xl border-4 border-transparent animated-border transition-all duration-500 max-w-md w-full z-10">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Pupil Signup</h2>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <input type="text" placeholder="Full Name"
              value={details.full_name}
              onChange={(e) => setDetails({ ...details, full_name: e.target.value })}
              className="input-field"
            />
            <input type="text" placeholder="Phone Number"
              value={details.phone_number}
              onChange={(e) => setDetails({ ...details, phone_number: e.target.value })}
              className="input-field"
            />
            <input type="email" placeholder="Email Address"
              value={details.email}
              onChange={(e) => setDetails({ ...details, email: e.target.value })}
              className="input-field"
            />
            <button onClick={() => setStep(2)} className="btn-primary w-full">Next</button>
          </div>
        )}

        {/* Step 2: Parent Information */}
        {step === 2 && (
          <div className="space-y-4">
            <input type="text" placeholder="Father's Name"
              value={details.father_name}
              onChange={(e) => setDetails({ ...details, father_name: e.target.value })}
              className="input-field"
            />
            <input type="text" placeholder="Mother's Name"
              value={details.mother_name}
              onChange={(e) => setDetails({ ...details, mother_name: e.target.value })}
              className="input-field"
            />
            <button onClick={() => setStep(3)} className="btn-primary w-full">Next</button>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
            </div>
          </div>
        )}

        {/* Step 3: Guardian Information */}
        {step === 3 && (
          <div className="space-y-4">
            <input type="text" placeholder="Guardian's Name"
              value={details.guardian_name}
              onChange={(e) => setDetails({ ...details, guardian_name: e.target.value })}
              className="input-field"
            />
            <input type="text" placeholder="Guardian's Contact"
              value={details.guardian_contact}
              onChange={(e) => setDetails({ ...details, guardian_contact: e.target.value })}
              className="input-field"
            />
            <button onClick={() => setStep(4)} className="btn-primary w-full">Next</button>
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="btn-secondary">Back</button>
            </div>
          </div>
        )}


        {/* Step 4: Password Creation */}
        {step === 4 && (
          <div className="space-y-4">
            <input type="password" placeholder="Create Password"
              value={details.password}
              onChange={(e) => setDetails({ ...details, password: e.target.value })}
              className="input-field"
            />
            <input type="password" placeholder="Confirm Password"
              value={details.confirmPassword}
              onChange={(e) => setDetails({ ...details, confirmPassword: e.target.value })}
              className="input-field"
            />
            <button onClick={handlePasswordStep} className="btn-primary w-full">Next</button>
            
            <div className="flex justify-between">
              <button onClick={() => setStep(3)} className="btn-secondary">Back</button>
            </div>
          </div>          
        )}


        {/* Step 5: Class Selection & Profile Picture Upload */}
        {step === 5 && (
          <div className="space-y-4">
            {/* Class Selection */}
            <select value={details.classLevel}
              onChange={(e) => setDetails({ ...details, classLevel: e.target.value })}
              className="input-field"
            >
              <option value="">Select Class</option>
              {classOptions.map((cls) => (
                <option key={cls} value={cls} className="bg-black">{cls}</option>
              ))}
            </select>

            {/* Profile Picture Upload */}
            <div className="space-y-2">
              <label className="text-white">Upload Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="input-field"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Profile Preview" className="w-24 h-24 rounded-full mx-auto mt-2 border-2 border-blue-500" />
              )}
            </div>

            <button onClick={generateUIN} className="btn-primary w-full">Generate UIN</button>

            <div className="flex justify-between">
              <button onClick={() => setStep(4)} className="btn-secondary">Back</button>
            </div>
          </div>
        )}

        {/* Step 6: UIN Confirmation */}
        {step === 6 && (
          <div className="space-y-4 text-center">
            <p className="text-lg text-white">Your Unique Identification Number (UIN):</p>
            <p className="text-2xl font-bold text-blue-400">{details.uin}</p>
            <button onClick={copyUIN} className="btn-primary">Copy to Clipboard</button>
            <button onClick={() => onSwitch("login")} className="btn-secondary">
              I've saved my UIN
            </button>
          </div>
        )}

        {/* Close Button */}
        <button onClick={() => onSwitch("login")} className="absolute top-2 right-3 text-white text-2xl">
          &times;
        </button>
        {/* Step Indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className={`w-3 h-3 rounded-full ${step === s ? "bg-blue-500" : "bg-gray-500"}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
