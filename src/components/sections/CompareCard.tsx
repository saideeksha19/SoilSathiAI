"use client";

import { Check, Info, TriangleAlert } from "lucide-react";
import { CropEvaluation } from "@/lib/types";
import { getCropById } from "@/data/crops";
import { StatusPill, SuitabilityPill, VerificationPill } from "@/components/ui/Pills";
import { SourceRefs } from "@/components/ui/SourceRefs";
import {
  assessmentText,
  cropLimitations,
  cropName,
  localisedFindings,
  paramLabel,
  rangeLine,
} from "@/lib/i18n";
import { useT } from "@/lib/useT";
import { evaluationVerification } from "@/components/ui/CropCard";

export function CompareCard({ evaluation }: { evaluation: CropEvaluation }) {
  const { lang, t } = useT();
  const ev = evaluation;
  const crop = getCropById(ev.cropId);
  const findings = localisedFindings(lang, ev);
  const limitations = cropLimitations(lang, ev.cropId);

  return (
    <article className="card flex flex-col p-5" id={`crop-${ev.cropId}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-[1.05rem] font-semibold tracking-tight text-brand-900">{cropName(lang, ev.cropId)}</h2>
          {crop ? <p className="text-[0.75rem] italic text-brand-400">{crop.scientificName}</p> : null}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <SuitabilityPill value={ev.suitability} />
          <VerificationPill status={evaluationVerification(ev)} />
        </div>
      </div>

      <p className="mt-3 flex flex-wrap items-baseline gap-x-2 text-[0.74rem] text-brand-600">
        <span className="font-medium text-brand-800">{t("label.dataComplete", { pct: ev.completeness })}</span>
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-wide text-brand-500">
            <Check className="h-3.5 w-3.5" aria-hidden /> {t("card.inFavour")}
          </p>
          {findings.strengths.length > 0 ? (
            <ul className="mt-1.5 space-y-1 text-[0.76rem] leading-snug text-brand-700">
              {findings.strengths.map((s) => (
                <li key={s} className="flex gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-400" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-[0.76rem] text-brand-400">{t("card.noOptimal")}</p>
          )}
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-wide text-amber-700">
            <TriangleAlert className="h-3.5 w-3.5" aria-hidden /> {t("label.constraints")}
          </p>
          {findings.limiting.length > 0 ? (
            <ul className="mt-1.5 space-y-1 text-[0.76rem] leading-snug text-amber-900">
              {findings.limiting.map((s) => (
                <li key={s} className="flex gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-[0.76rem] text-brand-400">{t("card.noConstraints")}</p>
          )}
        </div>
      </div>

      {findings.missing.length > 0 ? (
        <div className="mt-3 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
          <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-wide text-stone-600">
            <Info className="h-3.5 w-3.5" aria-hidden /> {t("card.missingTitle")}
          </p>
          <ul className="mt-1 space-y-1 text-[0.74rem] leading-snug text-stone-700">
            {findings.missing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-xl border border-brand-100">
        <p className="border-b border-brand-100 bg-brand-50/60 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-wide text-brand-600">
          {t("compare.perParam.title")}
        </p>
        <table className="w-full text-left text-[0.74rem]">
          <thead className="sr-only">
            <tr>
              <th>{t("label.parameter")}</th>
              <th>{t("label.value")}</th>
              <th>{t("label.reference")}</th>
              <th>{t("label.why")}</th>
            </tr>
          </thead>
          <tbody>
            {ev.parameterAssessments.map((a) => (
              <tr key={a.key} className="border-b border-brand-50 align-top last:border-0">
                <td className="px-3 py-2 font-medium text-brand-900">
                  {paramLabel(lang, a.key)}
                  <span className="mt-1 block">
                    <StatusPill status={a.status} />
                  </span>
                </td>
                <td className="px-2 py-2 tabular-nums text-brand-800">
                  {a.measured === null || a.measured === undefined
                    ? t("label.notReported")
                    : `${a.measured} ${a.unit ?? ""}`}
                </td>
                <td className="px-2 py-2 text-brand-600">
                  {a.range ? rangeLine(lang, a.range) : t("label.notUsed")}
                </td>
                <td className="px-3 py-2 text-brand-700">{assessmentText(lang, a)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {limitations.length > 0 ? (
        <p className="mt-3 text-[0.7rem] leading-snug text-brand-400">
          <span className="font-medium text-brand-500">{t("card.modelLimitation")}</span>
          {limitations.join(" ")}
        </p>
      ) : null}

      <div className="mt-3 border-t border-brand-100 pt-3">
        <SourceRefs ids={ev.sourceIds} compact />
      </div>
    </article>
  );
}
