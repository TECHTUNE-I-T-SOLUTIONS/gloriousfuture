import type { ReactNode } from "react";

type AuthFieldProps = {
  id: string;
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
};

export default function AuthField({ id, label, children, hint, error, required, className = "" }: AuthFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="gfa-label">
        {label}
        {required && <span className="ml-1 text-brand-bronze">*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs leading-relaxed text-brand-ink/55">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
