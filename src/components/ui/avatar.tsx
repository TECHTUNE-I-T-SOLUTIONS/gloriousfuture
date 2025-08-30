"use client";
import React from "react";
import Image from "next/image";

export const Avatar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={`inline-flex items-center justify-center rounded-full overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

export const AvatarImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ className = "w-10 h-10 object-cover", alt = "avatar", src = "" }) => (
  <div className={`relative ${className}`}>
    <Image src={String(src)} alt={alt} fill style={{ objectFit: "cover" }} />
  </div>
);

export const AvatarFallback: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "w-10 h-10 bg-slate-200 text-slate-700 flex items-center justify-center", children, ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

export default Avatar;
