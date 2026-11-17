# CRC Hacks 2026 — SoilSathi AI
## Submission Documentation

### Project Title
**SoilSathi AI — Intelligent Farm Decision Engine**

### Tagline
Understand your soil. Simulate your choices. Farm smarter.

### Short Description
SoilSathi AI is a web-based decision-support platform that reads soil test reports, validates measurements against documented agricultural reference ranges, and screens six major Indian crops for suitability. The application provides multilingual (English, Kannada, Hindi) explanations, a what-if simulator for scenario testing, and a printable decision report with source citations. The engine is deterministic, unit-tested, and designed for smallholder farmer use — it never invents values, prescribes fertiliser doses, or promises yield guarantees.

### Problem Statement
Indian smallholder farmers often lack access to decision-support tools that translate soil test data into actionable crop choices. Laboratory reports are typically in technical formats (pH, NPK mg/kg, dS/m EC) without crop-specific interpretation. Available extensions either:
- Require expensive proprietary software
- Make unverified yield claims without source citation
- Are available only in English, excluding Kannada and Hindi speakers
- Cannot be used offline or without internet connectivity
- Do not distinguish between verified reference data and project-indicative estimates

### Proposed Solution
A free, open-source, multilingual web application that:
- Reads soil test PDFs, images, or manual entries
- Validates every measurement and flags low confidence
- Screens against documented crop reference ranges with full provenance
- Shows structured assessment bands (min/max/optimal with units and source)
- Provides what-if scenario simulation without altering measured data
- Generates printable decision reports with source references
- Supports three languages without English text leaking into regional scripts
- Keeps API keys server-side; deterministic fallback when no key is configured

### Main Features

1. **Soil Report Extraction**
   - PDF text extraction via pdfjs-dist (browser)
   - Manual entry with real-time validation
   - Paste-text extraction with Gemini API (server-side, optional)
   - Unit conversion and confidence flagging

2. **Crop Suitability Engine**
   - Six Indian crops: ragi, groundnut, rice, maize, sorghum, chickpea
   - Per-parameter assessment: optimal, acceptable, marginal, unsuitable, missing, unreliable
   - Structured reference bands with min/max/optimalMin/optimalMax and units
   - Verification status shown for every range: verified / derived / unverified
   - ECe values with explicit caveat: ECe (saturation extract) vs 1:2 soil:water extract

3. **What-If Simulator**
   - Adjust pH, nutrients, or declared water availability
   - Hypothetical profiles never overwrite measured data
   - Only affected parameters show changed constraints
   - Suitability improvements/deteriorations tracked

4. **Multilingual UI**
   - English, Kannada, Hindi
   - All message dictionaries in src/messages/ (11 dictionaries, 200+ keys)
   - i18n.test.ts validates: no script contamination, same placeholders, prose translated not repeated
   - Range descriptions, suitability labels, warnings, and explanations all translate

5. **Decision Report**
   - Print-ready from browser
   - Structured soil profile table
   - Crop comparison with suitability verdicts
   - Gaps and unverified information section
   - Source citations with verification status
   - Disclaimer: supports, does not replace, local agricultural expertise

6. **AI Integration (Optional)**
   - `/api/extract` endpoint: Google Generative AI for PDF text → soil measurements
   - `/api/explain` endpoint: Multilingual explanation summary, key findings, questions
   - When GEMINI_API_KEY not configured: returns 503 with honest message; deterministic explanation shown
   - API key never exposed to browser; runtime="nodejs"

### Technical Architecture and Technology Stack

**Framework**: Next.js 13+ (app router), React, TypeScript
**Styling**: Tailwind CSS, custom brand colors (brand-50, brand-100, brand-200, brand-300, brand-500, brand-600, brand-700, brand-800, brand-900, soil-50, soil-100, sky-50, accent-400)
**UI Components**: shadcn/ui primitives (badges, pills, callouts, cards, inputs, buttons)
**State Management**: React Context (WorkspaceProvider) with localStorage hydration
**Language Switching**: useT() hook, centralized message tables (src/messages/*.ts), i18n utility functions (src/lib/i18n.ts)
**Evaluation Engine**: Deterministic rule engine in src/lib/evaluation.ts, 80 Vitest tests
**AI Routes**: 
  - `POST /api/extract` — Google Generative AI (gemini-1.5-flash), server-side only
  - `POST /api/explain` — Google Generative AI, deterministic fallback
  - Both: `runtime = "nodejs"`, API key from process.env.GEMINI_API_KEY

**Data Persistence**: 
- localStorage hydration of workspace state (soil, language, explanations, scenario)
- No server database required for demo; all data client-side or via API routes

**Testing**: 
- 7 test files, 80 tests (vitest)
- Test coverage: source catalogue, crop range provenance, evaluation rules, simulation consistency, report data integrity, message dictionary integrity (script integrity, placeholder consistency, prose translation), i18n coverage
- tsc --noEmit: clean
- next build: successful

**Deployment**: Cloudflare Sites (preview + production environments), D1 database, R2 bucket (optional), Durable Object realtime (optional)

### AI Integration and Deterministic Evaluation Explanation

The application features two tracks:

**Track A — With GEMINI_API_KEY configured**:
- `/api/extract`: Sends PDF text to Gemini 1.5 Flash, returns parsed soil measurements with warning codes
- `/api/explain`: Sends evaluation context + source catalog to Gemini 1.5 Flash, returns multilingual summary, key findings, questions for expert, additional tests, disclaimer
- Both routes return `usedAi: true` in response

**Track B — Without GEMINI_API_KEY (default in submission)**:
- `/api/extract`: Returns `503` with `{ error: "GEMINI_API_KEY is not configured...", missingApiKey: true }`. UI shows honest error and offers manual entry or sample report.
- `/api/explain`: Returns deterministic explanation with `usedAi: false`. The deterministic explanation is always authoritative and never depends on the presence of an API key.

**The deterministic evaluation engine is the primary authoritative source**. It:
- Rules out-of-range measurements as limiting factors
- Computes suitability from documented reference ranges only
- Generates explanations from structured codes (assessment codes: assess.belowMin, assess.aboveMax, assess.optimal, etc.)
- Produces multilingual output from centralized message dictionaries
- Is 100% test-covered (80 Vitest tests across 7 test files)
- Never invents values, citations, or yield/profit guarantees

When a Gemini key is later configured, the AI tracks enhance but do not replace the deterministic engine — they explain the same results in richer natural language.

### Data Sources and Verification Status

All reference data is documented in `src/data/sources.ts` and `SOURCES.md` with explicit verification status:

**Verified from authoritative sources** (shown with ✓ in UI):
- FAO Irrigation and Drainage Paper 29 (1985): ECe thresholds at first yield decline — groundnut 3.2 dS/m, rice 3.0 dS/m, maize 1.7 dS/m, sorghum 6.8 dS/m
- FAO Irrigation and Drainage Paper 48 (1992): Independent confirmation of ECe values, flooded-paddy measurement caveat
- FAO Crop Salt Tolerance Data (Annex 1, Table A1.1): Chickpea rated moderately sensitive, class boundary 3.0 dS/m ECe (derived, not crop-measured)
- TNAU Paddy Expert System: Rice pH range 5.5–6.5 ("grows well in soils having a pH range between 5.5 and 6.5")
- ICAR–Indian Institute of Soil Science, Bhopal (2021): Soil Health Card classes (OC <0.50 / 0.50–0.75 / >0.75%; N <280 / 280–560 / >560 kg ha⁻¹; P <10 / 10–25 / >25 kg ha⁻¹; K <120 / 120–280 / >280 kg ha⁻¹)

**Project-indicative / unverified** (shown with ⚠ in UI, never presented as verified):
- All 24 NPK/OC crop bands across 6 crops — marked `status: "unverified"`, `sourceId: "project-dataset"`
- Five of six pH bands (ragi, groundnut, maize, sorghum, chickpea) — unverified with caveats explaining why
- All six water-need labels — qualitative, not derived from soil report
- Chickpea EC: class-derived ceiling from FAO moderately-sensitive boundary

**Unit caveats explicitly displayed**:
- FAO ECe values carry caveat: "All values are ECe (saturation extract at 25 °C). Paddy rice is the exception: the figure refers to the EC of the submerged soil water. A 1:2 or 1:2.5 soil:water reading from an Indian laboratory is not directly comparable."
- No silent unit conversion; units displayed as reported (dS/m, mg/kg, % pH)

### Challenges and Limitations

1. **No local calibration** — bands are national or international references, not district-specific
2. **Narrow parameter set** — pH, available N/P/K, organic carbon, and EC only; no S, Zn, B, Fe, Ca/Mg, CEC, texture-based water holding, drainage, or depth
3. **No climate, season, variety, or management** factors — suitability is based solely on soil measurements
4. **No yield or profit claims** — suitability labels describe alignment with documented ranges only
5. **No fertiliser prescription** — app never converts suitability to dose
6. **Unit risk** — kg/ha → mg/kg uses ÷2.24 flag; ECe versus 1:2 soil:water extracts are not interchangeable
7. **Extraction risk** — Gemini can misread reports; every extracted number waits for human review
8. **Synthetic demonstration data** — DEMO-KA-042 is labelled synthetic throughout; not a real laboratory result
9. **Missing ICAR/SAU PDFs** — five of six pH bands and several NPK bands lack citable crop-specific sources; marked unverified with caveats
10. **Language coverage** — only English, Kannada, Hindi supported; additional languages would require dictionary expansion

### Future Improvements

1. Obtain citable ICAR/SAU PDFs for remaining pH bands and NPK thresholds
2. Convert EC bands to the laboratory's extraction basis (Olsen P, 1 N NH₄OAc K, alkaline KMnO₄ N) with documented conversions
3. Add district/season/variety layer reviewed by agronomists
4. Add realtime multiplayer collaboration via Cloudflare Durable Objects
5. Integrate with local laboratory APIs for automatic report reading
6. Add fertiliser recommendation module (outside current scope — requires local soil, crop stage, advisory context)
7. Add payment/credit system for Gemini API usage (only when key is configured)
8. Extend multilingual support to additional Indian languages
9. Add mobile-responsive design for field officer use
10. Build REST API for third-party integration with farm management software

### Instructions to Run Locally

```bash
# 1. Clone the repository
git clone <repository-url>
cd SoilSathiAI

# 2. Install dependencies
npm install

# 3. (Optional) Configure Gemini API key
# Copy .env.example to .env and add GEMINI_API_KEY
# Without the key, the app works fully with deterministic fallback

# 4. Start development server
npm run dev
# App runs at http://localhost:3000

# 5. Run the test suite
npm test
# All 80 tests pass

# 6. Type check
npx tsc --noEmit
# Clean — no errors

# 7. Production build
npm run build
# next build succeeds

# 8. Start production server
npm run start
# Serves at http://localhost:3000
```

### Demo Video Script (approximately 3 minutes)
See `DEMO_SCRIPT.md` for the complete three-minute demo narration, screens, and actions.

### Submission Deadline
[Insert deadline — verify with CRC Hacks 2026 organizers]

### Submission Link
[To be filled on Devpost]