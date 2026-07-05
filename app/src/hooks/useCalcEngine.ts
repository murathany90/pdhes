import { useMemo, useState } from 'react';
import type { Site } from '../types/site';
import { calculateScenario, type CalcScenario } from '../utils/calculateScenario';

export type { CalcScenario } from '../utils/calculateScenario';

export function useCalcEngine(site?: Site) {
  const [scenario, setScenario] = useState<CalcScenario>({
    capexFactor: 1,
    revenueFactor: 1,
    cycles: 300,
    reservePremium: 18,
  });

  const values = useMemo(() => {
    if (!site) return null;
    return calculateScenario(site, scenario);
  }, [scenario, site]);

  const setScenarioValue = (key: keyof CalcScenario, value: number) => {
    setScenario((current) => ({ ...current, [key]: value }));
  };

  const resetScenario = () => {
    setScenario({ capexFactor: 1, revenueFactor: 1, cycles: 300, reservePremium: 18 });
  };

  return { scenario, values, setScenarioValue, resetScenario };
}
