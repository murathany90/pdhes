// @vitest-environment jsdom

import { act, cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeTestSite } from '../test-utils/makeTestSite';
import { DEFAULT_SITE_ID, useSiteStore } from '../stores/useSiteStore';
import ThreeDPage from './ThreeDPage';

vi.mock('../components/ui/ThreeDModel', () => ({
  default: (props: any) => (
    <div
      data-testid="three-d-model"
      data-site-id={props.site.id}
      data-active={props.activeComponent}
      data-selected-item={props.selectedItemId ?? ''}
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

  it('uses Gökçekaya as the initial site when no selected site is available', () => {
    const defaultSite = makeTestSite({ id: DEFAULT_SITE_ID, name: 'Gökçekaya PDHES' });
    useSiteStore.setState({ sites: [makeTestSite({ id: 'other-site' }), defaultSite], selectedId: 'missing-site' });

    render(<ThreeDPage />);

    expect(screen.getByTestId('three-d-model').getAttribute('data-site-id')).toBe(DEFAULT_SITE_ID);
    expect(screen.getByText('Gökçekaya PDHES')).toBeTruthy();
  });

  it('uses consistent icons and exposes toggle states', () => {
    render(<ThreeDPage site={site} />);
    const model = screen.getByTestId('three-d-model');

    expect(screen.getByRole('button', { name: 'Üretim modu' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Pompalama modu' }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: 'Simülasyonu başlat' }).getAttribute('aria-pressed')).toBe('false');
    expect(model.getAttribute('data-show-labels')).toBe('false');
    expect(document.body.textContent).not.toMatch(/[\u26a1\ud83d\udca7\u26f0\ufe0f\ud83c\udff7\ufe0f\u25b6\ufe0f\u23f9\u26a0\ufe0f]/u);
    expect(screen.getByRole('alert').textContent).toMatch(/su seviyesi hareketi temsilidir/i);
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
    expect(screen.getByRole('alert').textContent).toMatch(/fallback|empty/i);
  });

  it('ignores a previous site footprint result after a fast site change', async () => {
    let resolveFirst!: (value: unknown) => void;
    let resolveSecond!: (value: unknown) => void;
    const firstResponse = new Promise((resolve) => { resolveFirst = resolve; });
    const secondResponse = new Promise((resolve) => { resolveSecond = resolve; });
    const fetchMock = vi.fn((url: string) => (
      url.includes('site-a') ? firstResponse : secondResponse
    ));
    vi.stubGlobal('fetch', fetchMock);

    const layout3D = {
      scale: 'macro' as const,
      preferredBearing: 0,
      terrainExaggeration: 1,
      reservoirSurfaceMode: 'polygon' as const,
      useFootprintPolygons: true,
      hideLegacySquareReservoir: true,
    };
    const siteA = makeTestSite({ id: 'site-a', name: 'Site A', layout3D });
    const siteB = makeTestSite({ id: 'site-b', name: 'Site B', layout3D });
    const { rerender, container } = render(<ThreeDPage site={siteA} />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const mountedModel = screen.getByTestId('three-d-model');
    expect(container.querySelector('.threed-footprint-loading')?.textContent).toMatch(/site a.*yükleniyor/i);
    rerender(<ThreeDPage site={siteB} />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(screen.getByTestId('three-d-model')).toBe(mountedModel);
    expect(container.querySelector('.threed-footprint-loading')?.textContent).toMatch(/site b.*yükleniyor/i);

    resolveFirst({ ok: false, status: 404, json: async () => [] });
    resolveSecond({
      ok: true,
      json: async () => [{
        id: 'site-b-powerhouse',
        component: 'powerhouse',
        kind: 'polygon',
        material: 'concrete',
        closed: true,
        coords: [[32, 40], [32.01, 40], [32.01, 40.01], [32, 40.01], [32, 40]],
        elevationM: 100,
      }],
    });

    await waitFor(() => expect(screen.getByTestId('three-d-model')).toBeTruthy());
    expect(screen.getByTestId('three-d-model')).toBe(mountedModel);
    expect(container.querySelector('.threed-footprint-loading')).toBeNull();
    expect(screen.queryByText(/Footprint verisi yüklenemedi/i)).toBeNull();
  });

  it('silently ignores an aborted footprint request during unmount', async () => {
    let rejectRequest!: (reason?: unknown) => void;
    const request = new Promise((_, reject) => {
      rejectRequest = reject;
    });
    vi.stubGlobal('fetch', vi.fn(() => request));
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const footprintSite = makeTestSite({
      layout3D: {
        scale: 'macro',
        preferredBearing: 0,
        terrainExaggeration: 1,
        reservoirSurfaceMode: 'polygon',
        useFootprintPolygons: true,
        hideLegacySquareReservoir: true,
      },
    });

    const view = render(<ThreeDPage site={footprintSite} />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    view.unmount();
    rejectRequest(new DOMException('Request aborted', 'AbortError'));

    await act(async () => {
      await Promise.resolve();
    });
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
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
      vi.advanceTimersByTime(400);
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
    fireEvent.click(screen.getByRole('checkbox', { name: /^Üst Rezervuar$/ }));

    expect(model.getAttribute('data-active')).toBe('tunnel');
    const layers = JSON.parse(model.getAttribute('data-layers') || '{}');
    expect(layers.upper_reservoir).toBe(false);
  });

  it('stops the simulation when the last unit is deselected and does not resume on reselect', async () => {
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
    fireEvent.click(screen.getByRole('button', { name: /Sim/ }));
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(model.getAttribute('data-simulation-state')).toBe('GENERATING');

    fireEvent.click(screen.getByRole('button', { name: 'G1' }));
    fireEvent.click(screen.getByRole('button', { name: 'G2' }));
    expect(model.getAttribute('data-active-units')).toBe('0');
    expect(model.getAttribute('data-simulation-state')).toBe('IDLE');
    expect(screen.getByRole('button', { name: 'Simülasyonu başlat' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'G1' }));
    expect(model.getAttribute('data-active-units')).toBe('1');
    expect(model.getAttribute('data-simulation-state')).toBe('IDLE');
    expect(screen.getByRole('button', { name: 'Simülasyonu başlat' })).toBeTruthy();
  });

  it('does not show the previous site footprint error while the next site is loading', async () => {
    const pendingResponse = new Promise(() => undefined);
    const fetchMock = vi.fn((url: string) => (
      url.includes('site-a')
        ? Promise.resolve({ ok: false, status: 404, json: async () => [] })
        : pendingResponse
    ));
    vi.stubGlobal('fetch', fetchMock);

    const layout3D = {
      scale: 'macro' as const,
      preferredBearing: 0,
      terrainExaggeration: 1,
      reservoirSurfaceMode: 'polygon' as const,
      useFootprintPolygons: true,
      hideLegacySquareReservoir: true,
    };
    const siteA = makeTestSite({ id: 'site-a', name: 'Site A', layout3D });
    const siteB = makeTestSite({ id: 'site-b', name: 'Site B', layout3D });
    const { rerender, container } = render(<ThreeDPage site={siteA} />);

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatch(/footprint.*yüklenemedi|temsili model/i);
    });

    rerender(<ThreeDPage site={siteB} />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(container.querySelector('.threed-footprint-loading')?.textContent).toMatch(/site b.*yükleniyor/i);
    expect(screen.queryByText(/footprint.*yüklenemedi/i)).toBeNull();
  });

  it('labels running flow as representative when the site has no flow data', async () => {
    vi.useFakeTimers();
    render(<ThreeDPage site={makeTestSite({
      projectFlowCms: null,
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
    fireEvent.click(screen.getByRole('button', { name: /Sim/ }));
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(model.getAttribute('data-simulation-state')).toBe('GENERATING');
    expect(screen.getAllByText('temsilî akış').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Gelişmiş ayarları aç/kapat' }));
    expect(screen.getByText(/Debi kaynağı yok/)).toBeTruthy();
  });

  it('selects a single penstock from the structure tree and shows it in the info panel', () => {
    const footprintSite = makeTestSite({
      id: 'penstock-site',
      layout3D: {
        scale: 'macro',
        preferredBearing: 0,
        terrainExaggeration: 1,
        reservoirSurfaceMode: 'polygon',
        useFootprintPolygons: true,
        hideLegacySquareReservoir: true,
        componentFootprints: [
          {
            id: 'penstock-1',
            component: 'penstock',
            kind: 'polyline',
            material: 'shaft',
            coords: [[32.015, 40.025], [32.02, 40.015]],
            profileElevationM: [250, 100],
          },
          {
            id: 'penstock-2',
            component: 'penstock',
            kind: 'polyline',
            material: 'shaft',
            coords: [[32.016, 40.026], [32.021, 40.016]],
            profileElevationM: [250, 100],
          },
        ],
      },
    });
    render(<ThreeDPage site={footprintSite} />);
    const model = screen.getByTestId('three-d-model');

    fireEvent.click(screen.getByRole('button', { name: 'Cebri Boru -1 · şaft' }));
    expect(model.getAttribute('data-selected-item')).toBe('penstock-1');
    expect(model.getAttribute('data-active')).toBe('penstock');
    expect(screen.getByRole('button', { name: 'Cebri Boru -2 · şaft', pressed: false })).toBeTruthy();
  });

  it('switches sites through the top search selector', () => {
    const siteA = makeTestSite({ id: 'site-a', name: 'Alfa PDHES' });
    const siteB = makeTestSite({ id: 'site-b', name: 'Beta PDHES' });
    useSiteStore.setState({ sites: [siteA, siteB], selectedId: 'site-a' });
    render(<ThreeDPage />);

    expect(screen.getByTestId('three-d-model').getAttribute('data-site-id')).toBe('site-a');
    const searchbox = screen.getByRole('searchbox', { name: 'Tesis ara' });
    fireEvent.focus(searchbox);
    expect(screen.getByRole('option', { name: /Alfa PDHES/ })).toBeTruthy();
    expect(screen.getByRole('option', { name: /Beta PDHES/ })).toBeTruthy();
    fireEvent.change(searchbox, { target: { value: 'beta' } });
    expect(screen.queryByRole('option', { name: /Alfa PDHES/ })).toBeNull();
    fireEvent.click(screen.getByRole('option', { name: /Beta PDHES/ }));
    expect(screen.getByTestId('three-d-model').getAttribute('data-site-id')).toBe('site-b');
  });

  it('shows technical and operation tabs for the selected component', () => {
    render(<ThreeDPage site={makeTestSite({
      components_detail: {
        upper_reservoir: {
          elevation_m: 889,
          active_volume_mcm: 10.84,
          dam_height_m: 55,
          lining: 'Beton',
          geology_note: '',
        },
        lower_reservoir: { elevation_m: 421, min_level_m: 413, note: '' },
        penstock: { diameter_m: 6.6, length_m: 4050, material: '', pressure_class: '', count: 4 },
        powerhouse: { cavern_width_m: 36, cavern_length_m: 266, cavern_height_m: 39, units: 4, turbine_type: '' },
        surge_tank: { type: '', height_m: 112, diameter_m: 33 },
        switchyard: { voltage_kv: 380, transformer_count: 3, connection_line_km: 7.1 },
        tunnel: { length_m: 4050, diameter_m: 8.2, excavation_type: '' },
        intake_outfall: null,
      },
    })} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Teknik Veri' }));
    expect(screen.getByText(/Kaynak kotu/)).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: 'İşletme' }));
    expect(screen.getByText(/Seçili ünite 4\/4/)).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: 'Kaynak / Veri' }));
    expect(screen.getAllByText(/Koordinat güveni/).length).toBeGreaterThan(0);
  });

  it('collapses and reopens the tree, info and bottom panels', () => {
    const { container } = render(<ThreeDPage site={site} />);
    const main = () => container.querySelector('.threed-main') as HTMLElement;
    const treeToggle = screen.getByRole('button', { name: 'Yapı ağacını aç/kapat' });
    const infoToggle = screen.getByRole('button', { name: 'Bilgi panelini aç/kapat' });

    fireEvent.click(treeToggle);
    expect(main().className).toMatch(/has-tree/);
    fireEvent.click(treeToggle);
    expect(main().className).not.toMatch(/has-tree/);

    fireEvent.click(infoToggle);
    expect(main().className).toMatch(/has-info/);
    fireEvent.click(infoToggle);
    expect(main().className).not.toMatch(/has-info/);

    expect(screen.getByLabelText('Simülasyon göstergeleri')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Alt işletme çubuğunu gizle' }));
    expect(screen.queryByLabelText('Simülasyon göstergeleri')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Alt işletme çubuğunu göster' }));
    expect(screen.getByLabelText('Simülasyon göstergeleri')).toBeTruthy();
  });
});

