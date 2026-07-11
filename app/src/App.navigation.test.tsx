// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSettingsStore } from './stores/useSettingsStore';
import App from './App';

vi.mock('./pages/PdhesPage', () => ({
  default: ({ sectionId }: { sectionId?: string }) => (
    <main data-testid="pdhes-page" data-section-id={sectionId ?? ''} />
  ),
}));

describe('application navigation', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
  });

  afterEach(() => {
    cleanup();
    window.location.hash = '';
    vi.unstubAllGlobals();
  });

  it('exposes top-level destinations as route links with the current page state', () => {
    window.location.hash = '#/pdhes';
    render(
      <HashRouter>
        <App />
      </HashRouter>,
    );

    expect(screen.getByRole('link', { name: 'PDHES Nedir' }).getAttribute('aria-current'))
      .toBe('page');
    expect(screen.getByRole('link', { name: 'PDHES Adayları' }).getAttribute('href'))
      .toBe('#/data');
    expect(screen.getByRole('link', { name: 'Ayarlar' }).getAttribute('href'))
      .toBe('#/settings');
    const skipLink = screen.getByRole('link', { name: 'Ana içeriğe geç' });
    expect(skipLink.getAttribute('href'))
      .toBe('#main-content');
    expect(skipLink.closest('.app')).toBeNull();
  });

  it('keeps legacy section links compatible with the canonical PDHES route', async () => {
    window.location.hash = '#sec-veri';

    render(
      <HashRouter>
        <App />
      </HashRouter>,
    );

    await waitFor(() => {
      expect(window.location.hash).toBe('#/pdhes/sec-veri');
    });
  });

  it('passes the nested content section encoded in the route to the PDHES page', async () => {
    window.location.hash = '#/pdhes/sec-veri';

    render(
      <HashRouter>
        <App />
      </HashRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('pdhes-page').getAttribute('data-section-id')).toBe('sec-veri');
    });
  });

  it('keeps the browser theme color aligned with the selected theme', async () => {
    useSettingsStore.setState({ theme: 'dark' });

    window.location.hash = '#/pdhes';
    render(
      <HashRouter>
        <App />
      </HashRouter>,
    );

    await waitFor(() => {
      expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#0a0a0a');
    });
  });
});
