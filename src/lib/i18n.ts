import { analysisMessages } from "@/messages/analysis";
import { commonMessages } from "@/messages/common";
import { compareMessages } from "@/messages/compare";
import { cropMessages } from "@/messages/crops";
import { domainMessages } from "@/messages/domain";
import { homeMessages } from "@/messages/home";
import { reportMessages } from "@/messages/report";
import { simulatorMessages } from "@/messages/simulator";
import { sourcesMessages } from "@/messages/sources";
import { uiMessages } from "@/messages/ui";
import type { MessageEntry, MessageTable } from "@/messages/types";
import { getCropById } from "@/data/crops";
import type { CropEvaluation, ParameterAssessment, ParameterKey } from "./types";

export type Lang = "en" | "kn" | "hi";

export const LANGS: { id: Lang; label: string; english: string }[] = [
  { id: "en", label: "English", english: "English" },
  { id: "kn", label: "ಕನ್ನಡ", english: "Kannada" },
  { id: "hi", label: "हिन्दी", english: "Hindi" },
];

export const messages: MessageTable = {
  ...commonMessages,
  ...domainMessages,
  ...homeMessages,
  ...cropMessages,
  ...analysisMessages,
  ...compareMessages,
  ...simulatorMessages,
  ...reportMessages,
  ...sourcesMessages,
  ...uiMessages,
};

export function isMessageKey(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(messages, key);
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match
  );
}

/** Translate a key. Returns the key itself if it is missing, which the tests treat as a defect. */
export function t(lang: Lang, key: string, params?: Record<string, string | number>): string {
  const entry: MessageEntry | undefined = messages[key];
  if (!entry) return key;
  return interpolate(entry[lang] ?? entry.en, params);
}

export function paramLabel(lang: Lang, key: ParameterKey): string {
  return t(lang, `param.${key}`);
}

export function statusLabel(lang: Lang, status: string): string {
  return isMessageKey(`status.${status}`) ? t(lang, `status.${status}`) : status;
}

export function suitabilityLabel(lang: Lang, value: CropEvaluation["suitability"]): string {
  return t(lang, `suitability.${value}`);
}

export function confidenceLabel(lang: Lang, confidence?: string): string {
  const key = `confidence.${confidence ?? "low"}`;
  return isMessageKey(key) ? t(lang, key) : t(lang, "confidence.low");
}

export function sourceLabel(lang: Lang, source: string): string {
  const key = `source.${source}`;
  return isMessageKey(key) ? t(lang, key) : source;
}

export function waterNeedLabel(lang: Lang, need: "low" | "moderate" | "high"): string {
  return t(lang, `water.${need}`);
}

export function verificationLabel(lang: Lang, status: "verified" | "derived" | "unverified"): string {
  return t(lang, `verification.${status}`);
}

export function cropName(lang: Lang, cropId: string): string {
  const key = `crop.${cropId}.name`;
  if (isMessageKey(key)) return t(lang, key);
  return getCropById(cropId)?.name ?? cropId;
}

export function cropWaterNote(lang: Lang, cropId: string): string {
  const key = `crop.${cropId}.waterNote`;
  if (isMessageKey(key)) return t(lang, key);
  return getCropById(cropId)?.waterNote ?? "";
}

/** Model limitations are stored per crop; translated copies live under
 * `crop.<id>.limitation.<index>` so no English sentence leaks into KN/HI screens. */
export function cropLimitations(lang: Lang, cropId: string): string[] {
  const crop = getCropById(cropId);
  if (!crop) return [];
  return crop.limitations.map((english, index) => {
    const key = `crop.${cropId}.limitation.${index}`;
    return isMessageKey(key) ? t(lang, key) : english;
  });
}

/** A range expressed in the reader's language; numbers and units are never translated. */
export function rangeLine(
  lang: Lang,
  range: { min?: number; max?: number; optimalMin?: number; optimalMax?: number; unit: string }
): string {
  const parts: string[] = [];
  if (range.optimalMin !== undefined && range.optimalMax !== undefined) {
    parts.push(t(lang, "range.optimal", { min: range.optimalMin, max: range.optimalMax, unit: range.unit }));
  }
  if (range.min !== undefined && range.max !== undefined) {
    parts.push(t(lang, "range.tolerates", { min: range.min, max: range.max, unit: range.unit }));
  } else if (range.min !== undefined) {
    parts.push(t(lang, "range.atLeast", { min: range.min, unit: range.unit }));
  } else if (range.max !== undefined) {
    parts.push(t(lang, "range.atMost", { max: range.max, unit: range.unit }));
  }
  return parts.join(" · ") || t(lang, "range.none");
}

/** Localised sentence for a single parameter comparison. */
export function assessmentText(lang: Lang, assessment: ParameterAssessment): string {
  const params = { ...(assessment.params ?? {}), unit: assessment.unit ?? "" };
  return t(lang, assessment.code, params);
}

export function assessmentLine(lang: Lang, assessment: ParameterAssessment): string {
  return `${paramLabel(lang, assessment.key)}: ${assessmentText(lang, assessment)}`;
}

export interface LocalisedFindings {
  strengths: string[];
  limiting: string[];
  missing: string[];
}

/** Rebuilds the engine's findings in the selected language from the structured codes,
 * so no English constraint text can leak into a Kannada or Hindi screen. */
export function localisedFindings(lang: Lang, evaluation: CropEvaluation): LocalisedFindings {
  const strengths = evaluation.parameterAssessments
    .filter((a) => a.status === "optimal")
    .map((a) => assessmentLine(lang, a));
  const limiting = evaluation.parameterAssessments
    .filter((a) => a.status === "unsuitable" || a.status === "marginal")
    .map((a) => assessmentLine(lang, a));
  const missing = evaluation.parameterAssessments
    .filter((a) => a.status === "missing" || a.status === "unreliable")
    .map((a) => assessmentLine(lang, a));
  return { strengths, limiting, missing };
}

export function localisedWhy(lang: Lang, evaluation: CropEvaluation): string {
  const crop = getCropById(evaluation.cropId);
  const parts: string[] = [];
  if (evaluation.suitability === "insufficient-data") parts.push(t(lang, "why.insufficient"));
  if (evaluation.counts.unsuitable > 0)
    parts.push(t(lang, "why.unsuitable", { count: evaluation.counts.unsuitable }));
  if (evaluation.counts.marginal > 0) parts.push(t(lang, "why.marginal", { count: evaluation.counts.marginal }));
  if (evaluation.counts.optimal > 0) parts.push(t(lang, "why.optimal", { count: evaluation.counts.optimal }));
  if (crop) {
    parts.push(
      t(lang, "why.water", {
        need: waterNeedLabel(lang, crop.waterNeed),
        note: cropWaterNote(lang, crop.id),
      })
    );
  }
  parts.push(t(lang, "why.noYield"));
  return parts.join(" ");
}

export function localisedCropName(lang: Lang, evaluation: CropEvaluation): string {
  return cropName(lang, evaluation.cropId);
}

export interface WaterFitText {
  need: "low" | "moderate" | "high";
  available?: "low" | "moderate" | "high";
}

export function waterFitLine(
  lang: Lang,
  code: "adequate" | "marginal" | "insufficient" | "unknown",
  fit: WaterFitText
): string {
  if (code === "unknown" || !fit.available) return t(lang, "water.unknown");
  return t(lang, `water.${code}`, {
    need: waterNeedLabel(lang, fit.need),
    available: t(lang, `water.${fit.available}`),
  });
}
