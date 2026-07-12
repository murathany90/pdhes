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

  it('keeps the FAB popover table sticky, compact, and mobile-safe', () => {
    const fabCss = css.slice(css.indexOf('/* --- FAB POPOVER --- */'), css.indexOf('/* --- ELEVATION PROFILE --- */'));

    expect(fabCss).not.toContain('-webkit-overflow-scrolling: touch');
    expect(fabCss).toContain('height: min(560px, calc(100vh - 112px), calc(100% - 72px))');
    expect(fabCss).toContain('position: fixed');
    expect(fabCss).toContain('overscroll-behavior: contain');
    expect(fabCss).toContain('min-width: 0');
    expect(fabCss).toContain('.fab-table-head');
    expect(fabCss).toContain('.fab-table-scroll');
    expect(fabCss).toContain('overflow: hidden');
    expect(fabCss).toContain('overflow-wrap: anywhere');
    expect(fabCss).toContain('.fab-table tbody tr:focus-visible');
    expect(fabCss).toContain('z-index: 12');
  });

  it('keeps map popups styled and mobile-safe in both themes', () => {
    expect(css).toContain('.map-popup-card');
    expect(css).toContain('.map-popup-title');
    expect(css).toContain('.map-popup-chip');
    expect(css).toContain('.map-popup-grid');
    expect(css).toContain('.map-popup-actions');
    expect(css).toContain('.map-popup-tooltip');
    expect(css).toContain('.map-popup-card--candidate');
    expect(css).toContain('width: min(240px, calc(100vw - 20px))');
    expect(css).toContain('.map-popup-card--world');
    expect(css).toContain('width: min(210px, calc(100vw - 20px))');
    expect(css).toContain('max-height: min(54vh, 300px)');
    expect(css).toContain('font-size: 10.75px');
    expect(css).toContain('html[data-theme="light"] .map-popup-card');
  });

  it('keeps the app chrome above 3D canvas and HTML overlays', () => {
    expect(css).toContain('.topbar, .tabs { position: relative; z-index: 40;');
    expect(css).toContain('border-bottom: 1px solid var(--line); background: var(--bg); z-index: 40;');
    expect(css).toContain('.threed-page { height: 100%; overflow: hidden; isolation: isolate;');
    expect(css).toContain('.app { height: 100vh; display: grid; grid-template-rows: min-content 52px 1fr; gap: 0; min-width: 0; position: fixed; inset: 0; width: 100%; overflow: hidden; }');
    expect(css).toContain('.app { position: static; height: auto; min-height: 100vh; overflow: visible;');
  });
});
