import type { Feature, FeatureCollection, LineString, Point, Polygon } from 'geojson';
import type { Site } from '../types/site';
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
    upperReservoirWater: site.upperReservoirDescription,
    upperReservoirEmbankment: '\u00dcst rezervuar set g\u00f6vdesi',
    upperIntake: '\u00dcst rezervuar intake yap\u0131s\u0131',
    surgeTankFootprint: 'Denge bacas\u0131',
    serviceDrainPortal: 'Servis + drenaj t\u00fcneli portal\u0131',
    powerhouseFootprint: 'T\u00fcrbin odas\u0131',
    switchyardFootprint: '\u015ealt / trafo sahas\u0131',
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
      .filter((footprint) => footprint.kind === 'polygon')
      .forEach((footprint) => {
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
      addRect('lower_reservoir', site.lowerReservoirName, layout.lower, 900, 500, 16, '#1fb6ff', bearing - 10);
    }
  } else if (sea) {
    addRect('upper_reservoir', 'Kaplamalı üst rezervuar', layout.upper, 980, 760, 42, '#4aa3ff', bearing + 8);
    addRect('lower_reservoir', 'Deniz alım/deşarj yapısı', layout.lower, 140, 90, 18, '#8a9597', bearing - 18);
    addRect('powerhouse', 'Türbin Odası', layout.power, 260, 150, 70, '#b277ff', bearing + 2);
    addCircle('surge_tank', 'Denge bacası', layout.surge, 70, 115, '#ffd75a');
    addRect('switchyard', '154/380 kV şalt sahası', layout.switchyard, 340, 240, 28, '#48f49a', bearing - 12);
    addRect('portal', 'Tünel portalı / servis alanı', mid(layout.upper, layout.power, 0.55), 220, 120, 24, '#ff944d', bearing + 16);
  } else {
    addRect('upper_reservoir', site.upperReservoirDescription, layout.upper, 1100, 850, 36, '#4aa3ff', bearing + 4);
    addRect('lower_reservoir', site.lowerReservoirName, layout.lower, 900, 500, 16, '#1fb6ff', bearing - 10);
    addRect('powerhouse', 'Türbin Odası', layout.power, 320, 170, 78, '#b277ff', bearing + 1);
    addCircle('surge_tank', 'Denge bacası', layout.surge, 82, 120, '#ffd75a');
    addRect('switchyard', 'Şalt / trafo sahası', layout.switchyard, 390, 260, 32, '#48f49a', bearing - 7);
    addRect('portal', 'Servis + drenaj tüneli portalı', mid(layout.upper, layout.power, 0.58), 240, 125, 22, '#ff944d', bearing + 12);
  }

  const waterFeatures: Feature<LineString>[] = [];

  if (footprintMode && site.layout3D) {
    site.layout3D.componentFootprints
      .filter((fp) => fp.kind === 'polyline' && (fp.id.includes('penstock') || fp.id.includes('headrace') || fp.id.includes('tailrace')))
      .forEach((fp) => {
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
    features: blocks.map((feature) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: centroid(feature.geometry.coordinates[0] as [number, number][]) },
      properties: { label: feature.properties?.label },
    })),
  };

  const grid: FeatureCollection<LineString> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [layout.gridA, layout.switchyard, layout.gridB] },
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
