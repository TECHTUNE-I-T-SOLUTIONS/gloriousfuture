"use client";
import React from "react";

export const Separator: React.FC<React.HTMLAttributes<HTMLHRElement>> = ({ className = "", ...props }) => (
  <hr className={`my-3 border-slate-100 dark:border-slate-800 ${className}`} {...props} />
);

export default Separator;
