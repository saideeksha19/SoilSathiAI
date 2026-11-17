import { evaluateAll } from "./evaluation";
import { CropEvaluation, ParameterKey, SoilReport } from "./types";

export type WaterAvailability = "low" | "moderate" | "high";

export interface ScenarioOverrides {
  pH?: number | null;
  nitrogen?: number | null;
  phosphorus?: number | null;
  potassium?: number | null;
  organicCarbon?: number | null;
  electricalConductivity?: number | null;
  waterAvailability?: WaterAvailability;
  cropIds?: string[];
}

const paramKeys: ParameterKey[] = ["pH", "nitrogen", "phosphorus", "potassium", "organicCarbon", "electricalConductivity"];

/** Builds a hypothetical soil report. Values the user has not overridden are carried over
 * from the measured report unchanged and keep their measured source label. */
export function applyScenario(soil: SoilReport, overrides: ScenarioOverrides): SoilReport {
  const next: SoilReport = {
    ...soil,
    warnings: [...soil.warnings.filter((w) => !w.startsWith("Hypothetical"))],
  };
  for (const key of paramKeys) {
    const override = overrides[key];
    if (override === undefined) {
      next[key] = { ...soil[key] };
    } else if (override === null) {
      next[key] = { ...soil[key], value: null, confidence: "low", source: "simulated" };
    } else {
      next[key] = {
        ...soil[key],
        value: override,
        source: "simulated",
        confidence: "high",
        originalValue: soil[key].value,
        notes: `Hypothetical simulation value (measured value: ${soil[key].value ?? "not available"}).`,
        noteCode: "note.hypothetical",
        noteParams: { measured: soil[key].value ?? "-" },
      };
    }
  }
  next.warnings = [
    "Hypothetical simulation — modified values are not real soil measurements.",
    ...next.warnings,
  ];
  next.warningCodes = [
    { code: "warn.hypothetical" },
    ...(next.warningCodes ?? []).filter((w) => w.code !== "warn.hypothetical"),
  ];
  return next;
}

export function changedParameters(soil: SoilReport, overrides: ScenarioOverrides): ParameterKey[] {
  return paramKeys.filter((k) => {
    const o = overrides[k];
    if (o === undefined) return false;
    if (o === null) return soil[k].value !== null;
    return soil[k].value !== o;
  });
}

export interface ScenarioComparisonRow {
  cropId: string;
  cropName: string;
  actual: CropEvaluation["suitability"];
  hypothetical: CropEvaluation["suitability"];
  changed: boolean;
  actualLimiting: string[];
  hypotheticalLimiting: string[];
  newLimiting: string[];
  resolvedLimiting: string[];
  missingInfo: string[];
  completenessActual: number;
  completenessHypothetical: number;
}

const rank: Record<CropEvaluation["suitability"], number> = {
  "well-suited": 4,
  "moderately-suited": 3,
  limited: 2,
  "insufficient-data": 1,
};

export function compareScenario(
  actual: CropEvaluation[],
  hypothetical: CropEvaluation[]
): ScenarioComparisonRow[] {
  const byId = new Map(actual.map((e) => [e.cropId, e]));
  return hypothetical.map((h) => {
    const a = byId.get(h.cropId);
    const actualLimiting = a?.limitingFactors ?? [];
    const hypotheticalLimiting = h.limitingFactors;
    return {
      cropId: h.cropId,
      cropName: h.cropName,
      actual: a?.suitability ?? "insufficient-data",
      hypothetical: h.suitability,
      changed: rank[h.suitability] !== rank[a?.suitability ?? "insufficient-data"],
      actualLimiting,
      hypotheticalLimiting,
      newLimiting: hypotheticalLimiting.filter((l) => !actualLimiting.includes(l)),
      resolvedLimiting: actualLimiting.filter((l) => !hypotheticalLimiting.includes(l)),
      missingInfo: h.missingInfo,
      completenessActual: a?.completeness ?? 0,
      completenessHypothetical: h.completeness,
    };
  });
}

export function runScenario(soil: SoilReport, overrides: ScenarioOverrides): { soil: SoilReport; evaluations: CropEvaluation[] } {
  const scenarioSoil = applyScenario(soil, overrides);
  return { soil: scenarioSoil, evaluations: evaluateAll(scenarioSoil, overrides.cropIds) };
}

const waterOrder: Record<WaterAvailability, number> = { low: 1, moderate: 2, high: 3 };
const cropWaterNeed: Record<string, WaterAvailability> = {};

export interface WaterFit {
  cropId: string;
  fit: "adequate" | "marginal" | "insufficient" | "unknown";
  /** Structured reason, translated by the UI; `message` is the English source text. */
  code: "adequate" | "marginal" | "insufficient" | "unknown";
  message: string;
}

/** Qualitative comparison of user-declared water availability against the crop dataset's
 * documented water need. This is a stated-input comparison, not a soil calculation. */
export function waterFitForNeed(
  cropId: string,
  waterNeed: "low" | "moderate" | "high",
  availability: WaterAvailability | undefined
): WaterFit {
  cropWaterNeed[cropId] = waterNeed;
  if (!availability) {
    return {
      cropId,
      fit: "unknown",
      code: "unknown",
      message: "Water availability not provided. Soil results alone do not determine water suitability.",
    };
  }
  const gap = waterOrder[waterNeed] - waterOrder[availability];
  if (gap <= 0) {
    return {
      cropId,
      fit: "adequate",
      code: "adequate",
      message: `Declared water availability (${availability}) meets the documented ${waterNeed} water need.`,
    };
  }
  if (gap === 1) {
    return {
      cropId,
      fit: "marginal",
      code: "marginal",
      message: `Crop is documented as ${waterNeed} water need; declared availability is ${availability}. Irrigation or a lower-water option may be needed.`,
    };
  }
  return {
    cropId,
    fit: "insufficient",
    code: "insufficient",
    message: `Documented ${waterNeed} water need is well above declared ${availability} availability. This is a major practical constraint, not a soil constraint.`,
  };
}
