// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import PdhesPage from './PdhesPage';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import React from 'react';

vi.mock('../stores/useWorkspaceStore', () => ({
  useWorkspaceStore: vi.fn(),
}));

vi.mock('../stores/useSiteStore', () => ({
  useSiteStore: vi.fn(() => ({
    setWorldExampleFocus: vi.fn(),
  })),
}));

describe('PdhesPage Security (XSS Protection)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sanitizes script tags in user content', () => {
    // Simulate malicious content coming from local storage / user workspace
    const maliciousContent = `PDHES Nedir? <script>alert("XSS")</script>`;
    
    (useWorkspaceStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue((key: string, defaults: any) => {
      if (key === 'pdhesWhatIs.title') return maliciousContent;
      return defaults;
    });

    const { container } = render(
      <HashRouter>
        <PdhesPage />
      </HashRouter>
    );

    const titleElement = container.querySelector('h2');
    expect(titleElement).not.toBeNull();
    // The script tag should be removed by DOMPurify
    expect(titleElement!.innerHTML).not.toContain('<script>');
    expect(titleElement!.innerHTML).toContain('PDHES Nedir?');
  });

  it('sanitizes img onerror vectors', () => {
    const maliciousContent = `PDHES <img src="invalid" onerror="alert('XSS')" />`;
    
    (useWorkspaceStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue((key: string, defaults: any) => {
      if (key === 'pdhesWhatIs.title') return maliciousContent;
      return defaults;
    });

    const { container } = render(
      <HashRouter>
        <PdhesPage />
      </HashRouter>
    );

    const titleElement = container.querySelector('h2');
    expect(titleElement).not.toBeNull();
    // The onerror attribute should be removed by DOMPurify
    expect(titleElement!.innerHTML).not.toContain('onerror');
    expect(titleElement!.innerHTML).toContain('<img src="invalid">');
  });
});
