import { z } from "zod";

export const extractedSoilSchema = z.object({
  pH: z.object({ value: z.number().nullable(), unit: z.string().nullable().optional(), confidence: z.enum(["high","medium","low"]).optional() }).optional(),
  nitrogen: z.object({ value: z.number().nullable(), unit: z.string().nullable().optional(), confidence: z.enum(["high","medium","low"]).optional() }).optional(),
  phosphorus: z.object({ value: z.number().nullable(), unit: z.string().nullable().optional(), confidence: z.enum(["high","medium","low"]).optional() }).optional(),
  potassium: z.object({ value: z.number().nullable(), unit: z.string().nullable().optional(), confidence: z.enum(["high","medium","low"]).optional() }).optional(),
  organicCarbon: z.object({ value: z.number().nullable(), unit: z.string().nullable().optional(), confidence: z.enum(["high","medium","low"]).optional() }).optional(),
  electricalConductivity: z.object({ value: z.number().nullable(), unit: z.string().nullable().optional(), confidence: z.enum(["high","medium","low"]).optional() }).optional(),
  texture: z.string().nullable().optional(),
  moisture: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  sampleId: z.string().nullable().optional(),
  rawText: z.string().nullable().optional(),
  warnings: z.array(z.string()).optional(),
  overallConfidence: z.enum(["high","medium","low"]).optional(),
});

/** Ambiguity codes the extraction prompt may return. Closed set so the UI can translate them. */
export const EXTRACTION_WARNING_CODES = [
  "unit-unclear",
  "low-confidence",
  "illegible",
  "multiple-values",
] as const;

export const explanationSchema = z.object({
  summary: z.string(),
  keyFindings: z.array(z.string()).min(1).max(10),
  questionsForExpert: z.array(z.string()).min(1).max(8),
  additionalTests: z.array(z.string()).min(1).max(8),
  disclaimer: z.string(),
});
