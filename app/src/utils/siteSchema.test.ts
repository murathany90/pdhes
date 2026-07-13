import { describe, expect, it } from 'vitest';
import sites from '../../public/data.json';
import { WORLD_EXAMPLES } from '../data/worldExamples';
import { buildComponentsDetail, getSiteLayout } from './siteDerived';
import { validateSites } from './siteSchema';

// Removed GOKCEKAYA_UPPER_POLYGON constant
const TARGET_3D_SITE_IDS = [
  'kamu-gokcekaya-pspp',
  'kamu-sariyar-pspp',
  'altinkaya',
  'kamu-bayramhacili-pspp',
  'kamu-hasan-ugurlu-pspp',
  'kamu-adiguzel-pspp',
  'kamu-kargi-pspp',
  'kamu-yamula-pspp',
  'kamu-oymapinar-pspp',
  'kamu-aslantas-pspp',
  'kamu-demirkopru-pspp',
];

const footprintModules = import.meta.glob('../../public/footprints/*.json', { eager: true }) as Record<string, { default: any[] }>;

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

  it('keeps Gokcekaya marker on the powerhouse while using an independent 3D map anchor', () => {
    const result = validateSites(sites);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const gokcekaya = result.sites.find((site) => site.id === 'kamu-gokcekaya-pspp');
    expect(gokcekaya).toBeTruthy();
    if (!gokcekaya) return;

    expect(gokcekaya.coordinates.mapAnchor).toEqual([31.00965069, 40.04173955]);
    expect(gokcekaya.coordinates.powerhouse.point).toEqual([31.0065, 40.0404]);
    expect(gokcekaya.coordinates.mapAnchor).not.toEqual(gokcekaya.coordinates.powerhouse.point);

    const layout = getSiteLayout(gokcekaya);
    expect(layout.power).toEqual([31.0065, 40.0404]);

    expect(gokcekaya.layout3D?.useFootprintPolygons).toBe(true);
    expect(gokcekaya.layout3D?.hideLegacySquareReservoir).toBe(true);
    expect(gokcekaya.layout3D?.componentFootprints).toBeUndefined();
    // componentFootprints are now lazy-loaded and not expected in data.json

    const details = buildComponentsDetail(gokcekaya);
    expect(details.upper_reservoir).toMatchObject({
      active_volume_mcm: 10.840809896995713,
      render_mode: 'polygon_footprint',
    });
    expect(details.upper_reservoir.elevation_m).toBeGreaterThan(0);
    expect(details.upper_reservoir.dam_height_m).toBeGreaterThan(0);
  });

  it('keeps all 11 enhanced 3D layouts lazy-loaded with volume validation metadata', () => {
    const result = validateSites(sites);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    for (const siteId of TARGET_3D_SITE_IDS) {
      const site = result.sites.find((item) => item.id === siteId);
      expect(site).toBeTruthy();
      expect(site?.layout3D?.useFootprintPolygons).toBe(true);
      expect(site?.layout3D?.componentFootprints).toBeUndefined();

      const footprintModule = footprintModules[`../../public/footprints/${siteId}.json`];
      expect(footprintModule).toBeTruthy();
      const upperWater = footprintModule.default.find((footprint) => footprint.id === 'upperReservoirWater');
      const powerhouse = footprintModule.default.find((footprint) => footprint.id === 'powerhouseFootprint');
      expect(upperWater?.activeVolumeHm3).toBeGreaterThan(0);
      expect(upperWater?.activeDepthM).toBe(25);
      expect(upperWater?.surfaceAreaM2).toBeGreaterThan(0);
      expect(Math.abs(upperWater?.volumeValidationDifferencePct ?? Number.POSITIVE_INFINITY)).toBeLessThanOrEqual(2);
      expect(powerhouse?.coords).toHaveLength(5);
    }
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
