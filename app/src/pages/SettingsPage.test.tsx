// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useSiteStore } from '../stores/useSiteStore';
import type { Site } from '../types/site';
import SettingsPage from './SettingsPage';

describe('SettingsPage', () => {
  beforeEach(() => {
    useSiteStore.setState({
      selectedId: 'test-site',
      sites: [{
        id: 'test-site',
        name: 'Test sahası',
        score: 70,
        scores: { topo: 80, grid: 70, env: 60, geology: 50, access: 90, market: 70 },
      } as Site],
    });
  });

  afterEach(cleanup);

  it('labels every preference control', () => {
    render(<SettingsPage />);

    expect(screen.getByRole('combobox', { name: 'Tema' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Harita görünümü' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: '3D yükseklik ölçeği' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Topografya / düşü' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Şebeke yakınlığı' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Çevresel kısıt' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Jeoloji / deprem' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Erişim ve lojistik' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Piyasa ve yük' })).toBeTruthy();
    expect(screen.getByText(/kaynak skor 70/i)).toBeTruthy();
    expect(screen.getByText(/^senaryo skoru 70$/i)).toBeTruthy();
    expect(screen.getByRole('link', { name: /yerel çalışma alanını etkinleştir/i })).toBeTruthy();
  });
});
