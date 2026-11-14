import * as THREE from 'three';
import type { Layout3DProjectedFootprint } from './layout3dFootprints';

export function footprintRing(item: Layout3DProjectedFootprint) {
  const points = item.points;
  const first = points[0];
  const last = points.at(-1);
  return first && last && first.x === last.x && first.z === last.z ? points.slice(0, -1) : points;
}

/** Preserve the surveyed X/Z ring. The water opening prevents a solid dam
 * cap from covering the reservoir; this is not a bathymetric reconstruction. */
export function createFootprintPolygonGeometry(
  item: Layout3DProjectedFootprint,
  waterOpening?: Layout3DProjectedFootprint,
): THREE.BufferGeometry {
  const ring = footprintRing(item);
  if (ring.length < 3) return new THREE.BufferGeometry();
  const shape = new THREE.Shape(ring.map((p) => new THREE.Vector2(p.x, -p.z)));
  if (waterOpening) {
    shape.holes.push(new THREE.Path(footprintRing(waterOpening).map((p) => new THREE.Vector2(p.x, -p.z))));
  }
  const depth = item.material === 'water' ? 0 : Math.max(0, item.topY - item.baseY);
  const geometry = depth > 0
    ? new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, steps: 1, curveSegments: 1 })
    : new THREE.ShapeGeometry(shape);
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, depth > 0 ? item.baseY : item.topY, 0);
  return geometry;
}

/** A visual SOC offset only: no stage/storage curve is available. */
export function reservoirSurfaceOffset(soc: number): number {
  return (Math.min(1, Math.max(0, Number.isFinite(soc) ? soc : 0)) - 1) * 2.5 + 0.08;
}

export function generationWaterwayPoints(item: Layout3DProjectedFootprint, plan: Layout3DProjectedFootprint[]) {
  const points = item.points.map((point) => [point.x, point.y + 1, point.z] as [number, number, number]);
  if (points.length < 2) return points;
  const first = points[0], last = points[points.length - 1];
  if (Math.abs(first[1] - last[1]) > 0.01) return first[1] < last[1] ? points.reverse() : points;
  const anchor = plan.find((p) => p.component === (item.component.startsWith('tailrace') ? 'powerhouse' : 'upper_reservoir'));
  if (!anchor) return points;
  const ring = footprintRing(anchor);
  const x = ring.reduce((sum, p) => sum + p.x, 0) / ring.length;
  const z = ring.reduce((sum, p) => sum + p.z, 0) / ring.length;
  return Math.hypot(first[0] - x, first[2] - z) > Math.hypot(last[0] - x, last[2] - z) ? points.reverse() : points;
}

/**
 * The source geometry remains immutable. A short dashed connector may help
 * visualize small schematic endpoint gaps; large gaps must remain visibly
 * disconnected until a surveyed branch or junction geometry is supplied.
 *
 * Projected X/Z coordinates use 0.11 scene units per meter. Y uses the same
 * scale when terrain exaggeration is 1. Values are approximate scene-distance
 * diagnostics, NOT a surveyed as-built pipeline length.
 */
export const WATERWAY_SCENE_UNITS_PER_METER = 0.11;
export const WATERWAY_MAX_SCHEMATIC_GAP_METERS = 25;

export interface WaterwayConnectionAudit {
  penstockId: string;
  side: 'inlet' | 'outlet';
  adjacentId: string | null;
  gapMeters: number | null;
  status: 'connected' | 'schematic-gap' | 'disconnected' | 'missing-reference';
  /** Only these two unmodified source endpoint positions can be bridged. */
  points: [[number, number, number], [number, number, number]] | null;
}

function endpointGapMeters(a: [number, number, number], b: [number, number, number]): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / WATERWAY_SCENE_UNITS_PER_METER;
}

export function auditWaterwayConnections(items: Layout3DProjectedFootprint[]): WaterwayConnectionAudit[] {
  const headraces = items.filter((item) => ['headrace_tunnel', 'pressure_tunnel'].includes(item.component) && item.kind === 'polyline');
  const tailraces = items.filter((item) => item.component.startsWith('tailrace') && item.kind === 'polyline');
  const audits: WaterwayConnectionAudit[] = [];

  for (const pipe of items.filter((item) => item.component === 'penstock' && item.kind === 'polyline')) {
    const pipePoints = generationWaterwayPoints(pipe, items);
    if (pipePoints.length < 2) continue;

    for (const side of ['inlet', 'outlet'] as const) {
      const candidates = side === 'inlet' ? headraces : tailraces;
      const pipeEnd = side === 'inlet' ? pipePoints[0] : pipePoints.at(-1)!;
      const matches = candidates.flatMap((candidate) => {
        const points = generationWaterwayPoints(candidate, items);
        if (points.length < 2) return [];
        const neighborEnd = side === 'inlet' ? points.at(-1)! : points[0];
        const ends: [[number, number, number], [number, number, number]] = side === 'inlet'
          ? [neighborEnd, pipeEnd] : [pipeEnd, neighborEnd];
        return [{ candidate, ends, distance: endpointGapMeters(...ends) }];
      }).sort((a, b) => a.distance - b.distance);

      const best = matches[0];
      if (!best) {
        audits.push({ penstockId: pipe.id, side, adjacentId: null, gapMeters: null, status: 'missing-reference', points: null });
        continue;
      }
      const status = best.distance <= 2
        ? 'connected' as const
        : best.distance <= WATERWAY_MAX_SCHEMATIC_GAP_METERS
          ? 'schematic-gap' as const : 'disconnected' as const;
      audits.push({
        penstockId: pipe.id,
        side,
        adjacentId: best.candidate.id,
        gapMeters: best.distance,
        status,
        points: best.ends,
      });
    }
  }
  return audits;
}

/** Represent ONLY short, explicitly classified gaps using dashed guide lines.
 * Never generate a false branch between distant footprint endpoints. */
export function representativeWaterwayLinks(items: Layout3DProjectedFootprint[]) {
  return auditWaterwayConnections(items).filter((audit) => audit.status === 'schematic-gap' && audit.points).map((audit) => ({
    id: `${audit.penstockId}-${audit.side}`,
    from: items.find((item) => item.id === (audit.side === 'inlet' ? audit.adjacentId : audit.penstockId))!,
    to: items.find((item) => item.id === (audit.side === 'inlet' ? audit.penstockId : audit.adjacentId))!,
    points: audit.points!,
  }));
}

/** Water levels are a visual SOC approximation; concrete and embankments
 * must never move with reservoir SOC. */
export function footprintSurfacePositionOffset(material: string, soc: number): number {
  return material === 'water' ? reservoirSurfaceOffset(soc) : 0;
}

/** Keep the representative terrain underneath the entire georeferenced
 * footprint plan, including long intake/tailrace routes. Scene units only:
 * this plane is not surveyed DEM. */
export function footprintTerrainSize(items: Layout3DProjectedFootprint[]): number {
  const maxRadius = items.flatMap((item) => item.points)
    .reduce((radius, point) => (
      Number.isFinite(point.x) && Number.isFinite(point.z)
        ? Math.max(radius, Math.abs(point.x), Math.abs(point.z))
        : radius
    ), 0);
  return Math.ceil(Math.max(1000, (maxRadius + 100) * 2) / 100) * 100;
}
