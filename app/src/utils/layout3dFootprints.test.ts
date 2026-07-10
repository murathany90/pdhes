import { describe, expect, it } from 'vitest';
import sites from '../../public/data.json';
import type { Site } from '../types/site';
import { buildLayout3DFootprintPlan, projectLngLatToScene } from './layout3dFootprints';

import fs from 'fs';
import path from 'path';

const rawGokcekaya = (sites as Site[]).find((site) => site.id === 'kamu-gokcekaya-pspp');
const footprints = JSON.parse(fs.readFileSync(path.join(__dirname, '../../public/footprints/kamu-gokcekaya-pspp.json'), 'utf-8'));
const gokcekaya = rawGokcekaya ? { ...rawGokcekaya, layout3D: { ...rawGokcekaya.layout3D!, componentFootprints: footprints } } : undefined;

describe('layout3D footprint planning', () => {
  it('projects lon/lat coordinates around the bbox center into local scene space', () => {
    expect(gokcekaya).toBeTruthy();
    if (!gokcekaya) return;

    const [minLon, minLat, maxLon, maxLat] = gokcekaya.coordinates.bbox;
    const center: [number, number] = [(minLon + maxLon) / 2, (minLat + maxLat) / 2];
    const centerPoint = projectLngLatToScene(center, gokcekaya.coordinates.bbox);
    const eastPoint = projectLngLatToScene([center[0] + 0.001, center[1]], gokcekaya.coordinates.bbox);
    const northPoint = projectLngLatToScene([center[0], center[1] + 0.001], gokcekaya.coordinates.bbox);

    expect(centerPoint.x).toBeCloseTo(0, 6);
    expect(centerPoint.z).toBeCloseTo(0, 6);
    expect(eastPoint.x).toBeGreaterThan(0);
    expect(northPoint.z).toBeLessThan(0);
  });

  it('plans Gokcekaya footprint meshes and hides the legacy upper reservoir', () => {
    expect(gokcekaya).toBeTruthy();
    if (!gokcekaya) return;

    const plan = buildLayout3DFootprintPlan(gokcekaya);
    const upperWater = plan.items.find((item) => item.id === 'upperReservoirWater');
    const embankment = plan.items.find((item) => item.id === 'upperReservoirEmbankment');
    const headrace = plan.items.find((item) => item.id === 'penstock01');

    expect(plan.enabled).toBe(true);
    expect(plan.hideLegacySquareReservoir).toBe(true);
    expect(upperWater).toMatchObject({
      kind: 'polygon',
      material: 'water',
      extrudeY: 0,
    });
    expect(upperWater?.points).toHaveLength(10);
    expect(embankment?.kind).toBe('polygon');
    expect(embankment?.material).toBe('embankment');
    expect(embankment?.extrudeY).toBeGreaterThan(0);
    expect(headrace?.kind).toBe('polyline');
    expect(headrace?.points).toHaveLength(4);
  });

  it('keeps sites without layout3D footprints on the legacy 3D path', () => {
    const plan = buildLayout3DFootprintPlan({ ...sites[1], layout3D: undefined } as Site);

    expect(plan.enabled).toBe(false);
    expect(plan.hideLegacySquareReservoir).toBe(false);
    expect(plan.items).toEqual([]);
  });
});
