"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname for active link styling
import { FiMenu, FiX, FiHome, FiUsers, FiBookOpen, FiUser, FiInfo } from "react-icons/fi"; // Import icons

const CustomHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // Get the current route

  // Define links with their respective icons
  const navLinks = [
    { href: "/", label: "Home", icon: <FiHome /> },
    { href: "/pupils", label: "Pupil Section", icon: <FiUsers /> },
    { href: "/teacher", label: "Teacher's Section", icon: <FiUser /> },
    { href: "/blog", label: "Blog", icon: <FiBookOpen /> },
    { href: "/about", label: "About Us", icon: <FiInfo /> },
  ];

  return (
    <header className="w-full fixed top-0 left-0 bg-blue-200 shadow-md z-60">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo and School Name */}
        <div className="flex items-center">
          <Image src="/apple-touch-icon.png" alt="Logo" width={50} height={50} />
          <span className="ml-3 text-lg font-bold text-blue-700">Glorious Future Academy</span>
        </div>

        {/* Menu Button for Small Screens */}
        <button
          className="md:hidden text-blue-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1 text-lg font-semibold px-1 py-1 rounded-md transition-colors ${
                pathname === href ? "bg-blue-700 text-white" : "text-blue-700 hover:bg-blue-300"
              }`}
            >
              {icon} {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu (Visible when menuOpen is true) */}
      {menuOpen && (
        <nav className="md:hidden bg-blue-300 py-3 px-6 space-y-4">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 text-lg py-2 rounded-md transition-colors ${
                pathname === href ? "bg-blue-700 text-white p-2" : "text-blue-700 hover:bg-blue-400 p-2"
              }`}
              onClick={() => setMenuOpen(false)} // Close menu on click
            >
              {icon} {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default CustomHeader;
