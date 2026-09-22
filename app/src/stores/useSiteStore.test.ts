// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { makeTestSite } from '../test-utils/makeTestSite';
import { DEFAULT_SITE_ID, useSiteStore } from './useSiteStore';

describe('useSiteStore default site selection', () => {
  afterEach(() => {
    useSiteStore.setState({ sites: [], baseSites: [], selectedId: DEFAULT_SITE_ID });
  });

  it('uses Gökçekaya when the current selection is missing', () => {
    const sariyar = makeTestSite({ id: 'kamu-sariyar-pspp' });
    const gokcekaya = makeTestSite({ id: DEFAULT_SITE_ID });

    useSiteStore.setState({ sites: [sariyar, gokcekaya], selectedId: 'missing-site' });
    useSiteStore.getState().setSites([sariyar, gokcekaya]);

    expect(useSiteStore.getState().selectedId).toBe(DEFAULT_SITE_ID);
  });

  it('preserves a valid user selection', () => {
    const sariyar = makeTestSite({ id: 'kamu-sariyar-pspp' });
    const gokcekaya = makeTestSite({ id: DEFAULT_SITE_ID });

    useSiteStore.setState({ sites: [sariyar, gokcekaya], selectedId: sariyar.id });
    useSiteStore.getState().setSites([sariyar, gokcekaya]);

    expect(useSiteStore.getState().selectedId).toBe(sariyar.id);
  });
});
