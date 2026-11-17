import type { CropReference, RangeProvenance } from "@/lib/types";

export { sourceCatalog, getSource } from "./sources";

/** Project-defined band with no verified crop-specific source. */
const indicative = (caveat: string): RangeProvenance => ({
  status: "unverified",
  sourceId: "project-dataset",
  caveat,
});

const NPK_UNVERIFIED =
  "Crop-specific NPK/OC suitability band from the project dataset, not a published crop threshold. The verified national Soil Health Card classes (ICAR-IISS 2021) are listed on the Sources page as fertility context and are deliberately not applied as crop thresholds.";

/** FAO 29 Table 4 threshold at first yield decline, in ECe. */
const faoEc = (value: number, caveatExtra?: string): RangeProvenance => ({
  status: "verified",
  sourceId: "fao-29",
  basis: `${value} dS/m ECe at first yield decline (FAO 29 Table 4; corroborated by FAO 48 Table 13)`,
  location: "Irrigation and Drainage Paper 29, §2.4.3, Table 4",
  caveat:
    "FAO thresholds are ECe (saturation extract). Indian laboratories commonly report EC on a 1:2 or 1:2.5 soil:water basis, which is not directly comparable." +
    (caveatExtra ? " " + caveatExtra : ""),
});

const waterUnverified = (): RangeProvenance => ({
  status: "unverified",
  sourceId: "project-dataset",
  caveat:
    "Qualitative water-need label, not derived from the soil report and not tied to a verified water-requirement figure.",
});

export const crops: CropReference[] = [
  {
    id: "ragi",
    name: "Ragi (Finger Millet)",
    scientificName: "Eleusine coracana",
    waterNeed: "low",
    waterNote:
      "Generally drought-tolerant compared to rice; still needs moisture at establishment and critical stages.",
    waterProvenance: waterUnverified(),
    ranges: {
      pH: {
        min: 4.5,
        max: 8.0,
        optimalMin: 5.0,
        optimalMax: 7.5,
        unit: "pH",
        note: "Tolerates mildly acidic soils.",
        provenance: indicative(
          "The widely repeated 'ragi tolerates pH 4.5-8.0' figure could not be traced to a citable ICAR/TNAU page in this research pass. Treat as indicative only."
        ),
      },
      nitrogen: { min: 80, optimalMin: 150, optimalMax: 400, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      phosphorus: { min: 5, optimalMin: 10, optimalMax: 25, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      potassium: { min: 60, optimalMin: 120, optimalMax: 300, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      organicCarbon: { min: 0.3, optimalMin: 0.5, optimalMax: 1.5, unit: "%", provenance: indicative(NPK_UNVERIFIED) },
      electricalConductivity: {
        min: 0,
        max: 4,
        unit: "dS/m",
        provenance: indicative(
          "No FAO or ICAR numeric ECe threshold exists for finger millet; FAO lists only foxtail millet, without a figure. The often-quoted 6 dS/m is a seedling-stage NaCl solution value, not ECe, so it is not used here."
        ),
      },
    },
    requiredData: ["pH", "nitrogen", "phosphorus", "potassium", "organicCarbon"],
    limitations: [
      "Variety and season strongly affect performance.",
      "Does not account for rainfall pattern, pests, or management.",
    ],
    sourceIds: ["project-dataset"],
  },
  {
    id: "groundnut",
    name: "Groundnut",
    scientificName: "Arachis hypogaea",
    waterNeed: "moderate",
    waterNote:
      "Needs well-distributed moisture; sensitive to waterlogging and severe drought at pegging/pod filling.",
    waterProvenance: waterUnverified(),
    ranges: {
      pH: {
        min: 5.5,
        max: 7.5,
        optimalMin: 6.0,
        optimalMax: 7.0,
        unit: "pH",
        note: "Prefers slightly acidic to neutral soils; calcium matters for pod development.",
        provenance: indicative(
          "Three ICAR groundnut bulletins seen only as search snippets give different ranges (5.5-7.0, 6.0-6.4, 6.0-6.5) and none could be opened during this pass; the TNAU groundnut pages read contain no pH figure. Not verified."
        ),
      },
      nitrogen: {
        min: 60,
        optimalMin: 100,
        optimalMax: 300,
        unit: "mg/kg",
        note: "Legume can fix N, but starter fertility still matters.",
        provenance: indicative(NPK_UNVERIFIED),
      },
      phosphorus: { min: 8, optimalMin: 12, optimalMax: 30, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      potassium: { min: 80, optimalMin: 120, optimalMax: 300, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      organicCarbon: { min: 0.3, optimalMin: 0.5, optimalMax: 1.2, unit: "%", provenance: indicative(NPK_UNVERIFIED) },
      electricalConductivity: {
        min: 0,
        max: 3.2,
        unit: "dS/m",
        provenance: faoEc(3.2),
      },
    },
    requiredData: ["pH", "phosphorus", "potassium", "organicCarbon", "electricalConductivity"],
    limitations: [
      "Soil texture and calcium/gypsum needs not fully captured here.",
      "Sensitive to salinity and waterlogging.",
    ],
    sourceIds: ["fao-29", "fao-48", "project-dataset"],
  },
  {
    id: "rice",
    name: "Rice",
    scientificName: "Oryza sativa",
    waterNeed: "high",
    waterNote:
      "Typically high water demand, especially under flooded/puddled systems; system varies by method.",
    waterProvenance: waterUnverified(),
    ranges: {
      pH: {
        min: 5.5,
        max: 6.5,
        optimalMin: 5.5,
        optimalMax: 6.5,
        unit: "pH",
        provenance: {
          status: "verified",
          sourceId: "tnau-paddy-soil",
          basis: "'It grows well in soils having a pH range between 5.5 and 6.5.'",
          location: "Main Field Preparation / Soil Condition Required",
          caveat:
            "The page states the range rice grows well in; it does not document wider tolerance, so values outside 5.5-6.5 are reported as outside the cited range rather than as unsuitable soils.",
        },
      },
      nitrogen: { min: 100, optimalMin: 200, optimalMax: 450, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      phosphorus: { min: 8, optimalMin: 12, optimalMax: 30, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      potassium: { min: 80, optimalMin: 120, optimalMax: 350, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      organicCarbon: { min: 0.4, optimalMin: 0.6, optimalMax: 1.5, unit: "%", provenance: indicative(NPK_UNVERIFIED) },
      electricalConductivity: {
        min: 0,
        max: 3.0,
        unit: "dS/m",
        provenance: faoEc(
          3.0,
          "For paddy the FAO figure refers to the EC of the submerged soil water, not a routine 1:2 extract; use as an order-of-magnitude check only."
        ),
      },
    },
    requiredData: ["pH", "nitrogen", "phosphorus", "potassium", "electricalConductivity"],
    limitations: [
      "Water availability and irrigation method are critical and not inferred from soil report alone.",
      "Submergence can change nutrient dynamics.",
    ],
    sourceIds: ["tnau-paddy-soil", "fao-29", "fao-48", "project-dataset"],
  },
  {
    id: "maize",
    name: "Maize",
    scientificName: "Zea mays",
    waterNeed: "moderate",
    waterNote: "Moderate water need; sensitive to moisture stress around tasseling and grain filling.",
    waterProvenance: waterUnverified(),
    ranges: {
      pH: {
        min: 5.5,
        max: 7.5,
        optimalMin: 5.8,
        optimalMax: 7.2,
        unit: "pH",
        provenance: indicative(
          "ICAR maize guidance exists only as PDF bulletins that could not be opened in this pass; snippet figures conflict (5.5-8.0 in one advisory, 6.5-7.5 in another). This band stays indicative."
        ),
      },
      nitrogen: { min: 120, optimalMin: 200, optimalMax: 450, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      phosphorus: { min: 8, optimalMin: 12, optimalMax: 30, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      potassium: { min: 100, optimalMin: 150, optimalMax: 350, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      organicCarbon: { min: 0.4, optimalMin: 0.6, optimalMax: 1.5, unit: "%", provenance: indicative(NPK_UNVERIFIED) },
      electricalConductivity: {
        min: 0,
        max: 1.7,
        unit: "dS/m",
        provenance: faoEc(1.7),
      },
    },
    requiredData: ["pH", "nitrogen", "phosphorus", "potassium", "organicCarbon"],
    limitations: [
      "Hybrid/variety nutrient demand differs.",
      "Yield depends on season, plant population, and management.",
    ],
    sourceIds: ["fao-29", "fao-48", "project-dataset"],
  },
  {
    id: "sorghum",
    name: "Sorghum",
    scientificName: "Sorghum bicolor",
    waterNeed: "low",
    waterNote: "Relatively drought-tolerant; performs better than many cereals under limited moisture.",
    waterProvenance: waterUnverified(),
    ranges: {
      pH: {
        min: 5.5,
        max: 8.5,
        optimalMin: 6.0,
        optimalMax: 7.5,
        unit: "pH",
        provenance: indicative(
          "ICAR-IIMR prints 6.5-7.5 as optimum in a 2024 PDF that could not be opened here, and ICRISAT regeneration guidance (not ICAR) prints 5.5-8.5. Neither was verified on a loaded page, so this band remains indicative."
        ),
      },
      nitrogen: { min: 80, optimalMin: 150, optimalMax: 350, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      phosphorus: { min: 5, optimalMin: 10, optimalMax: 25, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      potassium: { min: 80, optimalMin: 120, optimalMax: 300, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      organicCarbon: { min: 0.3, optimalMin: 0.5, optimalMax: 1.2, unit: "%", provenance: indicative(NPK_UNVERIFIED) },
      electricalConductivity: {
        min: 0,
        max: 6.8,
        unit: "dS/m",
        note: "Moderately tolerant to salinity compared to many crops.",
        provenance: faoEc(6.8),
      },
    },
    requiredData: ["pH", "nitrogen", "phosphorus", "potassium"],
    limitations: ["Local rainfall and soil depth matter greatly.", "Pest and disease pressures not considered."],
    sourceIds: ["fao-29", "fao-48", "project-dataset"],
  },
  {
    id: "chickpea",
    name: "Chickpea",
    scientificName: "Cicer arietinum",
    waterNeed: "low",
    waterNote: "Often grown on residual moisture; excessive water/waterlogging can be harmful.",
    waterProvenance: waterUnverified(),
    ranges: {
      pH: {
        min: 6.0,
        max: 8.0,
        optimalMin: 6.0,
        optimalMax: 7.5,
        unit: "pH",
        provenance: indicative(
          "ICAR-CRIDA's chickpea sheet says only 'preferably neutral pH' without numbers; the 6.0-8.0 range comes from ICRISAT and Vikaspedia, neither verified on a loaded ICAR page here."
        ),
      },
      nitrogen: {
        min: 50,
        optimalMin: 80,
        optimalMax: 250,
        unit: "mg/kg",
        note: "Legume; biological N fixation possible with effective nodulation.",
        provenance: indicative(NPK_UNVERIFIED),
      },
      phosphorus: { min: 8, optimalMin: 12, optimalMax: 30, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      potassium: { min: 80, optimalMin: 120, optimalMax: 300, unit: "mg/kg", provenance: indicative(NPK_UNVERIFIED) },
      organicCarbon: { min: 0.3, optimalMin: 0.5, optimalMax: 1.2, unit: "%", provenance: indicative(NPK_UNVERIFIED) },
      electricalConductivity: {
        min: 0,
        max: 3.0,
        unit: "dS/m",
        provenance: {
          status: "derived",
          sourceId: "fao-a1",
          basis:
            "FAO rates chickpea moderately sensitive with no numeric threshold; the band uses the FAO moderately-sensitive upper class boundary of 3.0 dS/m ECe.",
          location: "Annex 1, Table A1.1 plus FAO 29 Figure 10 class boundaries",
          caveat:
            "This is a class-derived ceiling, not a measured chickpea threshold. Trials summarised elsewhere suggest yield loss may begin well below 3 dS/m ECe.",
        },
      },
    },
    requiredData: ["pH", "phosphorus", "potassium", "electricalConductivity"],
    limitations: [
      "Requires well-drained conditions; drainage not inferred from report.",
      "Nodule health, Rhizobium, and micronutrients not modeled.",
    ],
    sourceIds: ["fao-29", "fao-a1", "project-dataset"],
  },
];

export function getCropById(id: string) {
  return crops.find((c) => c.id === id);
}

export type DatasetCrop = CropReference;
