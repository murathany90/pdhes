// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMapLibre } from '../hooks/useMapLibre';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useSiteStore } from '../stores/useSiteStore';
import { makeTestSite } from '../test-utils/makeTestSite';
import MapPage from './MapPage';

vi.mock('../hooks/useMapLibre', () => ({
  useMapLibre: vi.fn(() => ({ mapRef: { current: null } })),
}));

const site = makeTestSite();

describe('MapPage controls', () => {
  beforeEach(() => {
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
});
