import type { PdhesType } from '../types/site';

export type PdhesTypeFilter = 'ALL' | PdhesType;

export const PDHES_TYPE_FILTERS: Array<{ id: PdhesTypeFilter; label: string }> = [
  { id: 'ALL', label: 'Tümü' },
  { id: 'CLOSED_LOOP', label: 'Kapalı Devre' },
  { id: 'OPEN_LOOP', label: 'Açık Devre' },
  { id: 'SEA_WATER', label: 'Deniz Suyu' },
  { id: 'PROTOTYPE', label: 'Prototip / Pilot' },
];

export function matchesPdhesType(type: PdhesType, filter: PdhesTypeFilter): boolean {
  return filter === 'ALL' || type === filter;
}
