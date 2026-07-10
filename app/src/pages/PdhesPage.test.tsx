// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import PdhesPage from './PdhesPage';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('PdhesPage editable content safety', () => {
  beforeEach(() => {
    localStorage.clear();
    useWorkspaceStore.setState({ contentOverrides: {} });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders local workspace overrides as sanitized HTML', () => {
    const payload = '<img src="x" onerror="alert(1)">Güvenli başlık';
    useWorkspaceStore.getState().setOverride('pdhesWhatIs.title', payload);

    render(<PdhesPage />);

    expect(screen.getByText('Güvenli başlık')).toBeTruthy();
    const img = document.querySelector('img[src="x"]');
    expect(img).not.toBeNull();
    expect(img?.hasAttribute('onerror')).toBe(false);
  });

  it('keeps default editable content free of embedded HTML markup', () => {
    render(<PdhesPage />);

    expect(document.body.textContent).not.toContain('<span');
    expect(screen.getByRole('heading', { name: 'Pompaj Depolamalı HES (PDHES) Nedir?' }))
      .toBeTruthy();
  });

  it('provides an accessible glossary search and a consistent heading hierarchy', () => {
    render(<PdhesPage />);

    expect(screen.getByRole('textbox', { name: /teknik terim ara/i })).toBeTruthy();

  });

  it('uses the updated single-card contents for the PDHES primer', () => {
    render(<PdhesPage />);

    expect(screen.getByRole('link', { name: 'Türkiye Aday Veri Kurgusu' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Türkiye Aday Veri Kurgusu/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Sık Sorulan Sorular' })).toBeTruthy();
    expect(document.querySelectorAll('.encyclopedia .content-split .card')).toHaveLength(0);
    expect(document.querySelectorAll('.pdhes-rich-shell > .content > article.info-card').length).toBeGreaterThanOrEqual(13);
  });

  it('scrolls the nested content panel to the requested section', async () => {
    const scrollTo = vi.fn();
    const windowScrollTo = vi.fn();
    HTMLElement.prototype.scrollTo = scrollTo;
    window.scrollTo = windowScrollTo;
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(1000);
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(500);

    render(<PdhesPage sectionId="sec-veri" />);

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
      expect(windowScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
    });
  });
});
