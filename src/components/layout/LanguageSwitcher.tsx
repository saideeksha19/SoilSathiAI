"use client";

import { Languages } from "lucide-react";
import { LANGS } from "@/lib/i18n";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { useT } from "@/lib/useT";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { uiLanguage, setUiLanguage } = useWorkspace();
  const { t } = useT();
  return (
    <label className="inline-flex items-center gap-1.5 text-[0.72rem] text-brand-700">
      <Languages className="h-3.5 w-3.5 text-brand-500" aria-hidden />
      <span className={compact ? "sr-only" : "hidden sm:inline"}>{t("note.language")}</span>
      <select
        value={uiLanguage}
        onChange={(e) => setUiLanguage(e.target.value as (typeof LANGS)[number]["id"])}
        className="rounded-lg border border-brand-200 bg-white px-2 py-1 text-[0.72rem] font-medium text-brand-800 focus:border-brand-400 focus:outline-none"
        aria-label={t("note.language")}
      >
        {LANGS.map((l) => (
          <option key={l.id} value={l.id}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
