// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeTestSite } from '../test-utils/makeTestSite';
import { useSiteStore } from '../stores/useSiteStore';
import SiteEditorPage from './SiteEditorPage';

describe('SiteEditorPage raw record safety', () => {
  const site = makeTestSite();

  beforeEach(() => {
    localStorage.clear();
    useSiteStore.setState({
      sites: [site],
      baseSites: [site],
      selectedId: site.id,
      loading: false,
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('rejects malformed raw JSON without replacing the current draft', () => {
    const { container } = render(<SiteEditorPage mode="edit" templateSite={site} onDone={vi.fn()} />);
    const rawTextarea = container.querySelector('textarea.mono') as HTMLTextAreaElement;

    fireEvent.change(rawTextarea, { target: { value: '{"id":"broken"}' } });
    expect(() => fireEvent.click(screen.getByRole('button', { name: /Ham kayd.*tasla/i }))).not.toThrow();

    expect(screen.getByDisplayValue(site.name)).toBeTruthy();
  });

  it('keeps the original id when saving an edited raw record', () => {
    const { container } = render(<SiteEditorPage mode="edit" templateSite={site} onDone={vi.fn()} />);
    const rawTextarea = container.querySelector('textarea.mono') as HTMLTextAreaElement;
    const renamed = { ...site, id: 'renamed-from-json', name: 'Renamed Site' };

    fireEvent.change(rawTextarea, { target: { value: JSON.stringify(renamed) } });
    fireEvent.click(screen.getByRole('button', { name: /Ham kayd.*tasla/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Kaydet$/i }));

    const storedSites = useSiteStore.getState().sites;
    expect(storedSites).toHaveLength(1);
    expect(storedSites[0]).toMatchObject({ id: site.id, name: 'Renamed Site' });
  });
});
