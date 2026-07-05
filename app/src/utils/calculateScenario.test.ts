import { describe, expect, it } from 'vitest';
import sites from '../../public/data.json';
import type { Site } from '../types/site';
import { calculateScenario } from './calculateScenario';

const site = sites[0] as unknown as Site;

describe('calculateScenario', () => {
  it('calculates physical energy and financial scenario values', () => {
    const result = calculateScenario(site, {
      capexFactor: 1,
      revenueFactor: 1,
      cycles: 300,
      reservePremium: 18,
    });

    expect(result.physicsGWh).toBeGreaterThan(0);
    expect(result.adjCapex).toBe(site.capexBn);
    expect(result.adjRevenue).toBeCloseTo(site.revenueM * 1.18);
    expect(result.payback).not.toBeNull();
    expect(result.eurPerKw).not.toBeNull();
  });

  it('does not expose Infinity for zero revenue or power', () => {
    const result = calculateScenario({ ...site, revenueM: 0, powerMW: 0 }, {
      capexFactor: 1,
      revenueFactor: 1,
      cycles: 300,
      reservePremium: 0,
    });

    expect(result.payback).toBeNull();
    expect(result.eurPerKw).toBeNull();
  });
});
