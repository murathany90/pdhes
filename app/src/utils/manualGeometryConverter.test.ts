import { describe, expect, it } from 'vitest';
import { makeTestSite } from '../test-utils/makeTestSite';
import type { ManualGeometryFeature, ManualFeatureType, ManualGeometryType } from '../types/manualGeometry';
import { MANUAL_FEATURE_TYPES } from '../types/manualGeometry';
import { buildLayout3DFootprintPlan, footprintLayerKey } from './layout3dFootprints';
import { manualGeometryToFootprints, overrideSiteWithManualGeometries } from './manualGeometryConverter';

const polygon: [number, number][][] = [[
  [31.0, 40.0], [31.001, 40.0], [31.001, 40.001], [31.0, 40.001], [31.0, 40.0],
]];
const line: [number, number][] = [[31, 40], [31.005, 40.004]];
const feature = (type: ManualFeatureType, geometry: ManualGeometryFeature['geometry']): ManualGeometryFeature => ({
  type: 'Feature',
  id: `test-${type}`,
  geometry,
  properties: {
    siteId: 'site-1',
    siteName: 'Test',
    featureType: type,
    displayName: type,
    geometryType: (geometry?.type ?? 'Point') as ManualGeometryType,
    material: MANUAL_FEATURE_TYPES[type].material,
    role: MANUAL_FEATURE_TYPES[type].role,
    source: 'manual_map_drawing',
    confidence: 'conceptual',
    createdAt: '2026-11-14T00:00:00Z',
  },
});

describe('manual drawings to 3D footprints', () => {
  it('translates editor roles into standard 3D layers and valid materials', () => {
    const features = [
      feature('upper_reservoir', { type: 'Polygon', coordinates: polygon }),
      feature('lower_reservoir', { type: 'Polygon', coordinates: polygon }),
      feature('powerhouse', { type: 'Polygon', coordinates: polygon }),
      feature('new_switchyard', { type: 'Polygon', coordinates: polygon }),
      feature('penstock_tunnel_axis', { type: 'LineString', coordinates: line }),
      feature('intake_structure', { type: 'Polygon', coordinates: polygon }),
      feature('tailrace_outfall', { type: 'LineString', coordinates: line }),
    ];
    const result = manualGeometryToFootprints(features);
    expect(result).toHaveLength(7);
    expect(result.map((item) => footprintLayerKey(item.component))).toEqual([
      'upper_reservoir', 'lower_reservoir', 'powerhouse', 'switchyard',
      'penstock', 'upper_reservoir', 'tailrace',
    ]);
    expect(result.find((item) => item.component === 'penstock')?.material).toBe('tunnel_axis');
    expect(result.every((item) => item.coords.length >= (item.kind === 'polygon' ? 3 : 2))).toBe(true);
  });

  it('splits disconnected MultiLineString parts without connecting them falsely', () => {
    const lines = feature('penstock_tunnel_axis', {
      type: 'MultiLineString',
      coordinates: [line, [[31.006, 40.004], [31.01, 40.006]]],
    });
    const result = manualGeometryToFootprints([lines]);
    expect(result.map((item) => item.id)).toEqual([
      'test-penstock_tunnel_axis-part-1',
      'test-penstock_tunnel_axis-part-2',
    ]);
    expect(result.every((item) => item.kind === 'polyline')).toBe(true);
  });

  it('does not fabricate 3D footprints from measurement lines or point markers', () => {
    const site = makeTestSite({ id: 'site-1' });
    const features = [
      feature('distance', { type: 'LineString', coordinates: line }),
      feature('powerhouse', { type: 'Point', coordinates: [31, 40] }),
    ];
    expect(manualGeometryToFootprints(features)).toEqual([]);
    expect(overrideSiteWithManualGeometries(site, features)).toBe(site);
  });

  it('keeps the original footprint plan and adds supported manual drawings', () => {
    const site = makeTestSite({ id: 'site-1' });
    const result = overrideSiteWithManualGeometries(site, [
      feature('upper_reservoir', { type: 'Polygon', coordinates: polygon }),
    ]);
    expect(result.layout3D?.useFootprintPolygons).toBe(true);
    expect(buildLayout3DFootprintPlan(result).items.some((item) => item.component === 'upper_reservoir')).toBe(true);
  });

  it('rejects degenerate manually drawn routes', () => {
    const bad = feature('tailrace_outfall', {
      type: 'LineString', coordinates: [[31, 40]],
    });
    expect(manualGeometryToFootprints([bad])).toEqual([]);
  });
});
