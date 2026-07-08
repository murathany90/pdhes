import type { Site } from '../types/site';

export interface CalcScenario {
  activeVolumeHm3: number;
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
  theoreticalPowerMW: number | null;
  sourceCapacityMW: number;
  volumeSource: 'source' | 'scenario';
  consistencyNote: string;
}

export function calculateScenario(site: Site, scenario: CalcScenario): CalculatedScenario {
  const headM = site.headM ?? 0;
  const volumeHm3 = site.activeVolumeHm3 ?? scenario.activeVolumeHm3;
  const volumeSource = site.activeVolumeHm3 === null || site.activeVolumeHm3 === undefined ? 'scenario' : 'source';
  const physicsGWh = 1000 * 9.81 * headM * (volumeHm3 * 1e6) * 0.85 / 3.6e12;
  const capex = site.capexUsdBn ?? 0;
  const revenue = site.annualRevenueUsdM ?? 0;
  const adjCapex = capex * scenario.capexFactor;
  const adjRevenue = revenue
    * (scenario.cycles / 300)
    * scenario.revenueFactor
    * (1 + scenario.reservePremium / 100);
  const payback = adjRevenue > 0 ? (adjCapex * 1000) / adjRevenue : null;
  const eurPerKw = site.capacityMW > 0 && adjCapex > 0 ? (adjCapex * 1e9) / (site.capacityMW * 1000) : null;
  const theoreticalPowerMW = site.projectFlowCms && site.headM
    ? 1000 * 9.81 * site.projectFlowCms * site.headM * 0.85 / 1e6
    : null;
  const consistencyNote = volumeSource === 'scenario'
    ? 'Aktif hacim kaynakta yok; hesap kullanıcı senaryo hacmini kullanır.'
    : 'Aktif hacim veri setinden alınmıştır; sonuç ön inceleme varsayımıdır.';

  return {
    physicsGWh,
    adjCapex,
    adjRevenue,
    payback,
    eurPerKw,
    theoreticalPowerMW,
    sourceCapacityMW: site.capacityMW,
    volumeSource,
    consistencyNote,
  };
}
