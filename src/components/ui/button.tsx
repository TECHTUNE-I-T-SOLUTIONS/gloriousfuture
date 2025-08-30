"use client";
import React from "react";

type ButtonVariants = "default" | "outline" | "ghost" | "destructive"
type ButtonSizes = "sm" | "md" | "lg"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariants
  size?: ButtonSizes
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className = "", children, variant = "default", size = "md", ...props }, ref) => {
  const sizeMap: Record<ButtonSizes, string> = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  }

  const variantMap: Record<ButtonVariants, string> = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "bg-transparent border border-slate-300 text-foreground hover:bg-slate-50",
    ghost: "bg-transparent text-foreground hover:bg-slate-50",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  }

  const classes = `inline-flex items-center gap-2 rounded-md font-medium disabled:opacity-60 disabled:cursor-not-allowed ${sizeMap[size]} ${variantMap[variant]} ${className}`.trim()

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button
