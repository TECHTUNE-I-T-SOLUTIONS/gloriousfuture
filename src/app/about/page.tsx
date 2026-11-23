import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Eye,
  GraduationCap,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
 UsersRound,
} from "lucide-react";
import CustomFooter from "@/components/CustomFooter";
import CustomHeader from "@/components/CustomHeader";
import PageHero from "@/components/public/PageHero";
import SectionHeading from "@/components/public/SectionHeading";
import { siteConfig } from "@/lib/site-config";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About Our School",
  description:
    "Learn about Glorious Future Academy in Oro, Kwara State — our vision, values, leadership and the community behind every learner.",
  path: "/about",
  image: "/images/gallery/classroom.jpg",
  imageAlt: "A classroom at Glorious Future Academy",
});

const foundations = [
  {
    icon: Eye,
    label: "Our vision",
    text: "To inspire young minds and raise a generation of thoughtful leaders who shape the future with wisdom, creativity and integrity.",
  },
  {
    icon: Target,
    label: "Our mission",
    text: "To provide a quality education in a fun, engaging and interactive environment where every pupil's potential is taken seriously.",
  },
  {
    icon: Award,
    label: "Our values",
    text: "Excellence in all endeavours, integrity in character, innovation in learning and discipline in conduct.",
  },
];

const stats = [
  { icon: UsersRound, value: "500+", label: "Pupils" },
  { icon: BookOpen, value: "50+", label: "Courses" },
  { icon: GraduationCap, value: "25+", label: "Teachers" },
  { icon: ShieldCheck, value: "2020", label: "Founded" },
];

const values = [
  {
    icon: Sparkles,
    title: "Curiosity first",
    text: "Questions are welcomed. Lessons are designed to make pupils think, ask and try again.",
  },
  {
    icon: HeartHandshake,
    title: "Known and supported",
    text: "Small enough for every child to be seen, structured enough for every child to progress.",
  },
  {
    icon: GraduationCap,
    title: "Prepared for what follows",
    text: "Strong fundamentals, study habits and character that travel well beyond the classroom.",
  },
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/blog", label: "News & stories" },
  { href: "/funzone", label: "Fun Zone" },
  { href: "/donation", label: "Support the school" },
  { href: "/pupils/Login", label: "Pupil portal" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-brand-ink">
      <CustomHeader />

      <main>
        <PageHero
          kicker="About Glorious Future Academy"
          title="A school built around every child's potential."
          description="Founded in 2020 in Oro, Kwara State, Glorious Future Academy brings rigorous learning, warm relationships and a genuine sense of possibility together in one community."
          icon={GraduationCap}
        >
          <Link href="/pupils/Login" className="gfa-btn gfa-btn-primary">
            Explore the portal
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link href="#visit" className="gfa-btn gfa-btn-secondary">
            Plan a visit
          </Link>
        </PageHero>

        <section className="gfa-section">
          <div className="gfa-container grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-brand-line bg-brand-mist">
              <Image
                src="/images/gallery/classroom.jpg"
                alt="An interactive classroom at Glorious Future Academy"
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="gfa-eyebrow mb-4">Our story</p>
              <h2 className="gfa-section-title">Rooted in Oro, looking toward the world.</h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-ink/70 sm:text-base">
                We started with a simple belief: children learn best when they feel safe, known and gently
                challenged. That belief still shapes the way we teach, the way we speak to families and the
                way we build each school day.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-brand-ink/70 sm:text-base">
                Today, our pupils learn across science, technology, the arts and the humanities — with the
                same expectation that they grow in confidence as well as in knowledge.
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="rounded-2xl border border-brand-line bg-brand-surface p-4">
                      <Icon aria-hidden="true" className="mb-3 h-5 w-5 text-brand-gold" />
                      <dt className="font-display text-xl font-semibold text-brand-indigo sm:text-2xl">{stat.value}</dt>
                      <dd className="mt-1 text-xs uppercase tracking-wide text-brand-ink/55">{stat.label}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </section>

        <section className="gfa-section border-y border-brand-line bg-brand-surface">
          <div className="gfa-container">
            <SectionHeading
              title="What guides us"
              description="Three commitments that shape decisions big and small."
              centered
            />
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {foundations.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.label} className="gfa-card p-6 sm:p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-ink text-brand-gold">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <p className="gfa-eyebrow mb-2">{item.label}</p>
                    <p className="text-sm leading-relaxed text-brand-ink/70">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="gfa-section">
          <div className="gfa-container grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
            <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] border border-brand-line bg-brand-mist">
              <Image
                src="/proprietress.png"
                alt="Mrs. Alade, Founder and Proprietress of Glorious Future Academy"
                fill
                sizes="(max-width: 1024px) 90vw, 35vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="gfa-eyebrow mb-4">Leadership</p>
              <h2 className="gfa-section-title">Meet our proprietress.</h2>
              <p className="mt-2 text-lg font-semibold text-brand-indigo">Mrs. Alade</p>
              <p className="mb-5 text-sm text-brand-ink/55">Founder & Proprietress</p>
              <p className="max-w-2xl text-sm leading-relaxed text-brand-ink/70 sm:text-base">
                Passionate about education and dedicated to excellence, Mrs. Alade has devoted her work to
                shaping young minds and building brighter futures. Her leadership continues to inspire
                pupils and staff to reach for their highest potential.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${siteConfig.contact.telephone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gfa-btn gfa-btn-primary"
                >
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
                <a href={`mailto:${siteConfig.contact.email}`} className="gfa-btn gfa-btn-secondary">
                  <Mail aria-hidden="true" className="h-4 w-4" />
                  Send an email
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="gfa-section border-t border-brand-line bg-brand-mist/60">
          <div className="gfa-container">
            <SectionHeading title="The GFA difference" description="What families can expect from a day with us." />
            <div className="grid gap-5 md:grid-cols-3">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <article key={value.title} className="gfa-card p-6 sm:p-7">
                    <Icon aria-hidden="true" className="mb-4 h-6 w-6 text-brand-indigo" />
                    <h3 className="font-display text-lg font-semibold">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-ink/65">{value.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="visit" className="gfa-section scroll-mt-28">
          <div className="gfa-container grid gap-8 lg:grid-cols-2">
            <div className="gfa-card p-6 sm:p-8">
              <p className="gfa-eyebrow mb-4">Visit us</p>
              <h2 className="gfa-section-title">Find us in Oro.</h2>
              <div className="mt-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-ink text-brand-gold">
                  <MapPin aria-hidden="true" className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">IBA Transformer Area</h3>
                  <p className="mt-1 text-sm leading-relaxed text-brand-ink/65">
                    IBA Village, Ijomu Road<br />
                    Oro, Kwara State, Nigeria
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-3 border-t border-brand-line pt-6 text-sm">
                <a href={`tel:${siteConfig.contact.telephone}`} className="flex items-center gap-3 hover:text-brand-indigo">
                  <Phone aria-hidden="true" className="h-4 w-4 text-brand-indigo" />
                  {siteConfig.contact.telephoneLabel}
                </a>
                <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-3 break-all hover:text-brand-indigo">
                  <Mail aria-hidden="true" className="h-4 w-4 text-brand-indigo" />
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>

            <div className="gfa-card p-6 sm:p-8">
              <p className="gfa-eyebrow mb-4">Explore</p>
              <h2 className="gfa-section-title">Useful places to start.</h2>
              <nav aria-label="Quick links" className="mt-6 grid gap-2 sm:grid-cols-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-xl border border-brand-line bg-white px-4 py-3 text-sm font-medium transition hover:border-brand-indigo hover:text-brand-indigo"
                  >
                    {link.label}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </section>
      </main>

      <CustomFooter />
    </div>
  );
}
