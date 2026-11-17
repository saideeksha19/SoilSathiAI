"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Droplets,
  Languages,
  Minus,
  RotateCcw,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { evaluateAll } from "@/lib/evaluation";
import {
  ScenarioOverrides,
  WaterAvailability,
  changedParameters,
  compareScenario,
  runScenario,
  waterFitForNeed,
} from "@/lib/simulation";
import { ParameterKey } from "@/lib/types";
import { crops } from "@/data/crops";
import { cropName, localisedFindings, paramLabel, waterFitLine } from "@/lib/i18n";
import { useT } from "@/lib/useT";
import { PageHeader } from "@/components/ui/PageHeader";
import { NoSoilNotice } from "@/components/ui/RequireSoil";
import { Callout } from "@/components/ui/Callout";
import { SuitabilityPill } from "@/components/ui/Pills";

const paramKeys: ParameterKey[] = ["pH", "nitrogen", "phosphorus", "potassium", "organicCarbon", "electricalConductivity"];

const sliderConfig: Record<ParameterKey, { min: number; max: number; step: number; fallback: number }> = {
  pH: { min: 3, max: 11, step: 0.1, fallback: 6.5 },
  nitrogen: { min: 0, max: 600, step: 5, fallback: 200 },
  phosphorus: { min: 0, max: 120, step: 1, fallback: 20 },
  potassium: { min: 0, max: 600, step: 5, fallback: 150 },
  organicCarbon: { min: 0, max: 3, step: 0.01, fallback: 0.6 },
  electricalConductivity: { min: 0, max: 8, step: 0.1, fallback: 1 },
};

const waterOptions: WaterAvailability[] = ["low", "moderate", "high"];

function displayValue(key: ParameterKey, value: number) {
  if (key === "organicCarbon") return value.toFixed(2);
  if (key === "pH" || key === "electricalConductivity") return value.toFixed(1);
  return String(Math.round(value));
}

export default function SimulatorPage() {
  const router = useRouter();
  const { soil, hydrated, selectedCrops, setScenario, waterAvailability, setWaterAvailability } = useWorkspace();
  const { lang, t } = useT();
  const [overrides, setOverrides] = useState<ScenarioOverrides>({});

  const actualEvaluations = useMemo(() => (soil ? evaluateAll(soil, selectedCrops) : []), [soil, selectedCrops]);
  const scenario = useMemo(
    () => (soil ? runScenario(soil, { ...overrides, cropIds: selectedCrops }) : null),
    [soil, overrides, selectedCrops]
  );
  const rows = useMemo(
    () => (scenario ? compareScenario(actualEvaluations, scenario.evaluations) : []),
    [actualEvaluations, scenario]
  );
  const changed = soil ? changedParameters(soil, overrides) : [];
  const improved = rows.filter((r) => r.changed && better(r.hypothetical, r.actual)).length;
  const worsened = rows.filter((r) => r.changed && better(r.actual, r.hypothetical)).length;

  if (!hydrated) {
    return (
      <div className="container-page py-10">
        <div className="h-8 w-64 animate-pulse rounded bg-brand-100" />
        <div className="mt-4 h-28 animate-pulse rounded-2xl bg-brand-50" />
      </div>
    );
  }

  if (!soil) {
    return (
      <div className="container-page py-10">
        <PageHeader eyebrow={t("sim.eyebrow")} title={t("sim.title")} description={t("sim.description")} />
        <NoSoilNotice purpose={t("sim.purpose")} />
      </div>
    );
  }

  const setParam = (key: ParameterKey, value: number) => {
    setOverrides((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setOverrides({});
    setWaterAvailability(undefined);
  };

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow={t("sim.eyebrow")}
        title={t("sim.title")}
        description={t("sim.description")}
        actions={
          <>
            <button type="button" onClick={reset} className="btn-secondary" disabled={changed.length === 0 && !waterAvailability}>
              <RotateCcw className="h-4 w-4" aria-hidden /> {t("action.reset")}
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setScenario({ ...overrides, waterAvailability: waterAvailability ?? undefined, cropIds: selectedCrops });
                router.push("/report");
              }}
            >
              {t("action.useInReport")} <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </>
        }
      />

      <Callout tone="warning" title={t("sim.callout.title")}>
        {t("sim.callout.body")}
      </Callout>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-brand-100 px-5 py-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-brand-950">
              <SlidersHorizontal className="h-4 w-4 text-brand-600" aria-hidden /> {t("sim.panel.title")}
            </h2>
            <span className="badge bg-amber-50 text-amber-900">{t("sim.simulated")}</span>
          </div>

          <div className="divide-y divide-brand-50">
            {paramKeys.map((key) => {
              const cfg = sliderConfig[key];
              const measured = soil[key].value;
              const current =
                overrides[key] !== undefined && overrides[key] !== null ? (overrides[key] as number) : measured ?? cfg.fallback;
              const dirty = overrides[key] !== undefined;
              return (
                <div key={key} className="px-5 py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <label className="text-[0.84rem] font-medium text-brand-900" htmlFor={`slider-${key}`}>
                      {paramLabel(lang, key)}
                    </label>
                    <span className="text-[0.7rem] text-brand-500">
                      {t("sim.measured", {
                        value:
                          measured === null
                            ? t("sim.notReported")
                            : `${displayValue(key, measured)} ${soil[key].unit ?? ""}`,
                      })}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      id={`slider-${key}`}
                      type="range"
                      min={cfg.min}
                      max={cfg.max}
                      step={cfg.step}
                      value={current}
                      onChange={(e) => setParam(key, Number(e.target.value))}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-brand-100 accent-brand-700"
                      aria-describedby={`hint-${key}`}
                      aria-valuetext={`${displayValue(key, current)} ${soil[key].unit ?? ""}`}
                    />
                    <span
                      className={`w-20 shrink-0 rounded-lg px-2 py-1 text-right text-[0.78rem] font-medium tabular-nums ${
                        dirty ? "bg-amber-100 text-amber-900" : "bg-brand-50 text-brand-800"
                      }`}
                    >
                      {displayValue(key, current)}
                    </span>
                  </div>
                  <p id={`hint-${key}`} className="mt-1.5 text-[0.68rem] text-brand-500">
                    {t(`sim.hint.${key}`)}
                    {dirty && measured !== null ? ` ${t("sim.overridden")}` : ""}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-brand-100 px-5 py-4">
            <p className="flex items-center gap-1.5 text-[0.84rem] font-medium text-brand-900">
              <Droplets className="h-4 w-4 text-brand-600" aria-hidden /> {t("sim.water.title")}
            </p>
            <p className="mt-1 text-[0.7rem] text-brand-500">{t("sim.water.note")}</p>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {waterOptions.map((value) => {
                const active = waterAvailability === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setWaterAvailability(active ? undefined : value)}
                    className={`rounded-xl border px-2.5 py-2 text-left text-[0.76rem] transition ${
                      active ? "border-brand-700 bg-brand-800 text-white" : "border-brand-200 bg-white text-brand-800 hover:border-brand-300"
                    }`}
                  >
                    <span className="block font-medium">{t(`sim.water.${value}`)}</span>
                    <span className={`mt-0.5 block text-[0.64rem] leading-tight ${active ? "text-brand-100/85" : "text-brand-500"}`}>
                      {t(`sim.water.${value}.note`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-brand-100 bg-brand-50/50 px-5 py-4">
            <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-brand-500">{t("sim.changed.title")}</p>
            {changed.length === 0 ? (
              <p className="mt-1 text-[0.76rem] text-brand-600">{t("sim.changed.none")}</p>
            ) : (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {changed.map((k) => (
                  <span key={k} className="badge bg-amber-100 text-amber-900">
                    {paramLabel(lang, k)} → {displayValue(k, overrides[k] as number)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-brand-950">{t("sim.results.title")}</h2>
                <p className="mt-1 text-[0.76rem] leading-relaxed text-brand-600">{t("sim.results.note")}</p>
              </div>
              <div className="flex gap-2 text-center">
                <div className="rounded-xl bg-brand-50 px-3 py-1.5">
                  <p className="text-[0.62rem] uppercase tracking-wide text-brand-500">{t("sim.improved")}</p>
                  <p className="text-base font-semibold tabular-nums text-brand-900">{improved}</p>
                </div>
                <div className="rounded-xl bg-amber-50 px-3 py-1.5">
                  <p className="text-[0.62rem] uppercase tracking-wide text-amber-700">{t("sim.reduced")}</p>
                  <p className="text-base font-semibold tabular-nums text-amber-900">{worsened}</p>
                </div>
              </div>
            </div>

            <ul className="mt-4 space-y-2.5">
              {rows.map((row) => {
                const actualEv = actualEvaluations.find((e) => e.cropId === row.cropId);
                const hypotheticalEv = scenario?.evaluations.find((e) => e.cropId === row.cropId);
                const actualLimits = actualEv ? localisedFindings(lang, actualEv).limiting : [];
                const hypotheticalLimits = hypotheticalEv ? localisedFindings(lang, hypotheticalEv).limiting : [];
                const newLimiting = hypotheticalLimits.filter((l) => !actualLimits.includes(l));
                const resolvedLimiting = actualLimits.filter((l) => !hypotheticalLimits.includes(l));
                const stillMissing = hypotheticalEv ? localisedFindings(lang, hypotheticalEv).missing : [];
                return (
                  <li key={row.cropId} className="rounded-xl border border-brand-100 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[0.86rem] font-medium text-brand-900">{cropName(lang, row.cropId)}</p>
                      <span className="flex items-center gap-1.5 text-[0.7rem]">
                        <SuitabilityPill value={row.actual} />
                        <span className="text-brand-400" aria-hidden>
                          →
                        </span>
                        <SuitabilityPill value={row.hypothetical} />
                      </span>
                    </div>

                    {newLimiting.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {newLimiting.map((l) => (
                          <li key={l} className="flex items-start gap-1.5 text-[0.72rem] leading-snug text-amber-900">
                            <TriangleAlert className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                            <span>
                              <span className="font-medium">{t("sim.newConstraint")} </span>
                              {l}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {resolvedLimiting.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {resolvedLimiting.map((l) => (
                          <li key={l} className="flex items-start gap-1.5 text-[0.72rem] leading-snug text-brand-700">
                            <ChevronUp className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                            <span>
                              <span className="font-medium">{t("sim.resolved")} </span>
                              {l}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {!row.changed && newLimiting.length === 0 && resolvedLimiting.length === 0 ? (
                      <p className="mt-1.5 flex items-center gap-1.5 text-[0.72rem] text-brand-500">
                        <Minus className="h-3 w-3" aria-hidden /> {t("sim.noChange")}
                      </p>
                    ) : null}

                    {stillMissing.length > 0 && row.changed ? (
                      <p className="mt-2 text-[0.68rem] leading-snug text-brand-500">
                        {t("sim.stillMissing", { list: stillMissing.join(" · ") })}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-brand-950">
              <Droplets className="h-4 w-4 text-brand-600" aria-hidden /> {t("sim.waterCheck.title")}
            </h2>
            <p className="mt-1 text-[0.76rem] leading-relaxed text-brand-600">{t("sim.waterCheck.note")}</p>
            <ul className="mt-3 space-y-2">
              {waterAvailability ? (
                crops
                  .filter((c) => selectedCrops.includes(c.id))
                  .map((c) => {
                    const fit = waterFitForNeed(c.id, c.waterNeed, waterAvailability);
                    return (
                      <li
                        key={c.id}
                        className="flex flex-wrap items-baseline justify-between gap-2 border-b border-brand-50 pb-2 last:border-0 last:pb-0"
                      >
                        <span className="text-[0.78rem] font-medium text-brand-900">{cropName(lang, c.id)}</span>
                        <span className="max-w-[22rem] text-right text-[0.7rem] leading-snug text-brand-600">
                          {waterFitLine(lang, fit.code, { need: c.waterNeed, available: waterAvailability })}
                        </span>
                      </li>
                    );
                  })
              ) : (
                <li className="text-[0.78rem] text-brand-600">{t("sim.waterCheck.empty")}</li>
              )}
            </ul>
          </div>

          <Callout tone="safety" title={t("sim.next.title")}>
            <p className="text-[0.8rem] leading-relaxed">{t("sim.next.body")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/explain" className="btn-secondary">
                <Languages className="h-4 w-4" aria-hidden /> {t("action.explainResults")}
              </Link>
              <Link href="/compare" className="btn-secondary">
                {t("sim.next.compare")} <ChevronDown className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </Callout>
        </section>
      </div>
    </div>
  );
}

const rank: Record<string, number> = { "well-suited": 4, "moderately-suited": 3, limited: 2, "insufficient-data": 1 };

function better(a: string, b: string) {
  return (rank[a] ?? 0) > (rank[b] ?? 0);
}
