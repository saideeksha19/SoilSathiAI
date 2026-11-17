"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Info,
  Loader2,
  PencilLine,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { sampleSoilReport } from "@/data/sampleReport";
import { normalizeSoilReport, parameterMeta } from "@/lib/soil";
import { Confidence, ParameterKey, SoilMeasurement, SoilReport } from "@/lib/types";
import {
  ExtractionError,
  MAX_FILE_BYTES,
  extractPdfText,
  fileToBase64,
  requestExtraction,
} from "@/lib/extractClient";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout } from "@/components/ui/Callout";
import { ConfidencePill, SourcePill } from "@/components/ui/Pills";
import { isMessageKey, paramLabel } from "@/lib/i18n";
import { useT } from "@/lib/useT";

const paramKeys: ParameterKey[] = [
  "pH",
  "nitrogen",
  "phosphorus",
  "potassium",
  "organicCarbon",
  "electricalConductivity",
];

type Origin = "sample" | "extracted" | "manual";
type Mode = "sample" | "upload" | "manual";

interface Draft {
  values: Record<ParameterKey, string>;
  units: Record<ParameterKey, string>;
  confidence: Partial<Record<ParameterKey, Confidence>>;
  notes: Partial<Record<ParameterKey, string>>;
  texture: string;
  location: string;
  sampleId: string;
  rawText: string;
  /** Closed warning codes ("warn.aiExtracted", "extract.warn.*"); translated at render time. */
  warnings: string[];
  origin: Origin;
}

function emptyDraft(origin: Origin): Draft {
  const values = {} as Record<ParameterKey, string>;
  const units = {} as Record<ParameterKey, string>;
  for (const key of paramKeys) {
    values[key] = "";
    units[key] = parameterMeta[key].unit;
  }
  return {
    values,
    units,
    confidence: {},
    notes: {},
    texture: "",
    location: "",
    sampleId: "",
    rawText: "",
    warnings: [],
    origin,
  };
}

function draftFromSoil(soil: SoilReport, origin: Origin): Draft {
  const draft = emptyDraft(origin);
  for (const key of paramKeys) {
    const m = soil[key];
    draft.values[key] = m.value === null || m.value === undefined ? "" : String(m.value);
    draft.units[key] = m.unit ?? parameterMeta[key].unit;
    if (m.confidence) draft.confidence[key] = m.confidence;
    if (m.notes) draft.notes[key] = m.notes;
  }
  draft.texture = soil.texture ?? "";
  draft.location = soil.location ?? "";
  draft.sampleId = soil.sampleId ?? "";
  draft.rawText = soil.rawText ?? "";
  draft.warnings = (soil.warningCodes ?? [])
    .map((w) => w.code)
    .filter((code) => code === "warn.aiExtracted" || code.startsWith("extract.warn."));
  return draft;
}

function parseValue(raw: string): number | null {
  const cleaned = raw.replace(/,/g, "").trim();
  if (cleaned === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function buildSoil(draft: Draft): SoilReport {
  const partial: Partial<Record<ParameterKey, Partial<SoilMeasurement>>> = {};
  for (const key of paramKeys) {
    const raw = draft.values[key];
    partial[key] = {
      value: parseValue(raw),
      unit: draft.units[key] || parameterMeta[key].unit,
      confidence: draft.confidence[key] ?? (raw.trim() === "" ? "low" : "high"),
      originalValue: raw.trim() === "" ? null : raw.trim(),
      originalUnit: draft.units[key] || null,
      notes: draft.notes[key],
    };
  }
  return normalizeSoilReport(
    {
      ...partial,
      texture: draft.texture || null,
      location: draft.location || null,
      sampleId: draft.sampleId || null,
      rawText: draft.rawText || null,
      warnings: [],
      warningCodes: draft.warnings.map((code) => ({ code })),
    },
    draft.origin
  );
}

export function AnalyzerClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSoil, hydrated } = useWorkspace();
  const { lang, t } = useT();
  const [mode, setMode] = useState<Mode>("sample");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<{ code?: string; missingApiKey: boolean } | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [dragging, setDragging] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const initialized = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const loadSample = useCallback(() => {
    setError(null);
    setBusy(null);
    setMode("sample");
    setDraft(draftFromSoil(sampleSoilReport, "sample"));
  }, []);

  useEffect(() => {
    if (initialized.current || !hydrated) return;
    initialized.current = true;
    if (searchParams.get("sample") === "1") loadSample();
  }, [hydrated, searchParams, loadSample]);

  const startManual = useCallback(() => {
    setError(null);
    setBusy(null);
    setMode("manual");
    setDraft(emptyDraft("manual"));
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setBusy(null);
      setMode("upload");
      try {
        if (file.size > MAX_FILE_BYTES) {
          throw new ExtractionError(t("an.error.fileTooBig"), false, "an.error.fileTooBig");
        }
        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        const isImage = file.type.startsWith("image/");
        if (isPdf) {
          setBusy(t("an.busy.pdf"));
          const text = await extractPdfText(file);
          if (text.trim().length < 12) {
            throw new ExtractionError(t("an.error.noText"), false, "an.error.noText");
          }
          setBusy(t("an.busy.text"));
          const soil = await requestExtraction({ text });
          setDraft(draftFromSoil(soil, "extracted"));
        } else if (isImage) {
          setBusy(t("an.busy.image"));
          const data = await fileToBase64(file);
          const soil = await requestExtraction({ image: { data, mimeType: file.type || "image/jpeg" } });
          setDraft(draftFromSoil(soil, "extracted"));
        } else {
          throw new ExtractionError(t("an.error.unsupported"), false, "an.error.unsupported");
        }
      } catch (e) {
        const err = e as ExtractionError;
        setError({
          code: err instanceof ExtractionError ? err.code : "an.error.readFailed",
          missingApiKey: Boolean(err?.missingApiKey),
        });
      } finally {
        setBusy(null);
      }
    },
    [t]
  );

  const updateValue = (key: ParameterKey, value: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        values: { ...prev.values, [key]: value },
        confidence: {
          ...prev.confidence,
          [key]: value.trim() === "" ? "low" : prev.origin === "extracted" ? "medium" : "high",
        },
        notes:
          prev.origin === "extracted" && value.trim() !== ""
            ? { ...prev.notes, [key]: t("an.note.reviewed") }
            : prev.notes,
      };
    });
  };

  const updateUnit = (key: ParameterKey, unit: string) => {
    setDraft((prev) => (prev ? { ...prev, units: { ...prev.units, [key]: unit } } : prev));
  };

  const validation = useMemo(() => {
    if (!draft) return { provided: 0, invalid: [] as ParameterKey[], outOfRange: [] as ParameterKey[] };
    const invalid: ParameterKey[] = [];
    const outOfRange: ParameterKey[] = [];
    let provided = 0;
    for (const key of paramKeys) {
      const raw = draft.values[key];
      if (raw.trim() === "") continue;
      const n = parseValue(raw);
      if (n === null) {
        invalid.push(key);
        continue;
      }
      provided += 1;
      if (n < parameterMeta[key].min || n > parameterMeta[key].max) outOfRange.push(key);
    }
    return { provided, invalid, outOfRange };
  }, [draft]);

  const submit = () => {
    if (!draft) return;
    if (validation.provided === 0) {
      setError({ code: "an.error.noValues", missingApiKey: false });
      return;
    }
    if (validation.invalid.length > 0) {
      setError({ code: "an.error.notNumbers", missingApiKey: false });
      return;
    }
    setSoil(buildSoil(draft), draft.origin);
    router.push("/analysis");
  };

  const modeCard = (target: Mode, icon: React.ReactNode, title: string, body: string) => {
    const active = !draft && mode === target;
    return (
      <button
        type="button"
        onClick={() => {
          if (target === "sample") loadSample();
          else if (target === "manual") startManual();
          else {
            setDraft(null);
            setMode("upload");
            setError(null);
          }
        }}
        className={`card flex flex-col items-start p-4 text-left transition hover:border-brand-300 ${
          active ? "border-brand-400 ring-2 ring-brand-200" : ""
        }`}
        aria-pressed={active}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-800">{icon}</span>
        <span className="mt-3 text-sm font-semibold text-brand-950">{title}</span>
        <span className="mt-1 text-[0.78rem] leading-relaxed text-brand-600">{body}</span>
      </button>
    );
  };

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow={t("an.eyebrow")}
        title={t("an.title")}
        description={t("an.description")}
        actions={
          <>
            <Link href="/analysis" className="btn-secondary">
              {t("an.viewAnalysis")}
            </Link>
            <button type="button" onClick={loadSample} className="btn-primary">
              <Sparkles className="h-4 w-4" aria-hidden />
              {t("an.loadSample")}
            </button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {modeCard("upload", <Upload className="h-4 w-4" aria-hidden />, t("an.mode.upload.title"), t("an.mode.upload.body"))}
        {modeCard("manual", <PencilLine className="h-4 w-4" aria-hidden />, t("an.mode.manual.title"), t("an.mode.manual.body"))}
        {modeCard("sample", <ScanLine className="h-4 w-4" aria-hidden />, t("an.mode.sample.title"), t("an.mode.sample.body"))}
      </div>

      {error ? (
        <div className="mt-5">
          <Callout tone="warning" title={error.missingApiKey ? t("an.error.missingKey") : t("an.error.title")}>
            <p>{error.code && isMessageKey(error.code) ? t(error.code) : t("an.error.generic")}</p>
            {error.missingApiKey ? <p className="mt-2 text-xs">{t("an.error.missingKeyNote")}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2 no-print">
              <button type="button" className="btn-secondary" onClick={startManual}>
                <PencilLine className="h-4 w-4" aria-hidden /> {t("an.manualEntry")}
              </button>
              <button type="button" className="btn-secondary" onClick={loadSample}>
                <ScanLine className="h-4 w-4" aria-hidden /> {t("an.loadSample")}
              </button>
            </div>
          </Callout>
        </div>
      ) : null}

      {!draft && mode === "upload" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="card p-6">
            <h2 className="text-base font-semibold text-brand-950">{t("an.upload.title")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-brand-700">{t("an.upload.body")}</p>
            <div
              className={`mt-5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-9 text-center transition ${
                dragging ? "border-brand-400 bg-brand-50" : "border-brand-200 bg-soil-50"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) void handleFile(file);
              }}
            >
              <Upload className="h-7 w-7 text-brand-500" aria-hidden />
              <p className="mt-3 text-sm font-medium text-brand-900">{t("an.drop")}</p>
              <p className="mt-1 text-xs text-brand-600">{t("an.dropHint")}</p>
              <button
                type="button"
                className="btn-primary mt-4"
                disabled={Boolean(busy)}
                onClick={() => fileInput.current?.click()}
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Upload className="h-4 w-4" aria-hidden />}
                {busy ? t("an.working") : t("an.chooseFile")}
              </button>
              <input
                ref={fileInput}
                type="file"
                className="sr-only"
                accept="application/pdf,image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFile(file);
                  e.target.value = "";
                }}
              />
            </div>
            {busy ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-brand-700" role="status">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                {busy}
              </p>
            ) : null}

            <div className="mt-6 border-t border-brand-100 pt-5">
              <label htmlFor="pasted" className="label">
                {t("an.pasteLabel")}
              </label>
              <textarea
                id="pasted"
                className="input min-h-[110px] resize-y font-mono text-xs"
                placeholder={t("an.pastePlaceholder")}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
              />
              <button
                type="button"
                className="btn-secondary mt-3"
                disabled={Boolean(busy) || pastedText.trim().length < 12}
                onClick={async () => {
                  setError(null);
                  setBusy(t("an.busy.text"));
                  try {
                    const soil = await requestExtraction({ text: pastedText });
                    setDraft(draftFromSoil(soil, "extracted"));
                  } catch (e) {
                    const err = e as ExtractionError;
                    setError({
                      code: err instanceof ExtractionError ? err.code : "an.error.readFailed",
                      missingApiKey: Boolean(err?.missingApiKey),
                    });
                  } finally {
                    setBusy(null);
                  }
                }}
              >
                <FileText className="h-4 w-4" aria-hidden />
                {t("an.extractPaste")}
              </button>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-950">
                <ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden /> {t("an.privacy.title")}
              </h3>
              <ul className="mt-3 space-y-2 text-[0.8rem] leading-relaxed text-brand-700">
                <li>{t("an.privacy.1")}</li>
                <li>{t("an.privacy.2")}</li>
                <li>{t("an.privacy.3")}</li>
                <li>{t("an.privacy.4")}</li>
              </ul>
            </div>
            <Callout tone="info" title={t("an.noKey.title")}>
              {t("an.noKey.body")}
            </Callout>
          </aside>
        </div>
      ) : null}

      {draft ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <SourcePill source={draft.origin} />
                <span className="text-sm font-semibold text-brand-950">
                  {draft.origin === "sample"
                    ? t("an.review.sample")
                    : draft.origin === "extracted"
                      ? t("an.review.extracted")
                      : t("an.review.manual")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ConfidencePill
                  confidence={
                    validation.provided >= 5 && validation.outOfRange.length === 0
                      ? "high"
                      : validation.provided >= 3
                        ? "medium"
                        : "low"
                  }
                />
                <button
                  type="button"
                  onClick={() => {
                    setDraft(null);
                    setMode("upload");
                    setError(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 px-2.5 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden /> {t("an.startOver")}
                </button>
              </div>
            </div>

            {draft.origin === "sample" ? (
              <div className="border-b border-sky-100 bg-sky-50/60 px-5 py-3">
                <p className="text-xs leading-relaxed text-sky-900">{t("an.synthetic.note")}</p>
              </div>
            ) : null}

            <div className="grid gap-4 border-b border-brand-100 px-5 py-4 sm:grid-cols-3">
              <div>
                <label className="label" htmlFor="sampleId">
                  {t("an.sampleId")}
                </label>
                <input
                  id="sampleId"
                  className="input"
                  value={draft.sampleId}
                  placeholder={t("an.optional")}
                  onChange={(e) => setDraft({ ...draft, sampleId: e.target.value })}
                />
              </div>
              <div>
                <label className="label" htmlFor="location">
                  {t("label.location")}
                </label>
                <input
                  id="location"
                  className="input"
                  value={draft.location}
                  placeholder={t("an.locationHint")}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                />
              </div>
              <div>
                <label className="label" htmlFor="texture">
                  {t("an.texture")}
                </label>
                <input
                  id="texture"
                  className="input"
                  value={draft.texture}
                  placeholder={t("an.textureHint")}
                  onChange={(e) => setDraft({ ...draft, texture: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
              {paramKeys.map((key) => {
                const meta = parameterMeta[key];
                const label = paramLabel(lang, key);
                const raw = draft.values[key];
                const invalid = raw.trim() !== "" && parseValue(raw) === null;
                const numeric = parseValue(raw);
                const outOfRange = numeric !== null && (numeric < meta.min || numeric > meta.max);
                return (
                  <div key={key}>
                    <div className="mb-1 flex items-baseline justify-between gap-2">
                      <label className="label mb-0" htmlFor={`param-${key}`}>
                        {label}
                      </label>
                      <span className="text-[0.68rem] text-brand-500">
                        {t("an.expected", { min: meta.min, max: meta.max, unit: meta.unit })}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        id={`param-${key}`}
                        className={`input ${invalid ? "border-red-400 focus:border-red-500" : ""}`}
                        inputMode="decimal"
                        placeholder={t("label.notReported")}
                        value={raw}
                        onChange={(e) => updateValue(key, e.target.value)}
                      />
                      <input
                        aria-label={`${label} (${t("label.unit")})`}
                        className="input w-24 shrink-0 text-xs"
                        value={draft.units[key]}
                        onChange={(e) => updateUnit(key, e.target.value)}
                      />
                    </div>
                    {invalid ? (
                      <p className="mt-1 flex items-center gap-1 text-[0.72rem] text-red-600">
                        <AlertCircle className="h-3 w-3" aria-hidden /> {t("an.enterNumber")}
                      </p>
                    ) : outOfRange ? (
                      <p className="mt-1 text-[0.72rem] text-amber-700">{t("an.outsideRange")}</p>
                    ) : draft.notes[key] ? (
                      <p className="mt-1 text-[0.72rem] text-brand-500">{draft.notes[key]}</p>
                    ) : raw.trim() === "" ? (
                      <p className="mt-1 text-[0.72rem] text-brand-400">{t("an.missingWillReport")}</p>
                    ) : (
                      <p className="mt-1 text-[0.72rem] text-brand-400">{t("an.keptAsEntered")}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {draft.warnings.length > 0 ? (
              <div className="border-t border-amber-100 bg-amber-50/50 px-5 py-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden /> {t("an.notesReview")}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.78rem] leading-relaxed text-amber-900">
                  {draft.warnings.slice(0, 8).map((w) => (
                    <li key={w}>{isMessageKey(w) ? t(w) : t("extract.note.generic")}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {draft.rawText ? (
              <div className="border-t border-brand-100 px-5 py-4">
                <button
                  type="button"
                  className="text-xs font-medium text-brand-700 underline decoration-brand-300 underline-offset-2"
                  onClick={() => setShowRaw((v) => !v)}
                >
                  {showRaw ? t("an.hideRaw") : t("an.showRaw")}
                </button>
                {showRaw ? (
                  <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-soil-100 p-3 text-[0.7rem] leading-relaxed text-brand-800">
                    {draft.rawText}
                  </pre>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-100 bg-brand-50/40 px-5 py-4">
              <p className="text-xs text-brand-700">
                {t("an.provided", { count: validation.provided })}
                {validation.outOfRange.length > 0 ? ` · ${t("an.toVerify", { count: validation.outOfRange.length })}` : ""}
              </p>
              <button type="button" className="btn-primary" onClick={submit}>
                {t("an.run")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-950">
                <Info className="h-4 w-4 text-brand-600" aria-hidden /> {t("an.howto.title")}
              </h3>
              <ul className="mt-3 space-y-2.5 text-[0.8rem] leading-relaxed text-brand-700">
                <li>
                  <strong className="text-brand-900">{t("an.howto.1.strong")}</strong> {t("an.howto.1.body")}
                </li>
                <li>
                  <strong className="text-brand-900">{t("an.howto.2.strong")}</strong> {t("an.howto.2.body")}
                </li>
                <li>
                  <strong className="text-brand-900">{t("an.howto.3.strong")}</strong> {t("an.howto.3.body")}
                </li>
              </ul>
            </div>
            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-950">
                <ImageIcon className="h-4 w-4 text-brand-600" aria-hidden /> {t("an.photo.title")}
              </h3>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-brand-700">{t("an.photo.body")}</p>
            </div>
            <div className="rounded-xl border border-brand-200 bg-white p-4">
              <p className="text-xs leading-relaxed text-brand-600">{t("an.next.body")}</p>
            </div>
          </aside>
        </div>
      ) : null}

      {!draft && mode === "sample" ? (
        <div className="mt-6 card p-6">
          <h2 className="text-base font-semibold text-brand-950">{t("an.sampleIntro.title")}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-brand-700">{t("an.sampleIntro.body")}</p>
          <button type="button" className="btn-primary mt-4" onClick={loadSample}>
            <ScanLine className="h-4 w-4" aria-hidden />
            {t("an.sampleLoad")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
