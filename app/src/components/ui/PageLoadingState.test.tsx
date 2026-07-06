// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import PageLoadingState from './PageLoadingState';

describe('PageLoadingState', () => {
  afterEach(cleanup);

  it('announces loading while showing a non-text-only skeleton', () => {
    const { container } = render(<PageLoadingState />);

    expect(screen.getByRole('status').textContent).toMatch(/bölüm yükleniyor/i);
    expect(container.querySelectorAll('.skeleton-block').length).toBeGreaterThan(1);
  });
});
