import { describe, expect, it } from 'vitest';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { createFlowParticleCollection, createFlowParticlePlans } from './flowParticles';

function rivers(properties: GeoJsonProperties = {}): FeatureCollection<Geometry, GeoJsonProperties> {
  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      id: 'river-1',
      properties: { id: 'river-1', flowParticleActive: true, selectedRiver: true, ...properties },
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [[30, 40], [30.2, 40]],
          [[42.69, 40.14], [42.71, 40.13]],
        ],
      },
    }],
  };
}

describe('flow particle animation', () => {
  it('uses the river component nearest to the selected HES', () => {
    const plans = createFlowParticlePlans(rivers(), [42.7, 40.14]);
    expect(plans).toHaveLength(2);
    expect(plans[0].coordinates[0][0]).toBeGreaterThan(42);
  });

  it('moves representative particles without claiming a verified direction', () => {
    const plans = createFlowParticlePlans(rivers(), [42.7, 40.14]);
    const first = createFlowParticleCollection(plans.slice(0, 1), 0, 1, 8);
    const later = createFlowParticleCollection(plans.slice(0, 1), 0.75, 1, 8);
    expect(first.features[0].properties?.directionMode).toBe('representative');
    expect(first.features[0].geometry.coordinates).not.toEqual(later.features[0].geometry.coordinates);
  });

  it('applies speed changes directly to the next frame', () => {
    const plans = createFlowParticlePlans(rivers({ directionVerified: true, coordinatesFollowFlow: true }), [42.7, 40.14]);
    const slow = createFlowParticleCollection(plans.slice(0, 1), 1, 0.25, 8);
    const fast = createFlowParticleCollection(plans.slice(0, 1), 1, 3, 8);
    expect(slow.features[0].properties?.directionMode).toBe('verified');
    expect(slow.features[0].geometry.coordinates).not.toEqual(fast.features[0].geometry.coordinates);
  });
});
