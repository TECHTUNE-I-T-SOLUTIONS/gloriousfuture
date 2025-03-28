"use client";

import { useState } from "react";
import { FaHome, FaBook, FaCalendarAlt, FaFileAlt, FaUser, FaLaptopCode, FaClipboardCheck, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Sidebar({ setActivePage }: { setActivePage: (page: string) => void }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      animate={{ width: isOpen ? "250px" : "70px" }}
      className="h-full mt-20 bg-blue-700 text-white p-4 shadow-2xl transition-all duration-300 flex flex-col"
    >
      {/* Sidebar Toggle */}
      <button onClick={() => setIsOpen(!isOpen)} className="mb-6 self-end text-xl focus:outline-none">
        {isOpen ? "❌" : "☰"}
      </button>

      {/* Menu Items */}
      <nav className="flex flex-col space-y-4">
        <SidebarItem icon={<FaHome />} label="Dashboard" isOpen={isOpen} onClick={() => setActivePage("dashboard")} />
        <SidebarItem icon={<FaBook />} label="Assignments" isOpen={isOpen} onClick={() => setActivePage("assignments")} />
        <SidebarItem icon={<FaCalendarAlt />} label="Timetable" isOpen={isOpen} onClick={() => setActivePage("timetable")} />
        <SidebarItem icon={<FaFileAlt />} label="Results" isOpen={isOpen} onClick={() => setActivePage("exam-results")} />
        <SidebarItem icon={<FaUser />} label="Profile" isOpen={isOpen} onClick={() => setActivePage("profile")} />
        <SidebarItem icon={<FaLaptopCode />} label="CBT Exams" isOpen={isOpen} onClick={() => setActivePage("cbt-exams")} />
        <SidebarItem icon={<FaClipboardCheck />} label="Tests & Quizzes" isOpen={isOpen} onClick={() => setActivePage("tests")} />

        {/* Logout Button */}
        <button className="flex items-center space-x-3 hover:bg-red-600 p-3 rounded-md transition-all mt-4">
          <FaSignOutAlt className="text-lg" /> {isOpen && <span>Logout</span>}
        </button>
      </nav>
    </motion.div>
  );
}

// Sidebar Item Component
function SidebarItem({ icon, label, isOpen, onClick }: { icon: JSX.Element; label: string; isOpen: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center space-x-3 hover:bg-blue-800 p-3 rounded-md transition-all w-full text-left">
      {icon}
      {isOpen && <span>{label}</span>}
    </button>
  );
}
