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

export type LinkedHesSummary = {
  link: PdhesHesLink;
  hes: LinkedHesRecord | null;
  fullness: FullnessResult | null;
};

let cachedLinks: Promise<PdhesHesLink[]> | null = null;
let cachedLinkedSummaryData: Promise<{ links: PdhesHesLink[]; hesById: Map<string, LinkedHesRecord>; fullnessByHes: Map<string, FullnessResult> }> | null = null;

async function readJson<T>(path: string): Promise<T> {
  const response = await fetch(hydrologyDataUrl(path), { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Hydrology linked data HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

export function loadPdhesHesLinks(): Promise<PdhesHesLink[]> {
  cachedLinks ??= fetch(publicAssetUrl('hydrology/pdhes_hes_links.json'), { cache: 'force-cache' })
    .then((response) => { if (!response.ok) throw new Error(`PDHES-HES mapping HTTP ${response.status}`); return response.json() as Promise<LinkPayload>; })
    .then((payload) => Array.isArray(payload.links) ? payload.links : []);
  return cachedLinks;
}

/** Loads only the mapping, linked-HES metadata and linked fullness records used by a PDHES detail panel. */
export function loadLinkedHesSummary(pdhesSiteId: string): Promise<LinkedHesSummary | null> {
  cachedLinkedSummaryData ??= Promise.all([
    loadPdhesHesLinks(),
    readJson<LinkedHesPayload>('/hes177/hes_linked_summary.json'),
    readJson<FullnessPayload>('/live/hes_linked_fullness_latest.json'),
  ]).then(([links, hesPayload, fullnessPayload]) => ({
    links,
    hesById: new Map((hesPayload.records ?? []).map((record) => [record.hesId, record])),
    fullnessByHes: fullnessRecordsByHes(fullnessPayload),
  }));

  return cachedLinkedSummaryData.then(({ links, hesById, fullnessByHes }) => {
    const link = links.find((item) => item.pdhesSiteId === pdhesSiteId);
    if (!link) return null;
    return { link, hes: hesById.get(link.hesId) ?? null, fullness: fullnessByHes.get(link.hesId) ?? null };
  });
}
