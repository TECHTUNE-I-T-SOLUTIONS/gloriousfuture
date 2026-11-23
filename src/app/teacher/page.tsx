import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, CalendarCheck2, ClipboardCheck, GraduationCap, LockKeyhole, MessageSquareText, UsersRound } from "lucide-react";
import CustomHeader from "@/components/CustomHeader";
import CustomFooter from "@/components/CustomFooter";
import PageHero from "@/components/public/PageHero";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
 title: "Teacher Portal",
 description: "Manage classes, assignments, assessments and pupil progress in the Glorious Future Academy teacher portal.",
 path: "/teacher",
});

const features = [
 {
  title: "Class management",
  description: "Keep your class roster, timetable and school communication close at hand.",
  icon: UsersRound,
 },
 {
  title: "Assignments and assessments",
  description: "Set work, publish quizzes and review submissions without extra paperwork.",
  icon: ClipboardCheck,
 },
 {
  title: "Progress insights",
  description: "Spot strengths and gaps early with clear results and performance records.",
  icon: BarChart3,
 },
 {
  title: "Lesson planning",
  description: "Organise teaching resources and keep your scheme of work on track.",
  icon: CalendarCheck2,
 },
];

const steps = [
 { title: "Register with your staff number", description: "Use the staff number and email details recorded by the school office." },
 { title: "Sign in securely", description: "Access your own workspace with your staff number and password." },
 { title: "Teach and track", description: "Set assignments, record results and follow each pupil's progress." },
];

export default function TeacherPortalPage() {
 return (
  <div className="min-h-screen bg-white">
   <CustomHeader />
   <main>
    <PageHero
     kicker="Staff portal"
     title="Teaching made clearer"
     description="The Glorious Future Academy teacher portal gives educators one dependable place to manage classes, set assessments and follow pupil progress."
     icon={GraduationCap}
    >
     <Link href="/teacher/Login" className="gfa-btn gfa-btn-primary">
      <LockKeyhole aria-hidden="true" className="h-4 w-4" />
      Sign in to your portal
     </Link>
     <Link href="/teacher/Signup" className="gfa-btn gfa-btn-secondary">
      Create staff account
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
     </Link>
    </PageHero>

    <section className="gfa-section">
     <div className="gfa-container">
      <div className="mb-10 max-w-2xl">
       <p className="gfa-eyebrow mb-3">Built for educators</p>
       <h2 className="gfa-section-title">Practical tools for the classroom</h2>
       <p className="mt-4 text-brand-ink/70">
        Spend less time on administration and more time doing what you do best: teaching.
       </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
       {features.map(({ title, description, icon: Icon }) => (
        <div key={title} className="gfa-card p-6">
         <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-indigo/8 text-brand-indigo">
          <Icon aria-hidden="true" className="h-5 w-5" />
         </div>
         <h3 className="text-base font-semibold text-brand-ink">{title}</h3>
         <p className="mt-2 text-sm leading-relaxed text-brand-ink/65">{description}</p>
        </div>
       ))}
      </div>
     </div>
    </section>

    <section className="gfa-section border-y border-brand-line bg-brand-surface">
     <div className="gfa-container grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
      <div>
       <p className="gfa-eyebrow mb-3">Getting started</p>
       <h2 className="gfa-section-title">Join the staff portal</h2>
       <p className="mt-4 text-brand-ink/70">If you are new to the school portal, speak to the office to confirm your staff number before registering.</p>
       <Link href={`mailto:${siteConfig.contact.email}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-indigo hover:underline">
        <MessageSquareText aria-hidden="true" className="h-4 w-4" />
        {siteConfig.contact.email}
       </Link>
      </div>
      <ol className="grid gap-4 sm:grid-cols-3">
       {steps.map((step, index) => (
        <li key={step.title} className="gfa-card p-5">
         <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-indigo text-sm font-semibold text-white">{index + 1}</span>
         <h3 className="mt-4 text-sm font-semibold text-brand-ink">{step.title}</h3>
         <p className="mt-2 text-sm leading-relaxed text-brand-ink/65">{step.description}</p>
        </li>
       ))}
      </ol>
     </div>
    </section>

    <section className="gfa-section">
     <div className="gfa-container">
      <div className="gfa-card overflow-hidden bg-gradient-to-br from-brand-indigo to-brand-violet text-white">
       <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
         <h2 className="font-display text-3xl font-semibold sm:text-4xl">Return to your classroom</h2>
         <p className="mt-3 max-w-xl text-indigo-100/80">Sign in to continue where you left off with your classes and assessments.</p>
        </div>
        <Link href="/teacher/Login" className="gfa-btn border border-white/40 bg-white text-brand-indigo hover:bg-indigo-50">
         Open staff portal
         <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
       </div>
      </div>
     </div>
    </section>
   </main>
   <CustomFooter />
  </div>
 );
}
