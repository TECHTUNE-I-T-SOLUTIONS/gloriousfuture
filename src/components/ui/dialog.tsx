"use client";
import React from "react";
import { createPortal } from "react-dom";

type DialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  title?: string;
};

export const Dialog: React.FC<DialogProps> = ({ open, children }) => {
  if (typeof document === "undefined") return null;
  if (!open) return null;
  return createPortal(
    <div className={`fixed inset-0 z-50 flex items-center justify-center`}>
      {children}
    </div>,
    document.body
  );
};

export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-lg w-full mx-4 ${className}`} {...props}>
    {children}
  </div>
);

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => (
  <div className={`px-6 py-4 border-b border-slate-100 dark:border-slate-800 ${className}`} {...props}>
    {children}
  </div>
);

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = "", children, ...props }) => (
  <h2 className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </h2>
);

export const DialogDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => (
  <div className={`text-sm text-slate-600 dark:text-slate-300 ${className}`} {...props}>
    {children}
  </div>
);

export default Dialog;
