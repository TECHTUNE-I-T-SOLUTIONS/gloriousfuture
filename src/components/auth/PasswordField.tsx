"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AuthField from "./AuthField";

type PasswordFieldProps = {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
  error?: string;
  required?: boolean;
};

export default function PasswordField({
  id,
  label = "Password",
  value,
  onChange,
  placeholder = "Enter your password",
  autoComplete = "current-password",
  hint,
  error,
  required,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthField id={id} label={label} hint={hint} error={error} required={required}>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className="gfa-input pr-12"
          required={required}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-brand-ink/55 hover:text-brand-indigo"
        >
          {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    </AuthField>
  );
}
