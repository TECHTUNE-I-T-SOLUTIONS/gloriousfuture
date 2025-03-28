"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import TeacherLogin from "./Login/page";
import TeacherSignup from "./Signup/page";
import TeacherForgotPassword from "./ForgotPassword/page";
import CustomHeader from "@/components/CustomHeader";

// Dynamically import ParticlesBg to prevent hydration issues
const ParticlesBg = dynamic(() => import("../../components/ParticlesBg"), { ssr: false });

export default function TeacherAuth() {
  const [activeView, setActiveView] = useState<"login" | "signup" | "forgot">("login");

  return (
    <div className="flex flex-col min-h-screen">
      <CustomHeader />
      <div className="flex-grow flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-500 to-blue-700 relative">
        <ParticlesBg />

        <div className="relative shadow-xl rounded-lg p-8 max-w-lg w-full">
          {activeView === "login" && <TeacherLogin onSwitch={setActiveView} />}
          {activeView === "signup" && <TeacherSignup onSwitch={setActiveView} />}
          {activeView === "forgot" && <TeacherForgotPassword onSwitch={setActiveView} />}
        </div>
      </div>

      <footer className="w-full bg-gray-900 text-white py-6 text-center z-10">
        <p>&copy; {new Date().getFullYear()} Glorious Future Academy. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
