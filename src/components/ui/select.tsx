/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React from "react"

type SelectProps = {
  children?: React.ReactNode
  value?: string
  onValueChange?: (v: string) => void
  className?: string
  ariaLabel?: string
}

export const Select = ({ children, value, onValueChange, className = "", ariaLabel = "select" }: SelectProps) => {
  // Extract SelectContent children (options) if present
  const options: React.ReactNode[] = []
  let optIndex = 0
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    const reactChild = child as React.ReactElement<any>
    const typeName = (reactChild.type as any)?.displayName || (reactChild.type as any)?.name
    if (typeName === "SelectContent") {
      React.Children.forEach(reactChild.props.children, (c) => {
        if (!React.isValidElement(c)) return
        const reactC = c as React.ReactElement<any>
        const itemType = (reactC.type as any)?.displayName || (reactC.type as any)?.name
        if (itemType === "SelectItem") {
          options.push(
            reactC.props.children
              ? React.createElement("option", { key: `select-opt-${optIndex++}-${String(reactC.props.value ?? '')}`, value: reactC.props.value }, reactC.props.children)
              : null,
          )
        }
      })
    }
    if (typeName === "SelectItem") {
      options.push(React.createElement("option", { key: `select-opt-${optIndex++}-${String(reactChild.props.value ?? '')}`, value: reactChild.props.value }, reactChild.props.children))
    }
  })

  return (
    <div className={`inline-block w-full ${className}`}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className="w-full rounded-md border px-3 py-2 bg-white/80 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm"
      >
        {options.length > 0 ? options : children}
      </select>
    </div>
  )
}

export const SelectTrigger = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
)

export const SelectContent = ({ children }: { children?: React.ReactNode }) => <>{children}</>

export const SelectItem = ({ value, children }: { value: string; children?: React.ReactNode }) => (
  <option value={value}>{children}</option>
)

export const SelectValue = ({ placeholder }: { placeholder?: string }) => <>{placeholder}</>

export default Select
