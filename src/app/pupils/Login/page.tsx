"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoaderCircle, LogIn, ShieldCheck } from "lucide-react";
import AuthAlert from "@/components/auth/AuthAlert";
import AuthShell from "@/components/auth/AuthShell";
import PasswordField from "@/components/auth/PasswordField";
import UinField from "@/components/auth/UinField";

type AlertType = "success" | "error" | "warning" | "info";
type AlertState = { message: string; type: AlertType };

const STORAGE_KEY = "gfa-pupil-uin";

const toneFor = (type: AlertType): "error" | "success" | "info" => (type === "warning" ? "error" : type);

export default function PupilLoginPage() {
  const [uin, setUIN] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const digits = uin.replace(/^GFA-P-/i, "");

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => {
        if (!mounted) return;
        if (res.ok) router.push("/pupils/pupil-dashboard");
      })
      .catch(() => {});

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && /^\d{4}$/.test(saved)) {
        setUIN(`GFA-P-${saved}`);
        setRemember(true);
      }
    } catch {
      // Local storage is optional; signing in still works without it.
    }

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!uin.trim() || !password.trim()) {
      setAlert({ message: "Please fill in all fields.", type: "warning" });
      return;
    }

    const pupilPattern = /^GFA-P-\d{4}$/i;
    if (!pupilPattern.test(uin.trim())) {
      setAlert({ message: "Please enter a valid Pupil UIN (e.g. GFA-P-0123).", type: "warning" });
      return;
    }

    try {
      if (remember) window.localStorage.setItem(STORAGE_KEY, digits);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Local storage is optional; signing in still works without it.
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pupils/login", {
        method: "POST",
        body: JSON.stringify({ uin, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const sessionRes = await fetch("/api/auth/session", { credentials: "include" });
        if (!sessionRes.ok) {
          setAlert({ message: "Login succeeded but session verification failed.", type: "warning" });
          return;
        }
        const sessionBody = await sessionRes.json().catch(() => ({}));
        const sessionUin = sessionBody?.session?.uin;
        if (typeof sessionUin === "string" && sessionUin.startsWith("GFA-P-")) {
          setAlert({ message: "Login successful!", type: "success" });
          setTimeout(() => router.push("/pupils/pupil-dashboard"), 800);
        } else if (typeof sessionUin === "string" && sessionUin.startsWith("GFA-T-")) {
          await fetch("/api/auth/logout", { method: "POST" });
          setAlert({
            message: "Detected teacher session. You have been logged out. Please login with pupil credentials.",
            type: "error",
          });
        } else {
          setAlert({ message: "Login succeeded but session role mismatch.", type: "warning" });
        }
      } else {
        setAlert({ message: "Invalid UIN or Password", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setAlert({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      role="student"
      title="Pupil sign in"
      description="Use your pupil number and password to open your learning dashboard."
    >
      <form onSubmit={handleSubmit} noValidate aria-busy={loading} className="gfa-card p-5 sm:p-7">
        {alert && (
          <div className="mb-5">
            <AuthAlert message={alert.message} tone={toneFor(alert.type)} onDismiss={() => setAlert(null)} />
          </div>
        )}

        <div className="space-y-5">
          <UinField
            role="pupil"
            value={digits}
            onChange={(value) => setUIN(value ? `GFA-P-${value}` : "")}
          />

          <PasswordField
            id="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            hint="Use the password issued by your school."
            required
          />

          <div className="flex flex-col gap-4 border-t border-brand-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <label htmlFor="remember-pupil" className="inline-flex items-center gap-2 text-sm text-brand-ink/80">
                <input
                  id="remember-pupil"
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 rounded border-brand-line accent-brand-indigo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                />
                Remember my pupil number
              </label>
              <p className="mt-1 pl-6 text-xs text-brand-ink/55">Only your pupil number is saved on this device.</p>
            </div>
            <Link
              href="/pupils/Forgotpassword"
              className="text-sm font-semibold text-brand-indigo hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gfa-btn gfa-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Sign in
              </>
            )}
          </button>
          {loading && (
            <span role="status" className="sr-only">
              Signing in…
            </span>
          )}
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-brand-ink/70">
        <p>
          New to the portal?{" "}
          <Link href="/pupils/Signup" className="font-semibold text-brand-indigo hover:underline">
            Create account
          </Link>
        </p>
        <p className="mt-3 inline-flex items-start justify-center gap-2 text-xs leading-relaxed text-brand-ink/55">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
          Your details stay with your school. Need a hand? Contact the school office.
        </p>
      </div>
    </AuthShell>
  );
}
