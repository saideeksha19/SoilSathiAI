import { describe, expect, it } from "vitest";
import { explanationSchema, extractedSoilSchema } from "@/lib/aiSchemas";

const explanation = {
  summary: "Soil pH is within the documented tolerance for ragi but organic carbon is low.",
  keyFindings: ["pH 6.2 is in tolerance.", "Organic carbon is below the documented optimal range."],
  questionsForExpert: ["Which ragi variety suits this district?"],
  additionalTests: ["A repeat organic carbon test would confirm the low reading."],
  disclaimer: "This explanation supports, and does not replace, local agricultural advice.",
};

describe("AI explanation validation", () => {
  it("accepts a well-formed explanation", () => {
    expect(explanationSchema.safeParse(explanation).success).toBe(true);
  });

  it("rejects a missing disclaimer", () => {
    const { disclaimer, ...withoutDisclaimer } = explanation;
    expect(disclaimer).toBeTruthy();
    expect(explanationSchema.safeParse(withoutDisclaimer).success).toBe(false);
  });

  it("rejects empty finding or question lists", () => {
    expect(explanationSchema.safeParse({ ...explanation, keyFindings: [] }).success).toBe(false);
    expect(explanationSchema.safeParse({ ...explanation, questionsForExpert: [] }).success).toBe(false);
  });

  it("rejects non-string content instead of coercing it", () => {
    expect(explanationSchema.safeParse({ ...explanation, summary: 42 }).success).toBe(false);
    expect(explanationSchema.safeParse({ ...explanation, keyFindings: [null] }).success).toBe(false);
  });

  it("rejects unbounded lists", () => {
    const many = Array.from({ length: 11 }, (_, i) => `finding ${i}`);
    expect(explanationSchema.safeParse({ ...explanation, keyFindings: many }).success).toBe(false);
  });

  it("rejects a payload that is not an object", () => {
    expect(explanationSchema.safeParse("plain text answer").success).toBe(false);
    expect(explanationSchema.safeParse(null).success).toBe(false);
  });
});

describe("extraction validation", () => {
  it("accepts partial extraction so absent values stay absent", () => {
    const parsed = extractedSoilSchema.parse({ pH: { value: 6.4, unit: "pH", confidence: "high" } });
    expect(parsed.pH?.value).toBe(6.4);
    expect(parsed.nitrogen).toBeUndefined();
  });

  it("accepts explicit nulls for unreadable fields", () => {
    expect(extractedSoilSchema.safeParse({ potassium: { value: null, confidence: "low" } }).success).toBe(true);
  });

  it("rejects non-numeric measurements", () => {
    expect(extractedSoilSchema.safeParse({ pH: { value: "6.4" } }).success).toBe(false);
    expect(extractedSoilSchema.safeParse({ nitrogen: { value: "high" } }).success).toBe(false);
  });

  it("rejects unknown confidence labels", () => {
    expect(extractedSoilSchema.safeParse({ pH: { value: 6.4, confidence: "certain" } }).success).toBe(false);
  });

  it("keeps optional metadata such as raw text and warnings", () => {
    const parsed = extractedSoilSchema.parse({
      pH: { value: 6.4 },
      sampleId: "SYN-001",
      rawText: "pH 6.4",
      warnings: ["Phosphorus value unclear in scan."],
    });
    expect(parsed.sampleId).toBe("SYN-001");
    expect(parsed.warnings).toHaveLength(1);
  });
});
