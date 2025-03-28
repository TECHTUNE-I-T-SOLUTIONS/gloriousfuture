"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import CustomAlert from "@/components/CustomAlert";
import CustomLoader from "@/components/CustomLoader";
 
export default function Login({ onSwitch }: { onSwitch: (view: "login" | "signup" | "forgot") => void }) {
  const [uin, setUIN] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize the router

  const handleLogin = async () => {
    setLoading(true); // Show loader

    const res = await fetch("/api/teacher/login", {
      method: "POST",
      body: JSON.stringify({ uin, password }),
      headers: { "Content-Type": "application/json" },
    });

    setLoading(false); // Hide loader

    if (res.ok) {
      setAlert({ message: "Login Successful!", type: "success" });

      // Redirect to the Teacher Dashboard after a short delay
      setTimeout(() => {
        router.push("/teacher/teacher-dashboard");
      }, 1500);
    } else {
      setAlert({ message: "Invalid UIN or Password.", type: "error" });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen z-10">
      {/* Show Alert */}
      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      {/* Show Loader */}
      {loading && <CustomLoader />}

      {/* Login Card */}
      <div className="relative p-8 rounded-xl bg-transparent shadow-xl border-4 border-transparent animated-border transition-all duration-500">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Teacher Login</h2>

        {/* UIN Input */}
        <div className="relative w-full bg-transparent mb-4">
          <input
            type="text"
            id="uin"
            value={uin}
            onChange={(e) => setUIN(e.target.value)}
            className="peer w-full p-3 border-2 rounded-md bg-transparent outline-none transition-all duration-300 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:bg-transparent text-white peer-focus:bg-transparent"
          />
          <label
            htmlFor="uin"
            className="absolute left-3 transition-all duration-300 bg-gray-300 px-1 text-black peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-[-10px] peer-focus:text-blue-400 peer-focus:bg-transparent peer-focus:text-sm focus:bg-white focus:text-black"
            style={{ top: uin ? "-10px" : "14px", fontSize: uin ? "12px" : "16px" }}
          >
            Enter UIN
          </label>
        </div>

        {/* Password Input */}
        <div className="relative w-full mb-6">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer w-full p-3 border-2 rounded-md bg-transparent outline-none transition-all duration-300 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:bg-transparent text-white"
          />
          <label
            htmlFor="password"
            className="absolute left-3 transition-all duration-300 bg-gray-300 px-1 text-black peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-[-10px] peer-focus:text-blue-400 focus:bg-white peer-focus:text-sm focus:bg-white focus:text-black"
            style={{ top: password ? "-10px" : "14px", fontSize: password ? "12px" : "16px" }}
          >
            Password
          </label>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-md shadow-md transition-all duration-300 hover:opacity-90 hover:shadow-lg"
        >
          Login
        </button>

        {/* Links */}
        <p className="text-sm text-center mt-4 text-white">
          No account?{" "}
          <span onClick={() => onSwitch("signup")} className="text-blue-400 cursor-pointer hover:underline">
            Signup
          </span>{" "}
          |{" "}
          <span onClick={() => onSwitch("forgot")} className="text-blue-400 cursor-pointer hover:underline">
            Forgot Password?
          </span>
        </p>
      </div>
    </div>
  );
}
