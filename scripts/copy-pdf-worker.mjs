import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const source = join(process.cwd(), "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs");
const target = join(process.cwd(), "public", "pdf.worker.min.mjs");
if (!existsSync(source)) {
  console.warn("[copy-pdf-worker] pdfjs-dist worker not found; PDF text extraction may be unavailable.");
  process.exit(0);
}
mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
console.log("[copy-pdf-worker] copied pdf.worker.min.mjs to public/");
