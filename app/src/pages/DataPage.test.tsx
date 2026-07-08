// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useSiteStore } from '../stores/useSiteStore';
import { makeTestSite } from '../test-utils/makeTestSite';
import DataPage from './DataPage';

const site = makeTestSite({ id: 'jica-test-site' });

describe('DataPage', () => {
  beforeEach(() => {
    useSiteStore.setState({ sites: [site], selectedId: site.id });
  });

  afterEach(cleanup);

  it('makes filters and site selection keyboard accessible', () => {
    render(<DataPage site={site} />);

    expect(screen.getByRole('button', { name: 'Tümü' }).getAttribute('aria-pressed')).toBe('true');
    const siteButton = screen.getByRole('button', { name: /test pdhes/i });
    fireEvent.click(siteButton);
    expect(useSiteStore.getState().selectedId).toBe(site.id);
    expect(screen.getAllByText(/JİCA\/EİE/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Açık döngü/i)).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/undefined|NaN|null/i);
  });

  it('uses compact 16+4 table columns without province or coordinate filters', () => {
    render(<DataPage site={site} />);

    expect(screen.getByRole('columnheader', { name: 'Güç / Enerji' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Düşü (head) / Su Yolu' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Yatırım' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Gelir' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Kaynak / Senaryo Skoru' })).toBeTruthy();

    expect(screen.queryByRole('columnheader', { name: 'Kurulu güç' })).toBeNull();
    expect(screen.queryByRole('columnheader', { name: 'Debi / düşü' })).toBeNull();
    expect(screen.queryByRole('columnheader', { name: 'Skor' })).toBeNull();
    expect(screen.queryByRole('columnheader', { name: 'Koordinat' })).toBeNull();
    expect(screen.queryByLabelText('İl')).toBeNull();
    expect(screen.queryByLabelText('Koordinat güveni')).toBeNull();

    expect(screen.getByRole('button', { name: 'JİCA/EİE' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Deniz Tipi' })).toBeTruthy();
    expect(screen.getByText(/Kaynak: 75/i)).toBeTruthy();
    expect(screen.getByText(/Senaryo:/i)).toBeTruthy();
  });
});
