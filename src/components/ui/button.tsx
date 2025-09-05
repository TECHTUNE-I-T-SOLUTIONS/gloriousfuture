"use client";
import React from "react";

type ButtonVariants = "default" | "outline" | "ghost" | "destructive"
type ButtonSizes = "sm" | "md" | "lg"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariants
  size?: ButtonSizes
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className = "", children, variant = "default", size = "md", asChild, ...props }, ref) => {
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

  const classes = `inline-flex items-center justify-center text-center gap-2 rounded-md font-medium disabled:opacity-60 disabled:cursor-not-allowed ${sizeMap[size]} ${variantMap[variant]} ${className}`.trim()

  // If asChild is true and a single React element child is provided, render that child
  // with the computed classes to avoid forwarding the `asChild` prop to the DOM.
  if (asChild && React.isValidElement(children)) {
    type ChildProps = { className?: string }
    const child = React.Children.only(children) as React.ReactElement<ChildProps>
    const childClassName = [child.props?.className || "", classes].filter(Boolean).join(" ")
    return React.cloneElement(child, { className: childClassName })
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button
