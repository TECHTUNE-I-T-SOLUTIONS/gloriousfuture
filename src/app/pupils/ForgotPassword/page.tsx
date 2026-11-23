"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, Mail, Send } from "lucide-react";
import AuthAlert from "@/components/auth/AuthAlert";
import AuthField from "@/components/auth/AuthField";
import AuthShell from "@/components/auth/AuthShell";

type AlertType = "success" | "error" | "warning" | "info";
type AlertState = { message: string; type: AlertType };

const toneFor = (type: AlertType): "error" | "success" | "info" => (type === "warning" ? "error" : type);

export default function PupilForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setAlert({ message: "Please enter your email address.", type: "warning" });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setAlert({ message: "Please enter a valid email address.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pupils/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setEmailSent(true);
        setAlert({ message: "If an account exists for that email, a reset link is on its way.", type: "success" });
      } else {
        setAlert({ message: "Unable to send reset instructions. Please check the address and try again.", type: "error" });
      }
    } catch {
      setAlert({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const startOver = () => {
    setEmailSent(false);
    setEmail("");
    setAlert(null);
  };

  return (
    <AuthShell
      role="student"
      title="Reset your password"
      description="Enter the email registered for your pupil account and we will send a reset link."
    >
      <div className="gfa-card p-5 sm:p-7" aria-busy={loading}>
        {alert && !emailSent && (
          <div className="mb-5">
            <AuthAlert message={alert.message} tone={toneFor(alert.type)} onDismiss={() => setAlert(null)} />
          </div>
        )}

        {!emailSent ? (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <AuthField id="email" label="Email address" required hint="Use the email your school has on file for you.">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                className="gfa-input"
              />
            </AuthField>

            <button
              type="submit"
              disabled={loading}
              className="gfa-btn gfa-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Sending link…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send reset link
                </>
              )}
            </button>
            {loading && (
              <span role="status" className="sr-only">
                Sending reset link…
              </span>
            )}
          </form>
        ) : (
          <div className="space-y-5">
            <AuthAlert
              message="If an account exists for that email, a reset link is on its way."
              tone="success"
            />
            <div className="rounded-xl border border-brand-line bg-brand-mist/60 p-4">
              <h2 className="font-display text-lg text-brand-ink">What to do next</h2>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-brand-ink/75">
                <li>Open the reset email from your school portal.</li>
                <li>Follow the link and choose a new password.</li>
                <li>Check your spam folder if nothing arrives in a few minutes.</li>
              </ol>
            </div>
            <button type="button" onClick={startOver} className="gfa-btn gfa-btn-secondary w-full">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Use a different email
            </button>
          </div>
        )}

        <div className="mt-6 border-t border-brand-line pt-5 text-center">
          <Link
            href="/pupils/Login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-indigo hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to sign in
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
