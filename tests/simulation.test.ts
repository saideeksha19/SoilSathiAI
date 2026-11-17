import { describe, expect, it } from "vitest";
import { applyScenario, changedParameters, compareScenario, runScenario, waterFitForNeed } from "@/lib/simulation";
import { evaluateAll } from "@/lib/evaluation";
import { normalizeSoilReport } from "@/lib/soil";
import { sampleSoilReport } from "@/data/sampleReport";

const measured = normalizeSoilReport(
  {
    pH: { value: 5.1, unit: "pH", confidence: "high" },
    nitrogen: { value: 180, unit: "mg/kg", confidence: "high" },
    phosphorus: { value: 9, unit: "mg/kg", confidence: "high" },
    potassium: { value: 120, unit: "mg/kg", confidence: "high" },
    organicCarbon: { value: 0.42, unit: "%", confidence: "high" },
    electricalConductivity: { value: 0.7, unit: "dS/m", confidence: "high" },
  },
  "manual"
);

describe("what-if recalculation", () => {
  it("marks overridden values as simulated and keeps the measured value for reference", () => {
    const sim = applyScenario(measured, { pH: 6.6 });
    expect(sim.pH.value).toBe(6.6);
    expect(sim.pH.source).toBe("simulated");
    expect(sim.pH.originalValue).toBe(5.1);
    expect(sim.warnings[0]).toMatch(/Hypothetical simulation/);
  });

  it("carries unmodified measurements through unchanged", () => {
    const sim = applyScenario(measured, { pH: 6.6 });
    expect(sim.nitrogen.value).toBe(measured.nitrogen.value);
    expect(sim.nitrogen.source).toBe(measured.nitrogen.source);
    expect(sim.phosphorus.value).toBe(measured.phosphorus.value);
  });

  it("never mutates the original report", () => {
    const before = measured.pH.value;
    applyScenario(measured, { pH: 7.4 });
    expect(measured.pH.value).toBe(before);
    expect(measured.pH.source).not.toBe("simulated");
  });

  it("treats a null override as an explicit unknown rather than zero", () => {
    const sim = applyScenario(measured, { potassium: null });
    expect(sim.potassium.value).toBeNull();
    expect(sim.potassium.source).toBe("simulated");
  });

  it("lists only parameters that actually changed", () => {
    expect(changedParameters(measured, { pH: 6.6, nitrogen: 180 })).toEqual(["pH"]);
    expect(changedParameters(measured, {})).toEqual([]);
  });

  it("improves the suitability verdict when a constraint is corrected", () => {
    const before = runScenario(measured, {});
    const after = runScenario(measured, { pH: 6.6, organicCarbon: 0.85 });
    const beforeRagi = before.evaluations.find((e) => e.cropId === "ragi")!;
    const afterRagi = after.evaluations.find((e) => e.cropId === "ragi")!;
    expect(afterRagi.completeness).toBeGreaterThanOrEqual(beforeRagi.completeness);
    expect(afterRagi.limitingFactors.length).toBeLessThan(beforeRagi.limitingFactors.length);
  });

  it("uses the same engine for actual and hypothetical scenarios", () => {
    const actual = evaluateAll(measured, ["ragi", "maize"]);
    const hypothetical = runScenario(measured, { pH: 6.6, cropIds: ["ragi", "maize"] });
    expect(hypothetical.evaluations.map((e) => e.cropId)).toEqual(actual.map((e) => e.cropId));
    expect(hypothetical.evaluations[0].parameterAssessments).toHaveLength(6);
  });

  it("reports new and resolved limiting factors per crop", () => {
    const actual = evaluateAll(measured, ["ragi"]);
    // A single out-of-range value still leaves one marginal factor: verdict stays moderate.
    const one = compareScenario(actual, runScenario(measured, { pH: 8.2, cropIds: ["ragi"] }).evaluations)[0];
    expect(one.newLimiting.some((f) => f.startsWith("Soil pH"))).toBe(true);
    expect(one.changed).toBe(false);

    // Two hard constraints downgrade the verdict, and the resolved/new factors are reported.
    const two = compareScenario(
      actual,
      runScenario(measured, { pH: 8.2, electricalConductivity: 6, cropIds: ["ragi"] }).evaluations
    )[0];
    expect(two.changed).toBe(true);
    expect(two.hypothetical).toBe("limited");
    expect(two.newLimiting.length).toBeGreaterThanOrEqual(2);
  });

  it("keeps the synthetic sample consistent when no override is given", () => {
    const sim = applyScenario(sampleSoilReport, {});
    expect(sim.pH.value).toBe(sampleSoilReport.pH.value);
    const rows = compareScenario(evaluateAll(sampleSoilReport), runScenario(sampleSoilReport, {}).evaluations);
    expect(rows.every((r) => r.changed === false)).toBe(true);
    expect(rows.every((r) => r.newLimiting.length === 0)).toBe(true);
  });
});

describe("water availability comparison", () => {
  it("reports unknown instead of assuming adequate water", () => {
    expect(waterFitForNeed("rice", "high", undefined).fit).toBe("unknown");
  });

  it("compares documented need against declared availability", () => {
    expect(waterFitForNeed("rice", "high", "high").fit).toBe("adequate");
    expect(waterFitForNeed("rice", "high", "moderate").fit).toBe("marginal");
    expect(waterFitForNeed("rice", "high", "low").fit).toBe("insufficient");
  });

  it("explains the fit in words", () => {
    expect(waterFitForNeed("ragi", "low", "moderate").message).toMatch(/Documented|documented/);
  });
});
