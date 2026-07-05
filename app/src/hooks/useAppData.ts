import { useEffect, useState } from 'react';
import type { FeatureCollection } from 'geojson';
import { getLegacyCustomSites, getPersistedSites, useSiteStore } from '../stores/useSiteStore';
import { publicAssetUrl } from '../utils/publicUrl';
import { validateSites } from '../utils/siteSchema';

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

interface LoadedAppData {
  sites: ReturnType<typeof validateSites>['sites'];
  grid: FeatureCollection;
}

function isFeatureCollection(value: unknown): value is FeatureCollection {
  return typeof value === 'object'
    && value !== null
    && (value as FeatureCollection).type === 'FeatureCollection'
    && Array.isArray((value as FeatureCollection).features);
}

export async function loadAppData(
  fetcher: FetchLike = fetch,
  base = import.meta.env.BASE_URL,
): Promise<LoadedAppData> {
  const [dataResponse, gridResponse] = await Promise.all([
    fetcher(publicAssetUrl('data.json', base)),
    fetcher(publicAssetUrl('grid_assets.json', base)),
  ]);

  if (!dataResponse.ok || !gridResponse.ok) {
    throw new Error(
      `Uygulama verileri yüklenemedi (aday: ${dataResponse.status}, şebeke: ${gridResponse.status}).`,
    );
  }

  const [siteJson, gridJson] = await Promise.all([
    dataResponse.json() as Promise<unknown>,
    gridResponse.json() as Promise<unknown>,
  ]);
  const validation = validateSites(siteJson);
  if (!validation.ok) {
    throw new Error(`Aday veri sözleşmesi geçersiz: ${validation.errors.slice(0, 3).join(' ')}`);
  }
  if (!isFeatureCollection(gridJson)) {
    throw new Error('Şebeke verisi geçerli bir GeoJSON FeatureCollection değil.');
  }

  return { sites: validation.sites, grid: gridJson };
}

export function useAppData() {
  const [error, setError] = useState<string | null>(null);
  const setSites = useSiteStore((state) => state.setSites);
  const setBaseSites = useSiteStore((state) => state.setBaseSites);
  const setGridAssets = useSiteStore((state) => state.setGridAssets);
  const setLoading = useSiteStore((state) => state.setLoading);

  useEffect(() => {
    let active = true;

    loadAppData()
      .then(({ sites: baseSites, grid }) => {
        if (!active) return;
        const persistedSites = getPersistedSites();
        const legacySites = getLegacyCustomSites();
        const localSites = persistedSites ?? legacySites;
        const mergedSites = [
          ...localSites,
          ...baseSites.filter((base) => !localSites.some((local) => local.id === base.id)),
        ];
        setBaseSites(baseSites);
        setSites(mergedSites);
        setGridAssets(grid);
        setError(null);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        const message = reason instanceof Error ? reason.message : 'Uygulama verileri yüklenemedi.';
        setError(message);
        console.error(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [setBaseSites, setGridAssets, setLoading, setSites]);

  return { error };
}
