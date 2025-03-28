"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function TeacherHeader({ text }: { text: string }) {
  const [teacherName, setTeacherName] = useState("Loading...");
  const [profilePicture, setProfilePicture] = useState("/default-profile.png");
  const [uin, setUIN] = useState("N/A");

  useEffect(() => {
    const fetchSessionAndTeacherDetails = async () => {
      try {
        // Fetch session details
        const sessionRes = await fetch("/api/auth/session");
        if (!sessionRes.ok) throw new Error("Unauthorized session");

        const sessionData = await sessionRes.json();
        console.log("Session Data:", sessionData); // Log the session response

        if (!sessionData.session || !sessionData.session.uin) {
          throw new Error("Session missing UIN");
        }

        // Fetch teacher details, passing UIN in query
        const teacherRes = await fetch(`/api/teacher/details?uin=${sessionData.session.uin}`);
        if (!teacherRes.ok) throw new Error("Failed to fetch teacher details");

        const teacherData = await teacherRes.json();
        console.log("Teacher Data:", teacherData); // Log teacher response

        if (teacherData.success) {
          setTeacherName(teacherData.name || "Teacher");
          setUIN(teacherData.uin || "N/A");
          setProfilePicture(teacherData.profile_picture || "/default-profile.png");
        }
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      }
    };

    fetchSessionAndTeacherDetails();
  }, []);



  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="fixed top-0 left-0 w-full h-20 bg-gradient-to-r from-green-700 via-green-500 to-green-400 p-4 shadow-md flex items-center justify-between text-white z-50"
    >
      <div className="flex items-center space-x-3">
        <Image src="/logo.png" alt="School Logo" width={50} height={50} className="rounded-full" />
        <div>
          <h1 className="text-lg font-bold">Glorious Future Academy</h1>
          <p className="text-sm text-gray-200">{text}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="text-right">
          <p className="text-md font-semibold">{teacherName}</p>
          <p className="text-sm text-gray-200">UIN: {uin}</p>
        </div>
        <Image
          src={profilePicture}
          alt="Profile Picture"
          width={40}
          height={40}
          className="rounded-full border-2 border-white shadow-lg"
        />
      </div>
    </motion.header>
  );
}
