"use client";
import React from "react";

export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "accent" | "success" | "secondary" | "outline" | "destructive" }> = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold";
  const variants: Record<string, string> = {
    default: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
    accent: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
    secondary: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    outline: "bg-transparent border border-slate-300 text-foreground",
    destructive: "bg-red-100 text-red-800",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
