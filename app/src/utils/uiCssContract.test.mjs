import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8');

describe('UI stylesheet compatibility contract', () => {
  it('defines legacy theme aliases used by UI components', () => {
    [
      '--text-muted:',
      '--text-strong:',
      '--surface-1:',
      '--surface-2:',
      '--surface-sunken:',
      '--border:',
      '--border-light:',
      '--primary:',
      '--bg-primary:',
      '--text-inverted:',
    ].forEach((token) => {
      expect(css).toContain(token);
    });
  });

  it('keeps mobile map popovers and wide tables inside the viewport', () => {
    expect(css).toContain('width: min(400px, calc(100vw - 32px))');
    expect(css).toContain('max-width: calc(100vw - 32px)');
    expect(css).toContain('width: min(400px, calc(100vw - 48px))');
    expect(css).toContain('width: min(400px, calc(100vw - 40px))');
    expect(css).toContain('.table-card');
    expect(css).toContain('-webkit-overflow-scrolling: touch');
  });
});
