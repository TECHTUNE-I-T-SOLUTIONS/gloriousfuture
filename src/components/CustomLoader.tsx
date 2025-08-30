"use client";

// import { motion } from "framer-motion";

// export default function CustomLoader() {
//   return (
//     <div className="fixed inset-0 bg-transparent flex items-center justify-center z-[100]">
//       <motion.div
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.3 }}
//         className="flex flex-col items-center"
//       >
//         {/* Modern Dual-Circle Loader */}
//         <div className="relative">
//           <div className="h-12 w-12 border-4 border-t-transparent border-black rounded-full animate-spin absolute"></div>
//           {/*<div className="h-8 w-8 border-4 border-t-transparent border-blue-400 rounded-full animate-spin-slow"></div>*/}
//         </div>

//         {/*<p className="mt-4 text-lg font-semibold text-black">Processing...</p>*/}
//       </motion.div>
//     </div>
//   );
// }


import type React from "react"

interface LoaderProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const Loader: React.FC<LoaderProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 ${sizeClasses[size]}`}
      ></div>
    </div>
  )
}

export default Loader
