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

/** Diagram connectors between existing route ends. Never edits a source ring
 * or asserts an engineering alignment for the intervening gap. */
export function representativeWaterwayLinks(items: Layout3DProjectedFootprint[]) {
  const headrace = items.find((item) => ['headrace_tunnel', 'pressure_tunnel'].includes(item.component));
  const tailrace = items.find((item) => item.component.startsWith('tailrace') && item.kind === 'polyline');
  const links: { id: string; from: Layout3DProjectedFootprint; to: Layout3DProjectedFootprint; points: [number, number, number][] }[] = [];
  for (const pipe of items.filter((item) => item.component === 'penstock' && item.kind === 'polyline')) {
    const pipePoints = generationWaterwayPoints(pipe, items);
    if (headrace) links.push({ id: `${pipe.id}-inlet`, from: headrace, to: pipe, points: [generationWaterwayPoints(headrace, items).at(-1)!, pipePoints[0]] });
    if (tailrace) links.push({ id: `${pipe.id}-outlet`, from: pipe, to: tailrace, points: [pipePoints.at(-1)!, generationWaterwayPoints(tailrace, items)[0]] });
  }
  return links.filter(({ points: [a, b] }) => a && b && Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) > 0.2);
}
