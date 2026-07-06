// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ScenarioSlider from './ScenarioSlider';

describe('ScenarioSlider', () => {
  afterEach(cleanup);

  it('associates its visible label with the range control', () => {
    const onChange = vi.fn();
    render(
      <ScenarioSlider
        label="Arazi şeffaflığı"
        value={70}
        min={0}
        max={100}
        unit="%"
        onChange={onChange}
      />,
    );

    const slider = screen.getByRole('slider', { name: 'Arazi şeffaflığı' });
    expect(slider.getAttribute('aria-valuetext')).toBe('70%');

    fireEvent.change(slider, { target: { value: '65' } });
    expect(onChange).toHaveBeenCalledWith(65);
  });
});
