// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeTestSite } from '../test-utils/makeTestSite';
import { useSiteStore } from '../stores/useSiteStore';
import ThreeDEditorPage from './ThreeDEditorPage';

// Mock maplibre
vi.mock('../hooks/useMapLibre', () => ({
  useMapLibre: () => ({
    mapRef: { current: { on: vi.fn(), off: vi.fn(), getLayer: vi.fn(), addSource: vi.fn(), addLayer: vi.fn(), removeLayer: vi.fn(), removeSource: vi.fn(), getSource: vi.fn(), isStyleLoaded: vi.fn().mockReturnValue(true) } },
    getSiteView: vi.fn(),
  }),
}));

// Mock settings store to provide defaults
vi.mock('../stores/useSettingsStore', () => ({
  useSettingsStore: () => ({
    mapStyle: 'satellite',
    setMapStyle: vi.fn(),
    heightScale: 1.5,
    setHeightScale: vi.fn(),
    showPowerGrid: false,
    powerGridConfig: {},
  }),
}));

// Mock the FabPopover which uses lucide icons and portal
vi.mock('../components/FabPopover', () => ({
  FabPopover: () => <div data-testid="fab-popover-mock">FabPopover Mock</div>
}));

describe('ThreeDEditorPage basic UI requirements', () => {
  const site = makeTestSite();

  beforeEach(() => {
    localStorage.clear();
    useSiteStore.setState({
      sites: [site],
      baseSites: [site],
      selectedId: site.id,
      loading: false,
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders all required component cards including Surge Tank and Penstock', () => {
    render(<ThreeDEditorPage site={site} onDone={vi.fn()} />);
    
    // Check main title
    expect(screen.getByText('3D Yerleşim Editörü (Etkileşimli)')).toBeTruthy();
    
    // Check all component cards are rendered
    expect(screen.getByText('Üst Rezervuar')).toBeTruthy();
    expect(screen.getByText('Alt Rezervuar')).toBeTruthy();
    expect(screen.getByText('Türbin Odası')).toBeTruthy();
    expect(screen.getByText('Şalt Sahası (3D)')).toBeTruthy();
    expect(screen.getByText('Denge Bacası')).toBeTruthy();
    expect(screen.getByText('Enerji Nakil Hattı / Su Yolu')).toBeTruthy();
  });

  it('renders the FabPopover component', () => {
    render(<ThreeDEditorPage site={site} onDone={vi.fn()} />);
    
    expect(screen.getByTestId('fab-popover-mock')).toBeTruthy();
  });
});
