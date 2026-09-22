import { describe, expect, it } from 'vitest';
import { filterGridFeatures, getGridVoltageGroup, normalizeGridVoltageFeatures, normalizeGridVoltageKv } from './powerGrid';

describe('power grid voltage normalization', () => {
  it.each([
    [400, [400]],
    ['400 kV', [400]],
    ['380/400 kV', [380, 400]],
    ['400000', [400]],
    ['400;154', [400, 154]],
    ['400000;154000', [400, 154]],
    [null, []],
    ['bilinmiyor', []],
  ])('normalizes %s', (value, expected) => {
    expect(normalizeGridVoltageKv(value)).toEqual(expected);
  });

  it('filters only matching voltage and compatible geometry types', () => {
    const data = {
      type: 'FeatureCollection' as const,
      features: [
        { type: 'Feature' as const, geometry: { type: 'LineString' as const, coordinates: [[30, 40], [31, 41]] }, properties: { voltage: '400000' } },
        { type: 'Feature' as const, geometry: { type: 'MultiLineString' as const, coordinates: [[[30, 40], [31, 41]]] }, properties: { voltage: '154;400' } },
        { type: 'Feature' as const, geometry: { type: 'LineString' as const, coordinates: [[30, 40], [31, 41]] }, properties: { voltage: null } },
      ],
    };

    expect(filterGridFeatures(data, 'LineString', ['400']).features).toHaveLength(2);
    expect(filterGridFeatures(data, 'LineString', ['154']).features).toHaveLength(1);
  });

  it('keeps nominal 380 kV and 400 kV filters distinct', () => {
    const data = {
      type: 'FeatureCollection' as const,
      features: [
        { type: 'Feature' as const, geometry: { type: 'LineString' as const, coordinates: [[30, 40], [31, 41]] }, properties: { voltage: '380' } },
        { type: 'Feature' as const, geometry: { type: 'LineString' as const, coordinates: [[30, 40], [31, 41]] }, properties: { voltage: '400' } },
      ],
    };

    expect(filterGridFeatures(data, 'LineString', ['380']).features).toHaveLength(1);
    expect(filterGridFeatures(data, 'LineString', ['400']).features).toHaveLength(1);
  });

  it('adds normalized style fields without overwriting original voltage data', () => {
    const data = {
      type: 'FeatureCollection' as const,
      features: [
        { type: 'Feature' as const, geometry: { type: 'LineString' as const, coordinates: [[30, 40], [31, 41]] }, properties: { voltage: '400000;154' } },
        { type: 'Feature' as const, geometry: { type: 'LineString' as const, coordinates: [[30, 40], [31, 41]] }, properties: { voltage: 'bilinmiyor' } },
      ],
    };

    const normalized = normalizeGridVoltageFeatures(data);
    expect(normalized.features[0].properties).toMatchObject({ voltage: '400000;154', voltageKv: [400, 154], voltageKvMax: 400, voltageGroup: 'v400' });
    expect(normalized.features[1].properties).toMatchObject({ voltage: 'bilinmiyor', voltageKv: [], voltageKvMax: null, voltageGroup: 'unknown' });
  });

  it('keeps nominal voltage values separate from visual voltage groups', () => {
    expect(getGridVoltageGroup('380')).toBe('v380');
    expect(getGridVoltageGroup('400')).toBe('v400');
    expect(getGridVoltageGroup('400;154')).toBe('v400');
    expect(getGridVoltageGroup('bilinmiyor')).toBe('unknown');
  });
});
