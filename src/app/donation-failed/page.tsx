"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleDot, CircleX, Home, LoaderCircle, Mail, Phone, RotateCcw } from "lucide-react";

import CustomHeader from "@/components/CustomHeader";
import CustomFooter from "@/components/CustomFooter";
import PageHero from "@/components/public/PageHero";
import { siteConfig } from "@/lib/site-config";

const nextSteps = [
  "Check that your payment details are correct.",
  "Make sure you have sufficient funds.",
  "Try a different payment method.",
  "Contact your bank if the issue continues.",
];

function OutcomeFallback({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="gfa-container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center"
    >
      <LoaderCircle className="h-8 w-8 animate-spin text-brand-indigo" aria-hidden="true" />
      <p className="text-sm font-semibold text-brand-ink/70">{message}</p>
    </div>
  );
}

function DonationFailedContent() {
  const searchParams = useSearchParams();
  const reference = searchParams?.get("reference");

  return (
    <>
      <PageHero
        kicker="Donation not completed"
        title="Payment needs another try"
        description="Your donation did not go through. Here is what you can do next."
        icon={CircleX}
      />

      <section className="gfa-section">
        <div className="gfa-container">
          <div
            role="alert"
            className="gfa-card mx-auto max-w-3xl p-6 text-center sm:p-10"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-700">
              <CircleX className="h-8 w-8" aria-hidden="true" />
            </span>
            <h2 className="mt-6 font-display text-3xl leading-tight text-brand-ink sm:text-4xl">
              We could not process that payment
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-brand-ink/70 sm:text-base">
              No money has been recorded for this donation. You are welcome to try again with the same
              details or a different payment method.
            </p>

            <div className="mx-auto mt-7 max-w-md rounded-xl border border-brand-line bg-brand-surface px-5 py-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-bronze">
                Transaction reference
              </p>
              <p className="mt-2 break-all font-mono text-sm font-semibold text-brand-ink">
                {reference || "No reference was supplied"}
              </p>
            </div>

            <div className="mt-8 rounded-xl bg-brand-mist p-5 text-left sm:p-6">
              <h3 className="font-display text-xl text-brand-ink">What you can do</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {nextSteps.map((step) => (
                  <li key={step} className="flex gap-2 text-sm leading-relaxed text-brand-ink/75">
                    <CircleDot className="mt-0.5 h-4 w-4 shrink-0 text-brand-indigo" aria-hidden="true" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/donation" className="gfa-btn gfa-btn-primary">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Try again
              </Link>
              <Link href="/" className="gfa-btn gfa-btn-secondary">
                <Home className="h-4 w-4" aria-hidden="true" />
                Back to home
              </Link>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-brand-ink/55">
              Need help? Email{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-flex items-center gap-1 font-semibold text-brand-indigo hover:underline"
              >
                <Mail className="h-3 w-3" aria-hidden="true" />
                {siteConfig.contact.email}
              </a>{" "}
              or call{" "}
              <a
                href={`tel:${siteConfig.contact.telephone}`}
                className="inline-flex items-center gap-1 font-semibold text-brand-indigo hover:underline"
              >
                <Phone className="h-3 w-3" aria-hidden="true" />
                {siteConfig.contact.telephoneLabel}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default function DonationFailedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-surface">
      <CustomHeader />
      <main className="flex-1">
        <Suspense fallback={<OutcomeFallback message="Checking your payment status…" />}>
          <DonationFailedContent />
        </Suspense>
      </main>
      <CustomFooter />
    </div>
  );
}
