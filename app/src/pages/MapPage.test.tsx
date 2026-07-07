// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useSiteStore } from '../stores/useSiteStore';
import type { Site } from '../types/site';
import MapPage from './MapPage';

vi.mock('../hooks/useMapLibre', () => ({
  useMapLibre: vi.fn(() => ({ mapRef: { current: null } })),
}));

const site = {
  id: 'test-site',
  name: 'Test sahası',
  region: 'Test bölgesi',
  concept: 'classic',
  score: 75,
  powerMW: 1000,
  energyGWh: 8,
  head: 400,
  tunnelKm: 5,
  capexBn: 2,
  revenueM: 200,
  payback: 10,
  thesis: 'Test açıklaması',
  timeline: [],
} as unknown as Site;

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

    // Kapasite özeti panelini kapat should be visible
    expect(screen.getByRole('button', { name: /kapasite özeti panelini kapat/i })).toBeTruthy();
    
    // Minimalist 2D/3D toggle should be visible (exact match to avoid "3D Arazi" collision)
    const toggleBtn = screen.getByRole('button', { name: '3D' });
    expect(toggleBtn).toBeTruthy();

    // Open FAB Popover
    const fabBtn = screen.getByRole('button', { name: /Menüyü Aç/i });
    fireEvent.click(fabBtn);

    // Now Candidates tab should be visible and active
    expect(screen.getByText(/Test sahası/i)).toBeTruthy();

    // Go to Settings Tab
    const settingsTab = screen.getByRole('button', { name: /Ayarlar/i });
    fireEvent.click(settingsTab);

    // Check dimension controls
    const dimensionGroup = screen.getByRole('group', { name: 'Harita boyutu' });
    const dimension2D = within(dimensionGroup).getByRole('button', { name: '2D Düz' });
    const dimension3D = within(dimensionGroup).getByRole('button', { name: '3D Arazi' });
    
    expect(dimension2D.classList.contains('active')).toBe(false);
    expect(dimension3D.classList.contains('active')).toBe(true);

    // Check quality controls
    const qualityGroup = screen.getByRole('group', { name: '3D arazi kalitesi' });
    const qualityOrta = within(qualityGroup).getByRole('button', { name: /Orta/i });
    expect(qualityOrta.classList.contains('active')).toBe(true);
  });
});
