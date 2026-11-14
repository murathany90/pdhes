// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ThreeDPage from './ThreeDPage';
import { makeTestSite } from '../test-utils/makeTestSite';
import type { Layout3DFootprint } from '../types/site';
import gokcekayaFootprints from '../../public/footprints/kamu-gokcekaya-pspp.json';
import sariyarFootprints from '../../public/footprints/kamu-sariyar-pspp.json';

vi.mock('../components/ui/ThreeDModel', () => ({
  default: () => <div data-testid="three-d-model" />,
}));

const loadSite = (id: string) => {
  const footprints = (id === 'kamu-gokcekaya-pspp' ? gokcekayaFootprints : sariyarFootprints) as unknown as Layout3DFootprint[];
  return makeTestSite({
    id,
    layout3D: {
      scale: 'macro',
      preferredBearing: 0,
      terrainExaggeration: 1,
      reservoirSurfaceMode: 'polygon',
      useFootprintPolygons: true,
      hideLegacySquareReservoir: true,
      componentFootprints: footprints,
    },
  });
};

describe('3D real source waterway continuity UI', () => {
  afterEach(() => cleanup());

  it('warns about four Gökçekaya disconnected endpoints without pretending they are completed galleries', async () => {
    render(<ThreeDPage site={loadSite('kamu-gokcekaya-pspp')} />);
    await waitFor(() => expect(screen.getAllByText(/Su yolu bağlantı denetimi: 4 uçta/).length).toBeGreaterThan(0));
    fireEvent.click(screen.getByRole('tab', { name: 'Kaynak / Veri' }));
    const details = screen.getByLabelText('Su yolu süreklilik denetimi');
    expect(details.textContent).toContain('4 kopuk/karşı bağlantısı eksik');
    expect(details.textContent).toContain('penstock03');
    expect(details.textContent).toContain('penstock04');
    expect(details.textContent).toContain('25 m üzerindeki boşluklarda');
  });

  it('reports Sarıyar connected endpoints without a false gap warning', async () => {
    render(<ThreeDPage site={loadSite('kamu-sariyar-pspp')} />);
    await waitFor(() => expect(screen.getAllByText(/Footprint tabanlı yerleşim/).length).toBeGreaterThan(0));
    fireEvent.click(screen.getByRole('tab', { name: 'Kaynak / Veri' }));
    const details = screen.getByLabelText('Su yolu süreklilik denetimi');
    expect(details.textContent).toContain('2 boru ucu; 0 kopuk');
    expect(screen.queryByText(/Su yolu bağlantı denetimi: [1-9]/)).toBeNull();
  });
});
