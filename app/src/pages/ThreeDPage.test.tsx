// @vitest-environment jsdom

import { act, cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeTestSite } from '../test-utils/makeTestSite';
import ThreeDPage from './ThreeDPage';

vi.mock('../components/ui/ThreeDModel', () => ({
  default: (props: any) => (
    <div
      data-testid="three-d-model"
      data-active={props.activeComponent}
      data-active-units={props.activeUnits}
      data-active-unit-ids={JSON.stringify(props.activeUnitIds ?? [])}
      data-max-units={props.maxUnits}
      data-layers={JSON.stringify(props.layers)}
      data-show-labels={String(props.showLabels)}
      data-simulation-state={props.simulationState}
      data-upper-soc={props.upperSoc}
      data-lower-soc={props.lowerSoc}
    />
  ),
}));

const site = makeTestSite({
  capacityMW: 500,
  coordinates: {
    coordinateConfidence: 'fallback-approximate',
  },
});

describe('ThreeDPage controls', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('uses consistent icons and exposes toggle states', () => {
    render(<ThreeDPage site={site} />);
    const model = screen.getByTestId('three-d-model');

    expect(screen.getByRole('button', { name: 'Üretim modu' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Pompalama modu' }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: 'Simülasyonu başlat' }).getAttribute('aria-pressed')).toBe('false');
    expect(model.getAttribute('data-show-labels')).toBe('false');
    expect(document.body.textContent).not.toMatch(/[\u26a1\ud83d\udca7\u26f0\ufe0f\ud83c\udff7\ufe0f\u25b6\ufe0f\u23f9\u26a0\ufe0f]/u);
    expect(screen.getByRole('alert').textContent).toMatch(/3D konumlar temsilidir/i);
  });

  it('hides all layers and clears activeComponent when "Tümünü Kapat" is clicked', () => {
    render(<ThreeDPage site={site} />);
    const model = screen.getByTestId('three-d-model');
    
    expect(model.getAttribute('data-active')).toBe('upper_reservoir');
    
    // Toggle off everything
    const closeAllBtn = screen.getByRole('button', { name: 'Tümünü Kapat' });
    fireEvent.click(closeAllBtn);
    
    // activeComponent should be cleared because its layer was turned off
    expect(model.getAttribute('data-active')).toBe('');
    
    // all known components should be false
    const layers = JSON.parse(model.getAttribute('data-layers') || '{}');
    expect(layers['upper_reservoir']).toBe(false);
    expect(layers['tunnel']).toBe(false);
    expect(layers['powerhouse']).toBe(false);
  });

  it('handles fast layer toggling without throwing errors', () => {
    render(<ThreeDPage site={site} />);
    const closeAllBtn = screen.getByRole('button', { name: 'Tümünü Kapat' });
    const openAllBtn = screen.getByRole('button', { name: 'Tümünü Aç' });
    
    // Rapidly toggle to test memory leak / crash resistance logic in upper layers
    expect(() => {
      for (let i = 0; i < 10; i++) {
        closeAllBtn.click();
        openAllBtn.click();
      }
    }).not.toThrow();
  });

  it('renders after lazy footprint data loads without changing hook order', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }));
    const lazyFootprintSite = makeTestSite({
      layout3D: {
        scale: 'macro',
        preferredBearing: 0,
        terrainExaggeration: 1,
        reservoirSurfaceMode: 'polygon',
        useFootprintPolygons: true,
        hideLegacySquareReservoir: true,
      },
    });

    render(<ThreeDPage site={lazyFootprintSite} />);

    await waitFor(() => {
      expect(screen.getByTestId('three-d-model')).toBeTruthy();
    });
  });

  it('uses independent group toggles and allows zero active units', () => {
    render(<ThreeDPage site={makeTestSite({
      components_detail: {
        upper_reservoir: {
          elevation_m: 100,
          active_volume_mcm: 1,
          dam_height_m: 10,
          lining: '',
          geology_note: '',
        },
        lower_reservoir: { elevation_m: 50, min_level_m: 40, note: '' },
        penstock: { diameter_m: 4, length_m: 100, material: '', pressure_class: '', count: 2 },
        powerhouse: { cavern_width_m: 10, cavern_length_m: 20, cavern_height_m: 15, units: 3, turbine_type: '' },
        surge_tank: { type: '', height_m: 20, diameter_m: 5 },
        switchyard: { voltage_kv: 154, transformer_count: 2, connection_line_km: 1 },
        tunnel: { length_m: 100, diameter_m: 4, excavation_type: '' },
        intake_outfall: null,
      },
    })} />);

    const model = screen.getByTestId('three-d-model');
    expect(screen.getByRole('button', { name: 'G1' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'G2' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'G3' }).getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'G1' }));
    fireEvent.click(screen.getByRole('button', { name: 'G2' }));
    fireEvent.click(screen.getByRole('button', { name: 'G3' }));

    expect(model.getAttribute('data-active-units')).toBe('0');
    expect(model.getAttribute('data-active-unit-ids')).toBe('[]');
  });

  it('renders Gokcekaya controls as four 350 MW groups without G5 or G6', () => {
    render(<ThreeDPage site={makeTestSite({
      id: 'kamu-gokcekaya-pspp',
      capacityMW: 1400,
      projectFlowCms: 270,
      components_detail: {
        upper_reservoir: {
          elevation_m: 889,
          active_volume_mcm: 10.84,
          dam_height_m: 55,
          lining: '',
          geology_note: '',
        },
        lower_reservoir: { elevation_m: 421, min_level_m: 413, note: '' },
        penstock: { diameter_m: 6.6, length_m: 4050, material: '', pressure_class: '', count: 4 },
        powerhouse: { cavern_width_m: 36, cavern_length_m: 266, cavern_height_m: 39, units: 4, turbine_type: '', unitPowerMW: 350 },
        surge_tank: { type: '', height_m: 112, diameter_m: 33 },
        switchyard: { voltage_kv: 380, transformer_count: 3, connection_line_km: 7.1 },
        tunnel: { length_m: 4050, diameter_m: 8.2, excavation_type: '' },
        intake_outfall: null,
      },
    })} />);

    const model = screen.getByTestId('three-d-model');
    expect(model.getAttribute('data-max-units')).toBe('4');
    expect(model.getAttribute('data-active-units')).toBe('4');
    expect(model.getAttribute('data-active-unit-ids')).toBe('["G1","G2","G3","G4"]');
    expect(screen.getByRole('button', { name: 'G1' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'G2' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'G3' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'G4' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'G5' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'G6' })).toBeNull();
  });

  it('advances reservoir SOC while generation simulation is running', async () => {
    vi.useFakeTimers();
    render(<ThreeDPage site={makeTestSite({
      projectFlowCms: 120,
      components_detail: {
        upper_reservoir: {
          elevation_m: 100,
          active_volume_mcm: 1,
          dam_height_m: 10,
          lining: '',
          geology_note: '',
        },
        lower_reservoir: { elevation_m: 50, min_level_m: 40, note: '' },
        penstock: { diameter_m: 4, length_m: 100, material: '', pressure_class: '', count: 2 },
        powerhouse: { cavern_width_m: 10, cavern_length_m: 20, cavern_height_m: 15, units: 2, turbine_type: '' },
        surge_tank: { type: '', height_m: 20, diameter_m: 5 },
        switchyard: { voltage_kv: 154, transformer_count: 1, connection_line_km: 1 },
        tunnel: { length_m: 100, diameter_m: 4, excavation_type: '' },
        intake_outfall: null,
      },
    })} />);

    const model = screen.getByTestId('three-d-model');
    const initialUpperSoc = Number(model.getAttribute('data-upper-soc'));
    fireEvent.click(screen.getByRole('button', { name: /Sim/ }));

    await act(async () => {
      await Promise.resolve();
    });
    expect(model.getAttribute('data-simulation-state')).toBe('GENERATING');
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(Number(model.getAttribute('data-upper-soc'))).toBeLessThan(initialUpperSoc);
    expect(Number(model.getAttribute('data-lower-soc'))).toBeGreaterThan(0.28);
  });

  it('shows a visible footprint fallback warning when lazy footprint loading fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => [],
    }));
    const lazyFootprintSite = makeTestSite({
      layout3D: {
        scale: 'macro',
        preferredBearing: 0,
        terrainExaggeration: 1,
        reservoirSurfaceMode: 'polygon',
        useFootprintPolygons: true,
        hideLegacySquareReservoir: true,
      },
    });

    render(<ThreeDPage site={lazyFootprintSite} />);

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatch(/footprint.*yüklenemedi|fallback/i);
    });
    expect(screen.getByTestId('three-d-model')).toBeTruthy();
  });

  it('moves selection to the next visible layer when the active layer is hidden', () => {
    render(<ThreeDPage site={site} />);
    const model = screen.getByTestId('three-d-model');

    expect(model.getAttribute('data-active')).toBe('upper_reservoir');
    fireEvent.click(screen.getByText('Üst Rezervuar').closest('label')!);

    expect(model.getAttribute('data-active')).toBe('tunnel');
    const layers = JSON.parse(model.getAttribute('data-layers') || '{}');
    expect(layers.upper_reservoir).toBe(false);
  });
});

