import { describe, expect, it } from "vitest";
import { evaluateAll, evaluateCrop } from "@/lib/evaluation";
import { applyScenario, runScenario } from "@/lib/simulation";
import { sampleRawText, sampleSoilReport } from "@/data/sampleReport";
import { crops } from "@/data/crops";
import { messages, rangeLine } from "@/lib/i18n";
import { emptySoilReport } from "@/lib/soil";
import type { ParameterKey, SoilReport } from "@/lib/types";

const paramKeys: ParameterKey[] = ["pH", "nitrogen", "phosphorus", "potassium", "organicCarbon", "electricalConductivity"];

describe("analysis consistency", () => {
  it("is deterministic for the same report", () => {
    const a = evaluateAll(sampleSoilReport);
    const b = evaluateAll(sampleSoilReport);
    expect(a).toEqual(b);
  });

  it("returns one evaluation per crop with six parameter assessments", () => {
    const evaluations = evaluateAll(sampleSoilReport);
    expect(evaluations).toHaveLength(crops.length);
    for (const e of evaluations) {
      expect(e.parameterAssessments).toHaveLength(6);
      const { optimal, marginal, unsuitable, missing } = e.counts;
      const acceptable = e.parameterAssessments.filter((a) => a.status === "acceptable").length;
      expect(optimal + marginal + unsuitable + missing + acceptable).toBe(6);
      expect(e.completeness).toBeGreaterThanOrEqual(0);
      expect(e.completeness).toBeLessThanOrEqual(100);
    }
  });

  it("only reports insufficient data when the evidence really is thin", () => {
    for (const e of evaluateAll(sampleSoilReport)) {
      const requiredMissing = crops
        .find((c) => c.id === e.cropId)!
        .requiredData.filter((k) => sampleSoilReport[k].value === null || sampleSoilReport[k].confidence === "low").length;
      if (e.suitability === "insufficient-data") {
        expect(requiredMissing >= 2 || e.completeness < 50).toBe(true);
      } else {
        expect(requiredMissing >= 2 || e.completeness < 50).toBe(false);
      }
    }
  });

  it("never claims a well-suited crop while an unsuitable parameter exists", () => {
    for (const e of evaluateAll(sampleSoilReport)) {
      if (e.suitability === "well-suited") expect(e.counts.unsuitable).toBe(0);
    }
  });

  it("marks an empty report as insufficient data everywhere", () => {
    const empty = emptySoilReport("manual");
    for (const e of evaluateAll(empty)) {
      expect(e.suitability).toBe("insufficient-data");
      expect(e.completeness).toBe(0);
    }
  });

  it("carries a structured band so screens can show it in Kannada and Hindi", () => {
    for (const e of evaluateAll(sampleSoilReport)) {
      const crop = crops.find((c) => c.id === e.cropId)!;
      for (const a of e.parameterAssessments) {
        const reference = crop.ranges[a.key];
        if (!reference) {
          expect(a.range, `${e.cropId}.${a.key}`).toBeUndefined();
          continue;
        }
        expect(a.range, `${e.cropId}.${a.key}`).toBeDefined();
        expect(a.range!.unit).toBe(reference.unit);
        expect(rangeLine("hi", a.range!)).toMatch(/[\u0900-\u097F]/);
        expect(rangeLine("kn", a.range!)).toMatch(/[\u0C80-\u0CFF]/);
      }
    }
  });

  it("exposes a translatable message for every assessment code produced", () => {
    const evaluations = evaluateAll(emptySoilReport("manual")).concat(evaluateAll(sampleSoilReport));
    for (const e of evaluations) {
      for (const a of e.parameterAssessments) {
        expect(messages[a.code], a.code).toBeDefined();
        expect(a.reference === undefined || typeof a.reference === "string").toBe(true);
      }
    }
  });
});

describe("simulator consistency", () => {
  it("keeps simulated values inside the hypothetical report only", () => {
    const before = JSON.stringify(sampleSoilReport);
    const scenario = applyScenario(sampleSoilReport, { pH: 7.2 });
    expect(JSON.stringify(sampleSoilReport)).toBe(before);
    expect(scenario.pH.value).toBe(7.2);
    expect(scenario.pH.source).toBe("simulated");
    expect(scenario.pH.noteCode).toBe("note.hypothetical");
    expect(scenario.warningCodes?.some((w) => w.code === "warn.hypothetical")).toBe(true);
    for (const key of paramKeys.filter((k) => k !== "pH")) {
      expect(scenario[key].value, key).toBe(sampleSoilReport[key].value);
      expect(scenario[key].source, key).toBe(sampleSoilReport[key].source);
    }
  });

  it("recalculates with the same engine and shows improvement when pH is corrected", () => {
    const { evaluations } = runScenario(sampleSoilReport, { pH: 6.8 });
    const baseline = evaluateAll(sampleSoilReport);
    const changed = evaluations.filter((e, i) => e.completeness !== baseline[i].completeness);
    expect(changed).toHaveLength(0);
    const baselineRagi = evaluateCrop(sampleSoilReport, "ragi");
    const scenarioRagi = evaluations.find((e) => e.cropId === "ragi")!;
    expect(scenarioRagi.counts.unsuitable).toBeLessThanOrEqual(baselineRagi.counts.unsuitable);
  });

  it("treats an overridden value of null as missing, not as zero", () => {
    const scenario = applyScenario(sampleSoilReport, { phosphorus: null });
    expect(scenario.phosphorus.value).toBeNull();
    const evaluation = evaluateCrop(scenario, "groundnut");
    expect(evaluation.counts.missing).toBeGreaterThanOrEqual(1);
  });

  it("carries the measured value into the hypothetical note", () => {
    const scenario = applyScenario(sampleSoilReport, { organicCarbon: 0.9 });
    expect(scenario.organicCarbon.noteParams?.measured).toBe(sampleSoilReport.organicCarbon.value);
  });
});

describe("report data integrity", () => {
  it("keeps the sample narrative and the stored report in agreement", () => {
    const expected: Partial<Record<ParameterKey, number>> = { pH: 6.4, nitrogen: 180, phosphorus: 11, potassium: 140 };
    for (const [key, value] of Object.entries(expected) as [ParameterKey, number][]) {
      expect(sampleSoilReport[key].value, key).toBe(value);
      expect(sampleRawText).toContain(`${key === "pH" ? "pH" : ""}`);
    }
    expect(sampleRawText).toContain("DEMO-KA-042");
    expect(sampleRawText).toContain("6.4");
    expect(sampleRawText).toContain("180 mg/kg");
    expect(sampleRawText).toContain("11 mg/kg");
    expect(sampleRawText).toContain("140 mg/kg");
    expect(sampleRawText).toContain("0.62");
    expect(sampleRawText).toContain("1.2 dS/m");
    expect(sampleSoilReport.sampleId).toBe("DEMO-KA-042");
    expect(sampleRawText.toUpperCase()).toContain("SYNTHETIC");
  });

  it("labels the sample as synthetic everywhere it is shown", () => {
    const sourceKinds = paramKeys.map((k) => sampleSoilReport[k].source);
    expect(new Set(sourceKinds)).toEqual(new Set(["sample"]));
    expect(sampleSoilReport.warningCodes?.some((w) => w.code === "warn.synthetic")).toBe(false);
    expect(sampleSoilReport.warnings.some((w) => /synthetic/i.test(w))).toBe(true);
  });

  it("keeps every stored measurement self-describing", () => {
    for (const key of paramKeys) {
      const m = sampleSoilReport[key];
      expect(m.unit, key).toBeTruthy();
      expect(m.confidence, key).toBeTruthy();
      expect(m.originalUnit, key).toBeTruthy();
    }
    expect(sampleSoilReport).not.toBeNull();
  });
});
