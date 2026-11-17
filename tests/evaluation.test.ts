import { describe, expect, it } from "vitest";
import { evaluateAll, evaluateCrop } from "@/lib/evaluation";
import { emptySoilReport, normalizeSoilReport } from "@/lib/soil";
import { sampleSoilReport } from "@/data/sampleReport";
import { crops } from "@/data/crops";

const complete = normalizeSoilReport(
  {
    pH: { value: 6.4, unit: "pH", confidence: "high" },
    nitrogen: { value: 220, unit: "mg/kg", confidence: "high" },
    phosphorus: { value: 15, unit: "mg/kg", confidence: "high" },
    potassium: { value: 160, unit: "mg/kg", confidence: "high" },
    organicCarbon: { value: 0.8, unit: "%", confidence: "high" },
    electricalConductivity: { value: 1.1, unit: "dS/m", confidence: "high" },
  },
  "manual"
);

describe("crop suitability rules", () => {
  it("throws for an unknown crop instead of guessing", () => {
    expect(() => evaluateCrop(complete, "not-a-crop")).toThrow(/Unknown crop/);
  });

  it("returns one assessment per tracked parameter", () => {
    const ev = evaluateCrop(complete, "ragi");
    expect(ev.parameterAssessments).toHaveLength(6);
    expect(ev.cropName).toContain("Ragi");
  });

  it("rates a well-matched soil as well suited with strengths", () => {
    const ev = evaluateCrop(complete, "ragi");
    expect(ev.suitability).toBe("well-suited");
    expect(ev.strengths.length).toBeGreaterThan(0);
    expect(ev.completeness).toBe(100);
  });

  it("turns out-of-range measurements into limiting factors", () => {
    const acidic = normalizeSoilReport(
      { ...toRaw(complete), pH: { value: 3.6, unit: "pH", confidence: "high" }, electricalConductivity: { value: 6, unit: "dS/m", confidence: "high" } },
      "manual"
    );
    const ev = evaluateCrop(acidic, "ragi");
    expect(ev.limitingFactors.length).toBeGreaterThanOrEqual(2);
    expect(ev.suitability).toBe("limited");
    expect(ev.limitingFactors.some((f) => f.startsWith("Soil pH"))).toBe(true);
    expect(ev.limitingFactors.some((f) => f.includes("Electrical Conductivity"))).toBe(true);
    // Nutrients that are genuinely in range remain listed as strengths.
    expect(ev.strengths.some((s) => s.startsWith("Nitrogen"))).toBe(true);
  });

  it("explains every verdict in text instead of only a score", () => {
    const ev = evaluateCrop(complete, "rice");
    expect(ev.why).toMatch(/documented/);
    expect(ev.why).toContain("Water need");
    expect(ev.sourceIds.length).toBeGreaterThan(0);
  });

  it("evaluates only the requested crops", () => {
    const evs = evaluateAll(complete, ["ragi", "chickpea"]);
    expect(evs.map((e) => e.cropId)).toEqual(["ragi", "chickpea"]);
  });

  it("evaluates every dataset crop when no selection is given", () => {
    expect(evaluateAll(complete)).toHaveLength(crops.length);
  });
});

describe("missing data handling", () => {
  it("marks crops as insufficient-data when required values are absent", () => {
    const sparse = normalizeSoilReport({ pH: { value: 6.5, unit: "pH" } }, "manual");
    const ev = evaluateCrop(sparse, "ragi");
    expect(ev.suitability).toBe("insufficient-data");
    expect(ev.completeness).toBeLessThan(50);
    expect(ev.missingInfo.length).toBeGreaterThan(0);
  });

  it("never invents values for an empty report", () => {
    const empty = emptySoilReport("manual");
    const evs = evaluateAll(empty);
    expect(evs).toHaveLength(crops.length);
    for (const ev of evs) {
      expect(ev.suitability).toBe("insufficient-data");
      expect(ev.completeness).toBe(0);
    }
  });

  it("treats low-confidence values as unreliable rather than as facts", () => {
    const flagged = normalizeSoilReport(
      { ...toRaw(complete), phosphorus: { value: 15, unit: "mg/kg", confidence: "low" } },
      "extracted"
    );
    const ev = evaluateCrop(flagged, "ragi");
    const p = ev.parameterAssessments.find((a) => a.key === "phosphorus");
    expect(p?.status).toBe("unreliable");
    expect(ev.missingInfo.some((m) => m.toLowerCase().includes("phosphorus"))).toBe(true);
  });

  it("produces stable results for the synthetic sample", () => {
    const evs = evaluateAll(sampleSoilReport);
    expect(evs).toHaveLength(crops.length);
    expect(evs.every((e) => e.completeness === 100)).toBe(true);
    expect(evs.map((e) => e.suitability)).toContain("well-suited");
  });
});

function toRaw(report: ReturnType<typeof normalizeSoilReport>) {
  return {
    pH: { value: report.pH.value, unit: report.pH.unit, confidence: report.pH.confidence },
    nitrogen: { value: report.nitrogen.value, unit: report.nitrogen.unit, confidence: report.nitrogen.confidence },
    phosphorus: { value: report.phosphorus.value, unit: report.phosphorus.unit, confidence: report.phosphorus.confidence },
    potassium: { value: report.potassium.value, unit: report.potassium.unit, confidence: report.potassium.confidence },
    organicCarbon: { value: report.organicCarbon.value, unit: report.organicCarbon.unit, confidence: report.organicCarbon.confidence },
    electricalConductivity: {
      value: report.electricalConductivity.value,
      unit: report.electricalConductivity.unit,
      confidence: report.electricalConductivity.confidence,
    },
  };
}
