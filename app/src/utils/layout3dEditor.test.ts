import { describe, expect, it } from 'vitest';
import { makeTestSite } from '../test-utils/makeTestSite';
import { validateSites } from './siteSchema';
import {
  applyEditorDerivedLayout,
  ensureClosedRing,
} from './layout3dEditor';

describe('layout3dEditor helpers', () => {
  it('closes polygon rings without duplicating an already closed endpoint', () => {
    const openRing: [number, number][] = [[32, 40], [32.01, 40], [32.01, 40.01], [32, 40.01]];
    const closedRing = ensureClosedRing(openRing);

    expect(closedRing).toHaveLength(5);
    expect(closedRing[0]).toEqual(closedRing[closedRing.length - 1]);
    expect(ensureClosedRing(closedRing)).toHaveLength(5);
  });

  it('creates schema-valid 3D component footprints from edited map geometry', () => {
    const site = makeTestSite({
      coordinates: {
        upperReservoirPolygon: [[32.04, 40.04], [32.06, 40.04], [32.06, 40.06], [32.04, 40.06]],
        lowerReservoirPolygon: [[31.99, 39.99], [32.01, 39.99], [32.01, 40.01], [31.99, 40.01]],
      },
    });

    const prepared = applyEditorDerivedLayout(site);
    const footprints = prepared.layout3D?.componentFootprints ?? [];

    expect(prepared.coordinates.upperReservoirPolygon?.at(0)).toEqual(prepared.coordinates.upperReservoirPolygon?.at(-1));
    expect(prepared.coordinates.lowerReservoirPolygon?.at(0)).toEqual(prepared.coordinates.lowerReservoirPolygon?.at(-1));
    expect(prepared.layout3D?.useFootprintPolygons).toBe(true);
    expect(footprints.map((item) => item.id)).toEqual(expect.arrayContaining([
      'upperReservoirWater',
      'upperReservoirEmbankment',
      'lowerReservoirFootprint',
      'penstock01',
      'powerhouseFootprint',
      'surgeTankFootprint',
      'switchyardFootprint',
      'serviceDrainPortal',
    ]));
    expect(footprints.find((item) => item.id === 'penstock01')?.kind).toBe('polyline');
    const validation = validateSites([prepared]);
    expect(validation.errors).toEqual([]);
    expect(validation.ok).toBe(true);
  });
});
