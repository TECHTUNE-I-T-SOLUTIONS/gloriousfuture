"use client";

import { motion } from "framer-motion";

export default function DashboardCard({ title, icon, color }: { title: string; icon: JSX.Element; color: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-6 rounded-xl shadow-md flex items-center space-x-4 ${color} text-blue-900`}
    >
      <div className="text-4xl">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </motion.div>
  );
}
