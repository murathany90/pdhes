import type { Feature, FeatureCollection, LineString, Point, Polygon } from 'geojson';
import type { Site } from '../types/site';
import * as turf from '@turf/turf';
import { circlePolygon, centroid, mid, offset, rotatedRectangle, scalePolygon } from './geo';
import { getSiteLayout, isSeaLowerReservoir } from './siteDerived';
import { COMPONENTS } from './constants';

export interface LayoutBundle {
  blocks: FeatureCollection<Polygon>;
  water: FeatureCollection<LineString>;
  risk: FeatureCollection<Polygon>;
  labels: FeatureCollection<Point>;
  grid: FeatureCollection<LineString>;
}

export function buildLayout(site: Site, hScale: number): LayoutBundle {
  const layout = getSiteLayout(site);
  const bearing = layout.bearing;
  const blocks: Feature<Polygon>[] = [];
  const sea = isSeaLowerReservoir(site);
  const footprintMode = Boolean(site.layout3D?.useFootprintPolygons && (site.layout3D.componentFootprints ?? []).length > 0);
  const footprintById = new Map((site.layout3D?.componentFootprints ?? []).map((footprint) => [footprint.id, footprint]));

  const formatNum = (num: number) => num.toLocaleString('tr-TR', { maximumFractionDigits: 0 });
  const getUpperLabel = (coords?: [number, number][]) => {
    let area = site.components_detail?.upper_reservoir?.active_volume_mcm ? site.components_detail.upper_reservoir.active_volume_mcm * 1000000 / 25 : 0;
    if (area === 0 && coords && coords.length > 2) {
      try {
        const closed = [...coords];
        if (closed[0][0] !== closed[closed.length - 1][0] || closed[0][1] !== closed[closed.length - 1][1]) {
          closed.push(closed[0]);
        }
        area = turf.area(turf.polygon([closed]));
      } catch(e) {}
    }
    const volume = site.components_detail?.upper_reservoir?.active_volume_mcm ? site.components_detail.upper_reservoir.active_volume_mcm * 1000000 : area * 25;
    
    if (area > 0) {
      return `Üst Rezervuar\n(${formatNum(area)} m²)\n(${formatNum(volume)} m³)`;
    }
    return 'Üst Rezervuar';
  };

  const calcDimensions = (defaultW: number, defaultL: number) => {
    let area = site.components_detail?.upper_reservoir?.active_volume_mcm ? site.components_detail.upper_reservoir.active_volume_mcm * 1000000 / 25 : 0;
    if (area === 0 && site.activeVolumeHm3) area = site.activeVolumeHm3 * 1000000 / 25;
    if (area > 0) {
      const ratio = defaultL / defaultW;
      const w = Math.sqrt(area / ratio);
      const l = w * ratio;
      return { w, l };
    }
    return { w: defaultW, l: defaultL };
  };

  const materialColor: Record<string, string> = {
    water: '#4aa3ff',
    embankment: '#7c858c',
    crest_road: '#5a5d61',
    concrete: '#9aa3ad',
    shaft: '#ffd75a',
    portal: '#ff944d',
    industrial: '#b277ff',
    switchyard: '#48f49a',
  };
  const footprintLabels: Record<string, string> = {
    upperReservoirWater: getUpperLabel(footprintById.get('upperReservoirWater')?.coords),
    upperReservoirEmbankment: 'Üst Rezervuar Gövdesi',
    upperIntake: 'İntake Yapısı',
    lowerReservoirWater: `Alt Rezervuar (${site.lowerReservoirName})`,
    lowerReservoirFootprint: `Alt Rezervuar (${site.lowerReservoirName})`,
    surgeTankFootprint: 'Denge Bacası',
    serviceDrainPortal: 'Servis Portalı',
    powerhouseFootprint: 'Türbin Odası',
    switchyardFootprint: 'Şalt Sahası',
  };

  function addRect(
    key: string,
    label: string,
    center: [number, number],
    width: number,
    length: number,
    height: number,
    color: string,
    blockBearing = bearing,
    base = 2,
  ) {
    blocks.push({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [rotatedRectangle(center, width, length, blockBearing)] },
      properties: { key, label, width, length, height: height * hScale, base, color },
    });
  }

  function addCircle(
    key: string,
    label: string,
    center: [number, number],
    radius: number,
    height: number,
    color: string,
    base = 2,
  ) {
    blocks.push({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [circlePolygon(center, radius, 36)] },
      properties: { key, label, width: radius * 2, length: radius * 2, height: height * hScale, base, color },
    });
  }

  function addFootprintBlocks() {
    site.layout3D?.componentFootprints
      ?.filter((footprint) => footprint.kind === 'polygon')
      ?.forEach((footprint) => {
        const extrude = footprint.extrudeM
          ?? (footprint.baseElevationM !== undefined && footprint.topElevationM !== undefined
            ? Math.max(0, footprint.topElevationM - footprint.baseElevationM)
            : 6);
        blocks.push({
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [footprint.coords] },
          properties: {
            key: footprint.id,
            component: footprint.component,
            material: footprint.material,
            label: footprintLabels[footprint.id] ?? COMPONENTS.find(c => c.key === footprint.component)?.label ?? footprint.component,
            width: 0,
            length: 0,
            height: Math.max(1, extrude) * hScale,
            base: 2,
            color: materialColor[footprint.material] ?? '#9aa3ad',
          },
        });
      });
  }

  if (footprintMode) {
    addFootprintBlocks();
    if (!footprintById.has('lowerReservoirFootprint')) {
      addRect('lower_reservoir', `Alt Rezervuar (${site.lowerReservoirName})`, layout.lower, 900, 500, 16, '#1fb6ff', bearing - 10);
    }
  } else {
    // Upper Reservoir
    if (site.coordinates.upperReservoirPolygon && site.coordinates.upperReservoirPolygon.length > 2) {
      const coords = site.coordinates.upperReservoirPolygon;
      const embankmentCoords = scalePolygon(coords, 1.05);
      blocks.push({
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [embankmentCoords] },
        properties: { key: 'upper_reservoir_embankment', component: 'upper_reservoir', label: 'Üst Rezervuar Gövdesi', width: 0, length: 0, height: 38 * hScale, base: 2, color: '#9aa3ad' },
      });
      blocks.push({
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [coords] },
        properties: { key: 'upper_reservoir', component: 'upper_reservoir', label: getUpperLabel(coords), width: 0, length: 0, height: 36 * hScale, base: 4, color: '#4aa3ff' },
      });
    } else {
      const dims = sea ? calcDimensions(980, 760) : calcDimensions(1100, 850);
      addRect('upper_reservoir', getUpperLabel(), layout.upper, dims.w, dims.l, sea ? 42 : 36, '#4aa3ff', bearing + (sea ? 8 : 4));
    }

    // Lower Reservoir
    if (site.coordinates.lowerReservoirPolygon && site.coordinates.lowerReservoirPolygon.length > 2) {
      blocks.push({
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [site.coordinates.lowerReservoirPolygon] },
        properties: { key: 'lower_reservoir', component: 'lower_reservoir', label: `Alt Rezervuar (${site.lowerReservoirName})`, width: 0, length: 0, height: 16 * hScale, base: 2, color: '#1fb6ff' },
      });
    } else {
      if (sea) {
        addRect('lower_reservoir', `Alt Rezervuar (${site.lowerReservoirName || 'Deniz'})`, layout.lower, 140, 90, 18, '#8a9597', bearing - 18);
      } else {
        addRect('lower_reservoir', `Alt Rezervuar (${site.lowerReservoirName})`, layout.lower, 900, 500, 16, '#1fb6ff', bearing - 10);
      }
    }

    // Other components
    addRect('powerhouse', 'Türbin Odası', layout.power, sea ? 260 : 320, sea ? 150 : 170, sea ? 70 : 78, '#b277ff', bearing + (sea ? 2 : 1));
    addCircle('surge_tank', 'Denge Bacası', layout.surge, sea ? 70 : 82, sea ? 115 : 120, '#ffd75a');
    addRect('switchyard', 'Şalt Sahası', layout.switchyard, sea ? 340 : 390, sea ? 240 : 260, sea ? 28 : 32, '#48f49a', bearing - (sea ? 12 : 7));
    addRect('portal', sea ? 'Tünel Portalı' : 'Servis Portalı', mid(layout.upper, layout.power, sea ? 0.55 : 0.58), sea ? 220 : 240, sea ? 120 : 125, sea ? 24 : 22, '#ff944d', bearing + (sea ? 16 : 12));
  }

  const waterFeatures: Feature<LineString>[] = [];

  if (footprintMode && site.layout3D) {
    site.layout3D.componentFootprints
      ?.filter((fp) => fp.kind === 'polyline' && (fp.id.includes('penstock') || fp.id.includes('headrace') || fp.id.includes('tailrace')))
      ?.forEach((fp) => {
        waterFeatures.push({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: fp.coords },
          properties: { key: fp.id, color: fp.id.includes('tailrace') ? '#0891b2' : '#36d6ff', width: fp.id.includes('tailrace') ? 3 : 4 },
        });
      });
  } else {
    waterFeatures.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: site.coordinates.penstockRoute },
      properties: { color: '#36d6ff', width: 4 },
    });
    waterFeatures.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [layout.power, layout.lower] },
      properties: { color: '#0891b2', width: 3 },
    });
  }

  const water: FeatureCollection<LineString> = {
    type: 'FeatureCollection',
    features: waterFeatures,
  };

  let riskPolygonCoordinates: [number, number][];
  const upperReservoirBlock = blocks.find(b => b.properties?.component === 'upper_reservoir' || b.properties?.key === 'upper_reservoir');
  
  if (upperReservoirBlock && upperReservoirBlock.geometry.coordinates[0]) {
    riskPolygonCoordinates = scalePolygon(upperReservoirBlock.geometry.coordinates[0] as [number, number][], Math.sqrt(1.1));
  } else {
    riskPolygonCoordinates = circlePolygon(layout.risk, sea ? 1700 : 1450, 64);
  }

  const risk: FeatureCollection<Polygon> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [riskPolygonCoordinates] },
        properties: { label: 'koordinat belirsizlik / kavramsal yerleşim buffer' },
      },
    ],
  };

  const labels: FeatureCollection<Point> = {
    type: 'FeatureCollection',
    features: blocks
      .filter((feature) => {
        const k = feature.properties?.key || '';
        return ['upper_reservoir', 'lower_reservoir', 'upperReservoirWater', 'lowerReservoirFootprint'].includes(k);
      })
      .map((feature) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: centroid(feature.geometry.coordinates[0] as [number, number][]) },
        properties: { label: feature.properties?.label, key: feature.properties?.key },
      })),
  };

  const transmissionLineCoordinates = site.coordinates.transmissionLineRoute?.length
    ? [layout.switchyard, ...site.coordinates.transmissionLineRoute]
    : [layout.gridA, layout.switchyard, layout.gridB];

  const grid: FeatureCollection<LineString> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: transmissionLineCoordinates },
        properties: { label: 'şebeke bağlantısı', color: '#ffd75a', width: 3 },
      },
      {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [offset(layout.switchyard, 550, -300), offset(layout.switchyard, -450, 300)] },
        properties: { label: 'şalt çıkışı', color: '#48f49a', width: 2 },
      },
    ],
  };

  return { blocks: { type: 'FeatureCollection', features: blocks }, water, risk, labels, grid };
}
