import { AlertTriangle, Info, ShieldCheck } from "lucide-react";

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "safety";
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: { box: "border-brand-200 bg-brand-50/60 text-brand-900", icon: <Info className="h-4 w-4 mt-0.5 shrink-0 text-brand-600" aria-hidden /> },
    warning: { box: "border-amber-300 bg-amber-50 text-amber-900", icon: <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" aria-hidden /> },
    safety: { box: "border-brand-300 bg-white text-brand-900", icon: <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-brand-700" aria-hidden /> },
  }[tone];
  return (
    <div className={`rounded-xl border p-4 text-sm ${styles.box}`} role={tone === "warning" ? "alert" : undefined}>
      <div className="flex gap-2.5">
        {styles.icon}
        <div className="leading-relaxed">
          {title ? <p className="mb-1 font-semibold">{title}</p> : null}
          {children}
        </div>
      </div>
    </div>
  );
}
