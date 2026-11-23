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

const classOptions = [
  "Creche",
  "Pre-Nursery",
  "Nursery One",
  "Nursery Two",
  "Primary One",
  "Primary Two",
  "Primary Three",
  "Primary Four",
  "Primary Five",
];

const steps = [
  { label: "Details", title: "Basic information" },
  { label: "Family", title: "Parent information" },
  { label: "Guardian", title: "Guardian information" },
  { label: "Password", title: "Create password" },
  { label: "Class", title: "Class and profile" },
  { label: "Review", title: "Ready to create account" },
  { label: "Done", title: "Registration complete" },
];

type AlertType = "success" | "error" | "warning" | "info";
type AlertState = { message: string; type: AlertType };

const toneFor = (type: AlertType): "error" | "success" | "info" => (type === "warning" ? "error" : type);

export default function PupilSignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    father_name: "",
    mother_name: "",
    guardian_name: "",
    guardian_contact: "",
    classLevel: "",
    password: "",
    confirmPassword: "",
    profile_picture: null as File | null,
    uin: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlert({ message: "File size must be less than 5MB", type: "error" });
        return;
      }
      setFormData({ ...formData, profile_picture: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
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
        if (!formData.full_name.trim() || !formData.phone_number.trim() || !formData.email.trim()) {
          setAlert({ message: "Please fill in all required fields.", type: "warning" });
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          setAlert({ message: "Please enter a valid email address.", type: "error" });
          return false;
        }
        break;
      case 2:
        if (!formData.father_name.trim() || !formData.mother_name.trim()) {
          setAlert({ message: "Please fill in parent information.", type: "warning" });
          return false;
        }
        break;
      case 3:
        if (!formData.guardian_name.trim() || !formData.guardian_contact.trim()) {
          setAlert({ message: "Please fill in guardian information.", type: "warning" });
          return false;
        }
        break;
      case 4:
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
      case 5:
        if (!formData.classLevel.trim()) {
          setAlert({ message: "Please select a class.", type: "warning" });
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

  const generateUIN = async () => {
    setLoading(true);
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "confirmPassword" && value !== null) {
        fd.append(key, value as string | File);
      }
    });

    try {
      const res = await fetch("/api/pupils/signup", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, uin: data.uin });
        setStep(7);
      } else {
        setAlert({ message: data.error || "Signup failed", type: "error" });
      }
    } catch {
      setAlert({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const copyUIN = () => {
    if (!formData.uin) return;
    navigator.clipboard.writeText(formData.uin);
    setAlert({ message: "UIN copied to clipboard!", type: "info" });
  };

  const handleStepSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === 7) {
      router.push("/pupils/Login");
      return;
    }
    if (step === 6) {
      void generateUIN();
      return;
    }
    nextStep();
  };

  return (
    <AuthShell
      role="student"
      title="Create your pupil account"
      description="A few short steps to set up your place in the learning portal."
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
            <AuthField id="phone_number" label="Phone number" required>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
                autoComplete="tel"
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
            <AuthField id="father_name" label="Father's name" required>
              <input
                id="father_name"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
                placeholder="Enter father's name"
                className="gfa-input"
              />
            </AuthField>
            <AuthField id="mother_name" label="Mother's name" required>
              <input
                id="mother_name"
                name="mother_name"
                value={formData.mother_name}
                onChange={handleChange}
                placeholder="Enter mother's name"
                className="gfa-input"
              />
            </AuthField>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <AuthField id="guardian_name" label="Guardian's name" required>
              <input
                id="guardian_name"
                name="guardian_name"
                value={formData.guardian_name}
                onChange={handleChange}
                placeholder="Enter guardian's name"
                className="gfa-input"
              />
            </AuthField>
            <AuthField id="guardian_contact" label="Guardian's contact" required>
              <input
                id="guardian_contact"
                name="guardian_contact"
                value={formData.guardian_contact}
                onChange={handleChange}
                placeholder="Enter guardian's phone number or email"
                className="gfa-input"
              />
            </AuthField>
          </div>
        )}

        {step === 4 && (
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

        {step === 5 && (
          <div className="space-y-5">
            <AuthField id="classLevel" label="Class" required>
              <select
                id="classLevel"
                name="classLevel"
                value={formData.classLevel}
                onChange={handleChange}
                className="gfa-input"
              >
                <option value="">Select your class</option>
                {classOptions.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </AuthField>
            <div>
              <AuthField id="profile_picture" label="Profile picture" hint="Optional. Image files up to 5MB.">
                <input
                  id="profile_picture"
                  name="profile_picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="gfa-input file:mr-4 file:rounded-lg file:border-0 file:bg-brand-mist file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-ink hover:file:bg-brand-line/50"
                />
              </AuthField>
              {imagePreview && (
                <div className="mt-3 flex items-center gap-3">
                  <Image
                    src={imagePreview}
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

        {step === 6 && (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-brand-ink/70">
              Check your details, then create your pupil ID. You can still go back if something needs changing.
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
                <dt className="text-xs text-brand-ink/55">Class</dt>
                <dd className="font-semibold text-brand-ink">{formData.classLevel}</dd>
              </div>
              <div>
                <dt className="text-xs text-brand-ink/55">Profile picture</dt>
                <dd className="font-semibold text-brand-ink">{formData.profile_picture ? "Added" : "Not added"}</dd>
              </div>
            </dl>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-5 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display text-xl text-brand-ink">Registration successful</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">
                Save your pupil ID before you leave this page. You will need it to sign in.
              </p>
            </div>
            <div className="rounded-xl border border-brand-indigo/20 bg-brand-mist p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/55">Pupil ID (UIN)</p>
              <p className="mt-1 break-all font-mono text-2xl font-bold tracking-wide text-brand-indigo">
                {formData.uin}
              </p>
            </div>
          </div>
        )}

        {step < 7 ? (
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
              {loading && step === 6 ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Creating account…
                </>
              ) : step === 6 ? (
                "Generate pupil ID"
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
              Copy pupil ID
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

      {step < 7 && (
        <p className="mt-6 text-center text-sm text-brand-ink/70">
          Already have an account?{" "}
          <Link href="/pupils/Login" className="font-semibold text-brand-indigo hover:underline">
            Sign in here
          </Link>
        </p>
      )}
    </AuthShell>
  );
}
