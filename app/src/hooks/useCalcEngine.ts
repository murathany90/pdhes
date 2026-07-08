import { useEffect, useMemo, useState } from 'react';
import type { Site } from '../types/site';
import { calculateScenario, type CalcScenario } from '../utils/calculateScenario';

export type { CalcScenario } from '../utils/calculateScenario';

export const CALC_SCENARIO_STORAGE_KEY = 'pspp-calc-scenario-v1';

const DEFAULT_SCENARIO: CalcScenario = {
  activeVolumeHm3: 10,
  capexFactor: 1,
  revenueFactor: 1,
  cycles: 300,
  reservePremium: 18,
};

function readScenario(): CalcScenario {
  try {
    const parsed = JSON.parse(localStorage.getItem(CALC_SCENARIO_STORAGE_KEY) || '');
    const keys: Array<keyof CalcScenario> = ['activeVolumeHm3', 'capexFactor', 'revenueFactor', 'cycles', 'reservePremium'];
    if (keys.every((key) => Number.isFinite(parsed[key]))) {
      return parsed as CalcScenario;
    }
  } catch {
    // Invalid or unavailable local data falls back to documented defaults.
  }
  return DEFAULT_SCENARIO;
}

export function useCalcEngine(site?: Site) {
  const [scenario, setScenario] = useState<CalcScenario>(readScenario);

  useEffect(() => {
    localStorage.setItem(CALC_SCENARIO_STORAGE_KEY, JSON.stringify(scenario));
  }, [scenario]);

  const values = useMemo(() => {
    if (!site) return null;
    return calculateScenario(site, scenario);
  }, [scenario, site]);

  const setScenarioValue = (key: keyof CalcScenario, value: number) => {
    setScenario((current) => ({ ...current, [key]: value }));
  };

  const resetScenario = () => {
    setScenario(DEFAULT_SCENARIO);
  };

  return { scenario, values, setScenarioValue, resetScenario };
}
