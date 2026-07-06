// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { HashRouter, MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

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
    render(
      <MemoryRouter initialEntries={['/pdhes']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'PDHES Nedir' }).getAttribute('aria-current'))
      .toBe('page');
    expect(screen.getByRole('link', { name: 'Datalar' }).getAttribute('href'))
      .toBe('/data');
    expect(screen.getByRole('link', { name: 'Ayarlar' }).getAttribute('href'))
      .toBe('/settings');
    expect(screen.getByRole('link', { name: 'Ana içeriğe geç' }).getAttribute('href'))
      .toBe('#main-content');
  });

  it('keeps legacy section links compatible with the canonical PDHES route', async () => {
    window.location.hash = '#sec-tarihce';

    render(
      <HashRouter>
        <App />
      </HashRouter>,
    );

    await waitFor(() => {
      expect(window.location.hash).toBe('#/pdhes/sec-tarihce');
    });
  });

  it('scrolls the nested content panel to the section encoded in the route', async () => {
    const scrollIntoView = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    window.location.hash = '#/pdhes/sec-tarihce';

    render(
      <HashRouter>
        <App />
      </HashRouter>,
    );

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'auto' });
    });
  });
});
