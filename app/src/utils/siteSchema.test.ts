import { describe, expect, it } from 'vitest';
import sites from '../../public/data.json';
import { WORLD_EXAMPLES } from '../data/worldExamples';
import { buildComponentsDetail, getSiteLayout } from './siteDerived';
import { validateSites } from './siteSchema';

// Removed GOKCEKAYA_UPPER_POLYGON constant

describe('validateSites', () => {
  it('accepts the Kamu Kurumları 16 + seawater top4 candidate dataset', () => {
    const result = validateSites(sites);

    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.sites).toHaveLength(15);
    expect(new Set(result.sites.map((site) => site.id)).size).toBe(15);

    expect(result.sites.filter((site) => site.pdhesType === 'OPEN_LOOP')).toHaveLength(12);
    expect(result.sites.filter((site) => site.pdhesType === 'SEA_WATER')).toHaveLength(3);
    expect(result.sites.some((site) => site.id === 'presenzano')).toBe(false);
    expect(result.sites.map((site) => site.id).slice(12)).toEqual([
      'tasucu',
      'bozyazi_anamur',
      'karaburun',
    ]);
  });

  it('keeps technical values and approximate coordinate confidence explicit', () => {
    const result = validateSites(sites);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const sariyar = result.sites.find((site) => site.id === 'kamu-sariyar-pspp');
    expect(sariyar).toMatchObject({
      name: 'Sarıyar PDHES',
      province: 'Ankara',
      capacityMW: 1000,
      projectFlowCms: 270,
      headM: 434,
      shaftLengthM: 387,
      penstockLengthM: 595,
      tailraceTunnelLengthM: 815,
      pdhesType: 'OPEN_LOOP',
    });
    expect(sariyar?.coordinates.coordinateConfidence).toBe('fallback-approximate');
    expect(sariyar?.technicalClassification.primaryPurpose).toBe('PEAK_POWER');
  });

  it('keeps the updated Gokcekaya polygon footprint drawing coordinates', () => {
    const result = validateSites(sites);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const gokcekaya = result.sites.find((site) => site.id === 'kamu-gokcekaya-pspp');
    expect(gokcekaya).toBeTruthy();
    if (!gokcekaya) return;

    expect(gokcekaya.coordinates.mapAnchor).toEqual([31.0065, 40.0404]);
    expect(gokcekaya.coordinates.lowerReservoir.point).toEqual([31.0150, 40.0413]);
    expect(gokcekaya.coordinates.upperReservoir.point).toEqual([30.9921, 40.0515]);
    expect(gokcekaya.coordinates.powerhouse.point).toEqual([31.0065, 40.0404]);
    expect(gokcekaya.coordinates.switchyard.point).toEqual([31.0060, 40.0353]);
    expect(gokcekaya.coordinates.bbox).toEqual([30.9798, 40.0318, 31.0258, 40.0635]);

    const layout = getSiteLayout(gokcekaya);
    expect(layout.upper).toEqual([30.9921, 40.0515]);
    expect(layout.lower).toEqual([31.0150, 40.0413]);
    expect(layout.power).toEqual([31.0065, 40.0404]);
    expect(layout.switchyard).toEqual([31.0060, 40.0353]);

    expect(gokcekaya.layout3D?.useFootprintPolygons).toBe(true);
    expect(gokcekaya.layout3D?.hideLegacySquareReservoir).toBe(true);
    // componentFootprints are now lazy-loaded and not expected in data.json

    const details = buildComponentsDetail(gokcekaya);
    expect(details.upper_reservoir).toMatchObject({
      elevation_m: 801,
      active_volume_mcm: 10.8,
      dam_height_m: 38,
      render_mode: 'polygon_footprint',
    });
  });

  it('classifies selected seawater prototypes with sea lower reservoir rules', () => {
    const result = validateSites(sites);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const seaSites = result.sites.filter((site) => site.pdhesType === 'SEA_WATER');
    expect(seaSites.map((site) => site.score)).toEqual([54, 59, 62]);
    expect(seaSites.every((site) =>
      site.technicalClassification.cycleType === 'SEA_LOWER_RESERVOIR'
      && site.technicalClassification.infrastructureType === 'SEAWATER_COASTAL'
      && site.technicalClassification.conceptType === 'SEAWATER',
    )).toBe(true);
    expect(seaSites.every((site) => site.risks.includes('Deniz suyu korozyonu'))).toBe(true);
  });

  it('moves Presenzano to world examples without keeping it as a Turkey candidate', () => {
    const result = validateSites(sites);
    expect(result.ok).toBe(true);
    expect(result.sites.some((site) => site.id === 'presenzano')).toBe(false);

    const presenzano = WORLD_EXAMPLES.find((example) => example.id === 'presenzano');
    expect(presenzano).toMatchObject({
      name: 'Presenzano (Domenico Cimarosa) PSPP',
      country: 'İtalya',
      capacityMw: 1000,
      headM: 498,
      lat: 41.3878,
      lon: 14.073,
    });
  });

  it('rejects legacy type fields and malformed coordinates', () => {
    const invalid = [{
      ...sites[0],
      sourceGroup: 'SEA_WATER_PROTOTYPE_TOP4',
      coordinates: { ...sites[0].coordinates, mapAnchor: [190, 95] },
    }];
    const result = validateSites(invalid);

    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('eski sourceGroup'))).toBe(true);
    expect(result.errors.some((error) => error.includes('coordinates.mapAnchor'))).toBe(true);
  });

  it('rejects malformed Gokcekaya-style footprint geometry', () => {
    const invalid = [{
      ...sites[0],
      coordinates: {
        ...sites[0].coordinates,
        upperReservoirPolygon: [[30.1, 40.1], [30.2, 40.2], [30.3, 40.3]],
      },
      layout3D: {
        scale: 'macro',
        preferredBearing: -32,
        terrainExaggeration: 1.35,
        reservoirSurfaceMode: 'polygon',
        useFootprintPolygons: true,
        hideLegacySquareReservoir: true,
        componentFootprints: [{
          id: 'badFootprint',
          component: 'upper_reservoir',
          kind: 'polygon',
          material: 'bad_material',
          closed: true,
          coords: [[30.1, 40.1], [30.2, 40.2], [30.3, 40.3]],
          baseElevationM: 801,
          topElevationM: 801,
          extrudeM: 0,
        }],
      },
    }];
    const result = validateSites(invalid);

    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('upperReservoirPolygon'))).toBe(true);
    expect(result.errors.some((error) => error.includes('layout3D.componentFootprints'))).toBe(true);
    expect(result.errors.some((error) => error.includes('material'))).toBe(true);
  });

  it('rejects duplicate IDs', () => {
    const duplicate = [sites[0], { ...sites[1], id: sites[0].id }];
    const result = validateSites(duplicate);

    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('tekrar'))).toBe(true);
  });
});
