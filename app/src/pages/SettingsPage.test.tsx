// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import SettingsPage from './SettingsPage';

describe('SettingsPage', () => {
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
  });
});
