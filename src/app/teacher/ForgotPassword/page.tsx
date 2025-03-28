"use client";

import { useState } from "react";
import Loader from "@/components/CustomLoader"; // Custom Loader Component
import Alert from "@/components/CustomAlert"; // Custom Alert Component

export default function ForgotPassword({
  onSwitch,
}: {
  onSwitch: (view: "login" | "signup" | "forgot") => void;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/teacher/reset-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Password reset link sent! Check your email." });
      } else {
        setMessage({ type: "error", text: "Email not found. Please try again." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong. Try again later." });
    }

    setLoading(false);
  };

  return (
    <div className="relative bg-transparent shadow-xl border-4 border-transparent animated-border transition-all duration-500 rounded-lg p-6 max-w-md mx-auto text-center z-10">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Forgot Password?</h2>
      <p className="text-gray-200 text-sm mb-6">
        Enter your email, and we’ll send you a reset link.
      </p>

      {message && <Alert type={message.type} text={message.text} />} {/* Custom Alert */}

      <div className="relative w-full mb-4">
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="peer w-full p-3 border-2 rounded-md bg-transparent outline-none transition-all duration-300 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:bg-transparent text-white"
        />
        <label
          htmlFor="email"
          className="absolute left-3 transition-all duration-300 bg-gray-300 px-1 text-black peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-[-10px] peer-focus:text-blue-400 peer-focus:bg-white peer-focus:text-sm focus:bg-white focus:text-black"
          style={{ top: email ? "-10px" : "14px", fontSize: email ? "12px" : "16px" }}
        >
          Enter your email
        </label>
      </div>

      <button
        onClick={handleReset}
        disabled={loading}
        className={`w-full mt-4 py-2 font-semibold text-white rounded-md transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? <Loader /> : "Send Reset Link"} {/* Custom Loader */}
      </button>

      <p className="text-sm mt-4">
        <span
          onClick={() => onSwitch("login")}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          Back to Login
        </span>
      </p>
    </div>
  );
}
