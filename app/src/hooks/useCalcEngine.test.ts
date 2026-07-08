// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { makeTestSite } from '../test-utils/makeTestSite';
import { CALC_SCENARIO_STORAGE_KEY, useCalcEngine } from './useCalcEngine';

const site = makeTestSite({
  headM: 400,
  activeVolumeHm3: 10,
  capexUsdBn: 2,
  annualRevenueUsdM: 200,
  capacityMW: 1000,
});

describe('useCalcEngine persistence', () => {
  beforeEach(() => localStorage.clear());

  it('restores and saves the calculation scenario', () => {
    localStorage.setItem(CALC_SCENARIO_STORAGE_KEY, JSON.stringify({
      activeVolumeHm3: 12,
      capexFactor: 1.2,
      revenueFactor: 0.9,
      cycles: 280,
      reservePremium: 12,
    }));

    const { result } = renderHook(() => useCalcEngine(site));
    expect(result.current.scenario.capexFactor).toBe(1.2);
    expect(result.current.scenario.activeVolumeHm3).toBe(12);

    act(() => result.current.setScenarioValue('cycles', 320));
    expect(JSON.parse(localStorage.getItem(CALC_SCENARIO_STORAGE_KEY) || '{}').cycles).toBe(320);
  });
});
