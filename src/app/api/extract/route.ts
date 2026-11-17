import { NextResponse } from "next/server";
import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import { EXTRACTION_WARNING_CODES, extractedSoilSchema } from "@/lib/aiSchemas";
import { normalizeSoilReport } from "@/lib/soil";

export const runtime = "nodejs";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;
const MAX_BASE64_CHARS = 18_000_000;

type ExtractionErrorCode =
  | "extract.noInput"
  | "extract.missingKey"
  | "extract.imageType"
  | "extract.imageTooLarge"
  | "extract.invalidShape"
  | "extract.timeout"
  | "extract.failed";

function fail(code: ExtractionErrorCode, message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ code, error: message, ...extra }, { status });
}

const PROMPT = `You extract soil test measurements from a laboratory report. Return ONLY valid JSON (no markdown) with this shape:
{
  "pH": {"value": number|null, "unit": "pH"|null, "confidence": "high"|"medium"|"low"},
  "nitrogen": {"value": number|null, "unit": "mg/kg"| "kg/ha"|null, "confidence": "high"|"medium"|"low"},
  "phosphorus": {"value": number|null, "unit": "mg/kg"| "kg/ha"|null, "confidence": "high"|"medium"|"low"},
  "potassium": {"value": number|null, "unit": "mg/kg"| "kg/ha"|null, "confidence": "high"|"medium"|"low"},
  "organicCarbon": {"value": number|null, "unit": "%"|null, "confidence": "high"|"medium"|"low"},
  "electricalConductivity": {"value": number|null, "unit": "dS/m"|null, "confidence": "high"|"medium"|"low"},
  "texture": string|null,
  "moisture": string|null,
  "location": string|null,
  "sampleId": string|null,
  "warnings": string[],
  "overallConfidence": "high"|"medium"|"low"
}
Rules:
- Do NOT invent values. If a parameter is not explicitly present, set value to null and lower confidence.
- Preserve the reported unit when it is clear; if it is unclear, set unit to null and add the warning code "unit-unclear".
- "warnings" may only contain these codes: ${EXTRACTION_WARNING_CODES.map((c) => `"${c}"`).join(", ")}.
  Use "illegible" for unreadable fields, "multiple-values" when a parameter is reported more than once, "low-confidence" for uncertain readings.
- Never write prose, explanations, or recommendations inside the JSON.`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const text = typeof body?.text === "string" ? body.text.slice(0, 20000) : "";
    const image = body?.image as { data?: unknown; mimeType?: unknown } | undefined;

    const hasText = text.trim().length > 0;
    const hasImage = Boolean(image && typeof image.data === "string" && image.data.length > 0);

    if (!hasText && !hasImage) {
      return fail(
        "extract.noInput",
        "No text or image was provided for extraction. Upload a readable file, paste text, or use manual entry.",
        400
      );
    }

    if (hasImage) {
      const mime = String(image?.mimeType ?? "");
      if (!ALLOWED_IMAGE_TYPES.includes(mime as (typeof ALLOWED_IMAGE_TYPES)[number])) {
        return fail("extract.imageType", "Unsupported image type. Use PNG, JPEG, or WEBP.", 415);
      }
      if (String(image?.data).length > MAX_BASE64_CHARS) {
        return fail("extract.imageTooLarge", "The image is too large to process. Use a smaller image.", 413);
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return fail(
        "extract.missingKey",
        "GEMINI_API_KEY is not configured on the server. Use manual entry or load the sample report.",
        503,
        { missingApiKey: true }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = hasImage
      ? `${PROMPT}\n\nThe report is provided as an image. Read only what is legible in the image.`
      : `${PROMPT}\n\nReport text:\n"""${text}"""`;

    const parts: Part[] = [{ text: prompt }];
    if (hasImage) {
      parts.push({ inlineData: { data: String(image?.data), mimeType: String(image?.mimeType) } });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const result = await model.generateContent(
        { contents: [{ role: "user", parts }], generationConfig: { temperature: 0.1, responseMimeType: "application/json" } },
        { signal: controller.signal }
      );
      const out = result.response.text();
      let json: unknown;
      try {
        json = JSON.parse(out);
      } catch {
        return fail("extract.invalidShape", "The extraction response was not valid JSON. Please review manually.", 422);
      }
      const parsed = extractedSoilSchema.safeParse(json);
      if (!parsed.success) {
        return fail("extract.invalidShape", "The extraction response did not match the expected structure.", 422);
      }
      const warningCodes = (parsed.data.warnings ?? [])
        .map((w) => w.trim())
        .filter((w) => (EXTRACTION_WARNING_CODES as readonly string[]).includes(w))
        .map((code) => ({ code: `extract.warn.${code}` }));
      const soil = normalizeSoilReport(
        {
          ...parsed.data,
          rawText: hasText ? text : null,
          warnings: [],
          warningCodes: [{ code: "warn.aiExtracted" }, ...warningCodes],
        },
        "extracted"
      );
      return NextResponse.json({ soil, usedAi: true });
    } finally {
      clearTimeout(timeout);
    }
  } catch (e: unknown) {
    const aborted = e instanceof Error && e.name === "AbortError";
    if (aborted) {
      return fail("extract.timeout", "Extraction timed out. Try a shorter document or use manual entry.", 504);
    }
    return fail("extract.failed", "Extraction failed on the server. Use manual entry or load the sample report.", 500);
  }
}
