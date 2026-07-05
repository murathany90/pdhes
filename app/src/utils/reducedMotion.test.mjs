import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('reduced motion stylesheet contract', () => {
  it('disables nonessential animation and smooth scrolling when requested', () => {
    const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8');

    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('animation-duration: 0.01ms !important');
    expect(css).toContain('transition-duration: 0.01ms !important');
    expect(css).toContain('scroll-behavior: auto !important');
  });
});
