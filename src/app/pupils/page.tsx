"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Login from "./Login/page";
import Signup from "./Signup/page";
import ForgotPassword from "./ForgotPassword/page";
import Link from "next/link";
import CustomHeader from "@/components/CustomHeader";

// Dynamically import Particles to prevent hydration issues
const ParticlesBg = dynamic(() => import("../../components/ParticlesBg"), { ssr: false });

export default function PupilAuth() {
  const [activeView, setActiveView] = useState<"login" | "signup" | "forgot">("login");
  const [images] = useState([]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <CustomHeader />
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 relative">
        {/* Particles Background */}
        <ParticlesBg />

        {/* Animated Auth Container */}
        <div className="relative bg-transparent p-8">
          {activeView === "login" && <Login onSwitch={setActiveView} />}
          {activeView === "signup" && <Signup onSwitch={setActiveView} />}
          {activeView === "forgot" && <ForgotPassword onSwitch={setActiveView} />}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-6 text-center z-10">
        <p>&copy; {new Date().getFullYear()} Glorious Future Academy. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
