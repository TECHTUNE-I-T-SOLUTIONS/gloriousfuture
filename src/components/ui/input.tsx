"use client";
import React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full rounded-md border px-3 py-2 bg-white/80 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm ${className}`}
      {...props}
    />
  )
);

Input.displayName = "Input";

export default Input;
