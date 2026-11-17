"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Ban,
  Droplets,
  FlaskConical,
  GitCompareArrows,
  Leaf,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
} from "lucide-react";
import { Reveal } from "@/components/home/Reveal";

const heroDescription =
  "SoilSathi AI reads a soil test report, validates every measurement, and screens it against a documented crop reference dataset. It shows you the constraints, tells you what data is missing, and lets you test decisions before you commit a season to them.";

const workflow = [
  {
    number: 1,
    title: "Upload Soil Report",
    icon: Upload,
    body: "Upload a soil test PDF or photo, type numbers yourself, or open the labelled synthetic sample. Every value keeps its original unit and source.",
  },
  {
    number: 2,
    title: "Analyze Measurements",
    icon: Droplets,
    body: "Values are range-checked and converted to consistent units. Missing parameters stay visibly missing, and low-confidence values are flagged for review.",
  },
  {
    number: 3,
    title: "Compare Crops",
    icon: GitCompareArrows,
    body: "Each crop is compared against its own documented ranges. You see which parameters help, which constrain, and what the dataset cannot know.",
  },
  {
    number: 4,
    title: "Simulate Scenarios",
    icon: SlidersHorizontal,
    body: "Change pH, a nutrient, or your declared water availability and watch the constraints move. Simulations are labelled hypothetical everywhere.",
  },
];

const features = [
  {
    title: "Soil Report Analysis",
    icon: Leaf,
    body: "Comprehensive analysis of soil reports with expert insights.",
    href: "/analyzer",
    cta: "Open the analyzer",
  },
  {
    title: "Soil Intelligence",
    icon: ShieldCheck,
    body: "Smart recommendations based on soil data and crop requirements.",
    href: "/analysis",
    cta: "Read soil intelligence",
  },
  {
    title: "Crop Comparison",
    icon: GitCompareArrows,
    body: "Compare different crops' suitability for your soil conditions.",
    href: "/compare",
    cta: "Compare crops",
  },
  {
    title: "What-If Simulation",
    icon: SlidersHorizontal,
    body: "Run scenarios and generate hypothetical reports.",
    href: "/simulator",
    cta: "Open the simulator",
  },
];

const previews = [
  {
    title: "Soil Report Analysis",
    icon: Leaf,
    bars: [42, 68, 54, 80, 62, 91],
  },
  {
    title: "Soil Intelligence",
    icon: ShieldCheck,
    bars: [76, 58, 84, 46, 70, 64],
  },
  {
    title: "Crop Comparison",
    icon: GitCompareArrows,
    bars: [88, 52, 66, 74, 48, 82],
  },
  {
    title: "What-If Simulation",
    icon: SlidersHorizontal,
    bars: [34, 72, 58, 86, 54, 76],
  },
];

const transparency = [
  {
    title: "Verified reference data",
    icon: BadgeCheck,
    body: "Reference ranges are separated from the calculation code and documented in SOURCES.md, with verification status shown honestly rather than assumed.",
  },
  {
    title: "Hypothetical simulations",
    icon: FlaskConical,
    body: "Simulations are clearly labelled hypothetical everywhere and support rather than replace local agricultural expertise.",
  },
  {
    title: "No yield guarantees",
    icon: Ban,
    body: "This app does not guarantee yield or prescribe fertilizer doses. Confirm major decisions with local agricultural experts.",
  },
];

const sampleValues = [
  { label: "pH", value: "6.4", note: "slightly acidic" },
  { label: "N", value: "180 mg/kg", note: "reported" },
  { label: "P", value: "11 mg/kg", note: "low" },
  { label: "K", value: "140 mg/kg", note: "reported" },
];

function WorkflowConnector() {
  return (
    <div className="flex items-center justify-center py-2.5 lg:py-0 lg:px-1" aria-hidden>
      <div className="flex flex-col items-center lg:hidden">
        <span className="h-5 w-px bg-brand-300" />
        <ArrowDown className="h-5 w-5 text-brand-500" />
      </div>
      <div className="hidden items-center lg:flex">
        <span className="h-px w-2.5 bg-brand-300 xl:w-3.5" />
        <span className="mx-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-white shadow-sm">
          <ArrowRight className="h-4 w-4 text-brand-600" />
        </span>
        <span className="h-px w-2.5 bg-brand-300 xl:w-3.5" />
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Reveal className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-950 sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-relaxed text-brand-700">{description}</p>
    </Reveal>
  );
}

export default function Page() {
  return (
    <div className="bg-soil-50">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-brand-100/70 bg-gradient-to-b from-brand-50 via-soil-50 to-soil-50">
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-accent-400/10 blur-3xl"
          aria-hidden
        />

        <div className="container-page relative grid items-center gap-10 py-12 lg:grid-cols-[1.02fr_1fr] lg:gap-16 lg:py-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-brand-600">
              <Leaf className="h-3.5 w-3.5" aria-hidden />
              Intelligent farm decision engine
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-brand-950 sm:text-5xl lg:text-6xl">
              Understand Your Soil.
              <span className="mt-2 block text-brand-600">Grow With Confidence.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-700 sm:text-lg">
              {heroDescription}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/analyzer"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-800 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                Explore SoilSathi AI
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-900 transition hover:border-brand-300 hover:bg-brand-50"
              >
                How It Works
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-1 gap-3 text-sm text-brand-700 sm:grid-cols-3">
              <div className="flex items-start gap-2">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />
                <dt className="leading-snug">Documented reference ranges</dt>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />
                <dt className="leading-snug">Deterministic, unit-tested engine</dt>
              </div>
              <div className="flex items-start gap-2">
                <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />
                <dt className="leading-snug">Simulations always labelled</dt>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={120}>
            <figure className="relative mx-auto w-full max-w-2xl">
              <div
                className="absolute -inset-5 -z-10 rounded-[2.75rem] bg-brand-300/25 blur-2xl"
                aria-hidden
              />
              <div className="rounded-[2rem] border border-brand-100 bg-white p-2 shadow-[0_28px_70px_-30px_rgba(20,35,22,0.45)] sm:p-2.5">
                <div className="overflow-hidden rounded-[1.6rem] bg-brand-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/soil-hero.png"
                    alt="Cross-section of healthy soil showing crop roots and illustrative pH and nutrient readings"
                    width={1337}
                    height={746}
                    className="aspect-[1337/746] h-auto w-full object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-4 text-center text-xs leading-relaxed text-brand-600">
                Illustrative visual — the pH and nutrient cards shown inside the image are not
                laboratory results.
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* Illustrative sample values */}
        <div className="container-page relative pb-14 lg:pb-20">
          <Reveal delay={80}>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-brand-500">
              Illustrative sample values
            </p>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {sampleValues.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-brand-100 bg-white/90 px-4 py-4 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-200"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                    {item.label}
                  </dt>
                  <dd className="mt-1.5 text-2xl font-bold tracking-tight text-brand-950">
                    {item.value}
                  </dd>
                  <dd className="text-xs text-brand-600">{item.note}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="scroll-mt-24 bg-white py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="From report to decision in four steps"
            description="A single connected path. Every value stays tagged as measured, entered, estimated, or hypothetical."
          />

          <div className="mt-12 grid gap-0 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
            {workflow.map((step, index) => (
              <div key={step.title} className="contents">
                <Reveal delay={index * 110} className="h-full">
                  <article className="group relative flex h-full flex-col rounded-2xl border border-brand-100 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-800 text-sm font-semibold text-white ring-4 ring-brand-50">
                        {step.number}
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
                        <step.icon className="h-5 w-5" aria-hidden />
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight text-brand-950">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-brand-700">{step.body}</p>
                  </article>
                </Reveal>
                {index < workflow.length - 1 ? <WorkflowConnector /> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-soil-50 py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Features"
            title="Built for decisions, not impressions"
            description="Four linked tools that keep the evidence visible at every stage of a cropping decision."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 90} className="h-full">
                <Link
                  href={feature.href}
                  className="group flex h-full flex-col rounded-2xl border border-brand-100 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
                    <feature.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-base font-semibold tracking-tight text-brand-950">
                    {feature.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-700">{feature.body}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
                    {feature.cta}
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUCT PREVIEW ================= */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Product preview"
            title="A closer look at the workspace"
            description="Sample screens from the decision workflow, shown with illustrative values only."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {previews.map((preview, index) => (
              <Reveal key={preview.title} delay={index * 90} className="h-full">
                <figure className="flex h-full flex-col rounded-2xl border border-brand-100 bg-soil-50/70 p-4 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
                  <div className="rounded-xl border border-brand-100 bg-white p-3">
                    <div className="flex items-center justify-between">
                      <span className="h-2 w-16 rounded-full bg-brand-200" />
                      <span className="h-2 w-6 rounded-full bg-brand-100" />
                    </div>
                    <div className="mt-3 flex h-16 items-end gap-1.5" aria-hidden>
                      {preview.bars.map((height, barIndex) => (
                        <span
                          key={barIndex}
                          className="flex-1 rounded-t bg-gradient-to-t from-brand-200 to-brand-500/80"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-1.5" aria-hidden>
                      <span className="h-2 rounded-full bg-brand-100" />
                      <span className="h-2 rounded-full bg-brand-100" />
                      <span className="h-2 rounded-full bg-brand-100" />
                    </div>
                  </div>

                  <figcaption className="mt-4 flex flex-1 flex-col">
                    <span className="flex items-center gap-2 text-sm font-semibold text-brand-950">
                      <preview.icon className="h-4 w-4 text-brand-500" aria-hidden />
                      {preview.title}
                    </span>
                    <span className="mt-2 text-xs leading-relaxed text-brand-600">
                      Illustrative preview only · Values do not represent laboratory results.
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TRUST AND TRANSPARENCY ================= */}
      <section className="bg-brand-950 py-16 text-brand-50 sm:py-24">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
              Trust and transparency
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              What SoilSathi AI will not do
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-200">
              Verified and indicative data are kept visibly distinct, and every recommendation
              states its limits.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {transparency.map((item, index) => (
              <Reveal key={item.title} delay={index * 100} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-300 hover:border-white/20 hover:bg-white/10">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-brand-200">
                    <item.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-brand-200">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 to-brand-900 py-16 text-center sm:py-24">
        <div
          className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-accent-400/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl"
          aria-hidden
        />
        <Reveal className="container-page relative">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Your Soil Has a Story. Let&rsquo;s Understand It.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-brand-100 sm:text-lg">
              Start with a report, review every measurement, and see which crops your soil can
              realistically support.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/analyzer"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-brand-900 shadow-soft transition hover:bg-brand-50 hover:shadow-lg"
              >
                Explore SoilSathi AI
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href="/sources"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Read the reference basis
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
