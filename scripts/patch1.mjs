import { readFileSync, writeFileSync } from "node:fs";

const soilPath = "src/lib/soil.ts";
let soil = readFileSync(soilPath, "utf8");
soil = soil.replace(
  "  partial: Partial<Record<ParameterKey, Partial<SoilMeasurement>>> & Partial<SoilReport>,",
  '  partial: Partial<Record<ParameterKey, Partial<SoilMeasurement>>> &\n    Partial<Pick<SoilReport, "texture" | "moisture" | "location" | "sampleId" | "rawText" | "warnings">>,'
);
writeFileSync(soilPath, soil);

const explainPath = "src/lib/explain.ts";
let explain = readFileSync(explainPath, "utf8");
explain = explain.replace("  } as const;", "  };");
explain = explain.replace(
  "    questionsForExpert: b.questionsForExpert,\n    additionalTests: b.additionalTests,",
  "    questionsForExpert: [...b.questionsForExpert],\n    additionalTests: [...b.additionalTests],"
);
writeFileSync(explainPath, explain);
console.log("patched");
