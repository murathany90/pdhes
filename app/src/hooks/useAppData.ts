import { useEffect, useState } from 'react';
import { getLegacyCustomSites, getPersistedSites, useSiteStore } from '../stores/useSiteStore';
import { publicAssetUrl } from '../utils/publicUrl';
import { attachExcelCalculatedData } from '../utils/pdhes/excelDataMapper';
import { validateSites } from '../utils/siteSchema';

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

interface LoadedAppData {
  sites: ReturnType<typeof validateSites>['sites'];
}

export async function loadAppData(
  fetcher: FetchLike = fetch,
  base = import.meta.env.BASE_URL,
): Promise<LoadedAppData> {
  const dataResponse = await fetcher(publicAssetUrl(`data.json?v=${Date.now()}`, base), {
    cache: "no-store",
  });

  if (!dataResponse.ok) {
    throw new Error(
      `Uygulama verileri yüklenemedi (aday: ${dataResponse.status}).`,
    );
  }

  const siteJson = await dataResponse.json() as Promise<unknown>;
  const validation = validateSites(siteJson);
  if (!validation.ok) {
    throw new Error(`Aday veri sözleşmesi geçersiz: ${validation.errors.slice(0, 3).join(' ')}`);
  }

  return { sites: attachExcelCalculatedData(validation.sites) };
}

export function useAppData() {
  const [error, setError] = useState<string | null>(null);
  const setSites = useSiteStore((state) => state.setSites);
  const setBaseSites = useSiteStore((state) => state.setBaseSites);
  const setLoading = useSiteStore((state) => state.setLoading);

  useEffect(() => {
    let active = true;

    loadAppData()
      .then(({ sites: baseSites }) => {
        if (!active) return;
        const persistedSites = getPersistedSites();
        const legacySites = getLegacyCustomSites();
        const localSites = persistedSites ?? legacySites;
        const mergedSites = [
          ...localSites,
          ...baseSites.filter((base) => !localSites.some((local) => local.id === base.id)),
        ];
        setBaseSites(baseSites);
        setSites(attachExcelCalculatedData(mergedSites));
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
  }, [setBaseSites, setLoading, setSites]);

  return { error };
}
