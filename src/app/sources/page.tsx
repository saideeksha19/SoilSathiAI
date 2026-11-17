"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Droplets, FlaskConical, Link2, ShieldQuestion } from "lucide-react";
import { crops, sourceCatalog } from "@/data/crops";
import { ParameterKey } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout } from "@/components/ui/Callout";
import { VerificationPill } from "@/components/ui/Pills";
import { cropName, paramLabel, rangeLine, waterNeedLabel } from "@/lib/i18n";
import { useT } from "@/lib/useT";

const paramKeys: ParameterKey[] = [
  "pH",
  "nitrogen",
  "phosphorus",
  "potassium",
  "organicCarbon",
  "electricalConductivity",
];

export default function SourcesPage() {
  const { lang, t } = useT();

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow={t("sources.eyebrow")}
        title={t("sources.title")}
        description={t("sources.description")}
        actions={
          <Link href="/compare" className="btn-secondary">
            {t("sources.back")} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        }
      />

      <Callout tone="warning" title={t("sources.legend")}>
        <ul className="space-y-1.5">
          <li className="flex flex-wrap items-center gap-2">
            <VerificationPill status="verified" />
            <span>{t("sources.legend.verified")}</span>
          </li>
          <li className="flex flex-wrap items-center gap-2">
            <VerificationPill status="derived" />
            <span>{t("sources.legend.derived")}</span>
          </li>
          <li className="flex flex-wrap items-center gap-2">
            <VerificationPill status="unverified" />
            <span>{t("sources.legend.unverified")}</span>
          </li>
        </ul>
      </Callout>

      <section className="mt-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-brand-950">
          <BookOpen className="h-4 w-4 text-brand-600" aria-hidden /> {t("sources.catalogue.title")}
        </h2>
        <p className="mt-1 text-[0.8rem] text-brand-600">{t("sources.catalogue.note")}</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {sourceCatalog.map((s) => (
            <article key={s.id} className="card scroll-mt-24 p-4" id={s.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <code className="rounded bg-brand-50 px-1.5 py-0.5 text-[0.68rem] text-brand-700">{s.id}</code>
                <VerificationPill status={s.verification} />
              </div>
              <h3 className="mt-2 text-[0.88rem] font-medium leading-snug text-brand-900">{s.title}</h3>
              <dl className="mt-2 space-y-1.5 text-[0.74rem] leading-relaxed text-brand-700">
                <div>
                  <dt className="inline font-semibold text-brand-600">{t("sources.label.institution")}: </dt>
                  <dd className="inline">{s.institution}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-brand-600">{t("sources.label.year")}: </dt>
                  <dd className="inline">
                    {s.year} · {t(`sources.scope.${s.scope}`)}
                  </dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-brand-600">{t("sources.label.location")}: </dt>
                  <dd className="inline">{s.location}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-brand-600">{t("sources.label.supports")}: </dt>
                  <dd className="inline">{s.supports}</dd>
                </div>
                <div className="rounded-lg bg-amber-50/70 px-2 py-1.5">
                  <dt className="inline font-semibold text-amber-900">{t("sources.label.caveat")}: </dt>
                  <dd className="inline text-amber-900">{s.caveat}</dd>
                </div>
              </dl>
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-[0.74rem] font-medium text-brand-800 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-600"
                >
                  <Link2 className="h-3.5 w-3.5" aria-hidden /> {t("sources.label.openSource")}
                </a>
              ) : (
                <p className="mt-2 text-[0.7rem] text-brand-500">{t("sources.label.noUrl")}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-brand-950">
          <FlaskConical className="h-4 w-4 text-brand-600" aria-hidden /> {t("sources.table.title")}
        </h2>
        <p className="mt-1 text-[0.8rem] text-brand-600">{t("sources.table.note")}</p>
        <div className="card mt-3 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-[0.76rem]">
            <thead>
              <tr className="border-b border-brand-100 bg-brand-50/60 text-[0.62rem] uppercase tracking-wide text-brand-600">
                <th className="px-4 py-2.5 font-semibold">{t("sources.table.crop")}</th>
                {paramKeys.map((k) => (
                  <th key={k} className="px-3 py-2.5 font-semibold">
                    {paramLabel(lang, k)}
                  </th>
                ))}
                <th className="px-4 py-2.5 font-semibold">{t("sources.table.water")}</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((crop) => (
                <tr key={crop.id} className="border-b border-brand-50 align-top last:border-0">
                  <td className="px-4 py-2.5">
                    <span className="block font-medium text-brand-900">{cropName(lang, crop.id)}</span>
                    <span className="block text-[0.66rem] italic text-brand-400">{crop.scientificName}</span>
                  </td>
                  {paramKeys.map((k) => {
                    const range = crop.ranges[k];
                    return (
                      <td key={k} className="px-3 py-2.5 text-brand-700">
                        {range ? (
                          <>
                            <span className="block tabular-nums">{rangeLine(lang, range)}</span>
                            <span className="mt-1 flex flex-wrap items-center gap-1">
                              <VerificationPill status={range.provenance.status} />
                              <Link
                                href={`/sources#${range.provenance.sourceId}`}
                                className="text-[0.64rem] text-brand-500 hover:underline"
                              >
                                {range.provenance.sourceId}
                              </Link>
                            </span>
                          </>
                        ) : (
                          <span className="text-brand-400">{t("label.notUsed")}</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-start gap-1 text-brand-700">
                      <Droplets className="mt-0.5 h-3 w-3 shrink-0 text-brand-400" aria-hidden />
                      <span>
                        {waterNeedLabel(lang, crop.waterNeed)}
                        <span className="mt-1 block">
                          <VerificationPill status={crop.waterProvenance.status} />
                        </span>
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-brand-950">
            <ShieldQuestion className="h-4 w-4 text-brand-600" aria-hidden /> {t("sources.method.title")}
          </h2>
          <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-[0.8rem] leading-relaxed text-brand-700">
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n}>{t(`sources.method.${n}`)}</li>
            ))}
          </ol>
        </div>
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-brand-950">{t("sources.gaps.title")}</h2>
          <p className="mt-1 text-[0.74rem] text-brand-500">{t("sources.gaps.note")}</p>
          <ul className="mt-2 space-y-1.5 text-[0.8rem] leading-relaxed text-brand-700">
            {[1, 2, 3, 4].map((n) => (
              <li key={n}>{t(`sources.gaps.item${n}`)}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href="/analyzer" className="btn-primary">
          {t("sources.start")} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link href="/compare" className="btn-secondary">
          {t("sources.compare")}
        </Link>
      </div>
    </div>
  );
}
