import { describe, expect, it } from 'vitest';
import { footprintTerrainSize } from './layout3dGeometry';
import type { Layout3DProjectedFootprint } from './layout3dFootprints';

function route(id: string, x: number, z: number): Layout3DProjectedFootprint {
  return {
    id,
    component: 'tailrace_tunnel',
    kind: 'polyline',
    material: 'tunnel_axis',
    closed: false,
    baseY: 0,
    topY: 0,
    extrudeY: 0,
    points: [{ x: 0, y: 0, z: 0 }, { x, y: 0, z }],
  };
}

describe('georeferenced footprint terrain extent', () => {
  it('retains the standard ground for compact plants', () => {
    expect(footprintTerrainSize([route('short', 100, 80)])).toBe(1000);
  });
  it('extends schematic terrain beyond long river routes with a margin', () => {
    const result = footprintTerrainSize([route('long', 260, 585)]);
    expect(result).toBeGreaterThan(1170);
    expect(result / 2).toBeGreaterThan(585);
  });
  it('does not accept NaN points as an extent', () => {
    expect(footprintTerrainSize([route('invalid', Number.NaN, Number.NaN)])).toBe(1000);
  });
});
