"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { sourceCatalog } from "@/data/crops";
import { useT } from "@/lib/useT";

/** Compact citation chips and the full reference block. Every chip links to the
 * catalogue entry so a judge can inspect the exact publication behind a finding. */
export function SourceRefs({ ids, compact = false }: { ids: string[]; compact?: boolean }) {
  const { t } = useT();
  const sources = ids
    .map((id) => sourceCatalog.find((s) => s.id === id))
    .filter((s): s is (typeof sourceCatalog)[number] => Boolean(s));
  if (sources.length === 0) return null;
  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {sources.map((s) => (
          <Link
            key={s.id}
            href={`/sources#${s.id}`}
            className={`badge border text-[0.65rem] font-medium hover:underline ${
              s.verification === "verified"
                ? "border-brand-200 bg-brand-50 text-brand-800"
                : s.verification === "derived"
                  ? "border-sky-200 bg-sky-50 text-sky-900"
                  : "border-amber-300 bg-amber-50 text-amber-900"
            }`}
            title={s.title}
          >
            {s.id}
          </Link>
        ))}
      </div>
    );
  }
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wide text-brand-500">
        <BookOpen className="h-3.5 w-3.5" aria-hidden /> {t("sources.block.title")}
      </p>
      <ul className="mt-2 space-y-2 text-[0.78rem] leading-relaxed text-brand-700">
        {sources.map((s) => (
          <li key={s.id}>
            <Link href={`/sources#${s.id}`} className="font-medium text-brand-900 hover:underline">
              {s.title}
            </Link>
            <span className="block text-[0.72rem] text-brand-500">
              {s.institution}
              {s.year ? ` · ${s.year}` : ""} · {t(`verification.${s.verification}`)}
            </span>
            <span className="block text-[0.72rem] text-brand-600">{s.supports}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[0.68rem] text-brand-400">{t("note.referenceOnly")}</p>
    </div>
  );
}
