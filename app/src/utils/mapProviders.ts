import type { StyleSpecification } from 'maplibre-gl';

export type MapStyleKind = 
  | 'osm' 
  | 'dark' 
  | 'satellite' 
  | 'light' 
  | 'topo' 
  | 'gray'
  | 'maptiler-backdrop'
  | 'maptiler-hybrid'
  | 'maptiler-topo'
  | 'maptiler-basic';

export const MAP_PROVIDERS: Record<MapStyleKind, {
  name: string;
  tileUrl: string | string[];
  attribution: string;
}> = {
  osm: {
    name: 'OSM Standart',
    tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  },
  satellite: {
    name: 'Uydu - Esri World Imagery',
    tileUrl: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics and contributors',
  },
  'maptiler-hybrid': {
    name: 'Uydu - MapTiler Hybrid',
    tileUrl: 'https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=VhUFDSnUbhsGOvBDqrtE', // pdhes.tr domain kısıtı vardır
    attribution: '© <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>',
  },
  topo: {
    name: 'OpenTopoMap',
    tileUrl: [
      'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
      'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
      'https://c.tile.opentopomap.org/{z}/{x}/{y}.png'
    ],
    attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)',
  },
  'maptiler-topo': {
    name: 'MapTiler Topo',
    tileUrl: 'https://api.maptiler.com/maps/topo-v2/256/{z}/{x}/{y}.png?key=VhUFDSnUbhsGOvBDqrtE',
    attribution: '© <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>',
  },
  light: {
    name: 'CartoDB Light',
    tileUrl: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> © <a href="https://carto.com/attributions">CARTO</a>',
  },
  dark: {
    name: 'CartoDB Dark',
    tileUrl: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> © <a href="https://carto.com/attributions">CARTO</a>',
  },
  gray: {
    name: 'Esri World Gray',
    tileUrl: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles © Esri — Esri, HERE, Garmin, NGA, USGS',
  },
  'maptiler-backdrop': {
    name: 'MapTiler Backdrop',
    tileUrl: 'https://api.maptiler.com/maps/backdrop/256/{z}/{x}/{y}.png?key=VhUFDSnUbhsGOvBDqrtE',
    attribution: '© <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>',
  },
  'maptiler-basic': {
    name: 'MapTiler Basic',
    tileUrl: 'https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=VhUFDSnUbhsGOvBDqrtE',
    attribution: '© <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>',
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
        tiles: Array.isArray(provider.tileUrl) ? provider.tileUrl : [provider.tileUrl],
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


export function getMarkerIconHtml(_variant: string, color: string, isActive: boolean): string {
  const size = isActive ? 24 : 18;
  const innerSize = isActive ? 12 : 10;
  const shadow = isActive ? '0px 0px 8px rgba(0,0,0,0.8)' : '0px 0px 4px rgba(0,0,0,0.4)';
  const zIndex = isActive ? 10 : 1;

  return `
    <div style="width: ${size}px; height: ${size}px; background-color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: ${shadow}; transition: all 0.2s ease; cursor: pointer; position: relative; z-index: ${zIndex};">
      <div style="width: ${innerSize}px; height: ${innerSize}px; background-color: ${color}; border-radius: 50%;"></div>
    </div>
  `;
}
