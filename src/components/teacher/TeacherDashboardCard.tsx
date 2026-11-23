"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

interface TeacherDashboardCardProps {
 title: string;
 onClick: () => void;
 icon: ReactNode;
 description?: string;
 count?: number;
}

export default function TeacherDashboardCard({ title, onClick, icon, description, count }: TeacherDashboardCardProps) {
 return (
  <button
   type="button"
   onClick={onClick}
   className="group relative w-full overflow-hidden rounded-2xl border border-brand-line bg-white p-5 text-left shadow-sm transition-colors hover:border-brand-indigo/40"
  >
   <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-brand-gold/70 to-transparent" aria-hidden="true" />
   <div className="flex items-start justify-between gap-3">
    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-indigo/10 text-brand-indigo">{icon}</span>
    {count !== undefined && (
     <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-mist px-2 text-xs font-semibold text-brand-indigo">
      {count > 99 ? "99+" : count}
     </span>
    )}
   </div>
   <h3 className="mt-5 text-sm font-semibold text-brand-ink">{title}</h3>
   {description && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-brand-ink/55">{description}</p>}
   <ArrowUpRight aria-hidden="true" className="absolute bottom-5 right-5 h-4 w-4 text-brand-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-indigo" />
  </button>
 );
}
