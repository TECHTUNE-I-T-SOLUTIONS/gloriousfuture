"use client";
import React from "react";

export const Alert: React.FC<{ children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={`rounded-md p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 text-sm ${className}`} {...props}>
    {children}
  </div>
);

export const AlertDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={`text-sm text-slate-700 dark:text-slate-300 ${className}`} {...props}>
    {children}
  </div>
);

export default Alert;
