import AuthField from "./AuthField";

type UinFieldProps = {
  role: "pupil" | "teacher";
  value: string;
  onChange: (digits: string) => void;
  error?: string;
};

export default function UinField({ role, value, onChange, error }: UinFieldProps) {
  const prefix = role === "pupil" ? "GFA-P-" : "GFA-T-";

  return (
    <AuthField
      id="uin-digits"
      label={role === "pupil" ? "Pupil identification number" : "Staff identification number"}
      hint="Enter the four digits after the prefix."
      error={error}
      required
    >
      <div className="flex overflow-hidden rounded-xl border border-brand-line bg-white focus-within:border-brand-indigo focus-within:ring-4 focus-within:ring-indigo-500/10">
        <span className="flex items-center border-r border-brand-line bg-brand-mist px-4 text-sm font-semibold tracking-wide text-brand-bronze">
          {prefix}
        </span>
        <input
          id="uin-digits"
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 4))}
          inputMode="numeric"
          autoComplete="off"
          pattern="[0-9]{4}"
          maxLength={4}
          placeholder="0000"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "uin-digits-error" : "uin-digits-hint"}
          className="w-full bg-transparent px-4 py-3 text-base font-semibold tracking-[0.3em] text-brand-ink outline-none placeholder:tracking-[0.3em] placeholder:text-slate-300"
          required
        />
      </div>
    </AuthField>
  );
}
