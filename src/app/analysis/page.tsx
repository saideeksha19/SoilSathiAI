"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AlertCircle, ArrowRight, BarChart3, FlaskConical, GitCompareArrows, Info, Layers, SlidersHorizontal } from "lucide-react";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { evaluateAll } from "@/lib/evaluation";
import { ParameterKey } from "@/lib/types";
import { cropName, paramLabel } from "@/lib/i18n";
import { useT } from "@/lib/useT";
import { PageHeader } from "@/components/ui/PageHeader";
import { NoSoilNotice } from "@/components/ui/RequireSoil";
import { Callout } from "@/components/ui/Callout";
import { ConfidencePill, SourcePill } from "@/components/ui/Pills";
import { CropCard } from "@/components/ui/CropCard";
import { CropStatusChart } from "@/components/sections/CropStatusChart";

const paramKeys: ParameterKey[] = [
  "pH",
  "nitrogen",
  "phosphorus",
  "potassium",
  "organicCarbon",
  "electricalConductivity",
];

const rank: Record<string, number> = {
  "well-suited": 4,
  "moderately-suited": 3,
  limited: 2,
  "insufficient-data": 1,
};

export default function AnalysisPage() {
  const { soil, hydrated, selectedCrops } = useWorkspace();
  const { lang, t } = useT();

  const evaluations = useMemo(() => {
    if (!soil) return [];
    return evaluateAll(soil, selectedCrops.length ? selectedCrops : undefined);
  }, [soil, selectedCrops]);

  if (!hydrated) {
    return (
      <div className="container-page py-10">
        <div className="h-8 w-64 animate-pulse rounded bg-brand-100" />
        <div className="mt-4 h-24 animate-pulse rounded-2xl bg-brand-50" />
      </div>
    );
  }

  if (!soil) {
    return (
      <div className="container-page py-10">
        <PageHeader
          eyebrow={t("analysis.eyebrow")}
          title={t("analysis.title")}
          description={t("analysis.description")}
        />
        <NoSoilNotice purpose={t("analysis.notice.purpose")} />
      </div>
    );
  }

  const provided = paramKeys.filter((k) => soil[k].value !== null);
  const missing = paramKeys.filter((k) => soil[k].value === null);
  const unreliable = paramKeys.filter((k) => soil[k].confidence === "low" && soil[k].value !== null);
  const best = evaluations
    .slice()
    .sort((a, b) => (rank[b.suitability] ?? 0) - (rank[a.suitability] ?? 0) || b.completeness - a.completeness)[0];
  const withLimits = evaluations.filter((e) => e.limitingFactors.length > 0);

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow={t("analysis.eyebrow")}
        title={t("analysis.title")}
        description={t("analysis.description")}
        actions={
          <>
            <Link href="/compare" className="btn-secondary">
              <GitCompareArrows className="h-4 w-4" aria-hidden /> {t("action.compareCrops")}
            </Link>
            <Link href="/simulator" className="btn-primary">
              <SlidersHorizontal className="h-4 w-4" aria-hidden /> {t("action.openSimulator")}
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-brand-500">
            {t("analysis.card.provided")}
          </p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-brand-950">
            {provided.length}
            <span className="text-sm font-medium text-brand-400"> / 6</span>
          </p>
          <p className="mt-1 text-[0.72rem] text-brand-600">
            {missing.length === 0 ? t("analysis.card.providedAll") : t("analysis.card.providedMissing", { count: missing.length })}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-brand-500">
            {t("analysis.card.confidence")}
          </p>
          <p className="mt-2">
            <ConfidencePill confidence={soil.overallConfidence} />
          </p>
          <p className="mt-2 text-[0.72rem] text-brand-600">{t("analysis.card.confidenceNote")}</p>
        </div>
        <div className="card p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-brand-500">{t("analysis.card.best")}</p>
          <p className="mt-1.5 text-base font-semibold text-brand-950">
            {best ? cropName(lang, best.cropId) : "—"}
          </p>
          <p className="mt-1 text-[0.72rem] text-brand-600">
            {best ? t("analysis.card.bestNote", { pct: best.completeness }) : t("analysis.card.noneSelected")}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-brand-500">
            {t("analysis.card.withConstraints")}
          </p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-brand-950">
            {withLimits.length}
            <span className="text-sm font-medium text-brand-400"> / {evaluations.length}</span>
          </p>
          <p className="mt-1 text-[0.72rem] text-brand-600">{t("analysis.card.withConstraintsNote")}</p>
        </div>
      </div>

      {soil.warnings.length > 0 ? (
        <div className="mt-5">
          <Callout tone="warning" title={t("analysis.warnings.title")}>
            <ul className="list-disc space-y-1 pl-4 text-[0.8rem]">
              {(soil.warningCodes && soil.warningCodes.length > 0
                ? soil.warningCodes.map((w) => t(w.code, { ...w.params, ...(w.params?.param ? { param: paramLabel(lang, w.params.param as ParameterKey) } : {}) }))
                : soil.warnings
              )
                .slice(0, 6)
                .map((w) => (
                  <li key={w}>{w}</li>
                ))}
            </ul>
            {soil.warnings.length > 6 ? (
              <p className="mt-1 text-xs">{t("analysis.warnings.more", { count: soil.warnings.length - 6 })}</p>
            ) : null}
          </Callout>
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-brand-100 px-5 py-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-brand-950">
              <FlaskConical className="h-4 w-4 text-brand-600" aria-hidden /> {t("analysis.profile.title")}
            </h2>
            <Link
              href="/analyzer"
              className="no-print text-xs font-medium text-brand-700 underline decoration-brand-300 underline-offset-2"
            >
              {t("action.editValues")}
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-100 bg-brand-50/50 text-[0.68rem] uppercase tracking-wide text-brand-600">
                  <th className="px-5 py-2.5 font-semibold">{t("label.parameter")}</th>
                  <th className="px-3 py-2.5 font-semibold">{t("label.measured")}</th>
                  <th className="px-3 py-2.5 font-semibold">{t("label.unit")}</th>
                  <th className="px-3 py-2.5 font-semibold">{t("label.original")}</th>
                  <th className="px-3 py-2.5 font-semibold">{t("label.source")}</th>
                  <th className="px-5 py-2.5 font-semibold">{t("label.confidence")}</th>
                </tr>
              </thead>
              <tbody>
                {paramKeys.map((key) => {
                  const m = soil[key];
                  const original =
                    m.originalValue === null || m.originalValue === undefined || m.originalValue === ""
                      ? "—"
                      : `${m.originalValue} ${m.originalUnit ?? ""}`.trim();
                  return (
                    <tr key={key} className="border-b border-brand-50 last:border-0">
                      <td className="px-5 py-3">
                        <span className="font-medium text-brand-900">{paramLabel(lang, key)}</span>
                        {m.notes ? (
                          <span className="mt-0.5 block text-[0.68rem] leading-snug text-amber-700">
                            {m.noteCode ? t(m.noteCode, { ...m.noteParams, param: paramLabel(lang, key) }) : m.notes}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 tabular-nums text-brand-900">
                        {m.value === null ? <span className="text-brand-400">{t("label.notReported")}</span> : m.value}
                      </td>
                      <td className="px-3 py-3 text-[0.78rem] text-brand-600">{m.value === null ? "—" : m.unit}</td>
                      <td className="px-3 py-3 text-[0.78rem] text-brand-600">{original}</td>
                      <td className="px-3 py-3">
                        <SourcePill source={m.source} />
                      </td>
                      <td className="px-5 py-3">
                        {m.value === null ? (
                          <span className="text-[0.72rem] text-brand-400">—</span>
                        ) : (
                          <ConfidencePill confidence={m.confidence} />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {soil.texture || soil.location || soil.sampleId ? (
            <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-brand-100 bg-soil-50 px-5 py-3 text-[0.75rem] text-brand-700">
              {soil.sampleId ? (
                <span>
                  <span className="text-brand-500">{t("label.sample")}:</span> {soil.sampleId}
                </span>
              ) : null}
              {soil.location ? (
                <span>
                  <span className="text-brand-500">{t("label.location")}:</span> {soil.location}
                </span>
              ) : null}
              {soil.texture ? (
                <span>
                  <span className="text-brand-500">{t("label.texture")}:</span> {soil.texture}
                </span>
              ) : null}
            </div>
          ) : null}
        </section>

        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-brand-950">
              <AlertCircle className="h-4 w-4 text-amber-600" aria-hidden /> {t("analysis.missing.title")}
            </h2>
            {missing.length === 0 && unreliable.length === 0 ? (
              <p className="mt-2 text-[0.8rem] leading-relaxed text-brand-700">{t("analysis.missing.allPresent")}</p>
            ) : (
              <ul className="mt-2 space-y-2 text-[0.8rem] leading-relaxed text-brand-700">
                {missing.map((k) => (
                  <li key={k}>{t("analysis.missing.notReported", { param: paramLabel(lang, k) })}</li>
                ))}
                {unreliable.map((k) => (
                  <li key={k}>{t("analysis.missing.flagged", { param: paramLabel(lang, k) })}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-brand-950">
              <Layers className="h-4 w-4 text-brand-600" aria-hidden /> {t("analysis.unknown.title")}
            </h2>
            <ul className="mt-2 space-y-1.5 text-[0.78rem] leading-relaxed text-brand-700">
              <li>{t("analysis.unknown.rain")}</li>
              <li>{t("analysis.unknown.variety")}</li>
              <li>{t("analysis.unknown.soil")}</li>
              <li>{t("analysis.unknown.micro")}</li>
              <li>{t("analysis.unknown.market")}</li>
            </ul>
            <p className="mt-2 text-[0.7rem] text-brand-500">{t("analysis.unknown.note")}</p>
          </div>

          <div className="rounded-xl border border-brand-200 bg-brand-900 p-5 text-white">
            <p className="text-sm font-semibold">{t("analysis.next.title")}</p>
            <p className="mt-1.5 text-[0.78rem] leading-relaxed text-brand-100/85">{t("analysis.next.body")}</p>
            <Link
              href="/simulator"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-accent-400 px-3 py-2 text-[0.78rem] font-semibold text-brand-950 hover:bg-accent-500"
            >
              {t("action.openSimulator")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </aside>
      </div>

      <section className="card mt-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-brand-950">
              <BarChart3 className="h-4 w-4 text-brand-600" aria-hidden /> {t("analysis.matrix.title")}
            </h2>
            <p className="mt-1 text-[0.78rem] text-brand-600">{t("analysis.matrix.note")}</p>
          </div>
          <span className="badge bg-brand-50 text-brand-700">{t("label.deterministic")}</span>
        </div>
        <div className="mt-4">
          <CropStatusChart evaluations={evaluations} />
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-brand-950">{t("analysis.suitability.title")}</h2>
            <p className="mt-1 text-[0.8rem] text-brand-600">{t("analysis.suitability.note")}</p>
          </div>
          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-brand-800 hover:text-brand-600"
          >
            {t("analysis.suitability.link")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {evaluations.map((e) => (
            <CropCard key={e.cropId} evaluation={e} />
          ))}
        </div>
      </section>

      <div className="mt-6">
        <Callout tone="safety" title={t("analysis.howTo.title")}>
          <span className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
            <span>{t("analysis.howTo.body")}</span>
          </span>
        </Callout>
      </div>
    </div>
  );
}
