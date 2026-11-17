import { describe, expect, it } from "vitest";
import { normalizeMeasurement, normalizeSoilReport, soilToEditableStrings } from "@/lib/soil";
import { sampleSoilReport } from "@/data/sampleReport";

describe("measurement normalization", () => {
  it("keeps a reported pH value and unit", () => {
    const m = normalizeMeasurement("pH", { value: 6.4, unit: "pH", confidence: "high" }, "manual");
    expect(m.value).toBe(6.4);
    expect(m.unit).toBe("pH");
    expect(m.confidence).toBe("high");
  });

  it("accepts numeric strings with thousands separators", () => {
    const m = normalizeMeasurement("potassium", { value: "1,250", unit: "mg/kg" }, "extracted");
    expect(m.value).toBe(1250);
  });

  it("normalizes ppm to mg/kg without changing the number", () => {
    const m = normalizeMeasurement("phosphorus", { value: 18, unit: "ppm" }, "manual");
    expect(m.unit).toBe("mg/kg");
    expect(m.value).toBe(18);
  });

  it("converts kg/ha to mg/kg for NPK and lowers confidence", () => {
    const m = normalizeMeasurement("nitrogen", { value: 224, unit: "kg/ha", confidence: "high" }, "extracted");
    expect(m.unit).toBe("mg/kg");
    expect(m.value).toBe(100);
    expect(m.confidence).toBe("medium");
    expect(m.notes).toContain("kg/ha");
  });

  it("does not convert kg/ha for organic carbon", () => {
    const m = normalizeMeasurement("organicCarbon", { value: 300, unit: "kg/ha" }, "manual");
    expect(m.unit).toBe("kg/ha");
    expect(m.value).toBe(300);
    expect(m.confidence).toBe("low");
  });

  it("flags out-of-range values as low confidence instead of silently clamping them", () => {
    const m = normalizeMeasurement("pH", { value: 15, unit: "pH", confidence: "high" }, "manual");
    expect(m.value).toBe(15);
    expect(m.confidence).toBe("low");
    expect(m.notes).toContain("outside expected validation range");
  });

  it("keeps missing values missing and marks them low confidence", () => {
    const m = normalizeMeasurement("phosphorus", { value: null, unit: null }, "extracted");
    expect(m.value).toBeNull();
    expect(m.confidence).toBe("low");
  });
});

describe("report normalization", () => {
  it("produces one warning per missing parameter", () => {
    const report = normalizeSoilReport({ pH: { value: 6.5, unit: "pH" } }, "manual");
    expect(report.nitrogen.value).toBeNull();
    expect(report.warnings.some((w) => w.includes("Nitrogen"))).toBe(true);
    expect(report.warnings.some((w) => w.includes("Potassium"))).toBe(true);
    expect(report.overallConfidence).not.toBe("high");
  });

  it("deduplicates warnings and keeps the synthetic sample flags", () => {
    const report = normalizeSoilReport(
      { pH: { value: 6.4, unit: "pH" }, warnings: ["Synthetic demonstration data — not a real laboratory report."] },
      "sample"
    );
    const unique = new Set(report.warnings);
    expect(unique.size).toBe(report.warnings.length);
    expect(report.warnings).toContain("Synthetic demonstration data — not a real laboratory report.");
  });

  it("reports high confidence only when data is complete and unflagged", () => {
    const report = normalizeSoilReport(
      {
        pH: { value: 6.4, unit: "pH" },
        nitrogen: { value: 180, unit: "mg/kg" },
        phosphorus: { value: 11, unit: "mg/kg" },
        potassium: { value: 140, unit: "mg/kg" },
        organicCarbon: { value: 0.62, unit: "%" },
        electricalConductivity: { value: 1.2, unit: "dS/m" },
      },
      "manual"
    );
    expect(report.overallConfidence).toBe("high");
  });

  it("round-trips the sample report into editable strings", () => {
    const strings = soilToEditableStrings(sampleSoilReport);
    expect(strings.pH).toBe("6.4");
    expect(strings.nitrogen).toBe("180");
    expect(strings.organicCarbon).toBe("0.62");
  });

  it("labels every sample value as sample-sourced", () => {
    expect(sampleSoilReport.pH.source).toBe("sample");
    expect(sampleSoilReport.warnings.join(" ")).toMatch(/synthetic/i);
  });
});
