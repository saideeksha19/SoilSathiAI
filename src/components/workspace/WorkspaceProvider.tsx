"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SoilReport, ExplanationResponse } from "@/lib/types";
import { SoilMeasurement } from "@/lib/types";
import { ScenarioOverrides, WaterAvailability } from "@/lib/simulation";

const STORAGE_KEY = "soilsathi.workspace.v1";
export type Language = "en" | "kn" | "hi";

interface WorkspaceState {
  soil: SoilReport | null;
  uiLanguage: Language;
  origin: SoilMeasurement["source"] | null;
  selectedCrops: string[];
  waterAvailability: WaterAvailability | undefined;
  explanations: Partial<Record<Language, ExplanationResponse>>;
  scenario: ScenarioOverrides | null;
  scenarioUpdatedAt: string | null;
}

const initialState: WorkspaceState = {
  soil: null,
  uiLanguage: "en",
  origin: null,
  selectedCrops: ["ragi", "groundnut", "rice", "maize", "sorghum", "chickpea"],
  waterAvailability: undefined,
  explanations: {},
  scenario: null,
  scenarioUpdatedAt: null,
};

interface WorkspaceContextValue extends WorkspaceState {
  hydrated: boolean;
  setSoil: (soil: SoilReport, origin: SoilMeasurement["source"]) => void;
  setSelectedCrops: (ids: string[]) => void;
  setWaterAvailability: (w: WaterAvailability | undefined) => void;
  setExplanation: (language: Language, explanation: ExplanationResponse) => void;
  setScenario: (scenario: ScenarioOverrides | null) => void;
  setUiLanguage: (lang: Language) => void;
  clearWorkspace: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkspaceState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<WorkspaceState>;
        setState({
          ...initialState,
          ...parsed,
          explanations: parsed.explanations ?? {},
        });
      }
    } catch {
      // Corrupted or unavailable storage: fall back to a clean workspace.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage may be full or blocked; the in-memory workspace still works.
    }
  }, [state, hydrated]);

  const setSoil = useCallback((soil: SoilReport, origin: SoilMeasurement["source"]) => {
    setState((prev) => ({ ...prev, soil, origin, explanations: {}, scenario: null, scenarioUpdatedAt: null }));
  }, []);

  const setSelectedCrops = useCallback((ids: string[]) => {
    setState((prev) => ({ ...prev, selectedCrops: ids }));
  }, []);

  const setWaterAvailability = useCallback((w: WaterAvailability | undefined) => {
    setState((prev) => ({ ...prev, waterAvailability: w }));
  }, []);

  const setExplanation = useCallback((language: Language, explanation: ExplanationResponse) => {
    setState((prev) => ({ ...prev, explanations: { ...prev.explanations, [language]: explanation } }));
  }, []);

  const setUiLanguage = useCallback((uiLanguage: Language) => {
    setState((prev) => ({ ...prev, uiLanguage }));
  }, []);

  const setScenario = useCallback((scenario: ScenarioOverrides | null) => {
    setState((prev) => ({ ...prev, scenario, scenarioUpdatedAt: scenario ? new Date().toISOString() : null }));
  }, []);

  const clearWorkspace = useCallback(() => {
    setState({ ...initialState, explanations: {} });
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      ...state,
      hydrated,
      setSoil,
      setSelectedCrops,
      setWaterAvailability,
      setExplanation,
      setScenario,
      setUiLanguage,
      clearWorkspace,
    }),
    [
      state,
      hydrated,
      setSoil,
      setSelectedCrops,
      setWaterAvailability,
      setExplanation,
      setScenario,
      setUiLanguage,
      clearWorkspace,
    ]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}
