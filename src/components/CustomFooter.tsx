import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, GraduationCap, HeartHandshake, Mail, MapPin, Phone, Trophy } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const footerColumns = [
  {
    title: "School",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About our school" },
      { href: "/blog", label: "News and stories" },
    ],
  },
  {
    title: "Learning",
    links: [
      { href: "/quizzes", label: "Practice quizzes" },
      { href: "/funzone", label: "Fun Zone" },
      { href: "/pupils", label: "Student portal" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/teacher", label: "Staff portal" },
      { href: "/donation", label: "Support the school" },
      { href: "/about#visit", label: "Visit us" },
    ],
  },
];

const quickActions = [
  { href: "/quizzes", label: "Take a quiz", icon: Trophy },
  { href: "/donation", label: "Support GFA", icon: HeartHandshake },
];

export default function CustomFooter() {
  return (
    <footer className="relative overflow-hidden bg-brand-ink text-white">
      <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full border border-white/5" />
      <div className="pointer-events-none absolute -bottom-48 -left-24 h-96 w-96 rounded-full border border-white/5" />

      <div className="gfa-container relative py-14 sm:py-16">
        <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/apple-touch-icon.png"
                alt=""
                width={52}
                height={52}
                className="rounded-full bg-white p-1"
              />
              <div>
                <p className="font-display text-xl leading-tight">Glorious Future Academy</p>
                <p className="mt-1 text-xs text-brand-gold">Learn to grow</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              A close-knit school community in Oro, Kwara State, helping pupils learn with confidence and character.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {quickActions.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={`${column.title} links`}>
              <h2 className="mb-4 text-sm font-semibold text-white">{column.title}</h2>
              <ul className="space-y-3">
                {column.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1 text-sm text-white/65 transition-colors hover:text-brand-gold"
                    >
                      {label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity hover:opacity-100" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="grid gap-6 py-8 sm:grid-cols-3">
          <a href={`tel:${siteConfig.contact.telephone}`} className="flex items-center gap-3 text-sm text-white/75 hover:text-brand-gold">
            <Phone className="h-4 w-4 text-brand-gold" aria-hidden="true" />
            {siteConfig.contact.telephoneLabel}
          </a>
          <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-3 break-all text-sm text-white/75 hover:text-brand-gold">
            <Mail className="h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
            {siteConfig.contact.email}
          </a>
          <p className="flex items-center gap-3 text-sm text-white/75">
            <MapPin className="h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
            {siteConfig.contact.streetAddress}, {siteConfig.contact.addressLocality}
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Educating today for tomorrow.
          </p>
        </div>
      </div>
    </footer>
  );
}
