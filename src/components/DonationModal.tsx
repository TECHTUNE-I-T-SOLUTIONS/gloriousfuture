"use client";

import Link from "next/link";
import { ArrowRight, Building2, Gift, GraduationCap, LockKeyhole, Sparkles, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

type DonationModalProps = {
 isOpen: boolean;
 onClose: () => void;
};

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4">
   <button type="button" aria-label="Close donation message" onClick={onClose} className="absolute inset-0 bg-brand-ink/65 backdrop-blur-sm" />
   <div role="dialog" aria-modal="true" aria-labelledby="donation-dialog-title" className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[1.5rem] bg-white shadow-2xl">
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-indigo to-brand-violet px-6 pb-8 pt-7 text-center text-white">
     <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/15" />
     <button type="button" onClick={onClose} aria-label="Close donation message" autoFocus className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20">
      <X aria-hidden="true" className="h-4 w-4" />
     </button>
     <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
      <Gift aria-hidden="true" className="h-6 w-6 text-brand-gold" />
     </div>
     <h2 id="donation-dialog-title" className="font-display text-2xl font-semibold">Make a difference</h2>
     <p className="mx-auto mt-2 max-w-xs text-sm text-indigo-100/80">
      Help us build better learning spaces for the pupils of Glorious Future Academy.
     </p>
    </div>

    <div className="space-y-5 p-6">
     <div className="flex items-start gap-3 rounded-xl border border-brand-line bg-brand-surface p-4">
      <Building2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand-indigo" />
      <p className="text-sm text-brand-ink/70">
       <span className="block font-semibold text-brand-ink">New campus fund</span>
       {siteConfig.contact.streetAddress}, {siteConfig.contact.addressLocality}, {siteConfig.contact.addressRegion}
      </p>
     </div>

     <div className="grid grid-cols-3 gap-2">
      {[
       { label: "Learning", icon: GraduationCap },
       { label: "Campus", icon: Building2 },
       { label: "Future", icon: Sparkles },
      ].map((item) => {
       const Icon = item.icon;
       return (
        <div key={item.label} className="rounded-xl border border-brand-line bg-white p-3 text-center">
         <Icon aria-hidden="true" className="mx-auto mb-1.5 h-5 w-5 text-brand-indigo" />
         <span className="text-xs font-semibold text-brand-ink/70">{item.label}</span>
        </div>
       );
      })}
     </div>

     <Link href="/donation" onClick={onClose} className="gfa-btn gfa-btn-primary w-full">
      Donate now
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
     </Link>
     <button type="button" onClick={onClose} className="w-full text-sm font-semibold text-brand-ink/55 hover:text-brand-indigo">
      Maybe later
     </button>
     <p className="flex items-center justify-center gap-2 text-xs text-brand-ink/50">
      <LockKeyhole aria-hidden="true" className="h-3.5 w-3.5" />
      Secure payment via Paystack
     </p>
    </div>
   </div>
  </div>
 );
}
