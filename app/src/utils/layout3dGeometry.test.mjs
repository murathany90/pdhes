import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { readFileSync } from 'node:fs';
import { makeTestSite } from '../test-utils/makeTestSite';
import { buildLayout3DFootprintPlan, isFootprintLayerVisible } from './layout3dFootprints';
import { auditWaterwayConnections, createFootprintPolygonGeometry, footprintSurfacePositionOffset, generationWaterwayPoints, representativeWaterwayLinks, reservoirSurfaceOffset, schematicTerrainGuide, schematicTerrainHeight } from './layout3dGeometry';

describe('source footprint rendering', () => {
  it.each(['kamu-gokcekaya-pspp', 'kamu-sariyar-pspp'])('keeps %s coordinates and exposes the water through the embankment', (id) => {
    const footprints = JSON.parse(readFileSync(new URL(`../../public/footprints/${id}.json`, import.meta.url), 'utf8'));
    const before = JSON.stringify(footprints);
    const site = makeTestSite({ layout3D: { scale: 'macro', preferredBearing: 0, terrainExaggeration: 1, reservoirSurfaceMode: 'polygon', useFootprintPolygons: true, hideLegacySquareReservoir: true, componentFootprints: footprints } });
    const plan = buildLayout3DFootprintPlan(site);
    const water = plan.items.find((item) => item.id === 'upperReservoirWater');
    const bank = plan.items.find((item) => item.id === 'upperReservoirEmbankment');
    const surface = createFootprintPolygonGeometry(water);
    const wall = createFootprintPolygonGeometry(bank, water);
    const vertices = surface.attributes.position;
    // Use an actual water triangle centroid (not the centroid of a concave ring).
    const indices = surface.index.array;
    const center = new THREE.Vector3();
    for (const index of [indices[0], indices[1], indices[2]]) center.add(new THREE.Vector3().fromBufferAttribute(vertices, index));
    center.divideScalar(3);
    const ray = new THREE.Raycaster(new THREE.Vector3(center.x, bank.topY + 100, center.z), new THREE.Vector3(0, -1, 0));
    const material = new THREE.MeshBasicMaterial();
    expect(ray.intersectObject(new THREE.Mesh(wall, material))).toHaveLength(0);
    expect(ray.intersectObject(new THREE.Mesh(surface, material)).length).toBeGreaterThan(0);
    expect(surface.attributes.normal.getY(0)).toBeCloseTo(1);
    expect(JSON.stringify(footprints)).toBe(before);
    expect(reservoirSurfaceOffset(0.3)).toBeLessThan(reservoirSurfaceOffset(0.7));
    surface.dispose(); wall.dispose(); material.dispose();
  });

  it('orients a reversed pipe downhill and scopes pressure/tailrace aliases to their own layers', () => {
    const item = { id: 'pipe', component: 'pressure_tunnel', kind: 'polyline', material: 'tunnel_axis', closed: false, baseY: 0, topY: 20, extrudeY: 0, points: [{ x: 1, y: 0, z: 0 }, { x: 0, y: 20, z: 0 }] };
    expect(generationWaterwayPoints(item, [item])[0][1]).toBe(21);
    expect(item.points[0].y).toBe(0);
    expect(isFootprintLayerVisible(item, { tunnel: false, penstock: true })).toBe(false);
    expect(isFootprintLayerVisible({ component: 'tailrace_channel' }, { tailrace: false })).toBe(false);
  });
});

describe('reference site hydraulic source continuity', () => {
  const load = (id) => {
    const footprints = JSON.parse(readFileSync(new URL(`../../public/footprints/${id}.json`, import.meta.url), 'utf8'));
    const site = makeTestSite({ layout3D: { scale: 'macro', preferredBearing: 0, terrainExaggeration: 1, reservoirSurfaceMode: 'polygon', useFootprintPolygons: true, hideLegacySquareReservoir: true, componentFootprints: footprints } });
    return { footprints, plan: buildLayout3DFootprintPlan(site) };
  };

  it('does not disguise the two broken Gökçekaya penstock branches as connected surveyed tunnels', () => {
    const { footprints, plan } = load('kamu-gokcekaya-pspp');
    const before = JSON.stringify(footprints);
    const audit = auditWaterwayConnections(plan.items);
    const broken = audit.filter((row) => row.status === 'disconnected');
    expect(audit).toHaveLength(8);
    expect(broken.map((row) => [row.penstockId, row.side])).toEqual([
      ['penstock03', 'inlet'], ['penstock03', 'outlet'],
      ['penstock04', 'inlet'], ['penstock04', 'outlet'],
    ]);
    expect(broken.every((row) => row.gapMeters > 80)).toBe(true);
    const guides = representativeWaterwayLinks(plan.items);
    expect(guides.map((link) => link.id)).toEqual(['penstock01-outlet', 'penstock02-outlet']);
    expect(JSON.stringify(footprints)).toBe(before);
  });

  it('does not add fake schematic connectors to the joined Sarıyar line', () => {
    const { plan } = load('kamu-sariyar-pspp');
    const audit = auditWaterwayConnections(plan.items);
    expect(audit).toHaveLength(2);
    expect(audit.every((row) => row.status === 'connected')).toBe(true);
    expect(representativeWaterwayLinks(plan.items)).toEqual([]);
  });

  it.each(['kamu-gokcekaya-pspp', 'kamu-sariyar-pspp'])('builds a schematic elevation gradient for %s without moving source geometry', (id) => {
    const { footprints, plan } = load(id);
    const before = JSON.stringify(footprints);
    const guide = schematicTerrainGuide(plan.items);
    expect(guide).toBeTruthy();
    expect(schematicTerrainHeight(guide.upper.x, guide.upper.z, guide)).toBeGreaterThan(
      schematicTerrainHeight(guide.lower.x, guide.lower.z, guide) + 10,
    );
    expect(JSON.stringify(footprints)).toBe(before);
  });

  it('never moves dam embankments or powerhouse footprints with simulated SOC', () => {
    expect(footprintSurfacePositionOffset('embankment', 0.1)).toBe(0);
    expect(footprintSurfacePositionOffset('industrial', 0.9)).toBe(0);
    expect(footprintSurfacePositionOffset('water', 0.1)).toBeLessThan(footprintSurfacePositionOffset('water', 0.9));
  });
});
