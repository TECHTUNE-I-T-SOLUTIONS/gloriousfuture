import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  BookOpenCheck,
  ClipboardCheck,
  GraduationCap,
  HeartHandshake,
  LibraryBig,
  MapPin,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import CustomFooter from "@/components/CustomFooter";
import CustomHeader from "@/components/CustomHeader";
import PlayZone from "@/components/public/PlayZone";
import SectionHeading from "@/components/public/SectionHeading";
import { siteConfig } from "@/lib/site-config";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Official School Portal",
  description:
    "Glorious Future Academy in Oro, Kwara State — a secure school portal for pupils and teachers, with learning resources, assessments, news and campus life.",
  path: "/",
  image: "/images/gallery/learning.jpg",
  imageAlt: "Pupils learning together at Glorious Future Academy",
});

const values = [
  {
    icon: BookOpenCheck,
    title: "Learning with purpose",
    description: "A balanced curriculum that builds strong foundations and a genuine love for discovery.",
  },
  {
    icon: ShieldCheck,
    title: "A safe community",
    description: "Careful supervision, clear routines and a culture where every child is known by name.",
  },
  {
    icon: Sparkles,
    title: "Room to shine",
    description: "Clubs, competitions and creative projects that help pupils find their own strengths.",
  },
];

const portalFeatures = [
  { icon: ShieldCheck, title: "Secure assessments", description: "Focused online tests with results ready when you need them.", href: "/pupils/Login" },
  { icon: BookOpen, title: "Learning resources", description: "Notes, schemes of work and materials organised for every term.", href: "/pupils/Login" },
  { icon: ClipboardCheck, title: "Results and reports", description: "Clear progress summaries that make next steps easy to see.", href: "/pupils/Login" },
  { icon: LibraryBig, title: "Digital assignments", description: "Homework and projects submitted through one calm workspace.", href: "/pupils/Login" },
  { icon: UsersRound, title: "Pupil profiles", description: "A fuller picture of each learner, beyond a single score.", href: "/teacher/Login" },
  { icon: GraduationCap, title: "Teacher tools", description: "Simple tools for planning, grading and staying in touch.", href: "/teacher/Login" },
];

const gallery = [
  { src: "/images/gallery/learning.jpg", alt: "Pupils working together in class", title: "Learning in action" },
  { src: "/images/gallery/science-lab.jpg", alt: "Practical science experiment", title: "Science laboratory" },
  { src: "/images/gallery/computer-training.jpg", alt: "Pupils using computers", title: "Digital literacy" },
  { src: "/images/gallery/sports.jpg", alt: "Students taking part in sport", title: "Sports and athletics" },
  { src: "/images/gallery/library.jpg", alt: "Reading in the school library", title: "Library sessions" },
  { src: "/images/gallery/art.jpg", alt: "Creative art work by pupils", title: "Creative arts" },
];

const testimonials = [
  {
    quote: "Since my child joined Glorious Future Academy, I've seen remarkable improvement in both academics and confidence. The teachers truly care.",
    name: "Mrs. Adeyemi",
    role: "Parent",
  },
  {
    quote: "The supportive environment allows me to focus on what matters most — helping every pupil succeed in their own way.",
    name: "Mr. Ogunleye",
    role: "Teacher",
  },
  {
    quote: "My time at GFA prepared me well for the next stage. The values I learned here stay with me.",
    name: "Sarah",
    role: "Alumna",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-brand-ink">
      <CustomHeader />

      <main>
        <section className="relative overflow-hidden border-b border-brand-line bg-brand-surface pt-28 sm:pt-36 lg:pt-40">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-violet/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />
          <div className="gfa-container relative grid items-center gap-12 pb-16 sm:pb-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div>
              <p className="gfa-eyebrow mb-5">
                <MapPin aria-hidden="true" className="h-4 w-4 text-brand-gold" />
                Oro, Kwara State · Nigeria
              </p>
              <h1 className="gfa-display max-w-2xl">
                A brighter future begins with a <span className="text-brand-indigo">strong foundation.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-ink/70 sm:text-lg">
                Welcome to the official portal of Glorious Future Academy — one place for school updates,
                learning resources and the everyday life of our community.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/pupils/Login" className="gfa-btn gfa-btn-primary">
                  Enter the portal
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link href="/about" className="gfa-btn gfa-btn-secondary">
                  Discover our school
                </Link>
              </div>
              <dl className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-brand-line pt-6">
                {[
                  { value: "500+", label: "Learners" },
                  { value: "50+", label: "Courses" },
                  { value: "2020", label: "Founded" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-display text-2xl font-semibold text-brand-indigo sm:text-3xl">{stat.value}</dt>
                    <dd className="mt-1 text-xs uppercase tracking-wider text-brand-ink/55 sm:text-sm">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-brand-line bg-brand-mist shadow-[0_30px_80px_-40px_rgba(29,24,86,0.55)]">
                <Image
                  src="/images/gallery/learning.jpg"
                  alt="Pupils learning together at Glorious Future Academy"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-brand-line bg-white p-4 shadow-lg sm:-left-8 sm:p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-ink text-brand-gold">
                  <Award aria-hidden="true" className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-ink">Excellence with character</p>
                  <p className="text-xs text-brand-ink/60">Since 2020</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="gfa-section">
          <div className="gfa-container">
            <SectionHeading
              title="An education that stays with them"
              description="We pair strong academics with the confidence, curiosity and character children need for the road ahead."
              centered
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <article key={value.title} className="gfa-card p-6 sm:p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-ink text-brand-gold">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-brand-ink">{value.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-ink/65">{value.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="gfa-section border-y border-brand-line bg-brand-mist/60">
          <div className="gfa-container">
            <SectionHeading
              title="Life at GFA"
              description="Classrooms, laboratories, studios and playing fields — a school day with room for every kind of curiosity."
              action={
                <Link href="/blog" className="gfa-btn gfa-btn-secondary">
                  Read our stories
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              }
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {gallery.map((item, index) => (
                <figure
                  key={item.src}
                  className={`group relative overflow-hidden rounded-2xl border border-brand-line bg-white ${
                    index === 0 ? "col-span-2 aspect-[16/9] lg:col-span-2 lg:row-span-2 lg:aspect-auto" : "aspect-square"
                  }`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={index === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 50vw, 33vw"}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-ink/85 to-transparent px-4 pb-4 pt-10 text-sm font-semibold text-white">
                    {item.title}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="gfa-section">
          <div className="gfa-container">
            <SectionHeading
              title="One portal, everything in place"
              description="Built for families and staff who want clarity without noise."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {portalFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link key={feature.title} href={feature.href} className="gfa-card group p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-mist text-brand-indigo transition group-hover:bg-brand-ink group-hover:text-brand-gold">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-brand-ink">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-ink/65">{feature.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-indigo">
                      Open portal
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="gfa-section border-t border-brand-line bg-brand-surface">
          <div className="gfa-container">
            <SectionHeading title="What our community says" description="Trust is built one everyday moment at a time." centered />
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.name} className="gfa-card flex flex-col p-6 sm:p-7">
                  <HeartHandshake aria-hidden="true" className="mb-4 h-6 w-6 text-brand-gold" />
                  <blockquote className="flex-1 text-sm leading-relaxed text-brand-ink/80 sm:text-base">
                    “{testimonial.quote}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-brand-line pt-4">
                    <span className="block font-semibold text-brand-ink">{testimonial.name}</span>
                    <span className="text-sm text-brand-ink/55">{testimonial.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="gfa-section bg-brand-ink">
          <div className="gfa-container grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
            <div>
              <p className="gfa-eyebrow mb-4 text-brand-gold">Study break</p>
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">Play, pause and learn.</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-indigo-100/75 sm:text-base">
                A small collection of brain teasers for curious minds. Pick a game and take a short break
                between lessons.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/funzone" className="gfa-btn bg-white text-brand-ink hover:bg-indigo-50">
                  Explore Fun Zone
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link href="/quizzes" className="gfa-btn border border-white/30 text-white hover:bg-white/10">
                  Take a quiz
                </Link>
              </div>
            </div>
            <PlayZone />
          </div>
        </section>

        <section className="gfa-section">
          <div className="gfa-container">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-indigo to-brand-violet px-6 py-12 text-center text-white sm:px-12 sm:py-16">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/15" />
              <p className="gfa-eyebrow mb-4 justify-center text-brand-gold">Join our community</p>
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
                The future looks brighter together.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-indigo-100/80 sm:text-base">
                Talk to us about enrolment, support the school, or simply come and see the campus for yourself.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={`https://wa.me/${siteConfig.contact.telephone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gfa-btn bg-white text-brand-indigo hover:bg-indigo-50"
                >
                  Chat with us
                </a>
                <Link href="/donation" className="gfa-btn border border-white/30 text-white hover:bg-white/10">
                  Support the school
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
