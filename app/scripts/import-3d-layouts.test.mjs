import { describe, expect, it } from 'vitest';
import sites from '../public/data.json' with { type: 'json' };
import referenceSites from '../../docs/PDHES_11_Santral_3D_Gelistirilmis_Tek_JSON.json' with { type: 'json' };
import {
  TARGET_SITE_IDS,
  distanceMeters,
  findFootprint,
  prepare3DGeometryUpdate,
  polygonAreaM2,
} from './import-3d-layouts.mjs';

const processed = prepare3DGeometryUpdate(sites, referenceSites);

function assertFiniteCoordinate(coord) {
  expect(Array.isArray(coord)).toBe(true);
  expect(coord).toHaveLength(2);
  expect(Number.isFinite(coord[0])).toBe(true);
  expect(Number.isFinite(coord[1])).toBe(true);
}

describe('import-3d-layouts geometry processor', () => {
  it('updates exactly the 11 target ids and keeps footprints out of data.json', () => {
    expect(TARGET_SITE_IDS).toHaveLength(11);
    expect(processed.report).toHaveLength(11);
    expect([...processed.footprintFiles.keys()].sort()).toEqual([...TARGET_SITE_IDS].sort());

    const targetIds = new Set(TARGET_SITE_IDS);
    processed.sites.forEach((site, index) => {
      if (targetIds.has(site.id)) {
        expect(site.layout3D?.useFootprintPolygons).toBe(true);
        expect(site.layout3D?.componentFootprints).toBeUndefined();
      } else {
        expect(site).toEqual(sites[index]);
      }
    });
  });

  it('places each target marker at the powerhouse and reports a small marker distance', () => {
    for (const site of processed.sites.filter((item) => TARGET_SITE_IDS.includes(item.id))) {
      const footprints = processed.footprintFiles.get(site.id);
      const powerhouse = findFootprint(footprints, ['powerhouseFootprint', 'powerhouse']);

      assertFiniteCoordinate(site.coordinates.powerhouse.point);
      expect(site.layout.power).toEqual(site.coordinates.powerhouse.point);
      expect(powerhouse).toBeTruthy();

      const distance = distanceMeters(site.coordinates.powerhouse.point, processed.metadataById.get(site.id).powerhouseCentroid);
      expect(distance).toBeLessThanOrEqual(80);
    }
  });

  it('scales upper reservoir water polygons to active volume metadata within 2 percent', () => {
    for (const [siteId, footprints] of processed.footprintFiles) {
      const water = findFootprint(footprints, ['upperReservoirWater']);
      expect(water).toBeTruthy();
      expect(water.activeVolumeHm3).toBeGreaterThan(0);
      expect(water.activeDepthM).toBeGreaterThan(0);
      expect(water.surfaceAreaM2).toBeGreaterThan(0);
      expect(Math.abs(water.volumeValidationDifferencePct)).toBeLessThanOrEqual(2);

      const area = polygonAreaM2(water.coords);
      expect(area).toBeCloseTo(water.surfaceAreaM2, -1);
      expect(processed.report.find((row) => row.id === siteId)?.volumeValidationDifferencePct).toBeLessThanOrEqual(2);
    }
  });

  it('shrinks switchyard, portal, powerhouse, and surge footprints by the requested linear factors', () => {
    for (const row of processed.report) {
      expect(row.switchyardScale).toBeCloseTo(0.4, 5);
      expect(row.portalScale).toBeCloseTo(0.4, 5);
      expect(row.powerhouseScale).toBeCloseTo(0.6, 5);
      expect(row.surgeScale).toBeCloseTo(0.6, 5);
    }
  });

  it('keeps route interior vertices while allowing terminal endpoints to reconnect', () => {
    for (const refSite of referenceSites) {
      const updated = processed.footprintFiles.get(refSite.id);
      for (const refRoute of refSite.layout3D.componentFootprints.filter((fp) => fp.kind === 'polyline')) {
        const updatedRoute = updated.find((fp) => fp.id === refRoute.id);
        expect(updatedRoute).toBeTruthy();
        expect(updatedRoute.coords).toHaveLength(refRoute.coords.length);

        if (refRoute.coords.length > 2) {
          expect(updatedRoute.coords.slice(1, -1)).toEqual(refRoute.coords.slice(1, -1));
        }
      }
    }
  });
});
