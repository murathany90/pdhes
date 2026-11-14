// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useHydrologyStore } from '../store/useHydrologyStore';
import { HesToolbar } from './HydrologyToolbar';

describe('HES snapshot freshness', () => {
  const initial = useHydrologyStore.getState();

  afterEach(() => {
    cleanup();
    useHydrologyStore.setState(initial, true);
  });

  it('excludes stale records from the current coverage KPI and marks them as old', () => {
    useHydrologyStore.setState({
      ...initial,
      hydroDataStatus: 'ready',
      hes177: {
        type: 'FeatureCollection',
        features: [
          { type: 'Feature', properties: { id: 'hes-a', name: 'A', installedPowerMw: 25 }, geometry: null },
          { type: 'Feature', properties: { id: 'hes-b', name: 'B', installedPowerMw: 30 }, geometry: null },
        ],
      },
      fullness: {
        status: 'degraded',
        pipelineRunAt: '2026-11-14T13:22:42Z',
        latestObservationAt: '2026-09-13T00:00:00Z',
        coverage: { applicableCount: 2, availableCount: 0, staleCount: 1, unavailableCount: 1 },
        records: [
          { hesId: 'hes-a', status: 'stale', fullnessPercent: 40, sourceClass: 'calculated_storage', source: 'canonical', observedAt: '2026-09-13T00:00:00Z' },
        ],
      },
    } as Partial<typeof initial>);

    render(<HesToolbar />);

    expect(screen.getByTitle(/Güncel doluluk 0\/2/)).toBeTruthy();
    expect(screen.getByText(/Eski gözlem/)).toBeTruthy();
    expect(screen.getByText('0/2')).toBeTruthy();
  });
});
