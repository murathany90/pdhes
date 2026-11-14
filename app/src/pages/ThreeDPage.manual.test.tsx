// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeTestSite } from '../test-utils/makeTestSite';
import { useManualGeometryStore } from '../stores/useManualGeometryStore';
import type { ManualGeometryFeature } from '../types/manualGeometry';
import ThreeDPage from './ThreeDPage';

vi.mock('../components/ui/ThreeDModel', () => ({
  default: () => <div data-testid="three-d-model" />,
}));

const feature: ManualGeometryFeature = {
  type: 'Feature',
  id: 'manual-upper-1',
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [32, 40], [32.001, 40], [32.001, 40.001], [32, 40.001], [32, 40],
    ]],
  },
  properties: {
    siteId: 'manual-ui-site',
    siteName: 'Manual UI Site',
    featureType: 'upper_reservoir',
    displayName: 'Üst rezervuar çizimi',
    geometryType: 'Polygon',
    material: 'water',
    role: 'upperReservoirWater',
    source: 'manual_map_drawing',
    confidence: 'conceptual',
    createdAt: '2026-11-14T00:00:00Z',
  },
};

describe('3D page manual drawing provenance', () => {
  afterEach(() => {
    cleanup();
    useManualGeometryStore.getState().clearAllFeatures();
  });

  it('shows a manual-only footprint scene as footprint-based rather than legacy representative model', () => {
    useManualGeometryStore.getState().clearAllFeatures();
    useManualGeometryStore.getState().addFeature(feature);
    render(<ThreeDPage site={makeTestSite({ id: 'manual-ui-site' })} />);
    expect(screen.getByText(/Footprint tabanlı yerleşim.*1 elle çizim/)).toBeTruthy();
    expect(screen.getByTestId('three-d-model')).toBeTruthy();
  });
});
