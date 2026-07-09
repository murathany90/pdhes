// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useSiteStore } from '../stores/useSiteStore';
import { makeTestSite } from '../test-utils/makeTestSite';
import SettingsPage from './SettingsPage';

const site = makeTestSite();

describe('SettingsPage', () => {
  beforeEach(() => {
    useSiteStore.setState({
      selectedId: site.id,
      sites: [site],
    });
  });

  afterEach(cleanup);

  it('labels every preference and scenario control', () => {
    render(<SettingsPage />);

    expect(screen.getByRole('combobox', { name: 'Tema' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Harita görünümü' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: '3D yükseklik ölçeği' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Senaryo aktif hacmi' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Yatırım gideri çarpanı' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Gelir yakalama' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Çevrim / yıl' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Yardımcı hizmet primi' })).toBeTruthy();

    expect(screen.getByRole('link', { name: /yerel çalışma alanını etkinleştir/i })).toBeTruthy();
  });
});
