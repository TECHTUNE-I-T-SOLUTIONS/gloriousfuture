"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CircleCheck,
  GraduationCap,
  HeartHandshake,
  LoaderCircle,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Wallet,
} from "lucide-react";

import CustomHeader from "@/components/CustomHeader";
import CustomFooter from "@/components/CustomFooter";
import PageHero from "@/components/public/PageHero";
import { siteConfig } from "@/lib/site-config";

interface DonationFormData {
  fullName: string;
  email: string;
  phone: string;
  amount: string;
  donationType: "one-time" | "recurring";
  message: string;
}

const impactAreas = [
  {
    icon: BookOpen,
    title: "Learning resources",
    description: "Textbooks and digital tools for every classroom.",
  },
  {
    icon: Building2,
    title: "Campus facilities",
    description: "Modern spaces where pupils can learn with confidence.",
  },
  {
    icon: GraduationCap,
    title: "Scholarships",
    description: "Places for deserving students who need support.",
  },
  {
    icon: Sparkles,
    title: "Student programmes",
    description: "Clubs, competitions and creative activities.",
  },
];

export default function DonationPage() {
  const [formData, setFormData] = useState<DonationFormData>({
    fullName: "",
    email: "",
    phone: "",
    amount: "",
    donationType: "one-time",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process donation");
      }

      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        setSuccessMessage("Donation processed successfully!");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          amount: "",
          donationType: "one-time",
          message: "",
        });
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-brand-surface">
      <CustomHeader />

      <main className="flex-1">
        <PageHero
          kicker="Support our school"
          title="Give a brighter future"
          description="Help us build a stronger learning environment at our new campus in Oro, Kwara State. Every gift supports a pupil’s next step."
          icon={HeartHandshake}
        >
          <Link href="/" className="gfa-btn gfa-btn-secondary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <span className="gfa-chip">
            <ShieldCheck className="h-4 w-4 text-brand-gold" aria-hidden="true" />
            Secure Paystack checkout
          </span>
        </PageHero>

        <section className="gfa-section" aria-label="Donation details">
          <div className="gfa-container grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] lg:items-start">
            <aside className="lg:sticky lg:top-32">
              <div className="gfa-card p-6 sm:p-8">
                <p className="gfa-eyebrow">Your giving at work</p>
                <h2 className="mt-3 font-display text-3xl leading-tight text-brand-ink">
                  Every gift has a place
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink/65">
                  Your support helps us provide the tools, spaces and opportunities pupils need to thrive.
                </p>

                <ul className="mt-7 space-y-4">
                  {impactAreas.map(({ icon: Icon, title, description }) => (
                    <li key={title} className="flex gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-mist text-brand-indigo">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-brand-ink">{title}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-brand-ink/65">
                          {description}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 border-t border-brand-line pt-6">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
                    <MapPin className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                    New campus
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">
                    {siteConfig.contact.streetAddress}, {siteConfig.contact.addressLocality},{" "}
                    {siteConfig.contact.addressRegion}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-brand-indigo">
                    <a
                      href={`tel:${siteConfig.contact.telephone}`}
                      className="inline-flex items-center gap-1.5 hover:text-brand-ink"
                    >
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      {siteConfig.contact.telephoneLabel}
                    </a>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="inline-flex items-center gap-1.5 break-all hover:text-brand-ink"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>
              </div>

              <p className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                Payments are processed securely through Paystack.
              </p>
            </aside>

            <div className="gfa-card p-6 sm:p-8 lg:p-10">
              <p className="gfa-eyebrow">Make a donation</p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-brand-ink">
                Choose your gift
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-ink/65">
                Complete the details below. You will be taken to Paystack to finish payment securely.
              </p>
              <p className="mt-5 rounded-xl bg-brand-mist px-4 py-3 text-sm text-brand-ink/75">
                Fields marked <strong className="font-semibold text-brand-ink">Required</strong> must be completed.
              </p>

              {successMessage && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                >
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <p className="font-semibold">{successMessage}</p>
                </div>
              )}

              {errorMessage && (
                <div
                  role="alert"
                  className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                >
                  <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <p className="font-semibold">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-7 space-y-5" aria-busy={isLoading}>
                <div>
                  <label htmlFor="donation-name" className="gfa-label">
                    Full name <span className="ml-1 text-xs font-medium text-brand-bronze">Required</span>
                  </label>
                  <input
                    id="donation-name"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className="gfa-input"
                  />
                </div>

                <div>
                  <label htmlFor="donation-email" className="gfa-label">
                    Email address <span className="ml-1 text-xs font-medium text-brand-bronze">Required</span>
                  </label>
                  <input
                    id="donation-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="your.email@example.com"
                    aria-describedby="donation-email-hint"
                    className="gfa-input"
                  />
                  <p id="donation-email-hint" className="mt-1.5 text-xs text-brand-ink/55">
                    We will send a confirmation receipt here.
                  </p>
                </div>

                <div>
                  <label htmlFor="donation-phone" className="gfa-label">
                    Phone number <span className="ml-1 text-xs font-medium text-brand-bronze">Required</span>
                  </label>
                  <input
                    id="donation-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    placeholder="+234 XXX XXX XXXX"
                    className="gfa-input"
                  />
                </div>

                <div>
                  <label htmlFor="donation-amount" className="gfa-label">
                    Donation amount <span className="ml-1 text-xs font-medium text-brand-bronze">Required</span>
                  </label>
                  <div className="relative">
                    <Wallet
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink/55"
                      aria-hidden="true"
                    />
                    <input
                      id="donation-amount"
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      min="1000"
                      placeholder="Enter amount in Naira"
                      aria-describedby="donation-amount-hint"
                      className="gfa-input pl-11"
                    />
                  </div>
                  <p id="donation-amount-hint" className="mt-1.5 text-xs text-brand-ink/55">
                    Minimum: ₦1,000. There is no maximum.
                  </p>
                </div>

                <fieldset>
                  <legend className="gfa-label">
                    Donation type <span className="ml-1 text-xs font-medium text-brand-bronze">Required</span>
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label
                      htmlFor="donation-one-time"
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-semibold transition-colors ${
                        formData.donationType === "one-time"
                          ? "border-brand-indigo bg-brand-mist text-brand-ink"
                          : "border-brand-line bg-white text-brand-ink/75 hover:border-brand-indigo"
                      }`}
                    >
                      <input
                        id="donation-one-time"
                        type="radio"
                        name="donationType"
                        value="one-time"
                        checked={formData.donationType === "one-time"}
                        onChange={handleChange}
                        className="h-4 w-4 shrink-0 accent-indigo-700"
                      />
                      One-time
                    </label>
                    <label
                      htmlFor="donation-monthly"
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-semibold transition-colors ${
                        formData.donationType === "recurring"
                          ? "border-brand-indigo bg-brand-mist text-brand-ink"
                          : "border-brand-line bg-white text-brand-ink/75 hover:border-brand-indigo"
                      }`}
                    >
                      <input
                        id="donation-monthly"
                        type="radio"
                        name="donationType"
                        value="recurring"
                        checked={formData.donationType === "recurring"}
                        onChange={handleChange}
                        className="h-4 w-4 shrink-0 accent-indigo-700"
                      />
                      Monthly
                    </label>
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="donation-message" className="gfa-label flex items-center gap-2">
                    <MessageSquareText className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                    Message <span className="text-xs font-medium text-brand-ink/55">(optional)</span>
                  </label>
                  <textarea
                    id="donation-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share why you are supporting us…"
                    rows={3}
                    maxLength={500}
                    aria-describedby="donation-message-count"
                    className="gfa-input min-h-[6rem] resize-y"
                  />
                  <p
                    id="donation-message-count"
                    role="status"
                    aria-live="polite"
                    className="mt-1.5 text-right text-xs text-brand-ink/55"
                  >
                    {formData.message.length}/500
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="gfa-btn gfa-btn-primary w-full !min-h-[3.25rem] !text-base disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
                      Processing donation…
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                      Donate now
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>
                {isLoading && (
                  <p role="status" aria-live="polite" className="sr-only">
                    Redirecting you to the secure payment page.
                  </p>
                )}

                <p className="flex items-start gap-2 rounded-xl border border-brand-line bg-brand-surface p-4 text-xs leading-relaxed text-brand-ink/65">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-indigo" aria-hidden="true" />
                  Your donation is processed through Paystack with industry-leading encryption. We do not store
                  sensitive payment details on our servers.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <CustomFooter />
    </div>
  );
}
