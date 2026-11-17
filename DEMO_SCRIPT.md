# CRC Hacks 2026 — SoilSathi AI Demo Script
## Three-Minute Demo Script

### 0:00–0:20 — Problem and Introduction
- **Visual**: Opening screen with soil erosion or dry field imagery
- **Narration**: "Farmers across India spend thousands on soil testing, but getting actionable insights from those reports remains a challenge. Soil chemistry data is often reported in formats that don't connect to local crop requirements. Smallholder farmers need a decision-support tool that reads soil test data, compares it against documented reference ranges, and shows — in their own language — what crops might work, what constraints exist, and what information is still missing."

### 0:20–0:45 — SoilSathi AI Overview
- **Visual**: App landing page, multilingual badge (English / ಕನ್ನಡ / हिन्दी)
- **Narration**: "SoilSathi AI is an open-source, locally-conscious decision-support platform. It reads a soil test report, validates every measurement against documented reference ranges, and screens the data against six major Indian crops — ragi, groundnut, rice, maize, sorghum, and chickpea. The engine is deterministic, unit-tested, and available in English, Kannada, and Hindi. An API key stays server-side; when no key is configured, the app uses a clearly labelled deterministic explanation."

### 0:45–1:15 — Upload/Use Synthetic Soil Report and Review Extracted Measurements
- **Visual**: 
  1. Landing page → click "Load sample report"
  2. Analyzer page shows DEMO-KA-042 with pH 6.4, N 180 mg/kg, P 11 mg/kg, K 140 mg/kg, OC 0.62%, EC 1.2 dS/m
  3. Parameter table with source pills (sample), confidence indicators
  4. "Provided: 6 / 6" and "All six tracked parameters were reported and none is flagged for verification"
- **Narration**: "Here's a synthetic soil test report — DEMO-KA-042. We load it via the sample path. The analyzer reads each measurement, preserves its unit and source, and displays validation status. pH is marked slightly acidic, nitrogen and potassium are reported at normal levels, phosphorus is flagged as low, organic carbon is low, and EC is normal. Every value keeps its original unit — dS/m for conductivity, mg/kg for NPK, percent for organic carbon."

### 1:15–1:45 — Soil Intelligence and Crop Comparison
- **Visual**:
  1. Analysis page shows crop evaluations
  2. Card showing "best suited" crop with suitability label
  3. Crop status chart with per-parameter assessments
  4. Comparison matrix table showing measured values vs documented ranges
  5. Color-coded cells: green within range, amber outside range
- **Narration**: "The engine evaluates the soil against all six crops. Each crop gets a suitability score — well-suited, moderately-suited, limited, or insufficient data. The chart shows which parameters are optimal, which are marginal, and which fall outside the documented range. The comparison matrix highlights where your measured values fall within or beyond each crop's tolerance band. For this sample report, ragi and groundnut show as well-suited, while rice, maize, sorghum and chickpea have specific constraints flagged."

### 1:45–2:15 — What-If Simulator and Water Availability
- **Visual**:
  1. Navigator click to simulator page
  2. Slider for pH parameter
  3. Declared water availability selector (low/moderate/high)
  4. "Measured vs hypothetical" comparison table
  5. Note: "Simulated — not a measurement" badge
- **Narration**: "The what-if simulator lets you test decisions before committing a season. A slider adjusts pH from 6.4 to 7.2 — the engine creates a hypothetical soil profile, evaluates all crops against it, and reports exactly which constraints change. The original measured data is never overwritten; the hypothetical values are labelled everywhere. The water reality check compares your declared availability against each crop's documented water need — rice needs high water, chickpea needs low. The simulator answers: 'If pH were 7.2, which limitations would disappear and which would appear?' — without claiming the soil actually changed."

### 2:15–2:35 — Kannada/Hindi Explanation
- **Visual**:
  1. Language selector switch from English → ಕನ್ನಡ → हिन्दी
  2. Explanation modal or expandable section
  3. Summary text in Kannada: "ಮನ್ನಿನ ಅಳತೆಗಳು ಮತ್ತು ದಾಖಲಿತ Uganda ಶ್ರೇಣಿಗಳ ಆಧಾರದ ಮೇಲೆ..."
  4. Summary text in Hindi: "मान्य मृदा मापों और प्रलेखित संदर्भ श्रेणियों के आधार पर..."
  5. Key findings, questions for expert, additional tests, disclaimer — all in the selected language
- **Narration**: "One core requirement: every screen in three languages. Switching from English to Kannada or Hindi translates all assessment text, range descriptions, suitability labels, warnings, and the explanation summary. No English sentences leak into Kannada or Hindi strings. The placeholders — {min}, {max}, {unit}, {count} — are identical across all three scripts. The deterministic explanation is generated server-side and is authoritative whether or not a Gemini API key is configured."

### 2:35–2:55 — Decision Report, Sources and Limitations
- **Visual**:
  1. Report page preview
  2. Report header: "SoilSathi AI · Farm decision report"
  3. Soil profile table with all six parameters, units, source, confidence
  4. Crop comparison section with parameter-by-parameter verdicts
  5. Gaps section listing unverified/missing information
  6. Footer disclaimer: "This report supports, and does not replace, local agricultural expertise."
  7. Sources note: "See SOURCES.md for verification status of every reference used here."
- **Narration**: "The decision report is print-ready from the browser. It documents the soil assessment in a structured table, lists which crops are suitable and why, identifies gaps in information, and includes a sources section citing every authoritative reference — FAO Irrigation and Drainage Paper 29, ICAR Soil Health Card 2021, TNAU paddy expert system. Every figure's verification status is shown: verified, derived, or project-indicative. The footer reiterates that suitability labels describe alignment with documented ranges only, not yield or profit guarantees."

### 2:55–3:00 — Closing Statement
- **Visual**: App running in three languages side by side, SOURCES.md link
- **Narration**: "SoilSathi AI — understand your soil, simulate your choices, farm smarter. Decision support, not a guarantee. The source code, reference data, and localization are all open for inspection. Thank you."

---
**Demo Notes**:
- No live Gemini API call is made during the demo — the deterministic explanation is always shown, and the app honestly reports when GEMINI_API_KEY is not configured.
- All multilingual text is from centralized translation dictionaries (src/messages/), tested by i18n.test.ts for script integrity and prose translation.
- Every range band in the appraisal has provenance: sourceId, basis, location, verification status, and caveat.
- The app is production-built with `next build`, all 80 tests pass, and TypeScript type-checking is clean.