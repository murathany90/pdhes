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
    expect(css).toContain('width: min(360px, calc(100vw - 32px))');
    expect(css).toContain('max-width: calc(100vw - 32px)');
    expect(css).toContain('width: min(360px, calc(100vw - 48px))');
    expect(css).toContain('width: min(360px, calc(100vw - 40px))');
    expect(css).toContain('.table-card');
    expect(css).toContain('-webkit-overflow-scrolling: touch');
  });

  it('keeps the app chrome above 3D canvas and HTML overlays', () => {
    expect(css).toContain('.topbar, .tabs { position: relative; z-index: 40;');
    expect(css).toContain('border-bottom: 1px solid var(--line); background: var(--bg); z-index: 40;');
    expect(css).toContain('.threed-page { height: 100%; overflow: hidden; isolation: isolate;');
    expect(css).toContain('.app { height: 100vh; display: grid; grid-template-rows: min-content 52px 1fr; gap: 0; min-width: 0; position: fixed; inset: 0; width: 100%; overflow: hidden; }');
    expect(css).toContain('.app { position: static; height: auto; min-height: 100vh; overflow: visible;');
  });
});
