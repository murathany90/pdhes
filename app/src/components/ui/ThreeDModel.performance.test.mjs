import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./ThreeDModel.tsx', import.meta.url), 'utf8');

describe('ThreeDModel performance contract', () => {
  it('avoids a continuous render loop when the simulation is idle', () => {
    expect(source).toContain("frameloop={props.isPlaying ? 'always' : 'demand'}");
  });

  it('caps WebGL pixel work for the 3D placement view', () => {
    expect(source).toContain('dpr={[1, 1.5]}');
    expect(source).toContain("powerPreference: 'high-performance'");
  });

  it('keeps footprint layer toggles scoped instead of rerendering every footprint mesh', () => {
    expect(source).toContain('memo(function FootprintPolygon');
    expect(source).toContain('memo(function FootprintPolyline');
    expect(source).toContain('groupFootprintsByLayer');
  });

  it('keeps terrain, trees, and rocks on one normalized opacity scale', () => {
    expect(source).toContain('export function normalizeTerrainOpacity(value: number): number');
    expect(source).toContain('<InstancedEnvironment assets={environmentAssets} opacity={terrainAlpha} />');
    expect(source).not.toContain('opacity={terrainOpacity / 100}');
  });

  it('avoids repeated instance matrix work during unrelated scene renders', () => {
    expect(source).toContain("const { trees, rocks } = useMemo(() => ({");
    expect(source).toContain('useLayoutEffect(() => {');
  });

  it('uses page SOC as the only legacy reservoir level input', () => {
    expect(source).toContain('useSmoothedReservoirLevels(upperSoc, lowerSoc, scenePlaying)');
    expect(source).not.toContain('waterLevelRef.current = clamp');
  });

  it('monitors active WebGL context loss without adding another renderer', () => {
    expect(source).toContain("canvas.addEventListener('webglcontextlost', handleContextLost)");
    expect(source).toContain("canvas.removeEventListener('webglcontextlost', handleContextLost)");
    expect(source).toContain('WebGL görüntü bağlamı kaybedildi');
  });
});
