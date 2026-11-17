"use client";

import { Wordmark } from "@/components/brand/Wordmark";
import { useT } from "@/lib/useT";

export function SiteFooter() {
  const { t } = useT();
  return (
    <footer className="no-print mt-16 border-t border-brand-100 bg-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-3">
        <div>
          <Wordmark compact />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-brand-700">{t("footer.tagline")}</p>
        </div>
        <div className="text-sm text-brand-700">
          <p className="mb-2 font-semibold text-brand-900">{t("footer.responsible.title")}</p>
          <p className="leading-relaxed">{t("footer.responsible.body")}</p>
        </div>
        <div className="text-sm text-brand-700">
          <p className="mb-2 font-semibold text-brand-900">{t("footer.transparency.title")}</p>
          <p className="leading-relaxed">{t("footer.transparency.body")}</p>
          <p className="mt-3 text-xs text-brand-500">{t("footer.sourcesNote")}</p>
        </div>
      </div>
    </footer>
  );
}
