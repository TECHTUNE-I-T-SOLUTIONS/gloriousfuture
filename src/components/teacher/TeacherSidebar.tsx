"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaHome, FaBook, FaCalendarAlt, FaFileAlt, FaUser, 
  FaLaptopCode, FaClipboardCheck, FaSignOutAlt, FaEdit, FaBell 
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function TeacherSidebar({ setActivePage, isSidebarOpen, setIsSidebarOpen }: { setActivePage: (page: string) => void, isSidebarOpen: boolean, setIsSidebarOpen: (isOpen: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(true);  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  // Detect screen width to adjust sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);  // Close sidebar on small screens
        setIsSidebarOpen(false);
      } else {
        setIsOpen(true);   // Open sidebar on larger screens
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSidebarOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setIsSidebarOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/teacher/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/teacher");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <motion.div
        animate={{ width: isSidebarOpen ? "250px" : "70px" }}
        className="h-full mt-20 bg-green-700 text-white p-2 shadow-2xl transition-all duration-300 flex flex-col"
      >
        {/* Sidebar Toggle Button */}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mb-2 self-end text-sm focus:outline-none">
          {isSidebarOpen ? "❌" : "☰"}
        </button>

        {/* Sidebar Navigation */}
        <nav className="flex flex-col space-y-1">
          <SidebarItem icon={<FaHome />} label="Dashboard" isOpen={isSidebarOpen} onClick={() => setActivePage("dashboard")} />
          <SidebarItem icon={<FaBook />} label="Assignments" isOpen={isSidebarOpen} onClick={() => setActivePage("assignments")} />
          <SidebarItem icon={<FaCalendarAlt />} label="Timetable" isOpen={isSidebarOpen} onClick={() => setActivePage("timetable")} />
          <SidebarItem icon={<FaFileAlt />} label="Results" isOpen={isSidebarOpen} onClick={() => setActivePage("exam-results")} />
          <SidebarItem icon={<FaUser />} label="Profile" isOpen={isSidebarOpen} onClick={() => setActivePage("profile")} />
          <SidebarItem icon={<FaLaptopCode />} label="CBT Exams" isOpen={isSidebarOpen} onClick={() => setActivePage("cbt-exams")} />
          <SidebarItem icon={<FaClipboardCheck />} label="Tests & Quizzes" isOpen={isSidebarOpen} onClick={() => setActivePage("tests")} />

          {/* New Sidebar Items */}
          <SidebarItem icon={<FaEdit />} label="Create Blog" isOpen={isSidebarOpen} onClick={() => setActivePage("create-blog")} />
          <SidebarItem icon={<FaBell />} label="Create Message Alert" isOpen={isSidebarOpen} onClick={() => setActivePage("create-alert")} />

          {/* Logout Button Styled Like SidebarItem */}
          <SidebarItem 
            icon={<FaSignOutAlt />} 
            label="Logout" 
            isOpen={isSidebarOpen} 
            onClick={() => setShowLogoutModal(true)} 
            customClass="hover:bg-red-600"
          />
        </nav>
      </motion.div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to log out?</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SidebarItem({ icon, label, isOpen, onClick }: { icon: JSX.Element, label: string, isOpen: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-3 hover:bg-green-800 p-2 rounded-md transition-all w-full text-left relative group"
    >
      {icon}
      {isOpen && <span>{label}</span>}
      {!isOpen && (
        <span className="absolute left-12 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {label}
        </span>
      )}
    </button>
  );
}
