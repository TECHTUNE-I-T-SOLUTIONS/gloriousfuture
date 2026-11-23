"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function useDashboardViewport() {
 const [viewport, setViewport] = useState<"mobile" | "desktop">("desktop");

 useEffect(() => {
  const update = () => setViewport(window.innerWidth < 768 ? "mobile" : "desktop");
  update();
  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
 }, []);

 return viewport;
}

export function DashboardBrand({ compact = false, role }: { compact?: boolean; role: string }) {
 return (
  <div className={`flex min-w-0 items-center ${compact ? "justify-center" : "gap-3"}`}>
   <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10">
    <Image src="/apple-touch-icon.png" alt="" width={28} height={28} className="rounded-lg bg-white p-0.5" />
   </span>
   {!compact && (
    <span className="min-w-0">
     <span className="block truncate font-display text-sm leading-tight text-white">Glorious Future</span>
     <span className="block truncate text-[11px] uppercase tracking-[0.12em] text-brand-gold/80">{role}</span>
    </span>
   )}
  </div>
 );
}

export function DashboardNavButton({
 icon: Icon,
 label,
 active,
 compact,
 onClick,
 danger = false,
}: {
 icon: LucideIcon;
 label: string;
 active?: boolean;
 compact: boolean;
 onClick: () => void;
 danger?: boolean;
}) {
 return (
  <button
   type="button"
   onClick={onClick}
   title={compact ? label : undefined}
   aria-label={compact ? label : undefined}
   aria-current={active ? "page" : undefined}
   className={`group relative flex w-full items-center rounded-xl px-3 py-2.5 text-sm transition-colors ${
    compact ? "justify-center" : "gap-3"
   } ${
    danger
     ? "text-rose-200 hover:bg-rose-500/15 hover:text-white"
     : active
       ? "bg-white/12 text-white"
       : "text-white/65 hover:bg-white/8 hover:text-white"
   }`}
  >
   {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-brand-gold" aria-hidden="true" />}
   <Icon aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
   {!compact && <span className="truncate font-medium">{label}</span>}
  </button>
 );
}

export function DashboardPageIntro({
 title,
 description,
 actions,
}: {
 title: string;
 description?: string;
 actions?: ReactNode;
}) {
 return (
  <div className="mb-7 flex flex-col gap-4 border-b border-brand-line pb-6 sm:flex-row sm:items-end sm:justify-between">
   <div className="min-w-0">
    <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">{title}</h1>
    {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-ink/60">{description}</p>}
   </div>
   {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
 );
}

export type DashboardStat = {
 label: string;
 value: string | number;
 detail?: string;
 icon?: LucideIcon;
};

export function DashboardStatStrip({ items }: { items: DashboardStat[] }) {
 return (
  <div className="mb-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-brand-line bg-white lg:grid-cols-4">
   {items.map(({ label, value, detail, icon: Icon }, index) => (
    <div
     key={label}
     className={`relative min-w-0 px-4 py-5 sm:px-5 ${index > 0 ? "border-l border-brand-line" : ""} ${
      index === 2 ? "max-lg:border-l-0 max-lg:border-t" : ""
     } ${index > 1 ? "max-lg:border-t" : ""}`}
    >
     <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-brand-gold/70 to-transparent" aria-hidden="true" />
     <div className="flex items-start justify-between gap-2">
      <p className="text-xs font-medium text-brand-ink/55">{label}</p>
      {Icon && <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-indigo/60" />}
     </div>
     <p className="mt-2 font-display text-3xl font-semibold leading-none text-brand-ink sm:text-4xl">{value}</p>
     {detail && <p className="mt-2 truncate text-[11px] text-brand-ink/50">{detail}</p>}
    </div>
   ))}
  </div>
 );
}

export function DashboardTableFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
 return (
  <div className={`overflow-hidden rounded-2xl border border-brand-line bg-white ${className}`}>
   <div className="gfa-table-scroll">{children}</div>
  </div>
 );
}
