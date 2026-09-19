import { publicAssetUrl } from '../../../utils/publicUrl';
import { hydrologyDataUrl } from './hydroData';
import { fullnessRecordsByHes } from '../data/fullnessSources';
import type { FullnessPayload, FullnessResult } from '../types/hydrology';

export type PdhesHesLink = {
  pdhesSiteId: string;
  hesId: string;
  reservoirId: string;
  role: 'lower_reservoir' | 'upper_reservoir';
  confidence: string;
  method: string;
};

type LinkPayload = { links?: PdhesHesLink[] };

export type LinkedHesRecord = {
  hesId: string;
  properties: Record<string, unknown>;
};

type LinkedHesPayload = { records?: LinkedHesRecord[] };

type HydrologyCacheManifest = {
  dataVersion?: string | number;
  generatedAt?: string;
  latestObservationAt?: string | null;
  pipelineRunAt?: string;
};

export type LinkedHesSummary = {
  link: PdhesHesLink;
  hes: LinkedHesRecord | null;
  fullness: FullnessResult | null;
};

let cachedLinks: Promise<PdhesHesLink[]> | null = null;
let cachedStaticLinkedData: Promise<{ links: PdhesHesLink[]; hesById: Map<string, LinkedHesRecord> }> | null = null;
let cachedFullness: { cacheKey: string; expiresAt: number; promise: Promise<FullnessPayload> } | null = null;
const FULLNESS_CACHE_TTL_MS = 5 * 60 * 1000;

async function readJson<T>(path: string, cache: RequestCache = 'force-cache'): Promise<T> {
  const response = await fetch(hydrologyDataUrl(path), { cache });
  if (!response.ok) throw new Error(`Hydrology linked data HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

function versionedPath(path: string, manifest: HydrologyCacheManifest): string {
  const cacheKey = [manifest.dataVersion, manifest.generatedAt, manifest.pipelineRunAt, manifest.latestObservationAt]
    .filter((value): value is string | number => value !== null && value !== undefined && String(value).length > 0)
    .map(String)
    .join('-');
  return cacheKey ? `${path}?v=${encodeURIComponent(cacheKey)}` : path;
}

export function loadPdhesHesLinks(): Promise<PdhesHesLink[]> {
  cachedLinks ??= fetch(publicAssetUrl('hydrology/pdhes_hes_links.json'), { cache: 'no-cache' })
    .then((response) => { if (!response.ok) throw new Error(`PDHES-HES mapping HTTP ${response.status}`); return response.json() as Promise<LinkPayload>; })
    .then((payload) => Array.isArray(payload.links) ? payload.links : []);
  return cachedLinks;
}

/** Loads only the mapping, linked-HES metadata and linked fullness records used by a PDHES detail panel. */
export function loadLinkedHesSummary(pdhesSiteId: string): Promise<LinkedHesSummary | null> {
  cachedStaticLinkedData ??= Promise.all([
    loadPdhesHesLinks(),
    readJson<LinkedHesPayload>('/hes177/hes_linked_summary.json'),
  ]).then(([links, hesPayload]) => ({
    links,
    hesById: new Map((hesPayload.records ?? []).map((record) => [record.hesId, record])),
  }));

  return Promise.all([
    cachedStaticLinkedData,
    readJson<HydrologyCacheManifest>('/hes177/hes_177_manifest.json', 'no-cache'),
  ]).then(async ([{ links, hesById }, manifest]) => {
    const cacheKey = versionedPath('/live/hes_linked_fullness_latest.json', manifest);
    if (!cachedFullness || cachedFullness.cacheKey !== cacheKey || cachedFullness.expiresAt <= Date.now()) {
      cachedFullness = { cacheKey, expiresAt: Date.now() + FULLNESS_CACHE_TTL_MS, promise: readJson<FullnessPayload>(cacheKey, 'no-cache') };
    }
    const fullnessByHes = fullnessRecordsByHes(await cachedFullness.promise);
    const link = links.find((item) => item.pdhesSiteId === pdhesSiteId);
    if (!link) return null;
    return { link, hes: hesById.get(link.hesId) ?? null, fullness: fullnessByHes.get(link.hesId) ?? null };
  });
}
