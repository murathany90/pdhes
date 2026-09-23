import { describe, expect, it } from 'vitest';
import sites from '../../public/data.json';
import type { Site } from '../types/site';
import { buildLayout } from './layout';

import gokcekayaFootprints from '../../public/footprints/kamu-gokcekaya-pspp.json';
import sariyarFootprints from '../../public/footprints/kamu-sariyar-pspp.json';

const rawGokcekaya = (sites as Site[]).find((site) => site.id === 'kamu-gokcekaya-pspp');
const gokcekaya = rawGokcekaya ? { ...rawGokcekaya, layout3D: { ...rawGokcekaya.layout3D!, componentFootprints: gokcekayaFootprints as any } } : undefined;

describe('buildLayout footprint geometry', () => {
  it('uses Gokcekaya polygon footprints instead of the legacy upper reservoir rectangle', () => {
    expect(gokcekaya).toBeTruthy();
    if (!gokcekaya) return;

    const layout = buildLayout(gokcekaya, 1);
    const blockKeys = layout.blocks.features.map((feature) => String(feature.properties?.key));
    const upperWater = layout.blocks.features.find((feature) => feature.properties?.key === 'upperReservoirWater');
    const headrace = layout.water.features.find((feature) => feature.properties?.key === 'penstock01');

    expect(blockKeys).toContain('upperReservoirWater');
    expect(blockKeys).toContain('upperReservoirEmbankment');
    expect(blockKeys).not.toContain('upper_reservoir');
    expect(upperWater?.geometry.coordinates[0].at(0)).toEqual(upperWater?.geometry.coordinates[0].at(-1));
    expect(upperWater?.geometry.coordinates[0].length).toBeGreaterThanOrEqual(5);
    expect(headrace?.geometry.coordinates.length).toBeGreaterThanOrEqual(2);
  });

  it.each([{ footprints: gokcekayaFootprints }, { footprints: sariyarFootprints }])('keeps reservoir water visible inside the original bank ring', ({ footprints }) => {
    const site = { ...rawGokcekaya!, layout3D: { ...rawGokcekaya!.layout3D!, componentFootprints: footprints as any } };
    const layout = buildLayout(site, 0.5);
    const bank = layout.blocks.features.find((feature) => feature.properties?.key === 'upperReservoirEmbankment')!;
    const water = layout.blocks.features.find((feature) => feature.properties?.key === 'upperReservoirWater')!;
    expect(bank.geometry.coordinates[0]).toEqual(footprints.find((fp) => fp.id === 'upperReservoirEmbankment')!.coords);
    expect(bank.geometry.coordinates[1]).toEqual(water.geometry.coordinates[0]);
    for (const feature of layout.blocks.features) {
      expect(feature.properties!.height).toBeGreaterThan(feature.properties!.base);
    }
  });

  it('does not overlay an alternate lower water footprint with a fallback rectangle', () => {
    const site = { ...rawGokcekaya!, layout3D: { ...rawGokcekaya!.layout3D!, componentFootprints: gokcekayaFootprints.map((fp) => fp.component === 'lower_reservoir' ? { ...fp, id: 'lowerReservoirWater' } : fp) as any } };
    const layout = buildLayout(site, 1);
    expect(layout.blocks.features.some((feature) => feature.properties?.key === 'lower_reservoir')).toBe(false);
    expect(layout.labels.features.some((feature) => feature.properties?.key === 'lowerReservoirWater')).toBe(true);
  });
});
