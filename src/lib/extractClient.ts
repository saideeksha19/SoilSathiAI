import { SoilReport } from "./types";

export const MAX_FILE_BYTES = 12 * 1024 * 1024;

export class ExtractionError extends Error {
  missingApiKey: boolean;
  /** Server-provided reason code; the screens translate it, so no English leaks into KN/HI. */
  code?: string;
  constructor(message: string, missingApiKey = false, code?: string) {
    super(message);
    this.name = "ExtractionError";
    this.missingApiKey = missingApiKey;
    this.code = code;
  }
}

/** Extracts selectable text from a PDF in the browser using PDF.js.
 * Scanned PDFs have no text layer and return an empty string. */
export async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer), isEvalSupported: false }).promise;
  const pageTexts: string[] = [];
  const pageLimit = Math.min(doc.numPages, 12);
  for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber += 1) {
    const page = await doc.getPage(pageNumber);
    const content = await page.getTextContent();
    let lastY: number | null = null;
    const lines: string[] = [];
    for (const item of content.items) {
      if (!("str" in item)) continue;
      const y = Array.isArray(item.transform) ? Math.round(item.transform[5]) : null;
      if (lastY !== null && y !== null && Math.abs(y - lastY) > 3) lines.push("\n");
      lines.push(item.str, " ");
      lastY = y;
    }
    pageTexts.push(lines.join("").replace(/[ \t]+/g, " ").trim());
  }
  await doc.destroy();
  return pageTexts.join("\n\n").trim();
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("The image could not be read from disk."));
    reader.readAsDataURL(file);
  });
}

export async function requestExtraction(input: {
  text?: string;
  image?: { data: string; mimeType: string };
}): Promise<SoilReport> {
  const res = await fetch("/api/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await res.json().catch(() => null)) as
    | { soil?: SoilReport; error?: string; code?: string; missingApiKey?: boolean }
    | null;
  if (!res.ok || !data?.soil) {
    throw new ExtractionError(
      data?.error ?? `Extraction failed (HTTP ${res.status}).`,
      Boolean(data?.missingApiKey),
      data?.code ?? (res.status === 504 ? "extract.timeout" : "extract.failed")
    );
  }
  return data.soil;
}
