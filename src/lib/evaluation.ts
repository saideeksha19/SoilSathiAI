import { crops } from "@/data/crops";
import { parameterMeta } from "./soil";
import { AssessmentCode, CropEvaluation, ParameterAssessment, ParameterKey, ParameterRange, SoilReport } from "./types";

const paramKeys: ParameterKey[] = ["pH", "nitrogen", "phosphorus", "potassium", "organicCarbon", "electricalConductivity"];

function assessParameter(
  key: ParameterKey,
  value: number | null,
  confidence: string | undefined,
  range: ParameterRange | undefined
): ParameterAssessment {
  const result = assessWithRange(key, value, confidence, range);
  if (!range) return result;
  // The structured band travels with the assessment so screens can render it in KN/HI.
  return {
    ...result,
    range: {
      min: range.min,
      max: range.max,
      optimalMin: range.optimalMin,
      optimalMax: range.optimalMax,
      unit: range.unit,
    },
  };
}

function assessWithRange(
  key: ParameterKey,
  value: number | null,
  confidence: string | undefined,
  range: ParameterRange | undefined
): ParameterAssessment {
  const label = parameterMeta[key].label;
  if (!range) {
    return {
      key,
      label,
      code: "assess.noRange",
      status: value === null ? "missing" : "acceptable",
      message: "No specific reference range defined for this crop in the current dataset.",
      measured: value,
      unit: parameterMeta[key].unit,
    };
  }
  if (value === null) {
    return {
      key,
      label,
      code: "assess.missing",
      status: "missing",
      message: "Measurement missing; suitability cannot be fully assessed for this parameter.",
      measured: null,
      unit: range.unit,
      reference: refText(range),
      verification: range.provenance.status,
    };
  }
  if (confidence === "low") {
    return {
      key,
      label,
      code: "assess.unreliable",
      status: "unreliable",
      message: "Measurement present but flagged low-confidence/out-of-range; verify before decisions.",
      measured: value,
      unit: range.unit,
      reference: refText(range),
      verification: range.provenance.status,
    };
  }
  const { min, max, optimalMin, optimalMax } = range;
  const base = {
    key,
    label,
    measured: value,
    unit: range.unit,
    reference: refText(range),
    verification: range.provenance.status,
  };
  const code = (c: AssessmentCode, params?: Record<string, string | number>): ParameterAssessment => ({
    ...base,
    code: c,
    params,
    status: statusFor(c),
    message: englishFor(c, params),
  });
  if (min !== undefined && value < min) return code("assess.belowMin", { min, unit: range.unit });
  if (max !== undefined && value > max) return code("assess.aboveMax", { max, unit: range.unit });
  if (optimalMin !== undefined && optimalMax !== undefined && value >= optimalMin && value <= optimalMax) {
    return code("assess.optimal");
  }
  if (optimalMin !== undefined && value < optimalMin) {
    const gap = optimalMin - value;
    const marginal = gap <= optimalMin * 0.25;
    return marginal
      ? code("assess.slightlyBelowOptimal", { optimalMin, unit: range.unit })
      : code("assess.belowOptimal");
  }
  if (optimalMax !== undefined && value > optimalMax) {
    const gap = value - optimalMax;
    const marginal = gap <= Math.max(optimalMax * 0.25, 0.5);
    return marginal
      ? code("assess.slightlyAboveOptimal", { optimalMax, unit: range.unit })
      : code("assess.aboveOptimal");
  }
  return code("assess.withinTolerance");
}

/** Status implied by a reason code. Kept next to the codes so the rule table stays auditable. */
export const statusFor = (code: AssessmentCode): ParameterAssessment["status"] => {
  switch (code) {
    case "assess.noRange":
      return "acceptable";
    case "assess.missing":
      return "missing";
    case "assess.unreliable":
      return "unreliable";
    case "assess.belowMin":
    case "assess.aboveMax":
      return "unsuitable";
    case "assess.optimal":
      return "optimal";
    case "assess.slightlyBelowOptimal":
    case "assess.slightlyAboveOptimal":
      return "marginal";
    case "assess.belowOptimal":
    case "assess.aboveOptimal":
    case "assess.withinTolerance":
      return "acceptable";
  }
};

/** English rendering, used by the AI prompt and the test suite. Screens translate the code. */
export const englishFor = (code: AssessmentCode, params?: Record<string, string | number>): string => {
  const p = params ?? {};
  switch (code) {
    case "assess.noRange":
      return "No specific reference range defined for this crop in the current dataset.";
    case "assess.missing":
      return "Measurement missing; suitability cannot be fully assessed for this parameter.";
    case "assess.unreliable":
      return "Measurement present but flagged low-confidence/out-of-range; verify before decisions.";
    case "assess.belowMin":
      return `Below documented minimum (${p.min} ${p.unit}). May limit suitability.`;
    case "assess.aboveMax":
      return `Above documented maximum (${p.max} ${p.unit}). May limit suitability.`;
    case "assess.optimal":
      return "Within documented optimal range.";
    case "assess.slightlyBelowOptimal":
      return "Slightly below optimal range.";
    case "assess.belowOptimal":
      return "Below optimal range but within documented tolerance.";
    case "assess.slightlyAboveOptimal":
      return "Slightly above optimal range.";
    case "assess.aboveOptimal":
      return "Above optimal range but within documented tolerance.";
    case "assess.withinTolerance":
      return "Within documented tolerance.";
  }
};

function refText(range: ParameterRange) {
  const parts: string[] = [];
  if (range.optimalMin !== undefined && range.optimalMax !== undefined)
    parts.push(`optimal ${range.optimalMin}-${range.optimalMax} ${range.unit}`);
  if (range.min !== undefined || range.max !== undefined)
    parts.push(`tolerance ${range.min ?? "?"}-${range.max ?? "?"} ${range.unit}`);
  return parts.join("; ") || "documented range";
}

export function evaluateCrop(soil: SoilReport, cropId: string): CropEvaluation {
  const crop = crops.find((c) => c.id === cropId);
  if (!crop) throw new Error(`Unknown crop: ${cropId}`);
  const assessments = paramKeys.map((k) => assessParameter(k, soil[k].value, soil[k].confidence, crop.ranges[k]));
  const requiredMissing = crop.requiredData.filter((k) => soil[k].value === null || soil[k].confidence === "low");
  const strengths = assessments.filter((a) => a.status === "optimal").map((a) => `${a.label}: ${a.message}`);
  const limitingFactors = assessments
    .filter((a) => ["unsuitable", "marginal"].includes(a.status))
    .map((a) => `${a.label}: ${a.message}`);
  const missingInfo = assessments
    .filter((a) => ["missing", "unreliable"].includes(a.status))
    .map((a) => `${a.label}: ${a.message}`);

  const considered = assessments.filter((a) => a.status !== "missing" && a.status !== "unreliable");
  const completeness = Math.round((considered.length / paramKeys.length) * 100);

  let suitability: CropEvaluation["suitability"] = "moderately-suited";
  const unsuitableCount = assessments.filter((a) => a.status === "unsuitable").length;
  const marginalCount = assessments.filter((a) => a.status === "marginal").length;
  const optimalCount = assessments.filter((a) => a.status === "optimal").length;
  const missingCount = assessments.filter((a) => a.status === "missing" || a.status === "unreliable").length;

  if (requiredMissing.length >= 2 || completeness < 50) suitability = "insufficient-data";
  else if (unsuitableCount >= 2) suitability = "limited";
  else if (unsuitableCount === 1 || marginalCount >= 2) suitability = "moderately-suited";
  else if (optimalCount >= 3 && unsuitableCount === 0) suitability = "well-suited";
  else suitability = "moderately-suited";

  const whyParts: string[] = [];
  if (suitability === "insufficient-data")
    whyParts.push("Key required measurements are missing or unreliable, so a confident comparison is not possible.");
  if (unsuitableCount > 0)
    whyParts.push(`${unsuitableCount} parameter(s) fall outside the documented tolerance range for this crop.`);
  if (marginalCount > 0) whyParts.push(`${marginalCount} parameter(s) are near the edge of the optimal range.`);
  if (optimalCount > 0) whyParts.push(`${optimalCount} parameter(s) are within the documented optimal range.`);
  whyParts.push(`Water need: ${crop.waterNeed} (${crop.waterNote})`);
  whyParts.push(
    "Suitability is based only on available soil measurements and documented reference ranges, not on yield guarantees."
  );

  return {
    cropId: crop.id,
    cropName: crop.name,
    suitability,
    completeness,
    strengths,
    limitingFactors,
    missingInfo,
    parameterAssessments: assessments,
    sourceIds: crop.sourceIds,
    why: whyParts.join(" "),
    counts: { optimal: optimalCount, marginal: marginalCount, unsuitable: unsuitableCount, missing: missingCount },
  };
}

export function evaluateAll(soil: SoilReport, cropIds?: string[]): CropEvaluation[] {
  const ids = cropIds && cropIds.length ? cropIds : crops.map((c) => c.id);
  return ids.map((id) => evaluateCrop(soil, id));
}
