import { Suspense } from "react";
import { AnalyzerClient } from "@/components/sections/AnalyzerClient";

export const metadata = {
  title: "Soil report analyzer",
};

export default function AnalyzerPage() {
  return (
    <Suspense
      fallback={<div className="container-page py-16 text-sm text-brand-600">Preparing the soil analyzer…</div>}
    >
      <AnalyzerClient />
    </Suspense>
  );
}
