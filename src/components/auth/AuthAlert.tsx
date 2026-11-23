import { CircleAlert, CircleCheck, Info, X } from "lucide-react";

type AuthAlertProps = {
  message: string;
  tone?: "error" | "success" | "info";
  onDismiss?: () => void;
};

const styles = {
  error: "border-red-200 bg-red-50 text-red-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  info: "border-indigo-200 bg-indigo-50 text-indigo-900",
};

const icons = {
  error: CircleAlert,
  success: CircleCheck,
  info: Info,
};

export default function AuthAlert({ message, tone = "error", onDismiss }: AuthAlertProps) {
  const Icon = icons[tone];

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${styles[tone]}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p className="flex-1 leading-relaxed">{message}</p>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss message" className="rounded p-0.5 hover:bg-black/5">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
