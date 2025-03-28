"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

type AlertProps = {
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: () => void;
};

export default function CustomAlert({ message, type, onClose }: AlertProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-close after 4 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const iconMap = {
    success: <FaCheckCircle className="text-green-500 text-2xl" />,
    error: <FaTimesCircle className="text-red-500 text-2xl" />,
    warning: <FaExclamationCircle className="text-yellow-500 text-2xl" />,
    info: <FaInfoCircle className="text-blue-500 text-2xl" />,
  };

  const bgColor = {
    success: "bg-green-100 border-green-500 text-green-800",
    error: "bg-red-100 border-red-500 text-red-800",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
    info: "bg-blue-100 border-blue-500 text-blue-800",
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.4 }}
          className={`fixed top-25 right-5 px-6 py-3 rounded-lg shadow-lg border-l-4 ${bgColor[type]} flex items-center space-x-3 z-70`}
        >
          {iconMap[type]}
          <p className="font-medium">{message}</p>
          <button onClick={onClose} className="ml-4 text-lg text-gray-700 hover:text-gray-900">
            &times;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
