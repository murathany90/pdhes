import type { Site } from '../types/site';

export interface CalcScenario {
  capexFactor: number;
  revenueFactor: number;
  cycles: number;
  reservePremium: number;
}

export interface CalculatedScenario {
  physicsGWh: number;
  adjCapex: number;
  adjRevenue: number;
  payback: number | null;
  eurPerKw: number | null;
}

export function calculateScenario(site: Site, scenario: CalcScenario): CalculatedScenario {
  const physicsGWh = 1000 * 9.81 * site.head * (site.activeMcm * 1e6) * 0.85 / 3.6e12;
  const adjCapex = site.capexBn * scenario.capexFactor;
  const adjRevenue = site.revenueM
    * (scenario.cycles / 300)
    * scenario.revenueFactor
    * (1 + scenario.reservePremium / 100);
  const payback = adjRevenue > 0 ? (adjCapex * 1000) / adjRevenue : null;
  const eurPerKw = site.powerMW > 0 ? (adjCapex * 1e9) / (site.powerMW * 1000) : null;

  return { physicsGWh, adjCapex, adjRevenue, payback, eurPerKw };
}
