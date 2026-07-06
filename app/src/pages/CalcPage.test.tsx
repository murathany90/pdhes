// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { Site } from '../types/site';
import CalcPage from './CalcPage';

const site = {
  id: 'test-site',
  name: 'Test sahası',
  head: 400,
  activeMcm: 10,
  energyGWh: 9,
  capexBn: 2,
  revenueM: 200,
  powerMW: 1000,
  risks: ['Jeoloji'],
  scores: {
    topo: 80,
    grid: 70,
    env: 60,
    geology: 50,
    access: 75,
    market: 85,
  },
} as Site;

describe('CalcPage', () => {
  afterEach(cleanup);

  it('gives every scenario slider an accessible name', () => {
    render(<CalcPage site={site} />);

    expect(screen.getByRole('slider', { name: 'Yatırım gideri çarpanı' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Gelir yakalama' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Çevrim / yıl' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Yardımcı hizmet primi' })).toBeTruthy();
  });

  it('announces the investment disclaimer as a danger alert', () => {
    render(<CalcPage site={site} />);

    expect(screen.getByRole('alert').textContent).toMatch(/yatırım kararı yerine kullanılamaz/i);
  });
});
