import { z } from "zod";
import { Confidence, MeasurementInput, ParameterKey, SoilMeasurement, SoilReport } from "./types";

export const parameterMeta: Record<ParameterKey, { label: string; unit: string; min: number; max: number }> = {
  pH: { label: "Soil pH", unit: "pH", min: 3, max: 11 },
  nitrogen: { label: "Nitrogen (N)", unit: "mg/kg", min: 0, max: 2000 },
  phosphorus: { label: "Phosphorus (P)", unit: "mg/kg", min: 0, max: 500 },
  potassium: { label: "Potassium (K)", unit: "mg/kg", min: 0, max: 2000 },
  organicCarbon: { label: "Organic Carbon", unit: "%", min: 0, max: 10 },
  electricalConductivity: { label: "Electrical Conductivity", unit: "dS/m", min: 0, max: 20 },
};

export const measurementSchema = z.object({
  value: z.number().nullable(),
  unit: z.string().nullable(),
  originalValue: z.union([z.number(), z.string(), z.null()]).optional(),
  originalUnit: z.string().nullable().optional(),
  confidence: z.enum(["high", "medium", "low"]).optional(),
  source: z.enum(["extracted", "manual", "sample", "simulated"]),
  notes: z.string().optional(),
  noteCode: z.enum(["note.converted", "note.outOfRange", "note.hypothetical"]).optional(),
  noteParams: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
});

export const soilReportSchema = z.object({
  pH: measurementSchema,
  nitrogen: measurementSchema,
  phosphorus: measurementSchema,
  potassium: measurementSchema,
  organicCarbon: measurementSchema,
  electricalConductivity: measurementSchema,
  texture: z.string().nullable().optional(),
  moisture: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  sampleId: z.string().nullable().optional(),
  rawText: z.string().nullable().optional(),
  warnings: z.array(z.string()),
  warningCodes: z
    .array(
      z.object({
        code: z.string(),
        params: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
      })
    )
    .optional(),
  overallConfidence: z.enum(["high", "medium", "low"]),
});

export function emptyMeasurement(source: SoilMeasurement["source"] = "manual"): SoilMeasurement {
  return { value: null, unit: null, originalValue: null, originalUnit: null, confidence: "low", source };
}

export function emptySoilReport(source: SoilMeasurement["source"] = "manual"): SoilReport {
  return {
    pH: emptyMeasurement(source),
    nitrogen: { ...emptyMeasurement(source), unit: "mg/kg" },
    phosphorus: { ...emptyMeasurement(source), unit: "mg/kg" },
    potassium: { ...emptyMeasurement(source), unit: "mg/kg" },
    organicCarbon: { ...emptyMeasurement(source), unit: "%" },
    electricalConductivity: { ...emptyMeasurement(source), unit: "dS/m" },
    texture: null,
    moisture: null,
    location: null,
    sampleId: null,
    rawText: null,
    warnings: [],
    overallConfidence: "low",
  };
}

function toNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
    if (!cleaned) return null;
    const n = Number(cleaned[0]);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function normUnit(unit: string | null | undefined): string | null {
  if (!unit) return null;
  const u = unit.toLowerCase().replace(/\s+/g, "");
  if (u === "ph") return "pH";
  if (["mg/kg", "mgkg", "ppm"].includes(u)) return "mg/kg";
  if (["kg/ha", "kgha"].includes(u)) return "kg/ha";
  if (["%", "percent"].includes(u)) return "%";
  if (["ds/m", "dsm-1", "dsm"].includes(u)) return "dS/m";
  return unit.trim();
}

export function normalizeMeasurement(
  key: ParameterKey,
  input: MeasurementInput | null | undefined,
  source: SoilMeasurement["source"]
): SoilMeasurement {
  const meta = parameterMeta[key];
  const originalValue = input?.originalValue ?? input?.value ?? null;
  const originalUnit = input?.originalUnit ?? input?.unit ?? meta.unit;
  let value = toNumber(input?.value);
  let unit = normUnit(input?.unit) ?? meta.unit;
  const notes: string[] = [];
  let noteCode: SoilMeasurement["noteCode"];
  let noteParams: Record<string, string | number> | undefined;
  let confidence: Confidence = input?.confidence ?? "medium";

  // Convert kg/ha to mg/kg approximately for NPK when possible (common heuristic: mg/kg ≈ kg/ha / 2.24)
  if (value !== null && unit === "kg/ha" && ["nitrogen", "phosphorus", "potassium"].includes(key)) {
    value = Number((value / 2.24).toFixed(2));
    unit = "mg/kg";
    notes.push("Converted from kg/ha to mg/kg using approximate factor (÷2.24); confirm lab units.");
    noteCode = "note.converted";
    confidence = confidence === "high" ? "medium" : confidence;
  }

  if (value !== null) {
    if (value < meta.min || value > meta.max) {
      notes.push(
        `Value ${value} ${unit} is outside expected validation range (${meta.min}-${meta.max} ${meta.unit}); please verify.`
      );
      noteCode = "note.outOfRange";
      noteParams = { value, unit, min: meta.min, max: meta.max, expectedUnit: meta.unit };
      confidence = "low";
    }
  } else {
    confidence = "low";
  }

  return {
    value,
    unit: value === null ? meta.unit : unit,
    originalValue,
    originalUnit: normUnit(originalUnit as string | null),
    confidence,
    source,
    notes: notes.length ? notes.join(" ") : input?.notes,
    noteCode,
    noteParams,
  };
}

export function normalizeSoilReport(
  partial: Partial<Record<ParameterKey, MeasurementInput>> &
    Partial<
      Pick<SoilReport, "texture" | "moisture" | "location" | "sampleId" | "rawText" | "warnings">
    > & { warningCodes?: SoilReport["warningCodes"] },
  source: SoilMeasurement["source"]
): SoilReport {
  const warnings: string[] = [...(partial.warnings ?? [])];
  const report: SoilReport = {
    pH: normalizeMeasurement("pH", partial.pH, source),
    nitrogen: normalizeMeasurement("nitrogen", partial.nitrogen, source),
    phosphorus: normalizeMeasurement("phosphorus", partial.phosphorus, source),
    potassium: normalizeMeasurement("potassium", partial.potassium, source),
    organicCarbon: normalizeMeasurement("organicCarbon", partial.organicCarbon, source),
    electricalConductivity: normalizeMeasurement("electricalConductivity", partial.electricalConductivity, source),
    texture: partial.texture ?? null,
    moisture: partial.moisture ?? null,
    location: partial.location ?? null,
    sampleId: partial.sampleId ?? null,
    rawText: partial.rawText ?? null,
    warnings,
    overallConfidence: "low",
  };

  const warningCodes: { code: string; params?: Record<string, string | number> }[] = [
    ...(partial.warningCodes ?? []),
  ];
  const keys: ParameterKey[] = ["pH", "nitrogen", "phosphorus", "potassium", "organicCarbon", "electricalConductivity"];
  for (const k of keys) {
    const m = report[k];
    if (m.value === null) {
      warnings.push(`${parameterMeta[k].label} is missing.`);
      warningCodes.push({ code: "warn.missing", params: { param: k } });
    }
    if (m.notes && m.notes.includes("outside expected validation range")) {
      warnings.push(`${parameterMeta[k].label}: ${m.notes}`);
      warningCodes.push({ code: "warn.outOfRange", params: { param: k, ...(m.noteParams ?? {}) } });
    }
  }

  const present = keys.filter((k) => report[k].value !== null).length;
  const low = keys.filter((k) => report[k].confidence === "low").length;
  report.overallConfidence = present >= 5 && low === 0 ? "high" : present >= 3 && low <= 2 ? "medium" : "low";
  report.warnings = Array.from(new Set(warnings));
  report.warningCodes = warningCodes.filter(
    (w, i, all) => all.findIndex((x) => x.code === w.code && x.params?.param === w.params?.param) === i
  );
  return soilReportSchema.parse(report);
}

export function soilToEditableStrings(soil: SoilReport): Record<ParameterKey, string> {
  const keys: ParameterKey[] = ["pH", "nitrogen", "phosphorus", "potassium", "organicCarbon", "electricalConductivity"];
  const out = {} as Record<ParameterKey, string>;
  for (const k of keys) {
    out[k] = soil[k].value === null || soil[k].value === undefined ? "" : String(soil[k].value);
  }
  return out;
}
