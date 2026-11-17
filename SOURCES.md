# SoilSathi AI — Agricultural Reference Sources, Verification Status and Limitations

This document records exactly what supports each crop-reference band in `src/data/crops.ts` and where the dataset stops being citable. SoilSathi AI is **decision support**, not local agronomic advice.

## Verification vocabulary

| Status | Meaning in this project |
|---|---|
| **verified** | The figure or statement was found on the page named in `location` during the Phase 2 research pass. The database entry carries the URL, the institution and the section used. |
| **derived** | Not a published crop threshold. The band is calculated from a published *class boundary* (for example FAO's salinity classes) and the derivation is stated in the entry. |
| **unverified** | No crop-specific, citable publication figure could be established. The band is a project-defined **indicative** range for rule logic and demonstration. The UI labels it "indicative range" and never as a recommendation. |

Every range in the dataset carries a provenance record, and the Sources page and every finding link render that status from structured codes, not from a hand-written caption. `tests/sources.test.ts` fails the build if a range appears without provenance, if an unverified band is labelled verified, or if a verified band loses its basis text.

## Verified sources

| ID | Publication | Institution | Used for | Link |
|---|---|---|---|---|
| `fao-29` | *Water Quality for Agriculture*, FAO Irrigation and Drainage Paper 29 Rev. 1 (Ayers & Westcot), 1985 | FAO | ECe at first yield decline: groundnut 3.2, rice 3.0, maize 1.7, sorghum 6.8 dS/m; salinity tolerance classes | https://www.fao.org/4/T0234E/T0234E03.htm (§2.4.3, Table 4) |
| `fao-48` | *The Use of Saline Waters for Crop Production*, Irrigation and Drainage Paper 48 (Rhoades, Kandiah & Mashali), 1992 | FAO | Independent confirmation of the same four ECe values, plus the flooded-paddy measurement note | https://www.fao.org/4/T0667E/t0667e07.htm (Ch. 4, Table 13, note 7) |
| `fao-a1` | *Crop Salt Tolerance Data*, Annex 1 Table A1.1 (after Maas & Grattan 1999) | FAO | Chickpea is rated moderately sensitive with no numeric threshold published | https://www.fao.org/4/Y4263E/y4263e0e.htm (Annex 1, Table A1.1) |
| `icar-iiss-shc` | *Soil Health Card: A Step Towards Sustainable Agriculture*, Harit Dhara 4(1), 2021 | ICAR–Indian Institute of Soil Science, Bhopal | National Soil Health Card critical limits and methods: OC <0.50 / 0.50–0.75 / >0.75 %; N <280 / 280–560 / >560 kg ha⁻¹; P <10 / 10–25 / >25 kg ha⁻¹; K <120 / 120–280 / >280 kg ha⁻¹; pH (1:2) classes; EC (1:2) normal <4.0 dS/m; N by alkaline KMnO₄, P by Olsen, K by 1 N NH₄OAc | https://iiss.res.in/old/eMagazine/v4i1/12.pdf (Table 1, pp. 2–3) |
| `tnau-paddy-soil` | *Cultivation Practices — Main Field Preparation*, Paddy Expert System | Tamil Nadu Agricultural University, Agritech Portal | Rice pH band 5.5–6.5 ("It grows well in soils having a pH range between 5.5 and 6.5") | http://www.agritech.tnau.ac.in/expert_system/paddy/cultivationpractices1.html |
| `tnau-soil-rating` | *Soil Rating Chart for Soil Test Data* | TNAU Agritech Portal | Evidence that rating scales are state-dependent (TN: N 240/480, P 11/22, K 110/280 kg ha⁻¹). Used for contrast only; the app does **not** use these cut-offs | https://agritech.tnau.ac.in/agriculture/agri_soil_rating.html |

### What the verified sources do *not* support

- The ICAR-IISS Soil Health Card table is a **soil fertility classification** for reading a laboratory report. It is not a crop-suitability threshold, and no crop band in this app is derived from it. Its classes and methods are listed on the Sources page as fertility context; the engine deliberately does not apply them as crop thresholds.
- FAO salinity numbers are **ECe** (saturation extract at 25 °C). Most Indian laboratories report EC on a 1:2 or 1:2.5 soil:water basis, which is not interchangeable. For paddy, FAO's figure describes the EC of the submerged soil water. Each EC entry carries this caveat verbatim.
- The TNAU paddy page states the range in which rice *grows well*; it does not claim wider tolerance, so a value outside 5.5–6.5 is reported as outside the cited range, not as an unsuitable soil.

## Range-by-range status

### Ragi / finger millet (*Eleusine coracana*)

| Parameter | Band used | Status | Basis |
|---|---|---|---|
| pH | tolerance 4.5–8.0, optimal 5.0–7.5 | unverified | The widely repeated 4.5–8.0 figure could not be traced to a citable ICAR or TNAU page. Indicative only. |
| N, P, K, OC | crop bands in mg/kg and % | unverified | Project illustrative bands; see the national fertility classes above for what *is* documented. |
| EC | 0–4 dS/m | unverified | Neither FAO nor ICAR publishes a numeric ECe threshold for finger millet. The often-quoted 6 dS/m is a seedling-stage NaCl solution value, not ECe, so it is deliberately not used. |
| Water need | qualitative "low" | unverified | Agronomic label; not computed from the soil report. |

### Groundnut (*Arachis hypogaea*)

| Parameter | Band used | Status | Basis |
|---|---|---|---|
| pH | tolerance 5.5–7.5, optimal 6.0–7.0 | unverified | Three ICAR bulletins seen only as search snippets give conflicting ranges (5.5–7.0, 6.0–6.4, 6.0–6.5) and none could be opened; the TNAU groundnut pages contain no pH figure. |
| N, P, K, OC | crop bands | unverified | Project illustrative bands. |
| EC | 0–3.2 dS/m ECe | verified | FAO 29 Table 4 (corroborated by FAO 48 Table 13). ECe basis caveat applies. |

### Rice (*Oryza sativa*)

| Parameter | Band used | Status | Basis |
|---|---|---|---|
| pH | 5.5–6.5 (tolerance = optimal) | verified | TNAU paddy expert system, "Soil Condition Required". State advisory, not a national threshold. |
| N, P, K, OC | crop bands | unverified | Project illustrative bands. |
| EC | 0–3.0 dS/m | verified | FAO 29 Table 4. For paddy the figure refers to the EC of the submerged soil water, not a 1:2 extract — use as an order-of-magnitude check only. |

### Maize (*Zea mays*)

| Parameter | Band used | Status | Basis |
|---|---|---|---|
| pH | tolerance 5.5–7.5, optimal 5.8–7.2 | unverified | ICAR maize bulletins could not be opened; snippets conflict (5.5–8.0 in one advisory, 6.5–7.5 in another). |
| N, P, K, OC | crop bands | unverified | Project illustrative bands. |
| EC | 0–1.7 dS/m ECe | verified | FAO 29 Table 4. |

### Sorghum (*Sorghum bicolor*)

| Parameter | Band used | Status | Basis |
|---|---|---|---|
| pH | tolerance 5.5–8.5, optimal 6.0–7.5 | unverified | ICAR-IIMR prints 6.5–7.5 as optimum in a 2024 PDF that could not be opened here; ICRISAT regeneration guidance (not ICAR) prints 5.5–8.5. |
| N, P, K, OC | crop bands | unverified | Project illustrative bands. |
| EC | 0–6.8 dS/m ECe | verified | FAO 29 Table 4. |

### Chickpea (*Cicer arietinum*)

| Parameter | Band used | Status | Basis |
|---|---|---|---|
| pH | tolerance 6.0–8.0, optimal 6.0–7.5 | unverified | ICAR-CRIDA's chickpea sheet says only "preferably neutral pH" without numbers; 6.0–8.0 comes from ICRISAT and Vikaspedia, not verified on a loaded ICAR page. |
| N, P, K, OC | crop bands | unverified | Project illustrative bands. |
| EC | 0–3.0 dS/m ECe | derived | FAO rates chickpea moderately sensitive with no numeric threshold. The ceiling is the FAO moderately-sensitive class boundary, not a chickpea trial; yield loss may begin below it. |

### Water-need labels (all six crops)

`derived` label, unverified figure. They compare a *declared* water availability against a qualitative dataset label. No water requirement is computed from the soil report, and the simulator says so.

## Unverified data remaining in the app

- **All 24 NPK/organic-carbon crop bands** (6 crops × 4 parameters). These are project-defined indicative ranges. They are the largest gap between this dataset and a field-ready one.
- **Five of six pH bands** (ragi, groundnut, maize, sorghum, chickpea). Only rice pH is citable.
- **All six water-need labels.**
- **Chickpea EC** is class-derived rather than crop-measured.

None of these is presented as a verified recommendation: the interface shows the status pill and the caveat on every finding, and the Sources page lists them under "indicative range".

## Method used for this verification pass

1. Searched for ICAR, ICAR-IISS, ICAR-IIMR, ICAR-CRIDA, TNAU Agritech, FAO and state extension material per crop and parameter.
2. Opened and read the pages that were reachable. Where a page returned only a search snippet, or a PDF could not be rendered, the value was **not** promoted to verified.
3. Recorded the institution, section, year and the specific statement that supports each figure.
4. Left every value that could not be traced at its original indicative number, with a caveat naming why.
5. During the final build, the FAO 29 page was re-opened directly to confirm the §2.4.3/Table 4 reference. The ICAR-IISS magazine is served as a PDF that this tool could not render, so its Table 1 figures rest on the research pass above; they are shown only as fertility context, never as crop thresholds.

No publication title, URL, page number or scientific value in `src/data/sources.ts` was reconstructed from memory. If a figure could not be checked, the entry says so rather than being removed or silently replaced.

## Limitations of the model

1. **No local calibration.** The bands are national or international references, not calibrated to a district's laboratories, extractants or rating charts.
2. **Narrow parameter set.** pH, available N/P/K, organic carbon and EC only. No S, Zn, B, Fe, Ca/Mg, CEC, texture-based water holding, drainage, or depth.
3. **No climate, season, variety or management.** Rainfall, temperature, variety choice, sowing date, pests and markets are outside the model.
4. **No yield or profit claims.** Suitability labels describe alignment with the cited ranges and nothing more.
5. **No fertiliser prescription.** The app never converts a suitability result into a dose.
6. **Unit risk.** kg/ha → mg/kg uses ÷2.24 and is flagged; ECe versus 1:2 soil:water extracts are not interchangeable.
7. **Extraction risk.** Gemini can misread a report; every extracted number waits for human review and edits are labelled as reviewed by the user.
8. **Synthetic demonstration data.** The bundled sample (DEMO-KA-042) is synthetic and labelled in the report, the analyzer and the report printout.

## What would make this dataset field-ready

- Replace the 24 NPK/OC bands with state package-of-practices figures tied to the extractant the local laboratory actually uses (Olsen P, 1 N NH₄OAc K, alkaline KMnO₄ N).
- Obtain citable ICAR/SAU PDFs for the five remaining pH bands and for chickpea salinity.
- Convert every EC band to the laboratory's extraction basis, or add a documented conversion.
- Add a district/season/variety layer reviewed by an agronomist.
