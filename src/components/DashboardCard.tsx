"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export default function DashboardCard({ title, icon, color }: { title: string; icon: ReactNode; color: string }) {
 return (
  <div className="group relative overflow-hidden rounded-2xl border border-brand-line bg-white p-5 text-left shadow-sm transition-colors hover:border-brand-indigo/40">
   <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-brand-gold/70 to-transparent" aria-hidden="true" />
   <div className="flex items-start justify-between gap-3">
    <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${color}`}>{icon}</span>
    <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-brand-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-indigo" />
   </div>
   <h3 className="mt-5 text-sm font-semibold text-brand-ink">{title}</h3>
   <p className="mt-1 text-xs text-brand-ink/50">Open workspace</p>
  </div>
 );
}
