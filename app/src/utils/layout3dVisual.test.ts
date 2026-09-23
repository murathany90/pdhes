import { describe, expect, it } from 'vitest';
import {
  CAMERA_VIEW_COMPONENTS,
  CAMERA_VIEWS,
  FLOW_VISUAL,
  resolveSceneQuality,
} from './layout3dVisual';

describe('layout3d visual language', () => {
  it('exposes a consistent flow color contract', () => {
    expect(FLOW_VISUAL.generate).toBe('#22c55e');
    expect(FLOW_VISUAL.pump).toBe('#ef4444');
    expect(FLOW_VISUAL.generate).not.toBe(FLOW_VISUAL.pump);
    for (const color of Object.values(FLOW_VISUAL)) {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('covers every camera view with a component filter', () => {
    const ids = CAMERA_VIEWS.map((view) => view.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id in CAMERA_VIEW_COMPONENTS).toBe(true);
    }
  });

  it('resolves a low/high scene quality without new dependencies', () => {
    expect(['low', 'high']).toContain(resolveSceneQuality());
  });
});
