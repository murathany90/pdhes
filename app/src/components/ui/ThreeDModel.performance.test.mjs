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
});
