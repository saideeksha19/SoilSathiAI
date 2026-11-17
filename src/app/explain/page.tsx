"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Bot, FileText, Info, Languages, Loader2, RefreshCw, Sparkles, TriangleAlert } from "lucide-react";
import { useWorkspace, Language } from "@/components/workspace/WorkspaceProvider";
import { evaluateAll } from "@/lib/evaluation";
import { ExplanationResponse } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { NoSoilNotice } from "@/components/ui/RequireSoil";
import { Callout } from "@/components/ui/Callout";
import { LANGS } from "@/lib/i18n";
import { useT } from "@/lib/useT";

const languages: { value: Language; native: string }[] = LANGS.map((l) => ({
  value: l.id,
  native: l.id === "kn" ? "ಕನ್ನಡ" : l.id === "hi" ? "हिन्दी" : "English",
}));

export default function ExplainPage() {
  const { soil, hydrated, selectedCrops, explanations, setExplanation, uiLanguage } = useWorkspace();
  const [language, setLanguage] = useState<Language>(uiLanguage);
  const [languageChosen, setLanguageChosen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useT();

  // The stored UI language only arrives after hydration; until the user picks a language
  // on this screen, the explanation should follow it instead of defaulting to English.
  useEffect(() => {
    if (!languageChosen) setLanguage(uiLanguage);
  }, [uiLanguage, languageChosen]);

  const evaluations = useMemo(() => (soil ? evaluateAll(soil, selectedCrops) : []), [soil, selectedCrops]);
  const current = explanations[language];

  const generate = useCallback(
    async (lang: Language) => {
      if (!soil) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ soil, evaluations, language: lang }),
        });
        const data = (await res.json()) as ExplanationResponse & { error?: string };
        if (!res.ok) {
          throw new Error(String(res.status));
        }
        setExplanation(lang, data);
        if (data.error) setError(t("exp.note.fallback"));
      } catch {
        setError(t("exp.error.request"));
      } finally {
        setLoading(false);
      }
    },
    [soil, evaluations, setExplanation, t]
  );

  useEffect(() => {
    if (!hydrated || !soil || current || loading) return;
    void generate(language);
  }, [hydrated, soil, current, loading, language, generate]);

  const measurementCount = useMemo(() => {
    if (!soil) return 0;
    return Object.values(soil).filter((v) => v !== null && typeof v === "object" && "value" in (v as object)).length;
  }, [soil]);

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
        <PageHeader eyebrow={t("exp.eyebrow")} title={t("exp.title")} description={t("exp.description")} />
        <NoSoilNotice purpose={t("exp.purpose")} />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow={t("exp.eyebrow")}
        title={t("exp.title")}
        description={t("exp.description")}
        actions={
          <>
            <Link href="/report" className="btn-secondary">
              <FileText className="h-4 w-4" aria-hidden /> {t("nav.report")}
            </Link>
            <Link href="/compare" className="btn-primary">
              {t("nav.compare")} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-brand-200 bg-white p-1">
          {languages.map((l) => (
            <button
              key={l.value}
              type="button"
              aria-pressed={language === l.value}
              onClick={() => {
                setLanguageChosen(true);
                setLanguage(l.value);
              }}
              className={`rounded-lg px-3.5 py-2 text-[0.82rem] font-medium transition ${
                language === l.value ? "bg-brand-800 text-white" : "text-brand-700 hover:bg-brand-50"
              }`}
            >
              {l.native}
              <span className={`ml-1.5 text-[0.68rem] ${language === l.value ? "text-brand-100/70" : "text-brand-400"}`}>
                {l.value.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
        <button type="button" className="btn-secondary" onClick={() => void generate(language)} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <RefreshCw className="h-4 w-4" aria-hidden />}
          {current ? t("exp.regenerate") : t("exp.generate")}
        </button>
      </div>

      {loading ? (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-brand-200 bg-white px-4 py-3 text-[0.82rem] text-brand-700">
          <Loader2 className="h-4 w-4 animate-spin text-brand-600" aria-hidden />
          {t("exp.generating")}
        </div>
      ) : null}

      {error ? (
        <div className="mt-5">
          <Callout tone="warning" title={t("exp.status.title")}>
            {error}
          </Callout>
        </div>
      ) : null}

      {!current && !loading ? (
        <div className="mt-5">
          <Callout tone="info" title={t("exp.none.title")}>
            {t("exp.none.body")}
          </Callout>
        </div>
      ) : null}

      {current ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <article className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-brand-950">
                <Languages className="h-4 w-4 text-brand-600" aria-hidden /> {t("exp.heading")}
              </h2>
              <span
                className={`badge ${
                  current.usedAi
                    ? "bg-purple-50 text-purple-800 border border-purple-200"
                    : "bg-brand-50 text-brand-800 border border-brand-200"
                }`}
              >
                {current.usedAi ? (
                  <>
                    <Sparkles className="mr-1 h-3 w-3" aria-hidden /> {t("exp.gemini")}
                  </>
                ) : (
                  <>
                    <Bot className="mr-1 h-3 w-3" aria-hidden /> {t("exp.fallback")}
                  </>
                )}
              </span>
            </div>

            <p className="mt-3 text-[0.92rem] leading-relaxed text-brand-800">{current.summary}</p>

            <h3 className="mt-5 text-[0.7rem] font-semibold uppercase tracking-wide text-brand-500">
              {t("exp.keyFindings")}
            </h3>
            <ul className="mt-2 space-y-2 text-[0.83rem] leading-relaxed text-brand-700">
              {current.keyFindings.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <h3 className="text-[0.7rem] font-semibold uppercase tracking-wide text-brand-500">
                  {t("exp.questions")}
                </h3>
                <ul className="mt-2 space-y-1.5 text-[0.8rem] leading-relaxed text-brand-700">
                  {current.questionsForExpert.map((q, i) => (
                    <li key={i} className="rounded-lg bg-brand-50/70 px-2.5 py-2">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[0.7rem] font-semibold uppercase tracking-wide text-brand-500">{t("exp.tests")}</h3>
                <ul className="mt-2 space-y-1.5 text-[0.8rem] leading-relaxed text-brand-700">
                  {current.additionalTests.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-5 flex items-start gap-2 rounded-xl border border-brand-200 bg-brand-50/60 px-3 py-2.5 text-[0.76rem] leading-relaxed text-brand-700">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
              {current.disclaimer}
            </p>
          </article>

          <aside className="space-y-4">
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-brand-950">{t("exp.received.title")}</h2>
              <ul className="mt-2 space-y-1.5 text-[0.78rem] leading-relaxed text-brand-700">
                <li>{t("exp.received.1", { count: evaluations.length })}</li>
                <li>{t("exp.received.2", { count: measurementCount })}</li>
                <li>{t("exp.received.3")}</li>
                <li>{t("exp.received.4")}</li>
              </ul>
              <p className="mt-3 text-[0.72rem] leading-relaxed text-brand-500">{t("exp.received.note")}</p>
            </div>

            <div className="rounded-xl border border-brand-200 bg-brand-900 p-5 text-white">
              <p className="text-sm font-semibold">{t("exp.field.title")}</p>
              <p className="mt-1.5 text-[0.78rem] leading-relaxed text-brand-100/85">{t("exp.field.body")}</p>
              <Link
                href="/report"
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-accent-400 px-3 py-2 text-[0.78rem] font-semibold text-brand-950 hover:bg-accent-500"
              >
                {t("exp.openReport")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
