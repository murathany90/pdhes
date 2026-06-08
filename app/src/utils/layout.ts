import type { Feature, FeatureCollection, LineString, Point, Polygon } from 'geojson';
import type { Site } from '../types/site';
import { circlePolygon, centroid, mid, offset, rotatedRectangle } from './geo';

export interface LayoutBundle {
  blocks: FeatureCollection<Polygon>;
  water: FeatureCollection<LineString>;
  risk: FeatureCollection<Polygon>;
  labels: FeatureCollection<Point>;
  grid: FeatureCollection<LineString>;
}

export function buildLayout(s: Site, hScale: number): LayoutBundle {
  const layout = s.layout;
  const bearing = layout.bearing;
  const blocks: Feature<Polygon>[] = [];

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

  if (s.concept === 'sea') {
    addRect('upper_reservoir', 'Kaplamalı üst rezervuar', layout.upper, 980, 760, 42, '#4aa3ff', bearing + 8);
    addRect('lower_reservoir', 'Deniz alım/deşarj yapısı', layout.lower, 420, 180, 18, '#1fb6ff', bearing - 18);
    addRect('powerhouse', 'Yeraltı güç evi (powerhouse)', layout.power, 260, 150, 70, '#b277ff', bearing + 2);
    addCircle('surge_tank', 'Denge bacası (surge tank)', layout.surge, 70, 115, '#ffd75a');
    addRect('switchyard', '154/380 kV şalt sahası (switchyard)', layout.switchyard, 340, 240, 28, '#48f49a', bearing - 12);
    addRect('portal', 'Tünel portalı / servis alanı', mid(layout.upper, layout.power, .55), 220, 120, 24, '#ff944d', bearing + 16);
  } else {
    addRect('upper_reservoir', 'Üst rezervuar', layout.upper, 1100, 850, 36, '#4aa3ff', bearing + 4);
    addRect('lower_reservoir', 'Mevcut alt rezervuar', layout.lower, 900, 500, 16, '#1fb6ff', bearing - 10);
    addRect('powerhouse', 'Yeraltı güç evi (powerhouse)', layout.power, 320, 170, 78, '#b277ff', bearing + 1);
    addCircle('surge_tank', 'Denge bacası (surge tank)', layout.surge, 82, 120, '#ffd75a');
    addRect('switchyard', '380 kV şalt / trafo sahası', layout.switchyard, 390, 260, 32, '#48f49a', bearing - 7);
    addRect('portal', 'Servis + drenaj tüneli portalı', mid(layout.upper, layout.power, .58), 240, 125, 22, '#ff944d', bearing + 12);
  }

  const water: FeatureCollection<LineString> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [layout.upper, layout.surge, layout.power, layout.lower] },
        properties: { color: '#36d6ff', width: 4 },
      },
    ],
  };
  const risk: FeatureCollection<Polygon> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [circlePolygon(layout.risk, s.concept === 'sea' ? 1700 : 1450, 64)] },
        properties: { label: 'risk buffer' },
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
