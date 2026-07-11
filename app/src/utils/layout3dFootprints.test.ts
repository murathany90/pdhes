import { describe, it, expect } from 'vitest';
import { footprintLayerKey } from './layout3dFootprints';

describe('footprintLayerKey', () => {
  it('maps known components to their respective standard layers', () => {
    expect(footprintLayerKey('intake')).toBe('upper_reservoir');
    expect(footprintLayerKey('headrace_tunnel')).toBe('tunnel');
    expect(footprintLayerKey('tailrace_tunnel')).toBe('tailrace');
    expect(footprintLayerKey('tailrace_surge_tank')).toBe('surge_tank');
    expect(footprintLayerKey('existing_switchyard')).toBe('switchyard');
    expect(footprintLayerKey('new_switchyard')).toBe('switchyard');
  });

  it('returns the component itself if not mapped', () => {
    expect(footprintLayerKey('upper_reservoir')).toBe('upper_reservoir');
    expect(footprintLayerKey('powerhouse')).toBe('powerhouse');
    expect(footprintLayerKey('unknown_component')).toBe('unknown_component');
  });
});
