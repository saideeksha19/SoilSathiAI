import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { explanationSchema } from "@/lib/aiSchemas";
import { buildDeterministicExplanation } from "@/lib/explain";
import { sourceCatalog } from "@/data/crops";
import { ExplanationRequest } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ExplanationRequest;
    const language = body?.language ?? "en";
    if (!body?.soil || !Array.isArray(body?.evaluations)) {
      return NextResponse.json({ error: "Invalid request: soil and evaluations are required." }, { status: 400 });
    }
    const fallback = () => buildDeterministicExplanation(body);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ...fallback(), error: "GEMINI_API_KEY not configured; showing deterministic explanation." });
    }

    const langName = language === "kn" ? "Kannada" : language === "hi" ? "Hindi" : "English";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an agricultural explanation assistant. Using ONLY the provided validated soil measurements, deterministic evaluation results, crop-reference limitations, and missing information, explain the results in ${langName}.
Return ONLY valid JSON:
{
  "summary": string,
  "keyFindings": string[],
  "questionsForExpert": string[],
  "additionalTests": string[],
  "disclaimer": string
}
Rules:
- Do NOT invent soil measurements, research, citations, fertilizer doses, or yield/profit guarantees.
- Do NOT override deterministic suitability results; explain them.
- Clearly mention missing information and uncertainty.
- Encourage consulting qualified local agricultural experts before major decisions.
- Keep advice practical and evidence-bounded.

INPUT JSON:
${JSON.stringify({ soil: body.soil, evaluations: body.evaluations, sources: sourceCatalog, scenarioLabel: body.scenarioLabel ?? "Actual measured scenario" }).slice(0, 18000)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
      }, { signal: controller.signal });
      const out = result.response.text();
      const json = JSON.parse(out);
      const parsed = explanationSchema.safeParse(json);
      if (!parsed.success) {
        return NextResponse.json({ ...fallback(), error: "AI explanation response was invalid; showing deterministic explanation." });
      }
      return NextResponse.json({ language, ...parsed.data, usedAi: true });
    } finally {
      clearTimeout(timeout);
    }
  } catch (e: unknown) {
    try {
      const body = (await req.clone().json()) as ExplanationRequest;
      const fb = buildDeterministicExplanation(body);
      const aborted = e instanceof Error && e.name === "AbortError";
      return NextResponse.json({
        ...fb,
        error: aborted
          ? "AI explanation timed out; showing deterministic explanation."
          : "AI explanation failed; showing deterministic explanation.",
      });
    } catch {
      return NextResponse.json({ error: "Explanation failed." }, { status: 500 });
    }
  }
}
