"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/blog", label: "News" },
  { href: "/funzone", label: "Fun Zone" },
  { href: "/donation", label: "Support" },
];

const portalLinks = [
  { href: "/pupils", label: "Student portal", icon: GraduationCap },
  { href: "/teacher", label: "Staff portal", icon: Mail },
];

export default function CustomHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sessionRoles, setSessionRoles] = useState<{ pupil?: boolean; teacher?: boolean }>({});
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        const uin = data?.uin ?? data?.session?.uin ?? data?.user?.uin ?? data?.user?.id;
        if (!active || typeof uin !== "string") return;
        if (uin.startsWith("GFA-P-")) setSessionRoles({ pupil: true });
        if (uin.startsWith("GFA-T-")) setSessionRoles({ teacher: true });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const dashboardHref = sessionRoles.pupil
    ? "/pupils/pupil-dashboard"
    : sessionRoles.teacher
      ? "/teacher/teacher-dashboard"
      : "/pupils";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-brand-ink text-white">
        <div className="gfa-container flex h-9 items-center justify-between gap-4 text-xs">
          <p className="flex min-w-0 items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-gold" aria-hidden="true" />
            <span className="truncate">
              {siteConfig.contact.streetAddress}, {siteConfig.contact.addressLocality}
            </span>
          </p>
          <a
            href={`tel:${siteConfig.contact.telephone}`}
            className="hidden shrink-0 items-center gap-2 transition-colors hover:text-brand-gold sm:flex"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {siteConfig.contact.telephoneLabel}
          </a>
        </div>
      </div>

      <div
        className={`border-b transition-all duration-200 ${
          scrolled
            ? "border-brand-line bg-white/95 shadow-[0_10px_30px_-24px_rgba(30,41,115,0.8)] backdrop-blur-md"
            : "border-transparent bg-white"
        }`}
      >
        <div className="gfa-container flex h-[4.5rem] items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`${siteConfig.name} home`}>
            <Image
              src="/apple-touch-icon.png"
              alt=""
              width={46}
              height={46}
              priority
              className="rounded-full ring-1 ring-brand-line"
            />
            <span className="hidden sm:block">
              <span className="block font-display text-lg leading-none text-brand-ink">Glorious Future</span>
              <span className="mt-1 block text-[0.68rem] font-semibold tracking-wide text-brand-bronze">
                ACADEMY · ORO, KWARA
              </span>
            </span>
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(href) ? "bg-brand-mist text-brand-indigo" : "text-brand-ink/75 hover:text-brand-indigo"
                }`}
              >
                {label}
                {isActive(href) && (
                  <span className="absolute inset-x-3 -bottom-[1.15rem] h-0.5 rounded-full bg-brand-gold" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/teacher" className="gfa-btn gfa-btn-secondary hidden xl:inline-flex">
              Staff portal
            </Link>
            <Link href={dashboardHref} className="gfa-btn gfa-btn-primary !min-h-[2.5rem] !px-4 !py-2">
              {sessionRoles.pupil || sessionRoles.teacher ? "My dashboard" : "Student portal"}
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-line text-brand-ink lg:hidden"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="max-h-[calc(100vh-7rem)] overflow-y-auto border-b border-brand-line bg-white lg:hidden"
        >
          <div className="gfa-container space-y-5 py-5">
            <ul className="grid gap-1">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold ${
                      isActive(href) ? "bg-brand-mist text-brand-indigo" : "text-brand-ink"
                    }`}
                  >
                    {label}
                    {isActive(href) && <span className="h-2 w-2 rounded-full bg-brand-gold" />}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-t border-brand-line pt-4">
              <p className="mb-2 px-4 text-xs font-semibold text-brand-bronze">Portals</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {portalLinks.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} className="gfa-btn gfa-btn-secondary justify-start">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-brand-line px-4 pt-4 text-xs text-brand-ink/70">
              <a href={`tel:${siteConfig.contact.telephone}`} className="inline-flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {siteConfig.contact.telephoneLabel}
              </a>
              <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                Email the school
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
