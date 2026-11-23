"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, LoaderCircle } from "lucide-react";
import AuthAlert from "@/components/auth/AuthAlert";
import AuthField from "@/components/auth/AuthField";
import AuthShell from "@/components/auth/AuthShell";
import PasswordField from "@/components/auth/PasswordField";

const steps = [
  { label: "Details", title: "Personal information" },
  { label: "Teaching", title: "Teaching details" },
  { label: "Password", title: "Create password" },
  { label: "Review", title: "Ready to create account" },
  { label: "Done", title: "Registration complete" },
];

type AlertType = "success" | "error" | "warning" | "info";
type AlertState = { message: string; type: AlertType };

const toneFor = (type: AlertType): "error" | "success" | "info" => (type === "warning" ? "error" : type);

export default function TeacherSignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    class_taught: "",
    years_of_experience: "",
    uin: "",
    profile_picture: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setAlert({ message: "File size must be less than 5MB", type: "error" });
        return;
      }
      setFormData({ ...formData, profile_picture: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const checkPasswordStrength = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        if (!formData.full_name.trim() || !formData.username.trim() || !formData.email.trim()) {
          setAlert({ message: "Please fill in all required fields.", type: "warning" });
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          setAlert({ message: "Please enter a valid email address.", type: "error" });
          return false;
        }
        break;
      case 2:
        if (!formData.class_taught.trim() || !formData.years_of_experience.trim()) {
          setAlert({ message: "Please fill in all teaching details.", type: "warning" });
          return false;
        }
        if (isNaN(Number(formData.years_of_experience)) || Number(formData.years_of_experience) < 0) {
          setAlert({ message: "Please enter a valid number for years of experience.", type: "error" });
          return false;
        }
        break;
      case 3:
        if (formData.password !== formData.confirmPassword) {
          setAlert({ message: "Passwords do not match!", type: "error" });
          return false;
        }
        if (!checkPasswordStrength(formData.password)) {
          setAlert({
            message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character.",
            type: "warning",
          });
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setAlert(null);
    }
  };

  const handleSignup = async () => {
    setLoading(true);

    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "confirmPassword" && value !== null) {
        fd.append(key, value as string | File);
      }
    });

    try {
      const res = await fetch("/api/teacher/signup", { method: "POST", body: fd });
      const result = await res.json();
      if (res.ok) {
        setFormData({ ...formData, uin: result.uin || "" });
        setStep(5);
      } else {
        setAlert({ message: result.error || result.message || "Signup failed. Please try again.", type: "error" });
      }
    } catch {
      setAlert({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const copyUIN = () => {
    navigator.clipboard.writeText(formData.uin);
    setAlert({ message: "UIN copied to clipboard!", type: "info" });
  };

  const handleStepSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === 5) {
      router.push("/teacher/Login");
      return;
    }
    if (step === 4) {
      void handleSignup();
      return;
    }
    nextStep();
  };

  return (
    <AuthShell
      role="staff"
      title="Create your staff account"
      description="A few short steps to set up your place in the teaching portal."
    >
      <form onSubmit={handleStepSubmit} noValidate aria-busy={loading} className="gfa-card p-5 sm:p-7">
        {alert && (
          <div className="mb-5">
            <AuthAlert message={alert.message} tone={toneFor(alert.type)} onDismiss={() => setAlert(null)} />
          </div>
        )}

        <nav aria-label="Registration progress" className="mb-6">
          <ol className="flex flex-wrap gap-1.5 sm:gap-2">
            {steps.map((item, index) => {
              const number = index + 1;
              const current = number === step;
              const complete = number < step;
              return (
                <li
                  key={item.label}
                  aria-current={current ? "step" : undefined}
                  aria-label={`Step ${number} of ${steps.length}: ${item.title}${
                    complete ? " (completed)" : current ? " (current step)" : ""
                  }`}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold sm:px-3 ${
                    current
                      ? "border-brand-indigo bg-brand-indigo text-white"
                      : complete
                        ? "border-brand-line bg-brand-mist text-brand-ink"
                        : "border-brand-line bg-white text-brand-ink/45"
                  }`}
                >
                  {complete ? (
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">{number}</span>
                  )}
                  <span className="hidden md:inline">{item.label}</span>
                </li>
              );
            })}
          </ol>
        </nav>

        <div aria-live="polite" className="mb-6">
          <p className="gfa-eyebrow">
            Step {step} of {steps.length}
          </p>
          <h2 className="mt-1 font-display text-xl text-brand-ink sm:text-2xl">{steps[step - 1].title}</h2>
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <AuthField id="full_name" label="Full name" required>
              <input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                className="gfa-input"
              />
            </AuthField>
            <AuthField id="username" label="Username" required>
              <input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                autoComplete="username"
                className="gfa-input"
              />
            </AuthField>
            <AuthField id="email" label="Email address" required>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                autoComplete="email"
                className="gfa-input"
              />
            </AuthField>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <AuthField id="class_taught" label="Subject or class taught" required>
              <input
                id="class_taught"
                name="class_taught"
                value={formData.class_taught}
                onChange={handleChange}
                placeholder="e.g. Mathematics, Primary 3"
                className="gfa-input"
              />
            </AuthField>
            <AuthField id="years_of_experience" label="Years of experience" required>
              <input
                id="years_of_experience"
                name="years_of_experience"
                type="number"
                min="0"
                value={formData.years_of_experience}
                onChange={handleChange}
                placeholder="Years of teaching experience"
                className="gfa-input"
              />
            </AuthField>
            <div>
              <AuthField id="profile_picture" label="Profile picture" hint="Optional. Image files up to 5MB.">
                <input
                  id="profile_picture"
                  name="profile_picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="gfa-input file:mr-4 file:rounded-lg file:border-0 file:bg-brand-mist file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-ink hover:file:bg-brand-line/50"
                />
              </AuthField>
              {preview && (
                <div className="mt-3 flex items-center gap-3">
                  <Image
                    src={preview}
                    alt="Selected profile picture preview"
                    width={64}
                    height={64}
                    unoptimized
                    className="h-16 w-16 rounded-xl border border-brand-line object-cover"
                  />
                  <p className="text-xs text-brand-ink/60">This is how your picture will appear.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <PasswordField
              id="password"
              label="Password"
              value={formData.password}
              onChange={(value) => setFormData({ ...formData, password: value })}
              placeholder="Create a strong password"
              autoComplete="new-password"
              required
            />
            <PasswordField
              id="confirmPassword"
              label="Confirm password"
              value={formData.confirmPassword}
              onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
            />
            <div className="rounded-xl border border-brand-line bg-brand-mist/60 p-4 text-xs leading-relaxed text-brand-ink/70">
              <p className="font-semibold text-brand-ink">Your password must include:</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-brand-ink/70">
              Check your details, then create your staff ID. You can still go back if something needs changing.
            </p>
            <dl className="grid gap-3 rounded-xl border border-brand-line bg-brand-mist/60 p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-brand-ink/55">Full name</dt>
                <dd className="font-semibold text-brand-ink">{formData.full_name}</dd>
              </div>
              <div>
                <dt className="text-xs text-brand-ink/55">Email address</dt>
                <dd className="break-all font-semibold text-brand-ink">{formData.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-brand-ink/55">Class or subject</dt>
                <dd className="font-semibold text-brand-ink">{formData.class_taught}</dd>
              </div>
              <div>
                <dt className="text-xs text-brand-ink/55">Profile picture</dt>
                <dd className="font-semibold text-brand-ink">{formData.profile_picture ? "Added" : "Not added"}</dd>
              </div>
            </dl>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display text-xl text-brand-ink">Registration successful</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">
                Save your staff ID before you leave this page. You will need it to sign in.
              </p>
            </div>
            <div className="rounded-xl border border-brand-indigo/20 bg-brand-mist p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/55">Staff ID (UIN)</p>
              <p className="mt-1 break-all font-mono text-2xl font-bold tracking-wide text-brand-indigo">
                {formData.uin}
              </p>
            </div>
          </div>
        )}

        {step < 5 ? (
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="gfa-btn gfa-btn-secondary w-full sm:flex-1"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="gfa-btn gfa-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
            >
              {loading && step === 4 ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Creating account…
                </>
              ) : step === 4 ? (
                "Generate staff ID"
              ) : (
                <>
                  Next step
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={copyUIN} className="gfa-btn gfa-btn-secondary w-full sm:flex-1">
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copy staff ID
            </button>
            <button type="submit" className="gfa-btn gfa-btn-primary w-full sm:flex-1">
              Continue to sign in
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {loading && (
          <span role="status" className="sr-only">
            Creating account…
          </span>
        )}
      </form>

      {step < 5 && (
        <p className="mt-6 text-center text-sm text-brand-ink/70">
          Already have an account?{" "}
          <Link href="/teacher/Login" className="font-semibold text-brand-indigo hover:underline">
            Sign in here
          </Link>
        </p>
      )}
    </AuthShell>
  );
}
