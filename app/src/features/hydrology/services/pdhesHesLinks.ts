import { publicAssetUrl } from '../../../utils/publicUrl';

export type PdhesHesLink = {
  pdhesSiteId: string;
  hesId: string;
  reservoirId: string;
  role: 'lower_reservoir' | 'upper_reservoir';
  confidence: string;
  method: string;
};

type LinkPayload = { links?: PdhesHesLink[] };

let cachedLinks: Promise<PdhesHesLink[]> | null = null;

export function loadPdhesHesLinks(): Promise<PdhesHesLink[]> {
  cachedLinks ??= fetch(publicAssetUrl('hydrology/pdhes_hes_links.json'), { cache: 'force-cache' })
    .then((response) => { if (!response.ok) throw new Error(`PDHES-HES mapping HTTP ${response.status}`); return response.json() as Promise<LinkPayload>; })
    .then((payload) => Array.isArray(payload.links) ? payload.links : []);
  return cachedLinks;
}
