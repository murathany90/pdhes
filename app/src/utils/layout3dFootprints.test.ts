import { describe, it, expect } from 'vitest';
import {
  footprintLayerKey,
  groupFootprintsByLayer,
  isFootprintLayerVisible,
  isLayerVisible,
  shouldClearActiveFootprintComponent,
} from './layout3dFootprints';

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

  it('uses layer visibility without requiring footprint items to be filtered out', () => {
    expect(isFootprintLayerVisible({ component: 'headrace_tunnel' }, { tunnel: false })).toBe(false);
    expect(isFootprintLayerVisible({ component: 'headrace_tunnel' }, { tunnel: true })).toBe(true);
    expect(isFootprintLayerVisible({ component: 'new_switchyard' }, { switchyard: false })).toBe(false);
    expect(isFootprintLayerVisible({ component: 'unknown_component' }, {})).toBe(true);
    expect(isLayerVisible('tunnel', { tunnel: false })).toBe(false);
    expect(isLayerVisible('tunnel', { tunnel: true })).toBe(true);
  });

  it('clears active footprint selection in the same layer-toggle event', () => {
    expect(shouldClearActiveFootprintComponent('headrace_tunnel', 'tunnel', false)).toBe(true);
    expect(shouldClearActiveFootprintComponent('tunnel', 'tunnel', false)).toBe(true);
    expect(shouldClearActiveFootprintComponent('new_switchyard', 'switchyard', false)).toBe(true);
    expect(shouldClearActiveFootprintComponent('upper_reservoir', 'tunnel', false)).toBe(false);
    expect(shouldClearActiveFootprintComponent('tunnel', 'tunnel', true)).toBe(false);
  });

  it('groups footprints by normalized layer so visibility changes stay layer-scoped', () => {
    const groups = groupFootprintsByLayer([
      { id: 'upper', component: 'upper_reservoir' },
      { id: 'headrace', component: 'headrace_tunnel' },
      { id: 'tailrace', component: 'tailrace_tunnel' },
      { id: 'switchyardNew', component: 'new_switchyard' },
      { id: 'switchyardExisting', component: 'existing_switchyard' },
    ]);

    expect(groups.map((group) => group.layerKey)).toEqual(['upper_reservoir', 'tunnel', 'tailrace', 'switchyard']);
    expect(groups.find((group) => group.layerKey === 'switchyard')?.items.map((item) => item.id)).toEqual([
      'switchyardNew',
      'switchyardExisting',
    ]);
  });
});
