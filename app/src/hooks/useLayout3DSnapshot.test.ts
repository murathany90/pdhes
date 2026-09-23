// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { makeTestSite } from '../test-utils/makeTestSite';
import { buildComponentsDetail } from '../utils/siteDerived';
import { buildLayout3DFootprintPlan } from '../utils/layout3dFootprints';
import {
  deriveLayout3DTopology,
  resolveSimulationSnapshot,
} from '../utils/layout3dSimulation';
import { useLayout3DSnapshot } from './useLayout3DSnapshot';

describe('useLayout3DSnapshot', () => {
  it('matches the direct derivation shared by telemetry and scene', () => {
    const site = makeTestSite({ capacityMW: 1400, projectFlowCms: 193 });
    const componentsDetail = buildComponentsDetail(site);
    const input = {
      site,
      componentsDetail,
      activeUnitIds: ['G1', 'G2'],
      mode: 'generate' as const,
      simulationState: 'GENERATING' as const,
      isPlaying: true,
    };

    const { result } = renderHook(() => useLayout3DSnapshot(input));
    const expectedTopology = deriveLayout3DTopology(
      site,
      buildLayout3DFootprintPlan(site),
      componentsDetail,
    );

    expect(result.current.topology).toEqual(expectedTopology);
    expect(result.current.snapshot).toEqual(
      resolveSimulationSnapshot(expectedTopology, ['G1', 'G2'], 'generate', 'GENERATING', true),
    );
    expect(result.current.snapshot.running).toBe(true);
    expect(result.current.snapshot.powerMW).toBeGreaterThan(0);
  });

  it('keeps running true with zero flow for a flow-less site', () => {
    const site = makeTestSite({ projectFlowCms: null });
    const { result } = renderHook(() => useLayout3DSnapshot({
      site,
      componentsDetail: buildComponentsDetail(site),
      activeUnitIds: ['G1'],
      mode: 'generate',
      simulationState: 'GENERATING',
      isPlaying: true,
    }));

    expect(result.current.snapshot.running).toBe(true);
    expect(result.current.snapshot.flowCms).toBe(0);
  });

  it('returns an idle fallback without site or detail', () => {
    const { result } = renderHook(() => useLayout3DSnapshot({
      site: undefined,
      componentsDetail: null,
      activeUnitIds: ['G1'],
      mode: 'generate',
      simulationState: 'IDLE',
      isPlaying: false,
    }));

    expect(result.current.topology).toBeNull();
    expect(result.current.snapshot).toMatchObject({ running: false, powerMW: 0, flowCms: 0 });
  });
});
