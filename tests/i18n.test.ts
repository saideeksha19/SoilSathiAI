import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { messages, t } from "@/lib/i18n";

const DEVANAGARI = /[\u0900-\u097F]/;
const KANNADA = /[\u0C80-\u0CFF]/;
const LATIN_WORD = /[A-Za-z]{3,}/;

const entries = Object.entries(messages);

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) sourceFiles(full, out);
    else if (/\.(ts|tsx)$/.test(item.name)) out.push(full);
  }
  return out;
}

describe("message dictionary", () => {
  it("has a substantial dictionary", () => {
    expect(entries.length).toBeGreaterThan(200);
  });

  it("fills every language for every key", () => {
    for (const [key, entry] of entries) {
      expect(entry.en.trim().length, `${key}.en`).toBeGreaterThan(0);
      expect(entry.kn.trim().length, `${key}.kn`).toBeGreaterThan(0);
      expect(entry.hi.trim().length, `${key}.hi`).toBeGreaterThan(0);
    }
  });

  it("keeps Kannada in Kannada script (no Devanagari contamination)", () => {
    const contaminated = entries
      .filter(([, entry]) => DEVANAGARI.test(entry.kn))
      .map(([key, entry]) => `${key}: ${entry.kn}`);
    expect(contaminated).toEqual([]);
  });

  it("keeps Hindi in Devanagari (no Kannada contamination)", () => {
    const contaminated = entries
      .filter(([, entry]) => KANNADA.test(entry.hi))
      .map(([key, entry]) => `${key}: ${entry.hi}`);
    expect(contaminated).toEqual([]);
  });

  it("uses the same placeholders in all three languages", () => {
    const placeholders = (value: string) => (value.match(/\{\w+\}/g) ?? []).sort().join(",");
    for (const [key, entry] of entries) {
      expect(placeholders(entry.kn), `${key}.kn`).toBe(placeholders(entry.en));
      expect(placeholders(entry.hi), `${key}.hi`).toBe(placeholders(entry.en));
    }
  });

  it("translates prose keys rather than repeating the English text", () => {
    const untranslated = entries
      .filter(([, entry]) => {
        const proseEnglish = (entry.en.match(/[A-Za-z]{3,}/g) ?? []).length >= 3;
        return proseEnglish && entry.kn === entry.en && entry.hi === entry.en;
      })
      .map(([key]) => key);
    expect(untranslated).toEqual([]);
  });

  it("does not leave English sentences inside Kannada or Hindi strings", () => {
    // Placeholders such as {min} are identifiers, not prose; strip them before counting.
    // File formats, product names and acronyms are shared vocabulary, not untranslated prose.
    const SHARED = new Set(["Gemini", "SoilSathi", "KVK", "ICAR", "FAO", "TNAU", "Excel"]);
    const latinWords = (value: string) =>
      (value.replace(/\{\w+\}/g, " ").match(/[A-Za-z]{3,}/g) ?? []).filter(
        (word) => !SHARED.has(word) && word !== word.toUpperCase()
      ).length;
    const leaking = entries
      .filter(([, entry]) => {
        if (latinWords(entry.en) < 4) return false;
        return latinWords(entry.kn) > 2 || latinWords(entry.hi) > 2;
      })
      .map(([key]) => key);
    expect(leaking).toEqual([]);
  });

  it("returns the key itself only when it is genuinely missing", () => {
    expect(t("en", "nav.report")).not.toBe("nav.report");
    expect(t("kn", "nav.report")).toMatch(KANNADA);
    expect(t("hi", "nav.report")).toMatch(DEVANAGARI);
  });
});

describe("translation coverage of the screens", () => {
  it("defines every t(\"...\") key used in the app", () => {
    const root = path.resolve(process.cwd(), "src");
    const used = new Set<string>();
    const pattern = /\bt\(\s*"([a-zA-Z][\w.]*)"/g;
    for (const file of sourceFiles(root)) {
      const text = fs.readFileSync(file, "utf8");
      let match: RegExpExecArray | null = pattern.exec(text);
      while (match !== null) {
        used.add(match[1]);
        match = pattern.exec(text);
      }
      pattern.lastIndex = 0;
    }
    const missing = Array.from(used)
      .filter((key) => !(key in messages))
      .sort();
    expect(missing).toEqual([]);
    expect(used.size).toBeGreaterThan(150);
  });

  it("has no English-only entries left in the parameter labels", () => {
    const keys = entries.map(([key]) => key).filter((key) => key.startsWith("param."));
    expect(keys.length).toBeGreaterThanOrEqual(6);
    for (const key of keys) {
      expect(messages[key].kn, key).toMatch(KANNADA);
      expect(messages[key].hi, key).toMatch(DEVANAGARI);
    }
  });

  it("translates every assessment, warning and verification code", () => {
    const prefixes = ["assess.", "warn.", "note.", "verification.", "status.", "suitability.", "confidence.", "extract.warn."];
    for (const [key, entry] of entries) {
      if (!prefixes.some((p) => key.startsWith(p))) continue;
      if (key === "note.language") continue;
      if (LATIN_WORD.test(entry.kn) && !KANNADA.test(entry.kn)) {
        throw new Error(`Kannada missing for ${key}`);
      }
      if (LATIN_WORD.test(entry.hi) && !DEVANAGARI.test(entry.hi)) {
        throw new Error(`Hindi missing for ${key}`);
      }
    }
  });
});
