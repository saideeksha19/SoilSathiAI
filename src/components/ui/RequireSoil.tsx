"use client";

import { EmptyState } from "./EmptyState";
import { useT } from "@/lib/useT";

export function RequireSoil({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/** Named with its purpose already translated: pass the caller's translated label. */
export function NoSoilNotice({ purpose }: { purpose: string }) {
  const { t } = useT();
  return (
    <EmptyState
      title={t("empty.title")}
      description={t("empty.body", { purpose })}
      action={{ href: "/analyzer", label: t("empty.action") }}
    />
  );
}
