// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMapLibre } from '../hooks/useMapLibre';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useSiteStore } from '../stores/useSiteStore';
import { makeTestSite } from '../test-utils/makeTestSite';
import MapPage from './MapPage';

const mapRefMock = vi.hoisted(() => ({ current: null as any }));

vi.mock('../hooks/useMapLibre', () => ({
  useMapLibre: vi.fn(() => ({ mapRef: mapRefMock, map: mapRefMock.current })),
}));

vi.mock('../components/ManualGeometryLayer', () => ({
  default: () => null,
}));

const site = makeTestSite();

describe('MapPage controls', () => {
  beforeEach(() => {
    mapRefMock.current = null;
    useSiteStore.setState({
      sites: [site],
      selectedId: site.id,
      gridAssets: null,
      fetchGridAssets: vi.fn().mockResolvedValue(undefined),
    });
    useSettingsStore.setState({ mapStyle: 'satellite', heightScale: 1.1 });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.mocked(useMapLibre).mockClear();
  });

  it('exposes candidate, panel, and view state controls to assistive technology', () => {
    render(<MapPage />);

    expect(screen.getByRole('button', { name: /kapasite özeti panelini kapat/i })).toBeTruthy();

    const toggleBtn = screen.getByRole('button', { name: '2D' });
    expect(toggleBtn).toBeTruthy();

    const fabBtn = screen.getByRole('button', { name: /Menüyü Aç/i });
    fireEvent.click(fabBtn);

    expect(screen.getAllByText(/Test PDHES/i).length).toBeGreaterThan(0);

    const settingsTab = screen.getByRole('tab', { name: /Ayarlar/i });
    fireEvent.click(settingsTab);

    const dimensionGroup = screen.getByRole('group', { name: 'Harita boyutu' });
    const dimension2D = within(dimensionGroup).getByRole('button', { name: '2D Düz' });
    const dimension3D = within(dimensionGroup).getByRole('button', { name: '3D Arazi' });

    expect(dimension2D.classList.contains('active')).toBe(true);
    expect(dimension3D.classList.contains('active')).toBe(false);
    expect(screen.queryByRole('group', { name: '3D arazi kalitesi' })).toBeNull();
  });

  it('exposes a separate visibility control for the conceptual project grid', () => {
    render(<MapPage />);

    const projectGridButton = screen.getByRole('button', { name: 'Proje Şebeke' });
    expect(projectGridButton.getAttribute('title')).toBe('Kavramsal şebekeyi göster');
    expect(projectGridButton.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(projectGridButton);

    expect(projectGridButton.getAttribute('title')).toBe('Kavramsal şebekeyi gizle');
    expect(projectGridButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('lazy-loads selected site footprints before passing the site to MapLibre', async () => {
    const lazySite = makeTestSite({
      id: 'lazy-footprint-site',
      layout3D: {
        scale: 'macro',
        preferredBearing: 12,
        terrainExaggeration: 1.2,
        reservoirSurfaceMode: 'polygon',
        useFootprintPolygons: true,
        hideLegacySquareReservoir: true,
      },
    });
    const footprints = [{
      id: 'powerhouseFootprint',
      component: 'powerhouse',
      kind: 'polygon',
      material: 'industrial',
      closed: true,
      coords: [[32, 40], [32.001, 40], [32.001, 40.001], [32, 40.001], [32, 40]],
      baseElevationM: 300,
      topElevationM: 330,
    }];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => footprints,
    });
    vi.stubGlobal('fetch', fetchMock);
    useSiteStore.setState({
      sites: [lazySite],
      selectedId: lazySite.id,
      gridAssets: null,
      fetchGridAssets: vi.fn().mockResolvedValue(undefined),
    });

    render(<MapPage />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/footprints/lazy-footprint-site.json');
      const latestCall = vi.mocked(useMapLibre).mock.calls.at(-1)?.[0];
      expect(latestCall?.site?.layout3D?.componentFootprints).toEqual(footprints);
      expect(latestCall?.sites[0].layout3D?.componentFootprints).toEqual(footprints);
    });
  });

  it('does not reuse a previous site footprint while the next site is loading', async () => {
    const gokcekaya = makeTestSite({
      id: 'kamu-gokcekaya-pspp',
      layout3D: {
        scale: 'macro',
        preferredBearing: 0,
        terrainExaggeration: 1,
        reservoirSurfaceMode: 'polygon',
        useFootprintPolygons: true,
        hideLegacySquareReservoir: true,
      },
    });
    const sariyar = makeTestSite({
      id: 'kamu-sariyar-pspp',
      layout3D: {
        scale: 'macro',
        preferredBearing: 0,
        terrainExaggeration: 1,
        reservoirSurfaceMode: 'polygon',
        useFootprintPolygons: true,
        hideLegacySquareReservoir: true,
      },
    });
    let resolveGokcekaya!: (value: unknown) => void;
    let resolveSariyar!: (value: unknown) => void;
    const gokcekayaFootprints = [{ id: 'gokcekaya-footprint', component: 'upper_reservoir' }];
    const sariyarFootprints = [{ id: 'sariyar-footprint', component: 'powerhouse' }];
    const fetchMock = vi.fn((url: string) => new Promise((resolve) => {
      if (url.includes(gokcekaya.id)) resolveGokcekaya = resolve;
      if (url.includes(sariyar.id)) resolveSariyar = resolve;
    }));
    vi.stubGlobal('fetch', fetchMock);
    useSiteStore.setState({
      sites: [gokcekaya, sariyar],
      selectedId: gokcekaya.id,
      gridAssets: null,
      fetchGridAssets: vi.fn().mockResolvedValue(undefined),
    });

    render(<MapPage />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/footprints/kamu-gokcekaya-pspp.json'));

    act(() => useSiteStore.getState().selectSite(sariyar.id));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/footprints/kamu-sariyar-pspp.json'));

    await act(async () => {
      resolveGokcekaya({ ok: true, json: async () => gokcekayaFootprints });
      await Promise.resolve();
    });
    const duringSariyarLoad = vi.mocked(useMapLibre).mock.calls.at(-1)?.[0];
    expect(duringSariyarLoad?.site?.layout3D?.componentFootprints).toEqual([]);

    await act(async () => {
      resolveSariyar({ ok: true, json: async () => sariyarFootprints });
      await Promise.resolve();
    });
    await waitFor(() => {
      const latestCall = vi.mocked(useMapLibre).mock.calls.at(-1)?.[0];
      expect(latestCall?.site?.layout3D?.componentFootprints).toEqual(sariyarFootprints);
    });
  });

  it('keeps the camera position when the same site footprint finishes loading', async () => {
    const map = { easeTo: vi.fn() };
    mapRefMock.current = map;
    const siteWithFootprints = makeTestSite({
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
    const footprints = [{ id: 'same-site-footprint', component: 'powerhouse' }];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => footprints }));
    useSiteStore.setState({
      sites: [siteWithFootprints],
      selectedId: siteWithFootprints.id,
      gridAssets: null,
      fetchGridAssets: vi.fn().mockResolvedValue(undefined),
    });

    render(<MapPage />);
    await waitFor(() => expect(map.easeTo).toHaveBeenCalledTimes(1));

    await waitFor(() => {
      const latestCall = vi.mocked(useMapLibre).mock.calls.at(-1)?.[0];
      expect(latestCall?.site?.layout3D?.componentFootprints).toEqual(footprints);
    });
    expect(map.easeTo).toHaveBeenCalledTimes(1);
  });
});
