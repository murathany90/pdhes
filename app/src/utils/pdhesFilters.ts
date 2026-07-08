import type { CandidateSourceGroup, ConceptType, InfrastructureType, Site } from '../types/site';

export type SourceGroupFilter = 'ALL' | CandidateSourceGroup;
export type ConceptTypeFilter = 'ALL' | ConceptType;
export type InfrastructureTypeFilter = 'ALL' | InfrastructureType;

export interface CandidateFilters {
  sourceGroup: SourceGroupFilter;
  conceptType: ConceptTypeFilter;
  infrastructureType: InfrastructureTypeFilter;
  minCapacityMW: number | null;
  maxCapacityMW: number | null;
  minHeadM: number | null;
  maxHeadM: number | null;
  minFlowCms: number | null;
  maxFlowCms: number | null;
}

export const DEFAULT_DATA_FILTERS: CandidateFilters = {
  sourceGroup: 'ALL',
  conceptType: 'ALL',
  infrastructureType: 'ALL',
  minCapacityMW: null,
  maxCapacityMW: null,
  minHeadM: null,
  maxHeadM: null,
  minFlowCms: null,
  maxFlowCms: null,
};

export const SOURCE_GROUP_FILTERS: Array<{ id: SourceGroupFilter; label: string }> = [
  { id: 'ALL', label: 'Tümü' },
  { id: 'JICA_EIE_16', label: 'JİCA/EİE' },
  { id: 'SEA_WATER_PROTOTYPE_TOP4', label: 'Deniz Tipi' },
];

export const CONCEPT_TYPE_FILTERS: Array<{ id: ConceptTypeFilter; label: string }> = [
  { id: 'ALL', label: 'Tüm konseptler' },
  { id: 'CONVENTIONAL_LAND', label: 'Geleneksel kara tipi' },
  { id: 'SEAWATER', label: 'Deniz suyu' },
  { id: 'VARIABLE_SPEED_OPTION', label: 'Değişken hızlı seçenek' },
  { id: 'HYBRID_RENEWABLE_OPTION', label: 'Hibrit yenilenebilir seçenek' },
];

export const INFRASTRUCTURE_TYPE_FILTERS: Array<{ id: InfrastructureTypeFilter; label: string }> = [
  { id: 'ALL', label: 'Tüm altyapılar' },
  { id: 'EXISTING_RESERVOIR_INTEGRATED', label: 'Mevcut rezervuar entegre' },
  { id: 'PURE_NEW_BUILD', label: 'Tamamen yeni / saf' },
  { id: 'MIXED_EXISTING_HYDRO_CASCADE', label: 'Mevcut HES kaskadı' },
  { id: 'SEAWATER_COASTAL', label: 'Kıyı / deniz suyu' },
];

function inRange(value: number | null | undefined, min: number | null, max: number | null): boolean {
  if (min === null && max === null) return true;
  if (value === null || value === undefined || !Number.isFinite(value)) return false;
  if (min !== null && value < min) return false;
  if (max !== null && value > max) return false;
  return true;
}

export function matchesCandidateFilters(site: Site, filters: CandidateFilters): boolean {
  const classification = site.technicalClassification;
  if (filters.sourceGroup !== 'ALL' && site.sourceGroup !== filters.sourceGroup) return false;
  if (filters.conceptType !== 'ALL' && classification.conceptType !== filters.conceptType) return false;
  if (filters.infrastructureType !== 'ALL' && classification.infrastructureType !== filters.infrastructureType) return false;
  if (!inRange(site.capacityMW, filters.minCapacityMW, filters.maxCapacityMW)) return false;
  if (!inRange(site.headM, filters.minHeadM, filters.maxHeadM)) return false;
  if (!inRange(site.projectFlowCms, filters.minFlowCms, filters.maxFlowCms)) return false;
  return true;
}
