import { describe, expect, it } from 'vitest';
import { MAP_PROVIDERS, getMapStyleSpecification } from './mapProviders';

describe('map providers', () => {
  it('declares visible attribution for every basemap', () => {
    for (const provider of Object.values(MAP_PROVIDERS)) {
      expect(provider.attribution.length).toBeGreaterThan(10);
      const urls = Array.isArray(provider.tileUrl) ? provider.tileUrl : [provider.tileUrl];
      for (const url of urls) {
        expect(url).toMatch(/^https:\/\//);
      }
    }
  });

  it('embeds provider attribution in the MapLibre raster source', () => {
    const style = getMapStyleSpecification('satellite');
    const source = style.sources.base;

    expect(source).toMatchObject({
      type: 'raster',
      attribution: expect.stringContaining('Esri'),
    });
  });

  it('keeps the terrain source attribution explicit', () => {
    const style = getMapStyleSpecification('light');
    const source = style.sources.terrainSource;

    expect(source).toMatchObject({
      type: 'raster-dem',
      attribution: expect.stringContaining('AWS'),
    });
  });
});
