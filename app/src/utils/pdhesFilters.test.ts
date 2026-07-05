import { describe, expect, it } from 'vitest';
import { PDHES_TYPE_FILTERS, matchesPdhesType } from './pdhesFilters';

describe('PDHES type filters', () => {
  it('uses the canonical data enum values as filter identifiers', () => {
    expect(PDHES_TYPE_FILTERS.map((filter) => filter.id)).toEqual([
      'ALL',
      'CLOSED_LOOP',
      'OPEN_LOOP',
      'SEA_WATER',
      'PROTOTYPE',
    ]);
  });

  it('matches all records or only the selected canonical type', () => {
    expect(matchesPdhesType('SEA_WATER', 'ALL')).toBe(true);
    expect(matchesPdhesType('SEA_WATER', 'SEA_WATER')).toBe(true);
    expect(matchesPdhesType('SEA_WATER', 'OPEN_LOOP')).toBe(false);
  });
});
