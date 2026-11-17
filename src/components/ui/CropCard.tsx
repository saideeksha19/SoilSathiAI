"use client";

import Link from "next/link";
import { ArrowRight, Check, Droplets, TrendingUp, TriangleAlert } from "lucide-react";
import { CropEvaluation } from "@/lib/types";
import { getCropById } from "@/data/crops";
import { SuitabilityPill, VerificationPill } from "./Pills";
import { SourceRefs } from "./SourceRefs";
import { cropLimitations, cropName, cropWaterNote, localisedFindings } from "@/lib/i18n";
import { useT } from "@/lib/useT";

/** Weakest verification status among the parameter ranges this crop actually uses. */
export function evaluationVerification(evaluation: CropEvaluation): "verified" | "derived" | "unverified" {
  const statuses = evaluation.parameterAssessments
    .map((a) => a.verification)
    .filter((v): v is "verified" | "derived" | "unverified" => Boolean(v));
  if (statuses.includes("unverified")) return "unverified";
  if (statuses.includes("derived")) return "derived";
  if (statuses.length > 0) return "verified";
  return "unverified";
}

export function CropCard({ evaluation, showSources = true }: { evaluation: CropEvaluation; showSources?: boolean }) {
  const { lang, t } = useT();
  const crop = getCropById(evaluation.cropId);
  const findings = localisedFindings(lang, evaluation);
  const limitations = cropLimitations(lang, evaluation.cropId);
  return (
    <article className="card flex flex-col p-5" id={`crop-${evaluation.cropId}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[0.95rem] font-semibold text-brand-950">{cropName(lang, evaluation.cropId)}</h3>
          {crop ? <p className="text-[0.72rem] italic text-brand-500">{crop.scientificName}</p> : null}
        </div>
        <SuitabilityPill value={evaluation.suitability} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <VerificationPill status={evaluationVerification(evaluation)} />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[0.7rem] text-brand-600">
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden /> {t("label.dataCompleteness")}
          </span>
          <span className="font-semibold tabular-nums text-brand-900">{evaluation.completeness}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
          <div
            className={`h-full rounded-full ${
              evaluation.completeness >= 80
                ? "bg-brand-600"
                : evaluation.completeness >= 50
                  ? "bg-amber-500"
                  : "bg-stone-400"
            }`}
            style={{ width: `${Math.max(evaluation.completeness, 2)}%` }}
          />
        </div>
      </div>

      {findings.limiting.length > 0 ? (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3">
          <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-amber-900">
            <TriangleAlert className="h-3.5 w-3.5" aria-hidden /> {t("label.limitingFactors")}
          </p>
          <ul className="mt-1.5 space-y-1 text-[0.75rem] leading-relaxed text-amber-900">
            {findings.limiting.slice(0, 3).map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-3 text-[0.75rem] leading-relaxed text-brand-600">{t("card.noConstraints")}</p>
      )}

      {findings.strengths.length > 0 ? (
        <div className="mt-2.5">
          <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-brand-800">
            <Check className="h-3.5 w-3.5" aria-hidden /> {t("label.optimalBand")}
          </p>
          <ul className="mt-1 space-y-0.5 text-[0.75rem] leading-relaxed text-brand-700">
            {findings.strengths.slice(0, 3).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {findings.missing.length > 0 ? (
        <p className="mt-2.5 text-[0.72rem] leading-relaxed text-brand-500">
          {t("card.missingDetail", { count: findings.missing.length })}
        </p>
      ) : null}

      {crop ? (
        <p className="mt-3 flex items-start gap-1.5 text-[0.72rem] text-brand-600">
          <Droplets className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>
            {t("label.waterDocumented")}:{" "}
            <span className="font-medium text-brand-800">{cropWaterNote(lang, crop.id)}</span>
          </span>
        </p>
      ) : null}

      {limitations.length > 0 ? (
        <p className="mt-2 text-[0.7rem] leading-snug text-brand-400">
          <span className="font-medium text-brand-500">{t("card.modelLimitation")}</span>
          {limitations[0]}
        </p>
      ) : null}

      {showSources ? (
        <div className="mt-3 border-t border-brand-100 pt-3">
          <SourceRefs ids={evaluation.sourceIds} compact />
        </div>
      ) : null}

      <Link
        href={`/compare#crop-${evaluation.cropId}`}
        className="mt-4 inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-brand-800 hover:text-brand-600"
      >
        {t("card.compareDetail")}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </article>
  );
}
