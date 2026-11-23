import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpenCheck, GraduationCap, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site-config";

type AuthShellProps = {
  role: "student" | "staff";
  title: string;
  description: string;
  children: ReactNode;
};

const assurances = [
  { icon: GraduationCap, text: "A focused space for pupils to learn and grow" },
  { icon: BookOpenCheck, text: "Tools that help teachers support every learner" },
  { icon: ShieldCheck, text: "Private records, shared only with your school" },
];

export default function AuthShell({ role, title, description, children }: AuthShellProps) {
  const studentHref = role === "student" ? "/pupils/Login" : "/pupils";
  const staffHref = role === "staff" ? "/teacher/Login" : "/teacher";

  return (
    <div className="min-h-screen bg-brand-surface lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <aside className="relative hidden overflow-hidden bg-brand-ink p-12 text-white lg:flex lg:flex-col">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-brand-violet/20 blur-3xl" />

        <Link href="/" className="relative flex items-center gap-3">
          <Image src="/apple-touch-icon.png" alt="" width={48} height={48} className="rounded-full bg-white p-1" />
          <span className="font-display text-lg leading-tight">{siteConfig.name}</span>
        </Link>

        <div className="relative my-auto max-w-md">
          <p className="text-sm font-semibold text-brand-gold">Learn to grow</p>
          <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight">
            A school portal made for our school community.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/65">
            Everything pupils, teachers and families need, in one calm and dependable place.
          </p>

          <ul className="mt-10 space-y-4">
            {assurances.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-white/85">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-brand-gold">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/45">
          {siteConfig.contact.streetAddress}, {siteConfig.contact.addressLocality}, {siteConfig.contact.addressRegion}
        </p>
      </aside>

      <main className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between gap-4 px-5 py-6 sm:px-10">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <Image src="/apple-touch-icon.png" alt="" width={38} height={38} className="rounded-full" />
            <span className="font-display text-base text-brand-ink">Glorious Future</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-brand-ink/65 hover:text-brand-indigo">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to school site
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 pb-14 sm:px-10">
          <nav aria-label="Portal type" className="mb-8 grid grid-cols-2 gap-2 rounded-xl border border-brand-line bg-white p-1">
            <Link
              href={studentHref}
              aria-current={role === "student" ? "page" : undefined}
              className={`rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                role === "student" ? "bg-brand-ink text-white" : "text-brand-ink/65 hover:bg-brand-mist"
              }`}
            >
              Student
            </Link>
            <Link
              href={staffHref}
              aria-current={role === "staff" ? "page" : undefined}
              className={`rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                role === "staff" ? "bg-brand-ink text-white" : "text-brand-ink/65 hover:bg-brand-mist"
              }`}
            >
              Staff
            </Link>
          </nav>

          <h1 className="font-display text-3xl leading-tight tracking-tight text-brand-ink sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-ink/65 sm:text-base">{description}</p>

          <div className="mt-8">{children}</div>
        </div>

        <p className="px-5 pb-8 text-center text-xs text-brand-ink/45 sm:px-10">
          Need help signing in?{" "}
          <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold text-brand-indigo hover:underline">
            Contact the school office
          </a>
        </p>
      </main>
    </div>
  );
}
