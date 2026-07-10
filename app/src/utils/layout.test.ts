import { describe, expect, it } from 'vitest';
import sites from '../../public/data.json';
import type { Site } from '../types/site';
import { buildLayout } from './layout';

import fs from 'fs';
import path from 'path';

const rawGokcekaya = (sites as Site[]).find((site) => site.id === 'kamu-gokcekaya-pspp');
const footprints = JSON.parse(fs.readFileSync(path.join(__dirname, '../../public/footprints/kamu-gokcekaya-pspp.json'), 'utf-8'));
const gokcekaya = rawGokcekaya ? { ...rawGokcekaya, layout3D: { ...rawGokcekaya.layout3D!, componentFootprints: footprints } } : undefined;

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
    expect(upperWater?.geometry.coordinates[0]).toHaveLength(10);
    expect(headrace?.geometry.coordinates).toHaveLength(4);
  });
});
