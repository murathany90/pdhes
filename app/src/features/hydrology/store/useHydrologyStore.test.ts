import { afterEach, describe, expect, it, vi } from 'vitest';
import { useHydrologyStore } from './useHydrologyStore';
import { loadHydroData } from '../services/hydroData';

vi.mock('../services/hydroData', () => ({ loadHydroData: vi.fn(), loadFullnessHistory: vi.fn() }));
const initial = useHydrologyStore.getState();
afterEach(() => { useHydrologyStore.setState(initial, true); vi.resetAllMocks(); });

describe('HES request ownership', () => {
  it('reuses a recent snapshot on page reentry and prevents a concurrent refresh from overwriting it', async () => {
    useHydrologyStore.setState({ hydroDataStatus: 'partial', lastRefreshAt: new Date().toISOString() });
    await useHydrologyStore.getState().loadHydroData();
    expect(loadHydroData).not.toHaveBeenCalled();
    let reject!: (reason: Error) => void;
    vi.mocked(loadHydroData).mockReturnValue(new Promise((_, no) => { reject = no; }));
    const pending = useHydrologyStore.getState().refreshHydroData();
    await useHydrologyStore.getState().refreshHydroData();
    expect(loadHydroData).toHaveBeenCalledTimes(1);
    reject(new Error('Connection failed'));
    await pending;
    expect(useHydrologyStore.getState().hydroDataStatus).toBe('failed');
    expect(useHydrologyStore.getState().hydroDataError).toBe('Connection failed');
    vi.mocked(loadHydroData).mockRejectedValue(new Error('Retry reached service'));
    await useHydrologyStore.getState().refreshHydroData();
    expect(loadHydroData).toHaveBeenCalledTimes(2);
  });
});
