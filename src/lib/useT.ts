"use client";

import { useCallback } from "react";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { Lang, t as translate } from "./i18n";

/** Bound translator for the selected UI language, plus the language itself. */
export function useT(): { lang: Lang; t: (key: string, params?: Record<string, string | number>) => string } {
  const { uiLanguage } = useWorkspace();
  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(uiLanguage, key, params),
    [uiLanguage]
  );
  return { lang: uiLanguage, t };
}
