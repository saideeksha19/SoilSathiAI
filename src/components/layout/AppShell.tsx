"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { SiteFooter } from "./SiteFooter";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { navItems } from "./navItems";
import { useT } from "@/lib/useT";

const navKeyByHref: Record<string, string> = {
  "/": "nav.home",
  "/analyzer": "nav.analyzer",
  "/analysis": "nav.analysis",
  "/compare": "nav.compare",
  "/simulator": "nav.simulator",
  "/explain": "nav.explain",
  "/report": "nav.report",
  "/sources": "nav.sources",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { soil } = useWorkspace();
  const { lang, t } = useT();

  // Keep the document language in step with the chosen UI language so screen readers
  // and browser font/segmentation rules use the right script.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="flex min-h-screen flex-col bg-soil-50">
      <header className="no-print sticky top-0 z-40 border-b border-brand-100/80 bg-soil-50/95 backdrop-blur">
        <div className="container-page flex h-[70px] items-center justify-between gap-4">
          <Wordmark />
          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
            {navItems.slice(1).map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-2.5 py-2 text-[0.78rem] font-medium transition ${
                    active ? "bg-brand-100 text-brand-900" : "text-brand-700 hover:bg-brand-50 hover:text-brand-900"
                  }`}
                >
                  {t(navKeyByHref[item.href] ?? "nav.home")}
                </Link>
              );
            })}
          </nav>
          <div className="hidden items-center gap-3 xl:flex">
            <LanguageSwitcher />
            <span className={`badge ${soil ? "bg-brand-100 text-brand-800" : "bg-stone-100 text-stone-600"}`}>
              {soil ? t("shell.reportLoaded") : t("shell.noReport")}
            </span>
            <Link href="/analyzer" className="btn-primary">
              {t("shell.start")}
            </Link>
          </div>
          <button
            type="button"
            className="rounded-lg border border-brand-200 p-2 text-brand-900 xl:hidden"
            aria-label={open ? t("shell.menuClose") : t("shell.menuOpen")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open ? (
          <div className="border-t border-brand-100 bg-white px-4 pb-4 pt-2 xl:hidden">
            <div className="mb-2 flex items-center justify-between gap-2 px-2 pt-2">
              <LanguageSwitcher compact />
              <Link href="/analyzer" className="btn-primary" onClick={() => setOpen(false)}>
                {t("shell.start")}
              </Link>
            </div>
            <nav className="grid gap-1" aria-label="Mobile">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                      active ? "bg-brand-100 text-brand-900" : "text-brand-800 hover:bg-brand-50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" aria-hidden />
                    {t(navKeyByHref[item.href] ?? "nav.home")}
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : null}
      </header>

      <main className="flex-1">{children}</main>

      <SiteFooter />
    </div>
  );
}
