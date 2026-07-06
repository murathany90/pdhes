import { describe, expect, it } from 'vitest';
import { publicAssetUrl } from './publicUrl';

describe('publicAssetUrl', () => {
  it('resolves assets below a GitHub Pages project base', () => {
    expect(publicAssetUrl('data.json', '/pdhes/'))
      .toBe('/pdhes/data.json');
  });

  it('normalizes leading and trailing slashes', () => {
    expect(publicAssetUrl('/grid_assets.json', '/pdhes'))
      .toBe('/pdhes/grid_assets.json');
  });

  it('uses the site root in local development', () => {
    expect(publicAssetUrl('data.json', '/')).toBe('/data.json');
  });
});
