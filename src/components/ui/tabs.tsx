"use client"

import React, { createContext, useContext, useState } from "react"

type TabsContextValue = { value: string; onChange: (v: string) => void }
const TabsContext = createContext<TabsContextValue | null>(null)

type TabsProps = { children?: React.ReactNode; defaultValue?: string; className?: string }
export const Tabs = ({ children, defaultValue = "", className = "" }: TabsProps) => {
  const [value, setValue] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ value, onChange: setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export const TabsList = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
)

export const TabsTrigger = ({ value, children, className = "" }: { value: string; children?: React.ReactNode; className?: string }) => {
  const ctx = useContext(TabsContext)
  if (!ctx) return null
  return (
    <button onClick={() => ctx.onChange(value)} className={className} data-value={value}>
      {children}
    </button>
  )
}

export const TabsContent = ({ value, children, className = "" }: { value: string; children?: React.ReactNode; className?: string }) => {
  const ctx = useContext(TabsContext)
  if (!ctx) return null
  return <div hidden={ctx.value !== value} className={className}>{children}</div>
}

export default Tabs
