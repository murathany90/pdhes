import { useMemo, useState } from 'react';
import type { Site } from '../types/site';

export interface CalcScenario {
  capexFactor: number;
  revenueFactor: number;
  cycles: number;
  reservePremium: number;
}

export function useCalcEngine(site?: Site) {
  const [scenario, setScenario] = useState<CalcScenario>({
    capexFactor: 1,
    revenueFactor: 1,
    cycles: 300,
    reservePremium: 18,
  });

  const values = useMemo(() => {
    if (!site) return null;
    const physicsGWh = 1000 * 9.81 * site.head * (site.activeMcm * 1e6) * 0.85 / 3.6e12;
    const adjCapex = site.capexBn * scenario.capexFactor;
    const adjRevenue = site.revenueM * (scenario.cycles / 300) * scenario.revenueFactor * (1 + scenario.reservePremium / 100);
    const payback = (adjCapex * 1000) / adjRevenue;
    const eurPerKw = (adjCapex * 1e9) / (site.powerMW * 1000);
    return { physicsGWh, adjCapex, adjRevenue, payback, eurPerKw };
  }, [scenario, site]);

  const setScenarioValue = (key: keyof CalcScenario, value: number) => {
    setScenario((current) => ({ ...current, [key]: value }));
  };

  const resetScenario = () => {
    setScenario({ capexFactor: 1, revenueFactor: 1, cycles: 300, reservePremium: 18 });
  };

  return { scenario, values, setScenarioValue, resetScenario };
}
