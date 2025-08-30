"use client";
import React from "react";

export const Progress: React.FC<{ value?: number; className?: string } & React.HTMLAttributes<HTMLDivElement>> = ({ value = 0, className = "", ...props }) => {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full ${className}`} {...props}>
      <progress className="w-full appearance-none h-2 rounded-full overflow-hidden" value={pct} max={100} />
    </div>
  );
};

export default Progress;
