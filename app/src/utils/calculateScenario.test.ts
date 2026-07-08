import { describe, expect, it } from 'vitest';
import sites from '../../public/data.json';
import type { Site } from '../types/site';
import { calculateScenario } from './calculateScenario';

const site = sites[0] as unknown as Site;

describe('calculateScenario', () => {
  it('calculates energy from head and scenario volume when source active volume is missing', () => {
    const result = calculateScenario(site, {
      activeVolumeHm3: 10,
      capexFactor: 1,
      revenueFactor: 1,
      cycles: 300,
      reservePremium: 18,
    });

    expect(result.physicsGWh).toBeGreaterThan(0);
    expect(result.volumeSource).toBe('scenario');
    expect(result.consistencyNote).toMatch(/aktif hacim kaynakta yok/i);
    expect(result.sourceCapacityMW).toBe(site.capacityMW);
  });

  it('does not expose Infinity for zero revenue or power', () => {
    const result = calculateScenario({ ...site, annualRevenueUsdM: 0, capacityMW: 0 }, {
      activeVolumeHm3: 10,
      capexFactor: 1,
      revenueFactor: 1,
      cycles: 300,
      reservePremium: 0,
    });

    expect(result.payback).toBeNull();
    expect(result.eurPerKw).toBeNull();
  });
});
