import { describe, expect, it } from 'vitest';
import sites from '../../public/data.json';
import {
  DEFAULT_DATA_FILTERS,
  PDHES_TYPE_FILTERS,
  matchesCandidateFilters,
} from './pdhesFilters';
import type { Site } from '../types/site';

describe('PDHES candidate filters', () => {
  it('uses pdhesType filter identifiers from the new data contract', () => {
    expect(PDHES_TYPE_FILTERS.map((filter: { id: string }) => filter.id)).toEqual([
      'ALL',
      'OPEN_LOOP',
      'CLOSED_LOOP',
      'SEA_WATER',
      'HYBRID',
      'MIXED',
    ]);
    expect(PDHES_TYPE_FILTERS.map((filter: { label: string }) => filter.label)).toEqual([
      'Tümü',
      'Açık Çevrim PDHES',
      'Kapalı Çevrim PDHES',
      'Deniz Suyu PDHES',
      'Hibrit (Şebeke Desteksiz) PDHES',
      'Karışık PDHES',
    ]);
    expect(DEFAULT_DATA_FILTERS).not.toHaveProperty('province');
    expect(DEFAULT_DATA_FILTERS).not.toHaveProperty('coordinateConfidence');
  });

  it('matches source group, sea classification and numeric ranges together', () => {
    const tasucu = (sites as Site[]).find((site) => site.id === 'tasucu');
    const gokcekaya = (sites as Site[]).find((site) => site.id === 'kamu-gokcekaya-pspp');

    expect(tasucu).toBeTruthy();
    expect(gokcekaya).toBeTruthy();
    if (!tasucu || !gokcekaya) return;

    expect(matchesCandidateFilters(tasucu, {
      ...DEFAULT_DATA_FILTERS,
      pdhesType: 'SEA_WATER',
      minCapacityMW: 50,
      minHeadM: 500,
    })).toBe(true);

    expect(matchesCandidateFilters(gokcekaya, {
      ...DEFAULT_DATA_FILTERS,
      pdhesType: 'SEA_WATER',
    })).toBe(false);
  });
});
