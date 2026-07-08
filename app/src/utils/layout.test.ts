import { describe, expect, it } from 'vitest';
import sites from '../../public/data.json';
import type { Site } from '../types/site';
import { buildLayout } from './layout';

const gokcekaya = (sites as Site[]).find((site) => site.id === 'jica-gokcekaya-pspp');

describe('buildLayout footprint geometry', () => {
  it('uses Gokcekaya polygon footprints instead of the legacy upper reservoir rectangle', () => {
    expect(gokcekaya).toBeTruthy();
    if (!gokcekaya) return;

    const layout = buildLayout(gokcekaya, 1);
    const blockKeys = layout.blocks.features.map((feature) => String(feature.properties?.key));
    const upperWater = layout.blocks.features.find((feature) => feature.properties?.key === 'upperReservoirWater');
    const headrace = layout.water.features.find((feature) => feature.properties?.key === 'headraceAlignment');

    expect(blockKeys).toContain('upperReservoirWater');
    expect(blockKeys).toContain('upperReservoirEmbankment');
    expect(blockKeys).not.toContain('upper_reservoir');
    expect(upperWater?.geometry.coordinates[0]).toEqual(gokcekaya.coordinates.upperReservoirPolygon);
    expect(headrace?.geometry.coordinates).toEqual([
      [30.9802, 40.072],
      [30.9888, 40.0511],
      [30.9976, 40.0295],
      [31.0056, 40.0256],
    ]);
  });
});
