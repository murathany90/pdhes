import { describe, expect, it } from 'vitest';
import sites from '../../public/data.json';
import {
  normalizePdhesType,
  validateSites,
} from './siteSchema';

describe('normalizePdhesType', () => {
  it.each([
    ['CLOSED_LOOP', 'CLOSED_LOOP'],
    ['OPEN_LOOP', 'OPEN_LOOP'],
    ['SEA_WATER', 'SEA_WATER'],
    ['PROTOTYPE', 'PROTOTYPE'],
    ['MUSTAKIL_PDHES', 'CLOSED_LOOP'],
    ['YARI_PDHES', 'OPEN_LOOP'],
    ['MAKRO_DENIZ_PDHES', 'SEA_WATER'],
    ['MIKRO_DENIZ_PDHES', 'PROTOTYPE'],
  ] as const)('normalizes %s to %s', (input, expected) => {
    expect(normalizePdhesType(input)).toBe(expected);
  });

  it('rejects unknown values', () => {
    expect(normalizePdhesType('UNKNOWN')).toBeNull();
  });
});

describe('validateSites', () => {
  it('accepts the repository candidate dataset', () => {
    const result = validateSites(sites);

    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.sites).toHaveLength(20);
    expect(new Set(result.sites.map((site) => site.id)).size).toBe(20);
    expect(result.sites.find((site) => site.id === 'presenzano')?.coordinates.mapAnchor)
      .toEqual([14.073, 41.3878]);
  });

  it('rejects duplicate IDs', () => {
    const duplicate = [sites[0], { ...sites[1], id: sites[0].id }];
    const result = validateSites(duplicate);

    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('tekrar'))).toBe(true);
  });

  it('rejects malformed coordinates and non-finite numeric values', () => {
    const invalid = [{
      ...sites[0],
      lat: Number.NaN,
      coordinates: { ...sites[0].coordinates, mapAnchor: [190, 95] },
    }];
    const result = validateSites(invalid);

    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('lat'))).toBe(true);
    expect(result.errors.some((error) => error.includes('mapAnchor'))).toBe(true);
  });

  it('rejects invalid canonical types', () => {
    const invalid = [{ ...sites[0], pdhesType: 'NOT_A_TYPE' }];
    const result = validateSites(invalid);

    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('pdhesType'))).toBe(true);
  });
});
