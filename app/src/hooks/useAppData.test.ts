import { describe, expect, it, vi } from 'vitest';
import sites from '../../public/data.json';
import { loadAppData } from './useAppData';

describe('loadAppData', () => {
  it('loads and validates site data', async () => {
    const fetcher = vi.fn(async () => {
      return new Response(JSON.stringify(sites), { status: 200 });
    });

    const result = await loadAppData(fetcher, '/TR_PDHES_Potansiyel/');

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(result.sites).toHaveLength(20);
  });

  it('returns an actionable error for failed requests', async () => {
    const fetcher = vi.fn(async () => new Response('missing', { status: 404 }));

    await expect(loadAppData(fetcher, '/')).rejects.toThrow('yüklenemedi');
  });
});
