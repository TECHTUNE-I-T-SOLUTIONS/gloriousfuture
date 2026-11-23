import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type PageHeroProps = {
  title: string;
  description: string;
  kicker?: string;
  icon?: LucideIcon;
  children?: ReactNode;
};

export default function PageHero({ title, description, kicker, icon: Icon, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-brand-line bg-brand-surface pt-32 sm:pt-40">
      <div className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full border border-brand-line" />
      <div className="pointer-events-none absolute right-16 top-40 h-44 w-44 rounded-full bg-brand-gold/10 blur-2xl" />

      <div className="gfa-container relative grid gap-10 pb-14 sm:pb-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] lg:items-center">
        <div>
          {kicker && (
            <p className="gfa-eyebrow mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
              {kicker}
            </p>
          )}
          <h1 className="gfa-display max-w-3xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-ink/70 sm:text-lg">{description}</p>
          {children && <div className="mt-8 flex flex-wrap items-center gap-3">{children}</div>}
        </div>

        {Icon && (
          <div className="hidden justify-end lg:flex" aria-hidden="true">
            <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-brand-line bg-white">
              <div className="flex h-40 w-40 items-center justify-center rounded-full bg-brand-ink text-brand-gold">
                <Icon className="h-16 w-16" strokeWidth={1.25} />
              </div>
              <span className="absolute inset-x-8 top-1/2 h-px bg-brand-gold/50" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
