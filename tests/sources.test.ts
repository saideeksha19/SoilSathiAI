import { describe, expect, it } from "vitest";
import { crops, sourceCatalog } from "@/data/crops";
import { getSource } from "@/data/sources";
import type { ParameterKey } from "@/lib/types";

const paramKeys: ParameterKey[] = ["pH", "nitrogen", "phosphorus", "potassium", "organicCarbon", "electricalConductivity"];
const statuses = ["verified", "derived", "unverified"];

function rangeOf(crop: (typeof crops)[number], key: ParameterKey) {
  const range = crop.ranges[key];
  if (!range) throw new Error(`Missing ${key} range for ${crop.id}`);
  return range;
}

describe("reference source catalogue", () => {
  it("has unique ids", () => {
    const ids = sourceCatalog.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("records title, institution, scope and verification for every entry", () => {
    for (const source of sourceCatalog) {
      expect(source.title.trim().length, source.id).toBeGreaterThan(8);
      expect(source.institution.trim().length, source.id).toBeGreaterThan(4);
      expect(statuses, source.id).toContain(source.verification);
      expect(["national", "state", "international"], source.id).toContain(source.scope);
      expect(source.caveat.trim().length, source.id).toBeGreaterThan(30);
    }
  });

  it("gives every verified source a real link, a location and a supported statement", () => {
    for (const source of sourceCatalog.filter((s) => s.verification === "verified")) {
      expect(source.url, source.id).toMatch(/^https?:\/\//);
      expect(source.location.trim().length, source.id).toBeGreaterThan(4);
      expect(source.supports.trim().length, source.id).toBeGreaterThan(30);
    }
  });

  it("marks the project's own dataset as unverified with an empty link", () => {
    const own = getSource("project-dataset");
    expect(own).toBeDefined();
    expect(own?.verification).toBe("unverified");
    expect(own?.url).toBe("");
  });
});

describe("crop range provenance", () => {
  it("gives every crop at least one resolvable source", () => {
    for (const crop of crops) {
      expect(crop.sourceIds.length, crop.id).toBeGreaterThan(0);
      for (const id of crop.sourceIds) expect(getSource(id), `${crop.id} -> ${id}`).toBeDefined();
    }
  });

  it("records provenance for every parameter range and the water note", () => {
    for (const crop of crops) {
      for (const key of paramKeys) {
        const range = rangeOf(crop, key);
        expect(range.provenance, `${crop.id}.${key}`).toBeDefined();
        expect(statuses, `${crop.id}.${key}`).toContain(range.provenance.status);
        expect(getSource(range.provenance.sourceId), `${crop.id}.${key}`).toBeDefined();
        expect((range.provenance.caveat ?? "").trim().length, `${crop.id}.${key}`).toBeGreaterThan(30);
      }
      expect(statuses).toContain(crop.waterProvenance.status);
    }
  });

  it("never labels a project-defined band as verified", () => {
    for (const crop of crops) {
      for (const key of paramKeys) {
        const p = rangeOf(crop, key).provenance;
        if (p.sourceId === "project-dataset") expect(p.status, `${crop.id}.${key}`).toBe("unverified");
        if (p.status === "verified") expect(p.basis?.trim().length ?? 0, `${crop.id}.${key}`).toBeGreaterThan(10);
      }
    }
  });

  it("keeps verified FAO salinity thresholds at the published values", () => {
    const expected: Record<string, number> = { groundnut: 3.2, rice: 3.0, maize: 1.7, sorghum: 6.8 };
    for (const crop of crops) {
      const range = rangeOf(crop, "electricalConductivity");
      if (range.provenance.sourceId !== "fao-29") continue;
      expect(range.provenance.status).toBe("verified");
      if (expected[crop.id] !== undefined) {
        expect(range.max, `${crop.id} ECe`).toBe(expected[crop.id]);
      }
    }
  });

  it("keeps ranges internally ordered", () => {
    for (const crop of crops) {
      for (const key of paramKeys) {
        const r = rangeOf(crop, key);
        if (r.min !== undefined && r.max !== undefined) expect(r.min, `${crop.id}.${key}`).toBeLessThan(r.max);
        if (r.optimalMin !== undefined && r.optimalMax !== undefined)
          expect(r.optimalMin, `${crop.id}.${key}`).toBeLessThan(r.optimalMax);
        if (r.min !== undefined && r.optimalMin !== undefined)
          expect(r.min, `${crop.id}.${key}`).toBeLessThanOrEqual(r.optimalMin);
        if (r.max !== undefined && r.optimalMax !== undefined)
          expect(r.optimalMax, `${crop.id}.${key}`).toBeLessThanOrEqual(r.max);
      }
    }
  });
});
