import { describe, expect, it } from 'vitest';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { advanceFlowDistance, createCascadeFlowGuides, createFlowParticleCollection, createFlowParticlePlans } from './flowParticles';

function rivers(coordinates: number[][][], properties: GeoJsonProperties = {}): FeatureCollection<Geometry, GeoJsonProperties> {
  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      id: 'river-1',
      properties: { id: 'river-1', flowParticleActive: true, selectedRiver: true, ...properties },
      geometry: { type: 'MultiLineString', coordinates },
    }],
  };
}

describe('flow particle animation', () => {
  it('orients real river geometry from the higher cascade HES to the lower HES', () => {
    const hes: FeatureCollection<Geometry, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', id: 'high', properties: { id: 'high', name: 'Yüksek HES', riverSystemId: 'river-1', maxWaterLevelM: 900 }, geometry: { type: 'Point', coordinates: [31, 40] } },
        { type: 'Feature', id: 'low', properties: { id: 'low', name: 'Düşük HES', riverSystemId: 'river-1', maxWaterLevelM: 500 }, geometry: { type: 'Point', coordinates: [30, 40] } },
      ],
    };
    const cascades: FeatureCollection<Geometry, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', properties: { fromId: 'high', toId: 'low' }, geometry: { type: 'LineString', coordinates: [[31, 40], [30, 40]] } }],
    };
    const guides = createCascadeFlowGuides(hes, cascades);
    const plans = createFlowParticlePlans(rivers([[[30, 40], [31, 40]]]), [31, 40], undefined, guides);
    expect(guides).toHaveLength(1);
    expect(plans[0]).toMatchObject({ directionMode: 'cascade-elevation', directionSign: -1, elevationDropM: 400 });
    const particles = createFlowParticleCollection(plans, 2, 6).features.filter((feature) => feature.properties?.trailStep === 0);
    expect(new Set(particles.map((feature) => feature.properties?.travelDirection))).toEqual(new Set([-1]));
  });

  it('does not claim a cascade direction without shared river and elevation evidence', () => {
    const hes: FeatureCollection<Geometry, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', id: 'a', properties: { id: 'a', riverSystemId: 'river-1', maxWaterLevelM: 900 }, geometry: { type: 'Point', coordinates: [30, 40] } },
        { type: 'Feature', id: 'b', properties: { id: 'b', riverSystemId: 'river-2' }, geometry: { type: 'Point', coordinates: [31, 40] } },
      ],
    };
    const cascades: FeatureCollection<Geometry, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', properties: { fromId: 'a', toId: 'b' }, geometry: { type: 'LineString', coordinates: [[30, 40], [31, 40]] } }],
    };
    expect(createCascadeFlowGuides(hes, cascades)).toEqual([]);
  });

  it('renders a bright head and trailing points so movement direction is visible', () => {
    const plans = createFlowParticlePlans(rivers([[[30, 40], [31, 40]]]), [30.5, 40]);
    const particles = createFlowParticleCollection(plans, 2, 5);
    const grouped = new Map<string, number[]>();
    particles.features.forEach((feature) => grouped.set(String(feature.properties?.particleId), [...(grouped.get(String(feature.properties?.particleId)) ?? []), Number(feature.properties?.trailStep)]));
    expect([...grouped.values()].every((steps) => steps.sort().join(',') === '0,1,2')).toBe(true);
  });

  it('stitches every endpoint-connected segment instead of keeping two nearby snippets', () => {
    const plans = createFlowParticlePlans(rivers([
      [[30, 40], [30.1, 40]],
      [[30.1, 40], [30.2, 40]],
      [[30.2, 40], [30.3, 40]],
      [[31, 41], [31.1, 41]],
      [[32, 42], [32.1, 42]],
    ]), [30.15, 40]);
    expect(plans).toHaveLength(3);
    expect(plans[0].edgeBreaksKm).toHaveLength(3);
    expect(plans.flatMap((plan) => plan.edgeBreaksKm)).toHaveLength(5);
    expect(new Set(createFlowParticleCollection(plans, 0, 8).features.map((feature) => feature.properties?.routeId)).size).toBe(3);
  });

  it('keeps branches as separate real routes without a synthetic connector', () => {
    const plans = createFlowParticlePlans(rivers([
      [[30, 40], [30.1, 40]],
      [[30.1, 40], [30.2, 40]],
      [[30.1, 40], [30.1, 40.1]],
    ]), [30.1, 40]);
    expect(plans).toHaveLength(3);
    expect(plans.every((plan) => plan.edgeBreaksKm.length === 1)).toBe(true);
  });

  it('keeps one particle continuous while it crosses a source-segment boundary', () => {
    const plans = createFlowParticlePlans(rivers([
      [[30, 40], [30.1, 40]],
      [[30.1, 40], [30.2, 40]],
    ]), [30.1, 40]);
    const first = createFlowParticleCollection(plans, 0, 8);
    const particleId = first.features[0].id;
    const initialSegment = first.features[0].properties?.sourceSegmentIndex;
    const crossed = Array.from({ length: 80 }, (_, index) => createFlowParticleCollection(plans, index * 0.5, 8)
      .features.find((feature) => feature.id === particleId)?.properties?.sourceSegmentIndex)
      .some((segment) => segment !== initialSegment);
    expect(crossed).toBe(true);
  });

  it('uses opposite travel directions when river direction is not verified', () => {
    const plans = createFlowParticlePlans(rivers([[[30, 40], [31, 40]]]), [30.5, 40]);
    const particles = createFlowParticleCollection(plans, 2, 8);
    expect(new Set(particles.features.map((feature) => feature.properties?.directionMode))).toEqual(new Set(['representative']));
    expect(new Set(particles.features.map((feature) => feature.properties?.travelDirection))).toEqual(new Set([1, -1]));
  });

  it('uses directed motion only when metadata and stitched source order agree', () => {
    const properties = { directionVerified: true, coordinatesFollowFlow: true };
    const ordered = createFlowParticlePlans(rivers([
      [[30, 40], [30.1, 40]],
      [[30.1, 40], [30.2, 40]],
    ], properties), [30, 40]);
    const reversed = createFlowParticlePlans(rivers([
      [[30.1, 40], [30, 40]],
      [[30.1, 40], [30.2, 40]],
    ], properties), [30, 40]);
    expect(ordered[0].directional).toBe(true);
    expect(reversed[0].directional).toBe(false);
  });

  it('advances distance by frame delta and speed without recalculating the prior position', () => {
    const slowDistance = advanceFlowDistance(10, 0.05, 0.25);
    const fastDistance = advanceFlowDistance(slowDistance, 0.05, 3);
    expect(slowDistance).toBeCloseTo(10.1);
    expect(fastDistance).toBeCloseTo(11.3);
  });
});
