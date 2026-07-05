import { describe, expect, it, vi } from 'vitest';
import sites from '../../public/data.json';
import { loadAppData } from './useAppData';

describe('loadAppData', () => {
  it('loads and validates site and grid data in parallel', async () => {
    const fetcher = vi.fn(async (url: string | URL | Request) => {
      const value = String(url);
      if (value.endsWith('data.json')) {
        return new Response(JSON.stringify(sites), { status: 200 });
      }
      return new Response(JSON.stringify({ type: 'FeatureCollection', features: [] }), { status: 200 });
    });

    const result = await loadAppData(fetcher, '/TR_PDHES_Potansiyel/');

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(result.sites).toHaveLength(20);
    expect(result.grid.type).toBe('FeatureCollection');
  });

  it('returns an actionable error for failed requests', async () => {
    const fetcher = vi.fn(async () => new Response('missing', { status: 404 }));

    await expect(loadAppData(fetcher, '/')).rejects.toThrow('yüklenemedi');
  });
});
