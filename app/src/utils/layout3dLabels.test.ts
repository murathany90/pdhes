import { describe, expect, it } from 'vitest';
import { componentDescription, componentLabel, footprintItemLabel } from './layout3dLabels';

describe('layout3d labels', () => {
  it('labels penstock footprints by id without inventing data', () => {
    expect(footprintItemLabel({ id: 'penstock-1', component: 'penstock' })).toBe('Cebri Boru -1');
    expect(footprintItemLabel({ id: 'x', component: 'headrace_tunnel' })).toBe('İletim Tüneli');
    expect(footprintItemLabel({ id: 'upperReservoirWater', component: 'upper_reservoir' })).toBe('Üst Rezervuar');
  });

  it('falls back to component keys for unknown ids', () => {
    expect(footprintItemLabel({ id: 'custom', component: 'custom_layer' })).toBe('custom_layer');
    expect(componentLabel('unknown')).toBe('unknown');
    expect(componentDescription('unknown')).toBe('');
  });

  it('resolves known component labels and descriptions', () => {
    expect(componentLabel('powerhouse')).toMatch(/Santral|Powerhouse/);
    expect(componentDescription('powerhouse').length).toBeGreaterThan(0);
  });
});
