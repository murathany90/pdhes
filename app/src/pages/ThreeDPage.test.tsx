// @vitest-environment jsdom

import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeTestSite } from '../test-utils/makeTestSite';
import ThreeDPage from './ThreeDPage';

vi.mock('../components/ui/ThreeDModel', () => ({
  default: (props: any) => <div data-testid="three-d-model" data-active={props.activeComponent} data-layers={JSON.stringify(props.layers)} />,
}));

const site = makeTestSite({
  capacityMW: 500,
  coordinates: {
    coordinateConfidence: 'fallback-approximate',
  },
});

describe('ThreeDPage controls', () => {
  afterEach(cleanup);

  it('uses consistent icons and exposes toggle states', () => {
    render(<ThreeDPage site={site} />);

    expect(screen.getByRole('button', { name: 'Üretim modu' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Pompalama modu' }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: 'Simülasyonu başlat' }).getAttribute('aria-pressed')).toBe('false');
    expect(document.body.textContent).not.toMatch(/[\u26a1\ud83d\udca7\u26f0\ufe0f\ud83c\udff7\ufe0f\u25b6\ufe0f\u23f9\u26a0\ufe0f]/u);
    expect(screen.getByRole('alert').textContent).toMatch(/3D konumlar temsilidir/i);
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
});

