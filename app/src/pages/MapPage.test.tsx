// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
    useSettingsStore.setState({ mapStyle: 'satellite', heightScale: 1.3 });
  });

  afterEach(cleanup);

  it('exposes candidate, panel, and view state controls to assistive technology', () => {
    render(<MapPage />);

    expect(screen.getByRole('button', { name: /kapasite özeti panelini kapat/i })).toBeTruthy();

    const toggleBtn = screen.getByRole('button', { name: '3D' });
    expect(toggleBtn).toBeTruthy();

    const fabBtn = screen.getByRole('button', { name: /Menüyü Aç/i });
    fireEvent.click(fabBtn);

    expect(screen.getByText(/Test PDHES/i)).toBeTruthy();

    const settingsTab = screen.getByRole('button', { name: /Ayarlar/i });
    fireEvent.click(settingsTab);

    const dimensionGroup = screen.getByRole('group', { name: 'Harita boyutu' });
    const dimension2D = within(dimensionGroup).getByRole('button', { name: '2D Düz' });
    const dimension3D = within(dimensionGroup).getByRole('button', { name: '3D Arazi' });

    expect(dimension2D.classList.contains('active')).toBe(false);
    expect(dimension3D.classList.contains('active')).toBe(true);

    const qualityGroup = screen.getByRole('group', { name: '3D arazi kalitesi' });
    const qualityOrta = within(qualityGroup).getByRole('button', { name: /Orta/i });
    expect(qualityOrta.classList.contains('active')).toBe(true);
  });
});
