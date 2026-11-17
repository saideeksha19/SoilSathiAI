"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Check, Droplets, GitCompareArrows, SlidersHorizontal } from "lucide-react";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { evaluateAll } from "@/lib/evaluation";
import { crops, getCropById } from "@/data/crops";
import { ParameterKey } from "@/lib/types";
import { waterFitForNeed } from "@/lib/simulation";
import { cropName, paramLabel, rangeLine, waterFitLine, waterNeedLabel } from "@/lib/i18n";
import { useT } from "@/lib/useT";
import { PageHeader } from "@/components/ui/PageHeader";
import { NoSoilNotice } from "@/components/ui/RequireSoil";
import { Callout } from "@/components/ui/Callout";
import { SuitabilityPill, StatusPill } from "@/components/ui/Pills";
import { CompareCard } from "@/components/sections/CompareCard";

const paramKeys: ParameterKey[] = [
  "pH",
  "nitrogen",
  "phosphorus",
  "potassium",
  "organicCarbon",
  "electricalConductivity",
];

const fitStyles: Record<string, string> = {
  adequate: "bg-brand-100 text-brand-900",
  marginal: "bg-amber-100 text-amber-900",
  insufficient: "bg-orange-100 text-orange-900",
  unknown: "bg-stone-100 text-stone-600",
};

export default function ComparePage() {
  const { soil, hydrated, selectedCrops, setSelectedCrops, waterAvailability } = useWorkspace();
  const { lang, t } = useT();

  const evaluations = useMemo(() => {
    if (!soil) return [];
    return evaluateAll(soil, selectedCrops);
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
          eyebrow={t("compare.eyebrow")}
          title={t("compare.title")}
          description={t("compare.description")}
        />
        <NoSoilNotice purpose={t("compare.purpose")} />
      </div>
    );
  }

  const toggle = (id: string) => {
    setSelectedCrops(
      selectedCrops.includes(id) ? selectedCrops.filter((c) => c !== id) : [...selectedCrops, id]
    );
  };

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow={t("compare.eyebrow")}
        title={t("compare.title")}
        description={t("compare.description")}
        actions={
          <>
            <Link href="/simulator" className="btn-secondary">
              <SlidersHorizontal className="h-4 w-4" aria-hidden /> {t("action.testScenario")}
            </Link>
            <Link href="/report" className="btn-primary">
              {t("action.viewReport")} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </>
        }
      />

      <div className="card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-brand-500">{t("compare.cropsInView")}</p>
          <div className="flex gap-2">
            <button
              type="button"
              className="text-[0.72rem] font-medium text-brand-700 underline decoration-brand-300 underline-offset-2"
              onClick={() => setSelectedCrops(crops.map((c) => c.id))}
            >
              {t("action.selectAll")}
            </button>
            <button
              type="button"
              className="text-[0.72rem] font-medium text-brand-700 underline decoration-brand-300 underline-offset-2"
              onClick={() => setSelectedCrops([])}
            >
              {t("action.clear")}
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {crops.map((crop) => {
            const active = selectedCrops.includes(crop.id);
            return (
              <button
                key={crop.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(crop.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.78rem] font-medium transition ${
                  active
                    ? "border-brand-700 bg-brand-800 text-white"
                    : "border-brand-200 bg-white text-brand-700 hover:border-brand-300"
                }`}
              >
                {active ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}
                {cropName(lang, crop.id)}
              </button>
            );
          })}
        </div>
      </div>

      {evaluations.length === 0 ? (
        <div className="mt-5">
          <Callout tone="info" title={t("compare.none.title")}>
            {t("compare.none.body")}
          </Callout>
        </div>
      ) : null}

      {evaluations.length > 0 ? (
        <>
          <div className="mt-6 card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-100 bg-brand-50/60 px-5 py-3">
              <p className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-wide text-brand-600">
                <GitCompareArrows className="h-3.5 w-3.5" aria-hidden /> {t("compare.matrix.title")}
              </p>
              <p className="text-[0.7rem] text-brand-500">{t("compare.matrix.note")}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-brand-100 bg-white">
                    <th scope="col" className="sticky left-0 z-10 bg-white px-4 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-brand-500">
                      {t("compare.matrix.measurement")}
                    </th>
                    {evaluations.map((ev) => (
                      <th key={ev.cropId} scope="col" className="min-w-[150px] px-4 py-3 text-left">
                        <div className="text-[0.82rem] font-semibold text-brand-900">{cropName(lang, ev.cropId)}</div>
                        <div className="mt-1">
                          <SuitabilityPill value={ev.suitability} />
                        </div>
                        <div className="mt-1.5 text-[0.68rem] font-normal text-brand-500">
                          {t("label.dataComplete", { pct: ev.completeness })}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paramKeys.map((key) => (
                    <tr key={key} className="border-b border-brand-50 last:border-0">
                      <th scope="row" className="sticky left-0 z-10 bg-white px-4 py-2.5 text-left align-top">
                        <span className="block text-[0.78rem] font-medium text-brand-900">{paramLabel(lang, key)}</span>
                      </th>
                      {evaluations.map((ev) => {
                        const a = ev.parameterAssessments.find((p) => p.key === key);
                        if (!a) {
                          return (
                            <td key={ev.cropId} className="px-4 py-2.5 align-top text-[0.72rem] text-brand-400">
                              {t("label.notUsed")}
                            </td>
                          );
                        }
                        return (
                          <td key={ev.cropId} className="px-4 py-2.5 align-top">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[0.82rem] font-medium tabular-nums text-brand-900">
                                {a.measured !== null && a.measured !== undefined
                                  ? `${a.measured}${a.unit ? ` ${a.unit}` : ""}`
                                  : "—"}
                              </span>
                              <StatusPill status={a.status} />
                            </div>
                            <p className="mt-1 text-[0.68rem] leading-snug text-brand-500">
                              {a.range ? rangeLine(lang, a.range) : t("label.notUsed")}
                            </p>
                            {a.verification && a.verification !== "verified" ? (
                              <p className="mt-0.5 text-[0.64rem] font-medium text-amber-700">
                                {a.verification === "derived"
                                  ? t("verification.derived")
                                  : t("verification.unverified")}
                              </p>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className="sticky left-0 z-10 bg-white px-4 py-2.5 text-left">
                      <span className="flex items-center gap-1 text-[0.78rem] font-medium text-brand-900">
                        <Droplets className="h-3.5 w-3.5 text-brand-500" aria-hidden /> {t("label.waterNeed")}
                      </span>
                      <span className="block text-[0.68rem] text-brand-400">{t("label.reference")}</span>
                    </th>
                    {evaluations.map((ev) => {
                      const crop = getCropById(ev.cropId);
                      if (!crop) return <td key={ev.cropId} />;
                      const fit = waterFitForNeed(crop.id, crop.waterNeed, waterAvailability);
                      return (
                        <td key={ev.cropId} className="px-4 py-2.5 align-top">
                          <span className={`badge ${fitStyles[fit.fit] ?? fitStyles.unknown}`}>
                            {waterNeedLabel(lang, crop.waterNeed)}
                          </span>
                          <p className="mt-1 text-[0.68rem] leading-snug text-brand-500">
                            {waterFitLine(lang, fit.code, { need: crop.waterNeed, available: waterAvailability })}
                          </p>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {evaluations.map((ev) => (
              <CompareCard key={ev.cropId} evaluation={ev} />
            ))}
          </div>

          <div className="mt-6">
            <Callout tone="warning" title={t("compare.callout.title")}>
              {t("compare.callout.body")}{" "}
              <Link href="/sources" className="font-medium underline decoration-brand-300 underline-offset-2">
                {t("compare.callout.link")}
              </Link>
              .
            </Callout>
          </div>
        </>
      ) : null}
    </div>
  );
}
