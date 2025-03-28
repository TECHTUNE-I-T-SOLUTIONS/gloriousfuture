"use client";

import { useState } from "react";
import CustomLoader from "@/components/CustomLoader";
import CustomAlert from "@/components/CustomAlert";

export default function TeacherSignup({ onSwitch }: { onSwitch: (view: "login" | "signup" | "forgot") => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    class_taught: "",
    years_of_experience: "",
    uin: "",
    profile_picture: null as File | null, // Added profile picture field
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error" | "info" | "warning"; message: string } | null>(null);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Profile Picture Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, profile_picture: file });

      // Generate preview URL
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Password Validation
  const checkPasswordStrength = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const handlePasswordStep = () => {
    if (formData.password !== formData.confirmPassword) {
      setAlert({ message: "Passwords do not match!", type: "error" });
      return;
    }

    if (!checkPasswordStrength(formData.password)) {
      setAlert({
        message: "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character.",
        type: "warning",
      });
      return;
    }

    setStep(4);
  };

  // Handle Signup and Generate UIN
  const handleSignup = async () => {
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("full_name", formData.full_name);
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("class_taught", formData.class_taught);
    formDataToSend.append("years_of_experience", formData.years_of_experience);
    if (formData.profile_picture) {
      formDataToSend.append("profile_picture", formData.profile_picture);
    }

    const response = await fetch("/api/teacher/signup", {
      method: "POST",
      body: formDataToSend,
    });

    const result = await response.json();
    setLoading(false);

    if (response.ok) {
      setFormData({ ...formData, uin: result.uin });
      setStep(5); // Move to UIN display step
    } else {
      setAlert({ message: result.error || "Signup failed. Please try again.", type: "error" });
    }
  };

  // Copy UIN to Clipboard
  const copyUIN = () => {
    navigator.clipboard.writeText(formData.uin);
    setAlert({ message: "UIN copied to clipboard!", type: "info" });
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen z-50">
      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      {loading && <CustomLoader />}

      <div className="relative p-8 rounded-xl bg-transparent shadow-xl border-4 border-transparent animated-border transition-all duration-500 max-w-md w-full z-10">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Teacher Signup</h2>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} className="input-field" />
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="input-field" />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="input-field" />
            <button onClick={() => setStep(2)} className="btn-primary w-full">Next</button>
          </div>
        )}

        {/* Step 2: Teaching Details & Profile Picture Upload */}
        {step === 2 && (
          <div className="space-y-4">
            <input type="text" name="class_taught" placeholder="Class Taught" value={formData.class_taught} onChange={handleChange} className="input-field" />
            <input type="text" name="years_of_experience" placeholder="Years of Experience" value={formData.years_of_experience} onChange={handleChange} className="input-field" />
            
            {/* Profile Picture Upload */}
            <div className="space-y-2">
              <label className="text-white">Upload Profile Picture:</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="input-field" />
              {preview && <img src={preview} alt="Profile Preview" className="w-20 h-20 rounded-full mx-auto" />}
            </div>

            <button onClick={() => setStep(3)} className="btn-primary w-full">Next</button>
            <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
          </div>
        )}

        {/* Step 3: Password Creation */}
        {step === 3 && (
          <div className="space-y-4">
            <input type="password" name="password" placeholder="Create Password" value={formData.password} onChange={handleChange} className="input-field" />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="input-field" />
            <button onClick={handlePasswordStep} className="btn-primary w-full">Next</button>
            <button onClick={() => setStep(2)} className="btn-secondary">Back</button>
          </div>
        )}

        {/* Step 4: Generate UIN */}
        {step === 4 && (
          <div className="space-y-4">
            <button onClick={handleSignup} className="btn-primary w-full">Generate UIN</button>
            <button onClick={() => setStep(3)} className="btn-secondary">Back</button>
          </div>
        )}

        {/* Step 5: Show Generated UIN */}
        {step === 5 && (
          <div className="space-y-4 text-center">
            <p className="text-lg text-white">Your Unique Identification Number (UIN):</p>
            <p className="text-2xl font-bold text-blue-400">{formData.uin}</p>
            <button onClick={copyUIN} className="btn-primary">Copy to Clipboard</button>
            <button onClick={() => onSwitch("login")} className="btn-secondary">I've saved my UIN</button>
          </div>
        )}

        {/* Close Button */}
        <button onClick={() => onSwitch("login")} className="absolute top-2 right-3 text-white text-2xl">
          &times;
        </button>
        {/* Step Indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`w-3 h-3 rounded-full ${step === s ? "bg-blue-500" : "bg-gray-500"}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
