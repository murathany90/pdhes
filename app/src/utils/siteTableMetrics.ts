import type { Site } from '../types/site';

type MetricOrigin = 'source' | 'scenario';

export interface SiteTableMetrics {
  investmentUsdBn: number;
  investmentOrigin: MetricOrigin;
  revenueUsdM: number;
  revenueOrigin: MetricOrigin;
  sourceScore: number | null;
  scenarioScore: number;
}

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function scenarioInvestmentUsdBn(site: Site): number {
  const capacityComponent = site.capacityMW * 0.00165;
  const waterwayKm = site.tunnelLengthKm ?? ((site.penstockLengthM ?? 3500) + (site.tailraceTunnelLengthM ?? 0)) / 1000;
  const waterwayComponent = waterwayKm * 0.075;
  const headComponent = (site.headM ?? 350) * 0.00018;
  const seaComponent = site.technicalClassification.cycleType === 'SEA_LOWER_RESERVOIR' ? 0.28 : 0;
  return round(capacityComponent + waterwayComponent + headComponent + seaComponent, 2);
}

function scenarioRevenueUsdM(site: Site): number {
  const headFactor = clamp((site.headM ?? 350) / 500, 0.65, 1.45);
  const energyFactor = site.energyGWh ? clamp(site.energyGWh / Math.max(site.capacityMW / 125, 1), 0.75, 1.25) : 1;
  return round(site.capacityMW * 0.12 * headFactor * energyFactor, 1);
}

function scenarioScore(site: Site): number {
  const capacityScore = clamp((site.capacityMW / 1600) * 28, 6, 28);
  const headScore = clamp(((site.headM ?? 300) / 700) * 24, 6, 24);
  const flowScore = clamp(((site.projectFlowCms ?? 180) / 700) * 18, 5, 18);
  const coordinateScore = site.coordinates.coordinateConfidence === 'existing-data' ? 9 : 6;
  const sourceBonus = site.sourceGroup === 'SEA_WATER_PROTOTYPE_TOP4' ? 7 : 5;
  const riskPenalty = clamp(site.risks.length * 1.2, 0, 8);
  return Math.round(clamp(24 + capacityScore + headScore + flowScore + coordinateScore + sourceBonus - riskPenalty, 0, 100));
}

export function getSiteTableMetrics(site: Site): SiteTableMetrics {
  return {
    investmentUsdBn: site.capexUsdBn ?? scenarioInvestmentUsdBn(site),
    investmentOrigin: site.capexUsdBn === null || site.capexUsdBn === undefined ? 'scenario' : 'source',
    revenueUsdM: site.annualRevenueUsdM ?? scenarioRevenueUsdM(site),
    revenueOrigin: site.annualRevenueUsdM === null || site.annualRevenueUsdM === undefined ? 'scenario' : 'source',
    sourceScore: site.score ?? null,
    scenarioScore: scenarioScore(site),
  };
}

