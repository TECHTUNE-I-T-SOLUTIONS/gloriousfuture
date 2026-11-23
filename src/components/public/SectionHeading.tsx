import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  centered?: boolean;
};

export default function SectionHeading({ title, description, action, centered = false }: SectionHeadingProps) {
  return (
    <div
      className={`mb-8 flex flex-col gap-4 sm:mb-10 ${
        centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"
      }`}
    >
      <div className={centered ? "max-w-2xl" : "max-w-2xl"}>
        <h2 className="gfa-section-title">{title}</h2>
        {description && <p className="mt-3 text-sm leading-relaxed text-brand-ink/65 sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}
