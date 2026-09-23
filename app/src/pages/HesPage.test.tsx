// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useHydrologyStore } from '../features/hydrology/store/useHydrologyStore';
import HesPage from './HesPage';

vi.mock('../features/hydrology/components/HydrologyMap', () => ({ BaseMap: () => <div data-testid="hydrology-map" /> }));
vi.mock('../features/hydrology/components/HydrologySidebar', () => ({ Sidebar: () => <aside /> }));
vi.mock('../features/hydrology/components/HydrologyTimeline', () => ({ Timeline: () => <div /> }));
vi.mock('../features/hydrology/components/HydrologyToolbar', () => ({ HesToolbar: () => <header /> }));

describe('HesPage data loading state', () => {
  const initialHydrologyState = useHydrologyStore.getState();
  const initialSettingsState = useSettingsStore.getState();

  beforeEach(() => {
    useSettingsStore.setState({ theme: 'dark' });
    useHydrologyStore.setState({
      ...initialHydrologyState,
      hydroDataStatus: 'failed',
      hydroDataError: 'Manifest request failed',
      loadHydroData: vi.fn().mockResolvedValue(undefined),
      refreshHydroData: vi.fn().mockResolvedValue(undefined),
    }, true);
  });

  afterEach(() => {
    cleanup();
    useHydrologyStore.setState(initialHydrologyState, true);
    useSettingsStore.setState(initialSettingsState, true);
  });

  it('shows a retryable error instead of a permanent loading message', () => {
    render(<MemoryRouter><HesPage /></MemoryRouter>);

    expect(screen.getByRole('alert').textContent).toContain('Manifest request failed');
    expect(screen.queryByText(/Kanonik HES verisi yükleniyor/)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Yeniden Dene' }));
    expect(useHydrologyStore.getState().refreshHydroData).toHaveBeenCalledTimes(1);
  });
});
