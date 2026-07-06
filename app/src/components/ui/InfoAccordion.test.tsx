// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import InfoAccordion from './InfoAccordion';

describe('InfoAccordion', () => {
  afterEach(cleanup);

  it('exposes disclosure state and the controlled content relationship', () => {
    render(
      <InfoAccordion title="Teknik detay">
        <p>İçerik</p>
      </InfoAccordion>,
    );

    const trigger = screen.getByRole('button', { name: 'Teknik detay' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBeTruthy();

    fireEvent.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById(trigger.getAttribute('aria-controls')!)?.textContent)
      .toContain('İçerik');
  });
});
