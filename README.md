# SoilSathi AI — Intelligent Farm Decision Engine

**Understand Your Soil. Simulate Your Choices. Farm Smarter.**

SoilSathi AI reads a soil test report, validates and normalizes the measurements, evaluates them against a documented crop-reference dataset with deterministic rules, compares crops, runs what-if scenarios, and produces a source-bounded decision report with explanations in English, Kannada and Hindi.

The application is decision support. It does not replace local agricultural expertise, and it never invents missing measurements, yields or fertilizer doses.

## Quick start

```bash
npm install
cp .env.example .env      # optional: add GEMINI_API_KEY
npm run dev               # http://localhost:3000
```

Without `GEMINI_API_KEY` everything except AI extraction and AI explanation still works: manual entry, the synthetic sample report, the deterministic engine, crop comparison, the simulator and the printable report. The AI routes return an honest `503` with a message instead of a fake success.

```bash
npm run build     # production build (runs lint + type checks)
npm test          # vitest unit suite
```

## Environment

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Server-side only. Enables `/api/extract` (report text → measurements) and `/api/explain` (multilingual explanation). Never exposed to the browser. |

`.env.example` contains `GEMINI_API_KEY=`. The key is read exclusively in server route handlers.

## Workflow

1. **`/analyzer`** — upload a PDF or image (text is extracted in the browser with PDF.js), paste report text, choose the synthetic sample, or type measurements manually. Every value is reviewed and correctable before analysis; unit and confidence normalization is visible.
2. **`/analysis`** — deterministic soil intelligence: pH, N, P, K, organic carbon, EC verdicts, completeness, limiting factors, missing information, per-parameter evidence.
3. **`/compare`** — select crops and see why each is more or less suitable, with water-need context and sources.
4. **`/simulator`** — change pH, nutrients and water availability on a copy of the report; the same engine recalculates and diffs actual vs hypothetical verdicts and limiting factors. Hypothetical values are always labeled.
5. **`/explain`** — Gemini explanation constrained to validated data and dataset sources, in English/Kannada/Hindi; falls back to a deterministic explanation.
6. **`/report`** — full decision report with print layout (browser print → PDF).
7. **`/sources`** — dataset scope, verification status and limitations, mirroring [`SOURCES.md`](SOURCES.md).

## Architecture

```
src/
  app/                 App Router pages + /api/extract, /api/explain routes
  components/
    layout/            AppShell, nav, footer
    sections/          Analyzer, results, comparison, simulator, explanation, report
    ui/                Cards, pills, callouts, source references
    workspace/         WorkspaceProvider — the single source of truth for the active report
  data/
    crops.ts           Crop reference dataset (separate from logic)
    sampleReport.ts    Explicitly synthetic demo report
  lib/
    types.ts           Domain models
    soil.ts            Validation, unit normalization, plausibility ranges
    evaluation.ts      Deterministic suitability engine
    simulation.ts      Hypothetical scenario application + diffing
    explain.ts         Deterministic explanation fallback
    aiSchemas.ts       Zod schemas for every AI response
    extractClient.ts   Browser client for the extraction route
tests/                 vitest suites
```

Design rules: reference data is data, not code; the engine is pure and unit-tested; AI only explains validated results and its JSON is Zod-validated before use; missing values stay missing.

## Data integrity

- Measured, extracted, manual, sample and simulated values carry distinct source labels.
- Low-confidence or out-of-plausibility-range values are flagged and treated as unreliable, not as facts.
- No yield, profitability or fertilizer-quantity claims.
- AI output cannot override the deterministic verdicts; invalid AI responses are rejected and replaced by the deterministic explanation.
- Reference ranges are documented in [`SOURCES.md`](SOURCES.md) with explicit verification caveats.

## Tests

`npm test` runs 46 unit tests covering measurement validation, unit normalization (ppm, kg/ha, dS/m), crop rules, missing-data handling, what-if recalculation and AI response schemas.

## Known limitations

- Crop reference ranges are indicative and marked as needing verification against specific state/university publications before field deployment.
- The engine does not model climate, rainfall, season, variety, texture class, micronutrients, CEC or economics.
- Image/PDF extraction depends on Gemini and on the scan quality; text PDFs work without AI.
- No persistence: the workspace lives in browser state for the session.
