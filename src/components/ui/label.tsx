"use client";
import React from "react";

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className = "", ...props }) => (
  <label className={`block text-sm font-medium text-slate-700 dark:text-slate-200 ${className}`} {...props}>
    {children}
  </label>
);

export default Label;
