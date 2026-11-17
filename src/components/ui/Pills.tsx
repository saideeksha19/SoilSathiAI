"use client";

import { AlertTriangle, Check, CircleHelp, Info, MinusCircle, ShieldQuestion } from "lucide-react";
import { CropEvaluation } from "@/lib/types";
import { confidenceLabel, sourceLabel, statusLabel, suitabilityLabel, verificationLabel } from "@/lib/i18n";
import { useT } from "@/lib/useT";

const suitabilityStyles: Record<CropEvaluation["suitability"], { className: string; icon: React.ReactNode }> = {
  "well-suited": { className: "bg-brand-100 text-brand-900 border border-brand-200", icon: <Check className="h-3.5 w-3.5" aria-hidden /> },
  "moderately-suited": {
    className: "bg-amber-50 text-amber-900 border border-amber-200",
    icon: <MinusCircle className="h-3.5 w-3.5" aria-hidden />,
  },
  limited: {
    className: "bg-orange-50 text-orange-900 border border-orange-200",
    icon: <AlertTriangle className="h-3.5 w-3.5" aria-hidden />,
  },
  "insufficient-data": {
    className: "bg-stone-100 text-stone-700 border border-stone-300",
    icon: <CircleHelp className="h-3.5 w-3.5" aria-hidden />,
  },
};

export function SuitabilityPill({ value }: { value: CropEvaluation["suitability"] }) {
  const { lang } = useT();
  const s = suitabilityStyles[value];
  return (
    <span className={`badge gap-1.5 ${s.className}`}>
      {s.icon}
      {suitabilityLabel(lang, value)}
    </span>
  );
}

export const suitabilityClassNames = (value: CropEvaluation["suitability"]) => suitabilityStyles[value].className;

const statusClassNames: Record<string, string> = {
  optimal: "bg-brand-100 text-brand-900",
  acceptable: "bg-accent-400/20 text-brand-900",
  marginal: "bg-amber-100 text-amber-900",
  unsuitable: "bg-red-100 text-red-800",
  missing: "bg-stone-100 text-stone-600",
  unreliable: "bg-yellow-100 text-yellow-900",
};

export function StatusPill({ status }: { status: string }) {
  const { lang } = useT();
  return <span className={`badge ${statusClassNames[status] ?? "bg-stone-100 text-stone-700"}`}>{statusLabel(lang, status)}</span>;
}

const sourceClassNames: Record<string, string> = {
  sample: "bg-sky-50 text-sky-800 border border-sky-200",
  manual: "bg-brand-50 text-brand-800 border border-brand-200",
  extracted: "bg-purple-50 text-purple-800 border border-purple-200",
  simulated: "bg-amber-50 text-amber-900 border border-amber-300",
};

const sourceIcons: Record<string, React.ReactNode> = {
  sample: <ShieldQuestion className="h-3 w-3" aria-hidden />,
  manual: <Check className="h-3 w-3" aria-hidden />,
  extracted: <ShieldQuestion className="h-3 w-3" aria-hidden />,
  simulated: <AlertTriangle className="h-3 w-3" aria-hidden />,
};

export function SourcePill({ source }: { source: string }) {
  const { lang } = useT();
  return (
    <span className={`badge gap-1 ${sourceClassNames[source] ?? sourceClassNames.manual}`}>
      {sourceIcons[source] ?? sourceIcons.manual}
      {sourceLabel(lang, source)}
    </span>
  );
}

export function VerificationPill({ status }: { status: "verified" | "derived" | "unverified" }) {
  const { lang } = useT();
  const className =
    status === "verified"
      ? "bg-brand-50 text-brand-800 border border-brand-200"
      : status === "derived"
        ? "bg-sky-50 text-sky-900 border border-sky-200"
        : "bg-amber-50 text-amber-900 border border-amber-300";
  const icon =
    status === "verified" ? (
      <ShieldQuestion className="h-3 w-3" aria-hidden />
    ) : status === "derived" ? (
      <Info className="h-3 w-3" aria-hidden />
    ) : (
      <AlertTriangle className="h-3 w-3" aria-hidden />
    );
  return (
    <span className={`badge gap-1 ${className}`}>
      {icon}
      {verificationLabel(lang, status)}
    </span>
  );
}

export function ConfidencePill({ confidence }: { confidence?: string }) {
  const { lang } = useT();
  const className =
    confidence === "high"
      ? "bg-brand-100 text-brand-900"
      : confidence === "medium"
        ? "bg-amber-50 text-amber-800"
        : "bg-stone-100 text-stone-700";
  return <span className={`badge ${className}`}>{confidenceLabel(lang, confidence)}</span>;
}
