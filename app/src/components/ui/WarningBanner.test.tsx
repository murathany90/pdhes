// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import WarningBanner from './WarningBanner';

describe('WarningBanner', () => {
  afterEach(cleanup);

  it.each([
    ['info', 'status'],
    ['warning', 'status'],
    ['danger', 'alert'],
  ] as const)('renders the %s semantic variant', (type, role) => {
    render(<WarningBanner type={type} message={`${type} mesajı`} />);

    const banner = screen.getByRole(role);
    expect(banner.classList.contains(`alert-${type}`)).toBe(true);
  });
});
