"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface AnimatedHeaderProps {
  text: string;
}

export default function AnimatedHeader({ text }: AnimatedHeaderProps) {
  const [pupilName, setPupilName] = useState("");
  const [profilePicture, setProfilePicture] = useState("/default-profile.png");

  useEffect(() => {
    fetch("/api/pupils/details")
      .then((res) => res.json())
      .then((data) => {
        setPupilName(data.full_name);
        setProfilePicture(data.profile_picture || "/default-profile.png");
      })
      .catch(() => {});
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="fixed top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 p-4 shadow-md flex items-center justify-between text-white z-50"
    >
      <div className="flex items-center space-x-3">
        <Image src="/logo.png" alt="School Logo" width={50} height={50} className="rounded-full" />
        <div>
          <h1 className="text-lg font-bold">Glorious Future Academy</h1>
          <p className="text-sm text-gray-200">{text}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <p className="text-md font-semibold">{pupilName}</p>
        <Image src={profilePicture} alt="Profile Picture" width={40} height={40} className="rounded-full border-2 border-white shadow-lg" />
      </div>
    </motion.header>
  );
}
