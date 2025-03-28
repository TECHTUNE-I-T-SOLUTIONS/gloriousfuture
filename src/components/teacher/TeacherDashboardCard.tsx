"use client";

import { motion } from "framer-motion";

interface TeacherDashboardCardProps {
  title: string;
  onClick: () => void;
  icon: JSX.Element;
}

export default function TeacherDashboardCard({ title, onClick, icon }: TeacherDashboardCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-2xl"
      onClick={onClick}
    >
      <div className="text-blue-700 text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </motion.div>
  );
}
