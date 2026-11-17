"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, BookOpen, Printer, TriangleAlert } from "lucide-react";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { evaluateAll } from "@/lib/evaluation";
import { compareScenario, runScenario } from "@/lib/simulation";
import { ParameterKey } from "@/lib/types";
import { sourceCatalog } from "@/data/crops";
import { getSource } from "@/data/sources";
import { Logo } from "@/components/brand/Logo";
import { NoSoilNotice } from "@/components/ui/RequireSoil";
import { SuitabilityPill, VerificationPill } from "@/components/ui/Pills";
import { buildDeterministicExplanation } from "@/lib/explain";
import { cropName, localisedFindings, paramLabel, suitabilityLabel, waterNeedLabel } from "@/lib/i18n";
import { useT } from "@/lib/useT";

const paramKeys: ParameterKey[] = [
  "pH",
  "nitrogen",
  "phosphorus",
  "potassium",
  "organicCarbon",
  "electricalConductivity",
];

export default function ReportPage() {
  const {
    soil,
    hydrated,
    origin,
    selectedCrops,
    explanations,
    scenario,
    scenarioUpdatedAt,
    waterAvailability,
  } = useWorkspace();
  const { lang, t } = useT();

  const evaluations = useMemo(() => (soil ? evaluateAll(soil, selectedCrops) : []), [soil, selectedCrops]);
  const scenarioResult = useMemo(() => {
    if (!soil || !scenario) return null;
    const run = runScenario(soil, { ...scenario, cropIds: selectedCrops });
    return { run, rows: compareScenario(evaluations, run.evaluations) };
  }, [soil, scenario, selectedCrops, evaluations]);

  // The printed report must be readable in the language it is printed in: prefer the
  // explanation generated in that language, otherwise build the deterministic one from
  // the same evaluations instead of falling back to an English body on a Hindi page.
  const explanation = useMemo(() => {
    const generated = explanations[lang];
    if (generated) return generated;
    if (!soil || evaluations.length === 0) return null;
    return buildDeterministicExplanation({ soil, evaluations, language: lang });
  }, [explanations, lang, soil, evaluations]);

  if (!hydrated) {
    return (
      <div className="container-page py-10">
        <div className="h-8 w-64 animate-pulse rounded bg-brand-100" />
        <div className="mt-4 h-40 animate-pulse rounded-2xl bg-brand-50" />
      </div>
    );
  }

  if (!soil) {
    return (
      <div className="container-page py-10">
        <NoSoilNotice purpose={t("report.title")} />
      </div>
    );
  }

  const missing = paramKeys.filter((k) => soil[k].value === null);
  const unreliable = paramKeys.filter((k) => soil[k].value !== null && soil[k].confidence === "low");
  const sourceIds = Array.from(new Set(evaluations.flatMap((e) => e.sourceIds)));
  const sources = sourceCatalog.filter((s) => sourceIds.includes(s.id));
  const questions = explanation?.questionsForExpert ?? [];
  const generated = new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : lang === "kn" ? "kn-IN" : "en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container-page py-8 print:py-0">
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-brand-950">{t("report.title")}</h1>
          <p className="mt-1 text-[0.82rem] text-brand-600">{t("report.subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/explain" className="btn-secondary">
            {t("action.addExplanation")}
          </Link>
          <button type="button" className="btn-primary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden /> {t("action.print")}
          </button>
        </div>
      </div>

      <article className="card overflow-hidden print:rounded-none print:border-0 print:shadow-none">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-100 bg-brand-900 px-6 py-5 text-white">
          <div className="flex items-start gap-3">
            <Logo size={40} />
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-200">
                {t("report.eyebrow")}
              </p>
              <h2 className="mt-0.5 text-lg font-semibold">
                {soil.sampleId ? t("report.sampleHeading", { id: soil.sampleId }) : t("report.soilHeading")}
              </h2>
              <p className="text-[0.76rem] text-brand-100/80">
                {soil.location ?? t("report.locationMissing")} · {t("report.generated", { date: generated })}
              </p>
            </div>
          </div>
          <div className="text-right text-[0.7rem] text-brand-100/85">
            <p className="font-medium text-white">{t(`report.origin.${origin ?? "manual"}`)}</p>
            <p className="mt-0.5">{t("report.engine")}</p>
          </div>
        </header>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1fr_1fr]">
          <section>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-wide text-brand-500">
              {t("report.section.profile")}
            </h3>
            <table className="mt-2 w-full text-left text-[0.8rem]">
              <thead>
                <tr className="border-b border-brand-100 text-[0.64rem] uppercase tracking-wide text-brand-500">
                  <th className="py-1.5 pr-2 font-semibold">{t("label.parameter")}</th>
                  <th className="py-1.5 pr-2 font-semibold">{t("label.value")}</th>
                  <th className="py-1.5 pr-2 font-semibold">{t("label.unit")}</th>
                  <th className="py-1.5 pr-2 font-semibold">{t("label.source")}</th>
                </tr>
              </thead>
              <tbody>
                {paramKeys.map((key) => {
                  const m = soil[key];
                  return (
                    <tr key={key} className="border-b border-brand-50 last:border-0">
                      <td className="py-1.5 pr-2 text-brand-800">{paramLabel(lang, key)}</td>
                      <td className="py-1.5 pr-2 font-medium tabular-nums text-brand-950">
                        {m.value === null ? t("label.notReported") : m.value}
                      </td>
                      <td className="py-1.5 pr-2 text-brand-600">{m.value === null ? "—" : m.unit}</td>
                      <td className="py-1.5 pr-2 text-[0.72rem] text-brand-600">
                        {t(`source.${m.source}`)}
                        {m.confidence === "low" && m.value !== null ? ` · ${t("report.verify")}` : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-2 text-[0.7rem] leading-snug text-brand-500">
              {t("report.texture", { texture: soil.texture ?? t("label.notProvided") })} ·{" "}
              {t("report.confidence", { level: t(`confidence.${soil.overallConfidence}`) })} · {t("report.nothingImputed")}
            </p>
          </section>

          <section>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-wide text-brand-500">
              {t("report.section.crops")}
            </h3>
            <ul className="mt-2 space-y-2">
              {evaluations.map((ev) => {
                const findings = localisedFindings(lang, ev);
                return (
                  <li key={ev.cropId} className="rounded-lg border border-brand-100 px-3 py-2">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="text-[0.82rem] font-medium text-brand-900">{cropName(lang, ev.cropId)}</span>
                      <SuitabilityPill value={ev.suitability} />
                    </div>
                    {findings.limiting.length > 0 ? (
                      <p className="mt-1 text-[0.7rem] leading-snug text-amber-800">
                        {t("label.constraints")}: {findings.limiting.join(" ")}
                      </p>
                    ) : (
                      <p className="mt-1 text-[0.7rem] leading-snug text-brand-600">{t("card.noConstraints")}</p>
                    )}
                    {findings.missing.length > 0 ? (
                      <p className="mt-1 text-[0.68rem] leading-snug text-brand-500">
                        {t("card.missingTitle")}: {findings.missing.join(" · ")}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <div className="grid gap-6 border-t border-brand-100 px-6 py-6 lg:grid-cols-[1fr_1fr] print:break-before-page">
          <section>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-wide text-brand-500">
              {t("report.section.gaps")}
            </h3>
            {missing.length === 0 && unreliable.length === 0 ? (
              <p className="mt-2 text-[0.8rem] text-brand-700">{t("report.allReported")}</p>
            ) : (
              <ul className="mt-2 space-y-1.5 text-[0.8rem] leading-relaxed text-brand-700">
                {missing.map((k) => (
                  <li key={k}>{t("report.notReportedBySource", { param: paramLabel(lang, k) })}</li>
                ))}
                {unreliable.map((k) => (
                  <li key={k}>{t("report.flagged", { param: paramLabel(lang, k) })}</li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-[0.7rem] leading-snug text-brand-500">
              {t("report.waterDeclared", {
                value: waterAvailability ? waterNeedLabel(lang, waterAvailability) : t("label.notProvided"),
              })}
            </p>
          </section>

          <section>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-wide text-brand-500">
              {t("report.section.scenario")}
            </h3>
            {scenarioResult ? (
              <>
                <p className="mt-2 text-[0.76rem] leading-snug text-brand-700">
                  {t("report.scenario.saved", {
                    date: scenarioUpdatedAt
                      ? new Date(scenarioUpdatedAt).toLocaleString(lang === "hi" ? "hi-IN" : lang === "kn" ? "kn-IN" : "en-IN")
                      : "",
                  })}
                </p>
                <ul className="mt-2 space-y-1.5 text-[0.78rem] leading-snug text-brand-700">
                  {scenarioResult.rows.map((row) => {
                    const hypothetical = scenarioResult.run.evaluations.find((e) => e.cropId === row.cropId);
                    const actual = evaluations.find((e) => e.cropId === row.cropId);
                    const newLimiting = hypothetical
                      ? localisedFindings(lang, hypothetical).limiting.filter(
                          (l) => !(actual ? localisedFindings(lang, actual).limiting : []).includes(l)
                        )
                      : [];
                    const resolved = actual
                      ? localisedFindings(lang, actual).limiting.filter(
                          (l) => !(hypothetical ? localisedFindings(lang, hypothetical).limiting : []).includes(l)
                        )
                      : [];
                    return (
                      <li key={row.cropId}>
                        <span className="font-medium text-brand-900">{cropName(lang, row.cropId)}:</span>{" "}
                        {suitabilityLabel(lang, row.actual)} → {suitabilityLabel(lang, row.hypothetical)}
                        {newLimiting.length > 0
                          ? ` · ${t("report.scenario.newConstraint", { list: newLimiting.join(" ") })}`
                          : ""}
                        {resolved.length > 0 ? ` · ${t("report.scenario.resolved", { list: resolved.join(" ") })}` : ""}
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p className="mt-2 text-[0.8rem] leading-relaxed text-brand-600">{t("report.scenario.none")}</p>
            )}
          </section>
        </div>

        <div className="grid gap-6 border-t border-brand-100 px-6 py-6 lg:grid-cols-[1fr_1fr]">
          <section>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-wide text-brand-500">
              {t("report.section.questions")}
            </h3>
            {questions.length > 0 ? (
              <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-[0.8rem] leading-relaxed text-brand-700">
                {questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 text-[0.8rem] leading-relaxed text-brand-600">{t("report.noQuestions")}</p>
            )}
            {explanation ? (
              <div className="mt-3 rounded-lg bg-brand-50/70 px-3 py-2 text-[0.74rem] leading-relaxed text-brand-700">
                <p className="font-medium text-brand-900">
                  {t("report.summaryTitle", { lang: explanation.language.toUpperCase() })}
                  {explanation.usedAi ? ` · ${t("exp.gemini")}` : ` · ${t("exp.fallback")}`}
                </p>
                <p className="mt-1">{explanation.summary}</p>
              </div>
            ) : null}
          </section>

          <section>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-wide text-brand-500">
              {t("report.section.sources")}
            </h3>
            <ul className="mt-2 space-y-2.5 text-[0.76rem] leading-relaxed text-brand-700">
              {sources.map((s) => {
                const source = getSource(s.id);
                return (
                  <li key={s.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/sources#${s.id}`} className="font-medium text-brand-900 hover:underline">
                        {s.title}
                      </Link>
                      <VerificationPill status={s.verification} />
                    </div>
                    <span className="block text-[0.7rem] text-brand-500">
                      {s.institution}
                      {s.year ? ` · ${s.year}` : ""}
                      {source?.url ? (
                        <>
                          {" · "}
                          <a href={source.url} className="underline decoration-brand-300 underline-offset-2" target="_blank" rel="noreferrer">
                            {t("sources.label.openSource")}
                          </a>
                        </>
                      ) : null}
                    </span>
                    <span className="block text-[0.7rem] text-brand-600">{s.supports}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 flex items-start gap-1.5 text-[0.68rem] leading-snug text-brand-500">
              <BookOpen className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
              {t("report.sourcesNote")}
            </p>
          </section>
        </div>

        <footer className="border-t border-brand-100 bg-brand-50/60 px-6 py-4">
          <p className="flex items-start gap-2 text-[0.72rem] leading-relaxed text-brand-700">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
            <span>
              {t("report.footer")}
              {origin === "sample" ? ` ${t("report.footerSample")}` : ""}
            </span>
          </p>
          <p className="mt-2 text-[0.66rem] text-brand-400">{t("report.tagline")}</p>
        </footer>
      </article>

      <div className="no-print mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          href="/simulator"
          className="card flex items-center justify-between p-4 text-[0.84rem] font-medium text-brand-900 hover:border-brand-300"
        >
          {t("report.next.simulator")} <ArrowRight className="h-4 w-4 text-brand-500" aria-hidden />
        </Link>
        <Link
          href="/sources"
          className="card flex items-center justify-between p-4 text-[0.84rem] font-medium text-brand-900 hover:border-brand-300"
        >
          {t("report.next.sources")} <ArrowRight className="h-4 w-4 text-brand-500" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
