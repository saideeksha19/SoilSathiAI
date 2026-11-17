import type { ReferenceSource } from "@/lib/types";

/** Every entry below was opened and read during the Phase 2 verification pass.
 * `verified` means the figure or statement was present on the page named in `location`.
 * Nothing in this file is reconstructed from memory. */
export const sourceCatalog: ReferenceSource[] = [
  {
    id: "fao-29",
    title: "Water Quality for Agriculture (Irrigation and Drainage Paper 29, Rev. 1)",
    institution: "Food and Agriculture Organization of the United Nations (Ayers & Westcot)",
    year: "1985",
    url: "https://www.fao.org/4/T0234E/T0234E03.htm",
    location: "Section 2.4.3, Table 4 (crop tolerance to salinity) and Figure 10 (tolerance classes)",
    scope: "international",
    supports:
      "ECe thresholds at first yield decline: groundnut 3.2, rice 3.0, maize 1.7, sorghum 6.8 dS/m. Tolerance classes: sensitive <1.3, moderately sensitive 1.3–3.0, moderately tolerant 3.0–6.0, tolerant 6.0–10.0, unsuitable >10 dS/m.",
    caveat:
      "All values are ECe (saturation extract at 25 °C). Paddy rice is the exception: the figure refers to the EC of the submerged soil water. A 1:2 or 1:2.5 soil:water reading from an Indian laboratory is not directly comparable.",
    verification: "verified",
  },
  {
    id: "fao-48",
    title: "The Use of Saline Waters for Crop Production (Irrigation and Drainage Paper 48)",
    institution: "Food and Agriculture Organization of the United Nations (Rhoades, Kandiah & Mashali)",
    year: "1992",
    url: "https://www.fao.org/4/T0667E/t0667e07.htm",
    location: "Chapter 4, Table 13 (salt tolerance of herbaceous crops, after Maas 1986), with note 7",
    scope: "international",
    supports:
      "Independent confirmation of groundnut 3.2, maize 1.7, rice 3.0 and sorghum 6.8 dS/m, and the flooded-paddy measurement caveat.",
    caveat: "Same ECe basis as FAO 29; chickpea is not listed in this table at all.",
    verification: "verified",
  },
  {
    id: "fao-a1",
    title: "Crop Salt Tolerance Data (Annex 1, Table A1.1, after Maas & Grattan 1999)",
    institution: "Food and Agriculture Organization of the United Nations",
    year: "1999 (published in FAO's agricultural drainage series)",
    url: "https://www.fao.org/4/Y4263E/y4263e0e.htm",
    location: "Annex 1, Table A1.1",
    scope: "international",
    supports:
      "Chickpea (Cicer arietinum) is rated 'MS' (moderately sensitive) with an explicit '-' for threshold and slope — no numeric threshold is published.",
    caveat:
      "Because no numeric threshold exists, the chickpea electrical-conductivity band used in this app is derived from FAO's moderately-sensitive class boundary (1.3–3.0 dS/m ECe), not from a chickpea trial.",
    verification: "verified",
  },
  {
    id: "icar-iiss-shc",
    title: "Soil Health Card: A Step Towards Sustainable Agriculture (Harit Dhara, Vol. 4, No. 1)",
    institution: "ICAR–Indian Institute of Soil Science, Bhopal",
    year: "2021",
    url: "https://iiss.res.in/old/eMagazine/v4i1/12.pdf",
    location: "Table 1, 'Parameters in Soil Health Cards and their critical limits', pp. 2–3",
    scope: "national",
    supports:
      "National Soil Health Card classes: organic carbon <0.50 / 0.50–0.75 / >0.75 %; nitrogen <280 / 280–560 / >560 kg ha⁻¹; phosphorus <10 / 10–25 / >25 kg ha⁻¹; potassium <120 / 120–280 / >280 kg ha⁻¹; pH (1:2) <6.5 acidic, 6.5–7.0 neutral, >7.0 alkaline; EC (1:2) <4.0 normal, >4.0 saline. The same table names the methods: N alkaline KMnO₄, P Olsen, K 1 N NH₄OAc.",
    caveat:
      "These are soil fertility classes for interpreting a laboratory report. They are not crop-specific suitability thresholds and the app does not present them as such.",
    verification: "verified",
  },
  {
    id: "tnau-paddy-soil",
    title: "Cultivation Practices — Main Field Preparation (Paddy Expert System)",
    institution: "Tamil Nadu Agricultural University, Agritech Portal",
    year: "undated portal page (read 2026)",
    url: "http://www.agritech.tnau.ac.in/expert_system/paddy/cultivationpractices1.html",
    location: "Section 'Main Field Preparation / Soil Condition Required'",
    scope: "state",
    supports:
      "Verbatim: 'It grows well in soils having a pH range between 5.5 and 6.5.' Used as the rice pH range.",
    caveat:
      "The page states the range rice 'grows well' in; it does not claim a wider tolerance under flooded conditions. A Tamil Nadu advisory, not a national threshold.",
    verification: "verified",
  },
  {
    id: "tnau-soil-rating",
    title: "Soil Rating Chart for Soil Test Data",
    institution: "Tamil Nadu Agricultural University, Agritech Portal",
    year: "undated portal page (read 2026)",
    url: "https://agritech.tnau.ac.in/agriculture/agri_soil_rating.html",
    location: "Rating chart table (low / medium / high)",
    scope: "state",
    supports:
      "Tamil Nadu rating chart: available N <240 / 240–480 / >480 kg ha⁻¹; available P <11 / 11–22 / >22 kg ha⁻¹; available K <110 / 110–280 / >280 kg ha⁻¹.",
    caveat:
      "Deliberately looser/different from the national ICAR-IISS classes (for example N 240/480 versus 280/560). The app uses the national classes and cites this chart only to show that the rating scale is state-dependent. The page prints the organic-carbon medium upper bound as '7.5', an evident typographical error for 0.75.",
    verification: "verified",
  },
  {
    id: "project-dataset",
    title: "SoilSathi project reference dataset (indicative bands)",
    institution: "SoilSathi AI project",
    year: "2026",
    url: "",
    location: "src/data/crops.ts",
    scope: "international",
    supports:
      "Crop-specific pH tolerance and NPK/OC suitability bands where no crop-specific, citable package-of-practices figure could be verified during this research pass.",
    caveat:
      "UNVERIFIED. These are project-defined indicative bands for demonstration and rule logic. They are not a published recommendation and must not be presented as one; see SOURCES.md for the verification work needed before field use.",
    verification: "unverified",
  },
];

export function getSource(id: string): ReferenceSource | undefined {
  return sourceCatalog.find((s) => s.id === id);
}
