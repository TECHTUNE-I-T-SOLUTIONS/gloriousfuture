"use client"

import React from "react"

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={`w-full rounded-md border px-3 py-2 bg-white/80 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm resize-vertical ${className}`}
      {...props}
    />
  ),
)

Textarea.displayName = "Textarea"

export default Textarea
