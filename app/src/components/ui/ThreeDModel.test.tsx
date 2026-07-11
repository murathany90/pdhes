// @vitest-environment jsdom

import type React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeTestSite } from '../../test-utils/makeTestSite';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useSiteStore } from '../../stores/useSiteStore';
import ThreeDModel from './ThreeDModel';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children?: React.ReactNode }) => <div data-testid="mock-canvas">{children}</div>,
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  Html: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Line: () => <div data-testid="mock-line" />,
  MeshDistortMaterial: () => null,
  OrbitControls: () => null,
  Sky: () => null,
}));

describe('ThreeDModel footprint source', () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState({ theme: 'dark' });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders footprint data from the explicit site prop instead of stale store data', () => {
    const storeSite = makeTestSite({
      id: 'same-site',
      layout3D: {
        scale: 'macro',
        preferredBearing: 0,
        terrainExaggeration: 1,
        reservoirSurfaceMode: 'polygon',
        useFootprintPolygons: true,
        hideLegacySquareReservoir: true,
      },
    });
    const propSite = makeTestSite({
      ...storeSite,
      layout3D: {
        ...storeSite.layout3D!,
        componentFootprints: [{
          id: 'editorCustomFootprint',
          component: 'editor_custom_component',
          kind: 'polygon',
          material: 'concrete',
          closed: true,
          coords: [[32, 40], [32.01, 40], [32.01, 40.01], [32, 40.01], [32, 40]],
          baseElevationM: 100,
          topElevationM: 105,
        }],
      },
    });

    useSiteStore.setState({ sites: [storeSite], selectedId: storeSite.id, worldExampleFocusId: null });

    render(
      <ThreeDModel
        siteId={storeSite.id}
        activeComponent="editor_custom_component"
        onSelectComponent={vi.fn()}
        layers={{}}
        mode="generate"
        componentsDetail={{
          upper_reservoir: {
            elevation_m: 100,
            active_volume_mcm: 1,
            dam_height_m: 10,
            lining: '',
            geology_note: '',
          },
          lower_reservoir: { elevation_m: 50, min_level_m: 40, note: '' },
          penstock: { diameter_m: 4, length_m: 100, material: '', pressure_class: '', count: 1 },
          powerhouse: { cavern_width_m: 10, cavern_length_m: 20, cavern_height_m: 15, units: 1, turbine_type: '' },
          surge_tank: { type: '', height_m: 20, diameter_m: 5 },
          switchyard: { voltage_kv: 154, transformer_count: 1, connection_line_km: 1 },
          tunnel: { length_m: 100, diameter_m: 4, excavation_type: '' },
          intake_outfall: null,
        }}
        site={propSite}
        isPlaying={false}
        activeUnits={1}
        maxUnits={1}
        showTerrain={false}
        showLabels={true}
        terrainOpacity={0.7}
      />,
    );

    expect(screen.getByText('editor_custom_component')).toBeTruthy();
  });
});
