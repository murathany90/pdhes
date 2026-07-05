import type { StyleSpecification } from 'maplibre-gl';

export type MapStyleKind = 'dark' | 'light' | 'satellite';

export const MAP_PROVIDERS: Record<MapStyleKind, {
  tileUrl: string;
  attribution: string;
}> = {
  light: {
    tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  },
  dark: {
    tileUrl: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> © <a href="https://carto.com/attributions">CARTO</a>',
  },
  satellite: {
    tileUrl: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics and contributors',
  },
};

export function getMapStyleSpecification(kind: MapStyleKind): StyleSpecification {
  const provider = MAP_PROVIDERS[kind];

  return {
    version: 8,
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    sources: {
      base: {
        type: 'raster',
        tiles: [provider.tileUrl],
        tileSize: 256,
        maxzoom: 22,
        attribution: provider.attribution,
      },
      terrainSource: {
        type: 'raster-dem',
        tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
        tileSize: 256,
        encoding: 'terrarium',
        maxzoom: 15,
        attribution: 'Elevation tiles © AWS Open Data Terrain Tiles',
      },
    },
    layers: [{ id: 'base', type: 'raster', source: 'base' }],
  };
}
