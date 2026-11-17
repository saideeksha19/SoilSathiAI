export type Confidence = "high" | "medium" | "low";

export interface SoilMeasurement {
  value: number | null;
  unit: string | null;
  originalValue?: number | string | null;
  originalUnit?: string | null;
  confidence?: Confidence;
  source: "extracted" | "manual" | "sample" | "simulated";
  notes?: string;
  /** Localisable reason for the note above (engine-generated notes only). */
  noteCode?: "note.converted" | "note.outOfRange" | "note.hypothetical";
  noteParams?: Record<string, string | number>;
}

/** Raw measurement input: report text and manual forms may supply numeric strings
 * such as "1,250", which normalization parses without silently coercing garbage. */
export type MeasurementInput = Partial<Omit<SoilMeasurement, "value">> & {
  value?: number | string | null;
};

export interface SoilReport {
  pH: SoilMeasurement;
  nitrogen: SoilMeasurement; // mg/kg
  phosphorus: SoilMeasurement; // mg/kg
  potassium: SoilMeasurement; // mg/kg
  organicCarbon: SoilMeasurement; // %
  electricalConductivity: SoilMeasurement; // dS/m
  texture?: string | null;
  moisture?: string | null;
  location?: string | null;
  sampleId?: string | null;
  rawText?: string | null;
  warnings: string[];
  /** Machine-readable counterparts of engine-generated warnings, localised by the UI. */
  warningCodes?: { code: string; params?: Record<string, string | number> }[];
  overallConfidence: Confidence;
}

export interface ReferenceSource {
  id: string;
  title: string;
  institution: string;
  year: string;
  url: string;
  /** Table, section or page where the statement appears. */
  location: string;
  scope: "national" | "state" | "international";
  /** What this app actually uses the source for. */
  supports: string;
  caveat: string;
  verification: VerificationStatus;
  verificationNote?: string;
}

export type ParameterKey = "pH" | "nitrogen" | "phosphorus" | "potassium" | "organicCarbon" | "electricalConductivity";

/** How much documentary support a value in the reference dataset actually has.
 * - verified: the figure was read on a citable page/table during research.
 * - derived: transformed from a verified classification (e.g. a salinity class band).
 * - unverified: project-defined indicative band with no verified crop-specific source.
 */
export type VerificationStatus = "verified" | "derived" | "unverified";

export interface RangeProvenance {
  status: VerificationStatus;
  /** Must resolve to an entry in the source catalogue (or "project-dataset"). */
  sourceId: string;
  /** Wording or transformation the value came from, kept short and literal. */
  basis?: string;
  /** Table / section / page where it appears. */
  location?: string;
  /** Why the figure must not be generalised beyond its context. */
  caveat?: string;
}

export interface ParameterRange {
  min?: number;
  max?: number;
  optimalMin?: number;
  optimalMax?: number;
  unit: string;
  note?: string;
  provenance: RangeProvenance;
}

export interface CropReference {
  id: string;
  name: string;
  scientificName: string;
  waterNeed: "low" | "moderate" | "high";
  waterNote: string;
  ranges: Partial<Record<ParameterKey, ParameterRange>>;
  requiredData: ParameterKey[];
  limitations: string[];
  sourceIds: string[];
  waterProvenance: RangeProvenance;
}

/** Structured reason codes, so every screen can render the same rule outcome in its
 * own language without parsing English strings. */
export type AssessmentCode =
  | "assess.noRange"
  | "assess.missing"
  | "assess.unreliable"
  | "assess.belowMin"
  | "assess.aboveMax"
  | "assess.optimal"
  | "assess.slightlyBelowOptimal"
  | "assess.belowOptimal"
  | "assess.slightlyAboveOptimal"
  | "assess.aboveOptimal"
  | "assess.withinTolerance";

export interface ParameterAssessment {
  key: ParameterKey;
  label: string;
  code: AssessmentCode;
  params?: Record<string, string | number>;
  status: "optimal" | "acceptable" | "marginal" | "unsuitable" | "missing" | "unreliable";
  /** Direction of the comparison, so the UI can localise without parsing English text. */
  direction?: "below" | "above" | "within" | null;
  message: string;
  measured?: number | null;
  unit?: string | null;
  reference?: string;
  range?: { min?: number; max?: number; optimalMin?: number; optimalMax?: number; unit: string } | null;
  verification?: VerificationStatus;
}

export interface CropEvaluation {
  cropId: string;
  cropName: string;
  suitability: "well-suited" | "moderately-suited" | "limited" | "insufficient-data";
  completeness: number; // 0-100
  strengths: string[];
  limitingFactors: string[];
  missingInfo: string[];
  parameterAssessments: ParameterAssessment[];
  sourceIds: string[];
  why: string;
  counts: { optimal: number; marginal: number; unsuitable: number; missing: number };
}

export interface AnalysisResult {
  soil: SoilReport;
  evaluations: CropEvaluation[];
}

export interface ExplanationRequest {
  soil: SoilReport;
  evaluations: CropEvaluation[];
  scenarioLabel?: string;
  language: "en" | "kn" | "hi";
}

export interface ExplanationResponse {
  language: "en" | "kn" | "hi";
  summary: string;
  keyFindings: string[];
  questionsForExpert: string[];
  additionalTests: string[];
  disclaimer: string;
  usedAi: boolean;
  error?: string;
}
