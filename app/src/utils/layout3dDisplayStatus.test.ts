import { describe, expect, it } from 'vitest';
import {
  isFootprintDisplay,
  isRepresentativeDisplay,
  LAYOUT_3D_DISPLAY_STATUS_LABELS,
  resolveLayout3DDisplayStatus,
} from './layout3dDisplayStatus';

describe('resolveLayout3DDisplayStatus', () => {
  it('returns representative when footprint mode is off', () => {
    expect(
      resolveLayout3DDisplayStatus({ hasFootprints: false }),
    ).toBe('representative');
    expect(
      resolveLayout3DDisplayStatus({
        useFootprintPolygons: false,
        loadStatus: 'success',
        hasFootprints: true,
      }),
    ).toBe('representative');
  });

  it('returns footprint only for a successful load with items', () => {
    expect(
      resolveLayout3DDisplayStatus({
        useFootprintPolygons: true,
        loadStatus: 'success',
        hasFootprints: true,
      }),
    ).toBe('footprint');
    expect(
      resolveLayout3DDisplayStatus({
        useFootprintPolygons: true,
        loadStatus: 'success',
        hasFootprints: false,
      }),
    ).toBe('loading');
  });

  it('returns fallback for unloadable geometry', () => {
    for (const loadStatus of [
      'empty',
      'not-found',
      'invalid-schema',
      'network-error',
      'timeout',
      'fallback-model',
    ] as const) {
      expect(
        resolveLayout3DDisplayStatus({
          useFootprintPolygons: true,
          loadStatus,
          hasFootprints: false,
        }),
      ).toBe('fallback');
    }
  });

  it('returns loading while the footprint request is pending', () => {
    for (const loadStatus of ['idle', 'loading', undefined] as const) {
      expect(
        resolveLayout3DDisplayStatus({
          useFootprintPolygons: true,
          loadStatus,
          hasFootprints: false,
        }),
      ).toBe('loading');
    }
  });

  it('marks only representative and fallback as representative', () => {
    expect(isRepresentativeDisplay('footprint')).toBe(false);
    expect(isRepresentativeDisplay('loading')).toBe(false);
    expect(isRepresentativeDisplay('representative')).toBe(true);
    expect(isRepresentativeDisplay('fallback')).toBe(true);
  });

  it('marks only the footprint state as footprint display', () => {
    expect(isFootprintDisplay('footprint')).toBe(true);
    expect(isFootprintDisplay('loading')).toBe(false);
    expect(isFootprintDisplay('representative')).toBe(false);
    expect(isFootprintDisplay('fallback')).toBe(false);
  });

  it('labels every display status for the UI badge', () => {
    expect(Object.keys(LAYOUT_3D_DISPLAY_STATUS_LABELS)).toEqual(
      expect.arrayContaining(['footprint', 'loading', 'representative', 'fallback']),
    );
    for (const label of Object.values(LAYOUT_3D_DISPLAY_STATUS_LABELS)) {
      expect(label.length).toBeGreaterThan(0);
    }
  });
});
