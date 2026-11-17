import { normalizeSoilReport } from "@/lib/soil";
import { SoilReport } from "@/lib/types";

export const sampleRawText = `SYNTHETIC SOIL TEST REPORT (DEMO ONLY)
Sample ID: DEMO-KA-042
Location: Illustrative field, Karnataka (synthetic)
Texture: Sandy loam (reported)
pH: 6.4
Nitrogen (N): 180 mg/kg
Phosphorus (P): 11 mg/kg
Potassium (K): 140 mg/kg
Organic Carbon: 0.62 %
Electrical Conductivity (EC): 1.2 dS/m
Disclaimer: This is a synthetic sample created for demonstration. Not from a real laboratory.`;

export const sampleSoilReport: SoilReport = normalizeSoilReport({
  pH: { value: 6.4, unit: "pH", originalValue: 6.4, originalUnit: "pH", confidence: "high", source: "sample" },
  nitrogen: { value: 180, unit: "mg/kg", originalValue: 180, originalUnit: "mg/kg", confidence: "high", source: "sample" },
  phosphorus: { value: 11, unit: "mg/kg", originalValue: 11, originalUnit: "mg/kg", confidence: "high", source: "sample" },
  potassium: { value: 140, unit: "mg/kg", originalValue: 140, originalUnit: "mg/kg", confidence: "high", source: "sample" },
  organicCarbon: { value: 0.62, unit: "%", originalValue: 0.62, originalUnit: "%", confidence: "high", source: "sample" },
  electricalConductivity: { value: 1.2, unit: "dS/m", originalValue: 1.2, originalUnit: "dS/m", confidence: "high", source: "sample" },
  texture: "Sandy loam (reported)",
  location: "Illustrative field, Karnataka (synthetic)",
  sampleId: "DEMO-KA-042",
  rawText: sampleRawText,
  warnings: ["Synthetic demonstration data — not a real laboratory report."],
}, "sample");
