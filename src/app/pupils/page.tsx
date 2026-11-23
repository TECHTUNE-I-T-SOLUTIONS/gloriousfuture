import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CalendarDays, ClipboardList, GraduationCap, LockKeyhole, MessageSquareText, TrendingUp } from "lucide-react";
import CustomHeader from "@/components/CustomHeader";
import CustomFooter from "@/components/CustomFooter";
import PageHero from "@/components/public/PageHero";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
 title: "Pupil Portal",
 description: "Access assignments, quizzes, results and your timetable in the Glorious Future Academy pupil portal.",
 path: "/pupils",
});

const features = [
 {
  title: "Assignments and resources",
  description: "Find classwork, study materials and teacher feedback in one organised place.",
  icon: ClipboardList,
 },
 {
  title: "Quizzes and practice",
  description: "Test what you know with interactive quizzes and learn from every attempt.",
  icon: BookOpenCheck,
 },
 {
  title: "Results and progress",
  description: "See how you are doing and celebrate the improvements you make each term.",
  icon: TrendingUp,
 },
 {
  title: "Timetable and messages",
  description: "Keep track of your day and stay connected with important school updates.",
  icon: CalendarDays,
 },
];

const steps = [
 { title: "Create your account", description: "Use the pupil number issued by the school and the details on your admission record." },
 { title: "Sign in securely", description: "Your pupil number and password give you access to your own learning space." },
 { title: "Start learning", description: "Check your assignments, take quizzes and follow your progress all term long." },
];

export default function PupilPortalPage() {
 return (
  <div className="min-h-screen bg-white">
   <CustomHeader />
   <main>
    <PageHero
     kicker="Pupil portal"
     title="Your learning, all in one place"
     description="The Glorious Future Academy pupil portal brings your assignments, quizzes, results and school updates together so you can focus on learning."
     icon={GraduationCap}
    >
     <Link href="/pupils/Login" className="gfa-btn gfa-btn-primary">
      <LockKeyhole aria-hidden="true" className="h-4 w-4" />
      Sign in to your portal
     </Link>
     <Link href="/pupils/Signup" className="gfa-btn gfa-btn-secondary">
      Create pupil account
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
     </Link>
    </PageHero>

    <section className="gfa-section">
     <div className="gfa-container">
      <div className="mb-10 max-w-2xl">
       <p className="gfa-eyebrow mb-3">Built for pupils</p>
       <h2 className="gfa-section-title">Everything you need to study with confidence</h2>
       <p className="mt-4 text-brand-ink/70">
        Simple tools that help you stay organised, practise often and understand where you stand.
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
       <h2 className="gfa-section-title">Three steps to your portal</h2>
       <p className="mt-4 text-brand-ink/70">Need help with your pupil number or password? Ask your class teacher or contact the school office.</p>
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
         <h2 className="font-display text-3xl font-semibold sm:text-4xl">Ready to continue learning?</h2>
         <p className="mt-3 max-w-xl text-indigo-100/80">Sign in with your pupil number to pick up where you left off.</p>
        </div>
        <Link href="/pupils/Login" className="gfa-btn border border-white/40 bg-white text-brand-indigo hover:bg-indigo-50">
         Open pupil portal
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
