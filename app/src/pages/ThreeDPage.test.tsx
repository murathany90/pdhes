// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeTestSite } from '../test-utils/makeTestSite';
import ThreeDPage from './ThreeDPage';

vi.mock('../components/ui/ThreeDModel', () => ({
  default: () => <div data-testid="three-d-model" />,
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
});
