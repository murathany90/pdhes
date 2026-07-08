import { describe, expect, it } from 'vitest';
import sites from '../../public/data.json';
import {
  DEFAULT_DATA_FILTERS,
  SOURCE_GROUP_FILTERS,
  matchesCandidateFilters,
} from './pdhesFilters';
import type { Site } from '../types/site';

describe('PDHES candidate filters', () => {
  it('uses source-group filter identifiers from the new data contract', () => {
    expect(SOURCE_GROUP_FILTERS.map((filter) => filter.id)).toEqual([
      'ALL',
      'JICA_EIE_16',
      'SEA_WATER_PROTOTYPE_TOP4',
    ]);
    expect(SOURCE_GROUP_FILTERS.map((filter) => filter.label)).toEqual([
      'Tümü',
      'JİCA/EİE',
      'Deniz Tipi',
    ]);
    expect(DEFAULT_DATA_FILTERS).not.toHaveProperty('province');
    expect(DEFAULT_DATA_FILTERS).not.toHaveProperty('coordinateConfidence');
  });

  it('matches source group, sea classification and numeric ranges together', () => {
    const tasucu = (sites as Site[]).find((site) => site.id === 'tasucu');
    const gokcekaya = (sites as Site[]).find((site) => site.id === 'jica-gokcekaya-pspp');

    expect(tasucu).toBeTruthy();
    expect(gokcekaya).toBeTruthy();
    if (!tasucu || !gokcekaya) return;

    expect(matchesCandidateFilters(tasucu, {
      ...DEFAULT_DATA_FILTERS,
      sourceGroup: 'SEA_WATER_PROTOTYPE_TOP4',
      conceptType: 'SEAWATER',
      minCapacityMW: 500,
      minHeadM: 700,
    })).toBe(true);

    expect(matchesCandidateFilters(gokcekaya, {
      ...DEFAULT_DATA_FILTERS,
      sourceGroup: 'SEA_WATER_PROTOTYPE_TOP4',
    })).toBe(false);
  });
});
