import { describe, expect, it } from 'vitest';
import { makeTestSite } from '../test-utils/makeTestSite';
import type { ComponentsDetail } from '../types/site';
import type { Layout3DFootprintPlan } from './layout3dFootprints';
import {
  advanceReservoirSoc,
  calculateGenerationPowerMW,
  calculatePumpingPowerMW,
  deriveLayout3DTopology,
  transitionSimulationState,
  resolveSimulationSnapshot,
} from './layout3dSimulation';

function makeComponentsDetail(overrides: Partial<ComponentsDetail> = {}): ComponentsDetail {
  return {
    upper_reservoir: {
      elevation_m: 889,
      active_volume_mcm: 10.84,
      dam_height_m: 55,
      lining: '',
      geology_note: '',
    },
    lower_reservoir: { elevation_m: 421, min_level_m: 413, note: '' },
    penstock: { diameter_m: 6.6, length_m: 4050, material: '', pressure_class: '', count: 4 },
    powerhouse: {
      cavern_width_m: 36,
      cavern_length_m: 266,
      cavern_height_m: 39,
      units: 4,
      turbine_type: '',
      unitPowerMW: 350,
    },
    surge_tank: { type: '', height_m: 112, diameter_m: 33 },
    switchyard: { voltage_kv: 380, transformer_count: 3, connection_line_km: 7.1 },
    tunnel: { length_m: 4050, diameter_m: 8.2, excavation_type: '' },
    intake_outfall: null,
    ...overrides,
  };
}

function makeFootprintPlan(penstockCount: number): Layout3DFootprintPlan {
  return {
    enabled: true,
    hideLegacySquareReservoir: true,
    items: Array.from({ length: penstockCount }, (_, index) => ({
      id: `penstock-${index + 1}`,
      component: 'penstock',
      kind: 'polyline' as const,
      material: 'shaft' as const,
      closed: false,
      points: [
        { x: index * 10, y: 20, z: 0 },
        { x: index * 10, y: 5, z: 30 },
      ],
      baseY: 0,
      topY: 20,
      extrudeY: 0,
    })),
  };
}

describe('layout3d simulation topology', () => {
  it('derives Gokcekaya as 4 x 350 MW units, 4 footprint penstocks and 3 transformers', () => {
    const topology = deriveLayout3DTopology(
      makeTestSite({ capacityMW: 1400, projectFlowCms: 193 }),
      makeFootprintPlan(4),
      makeComponentsDetail(),
    );

    expect(topology.units).toHaveLength(4);
    expect(topology.penstocks).toHaveLength(4);
    expect(topology.transformers).toHaveLength(3);
    expect(topology.units.map((unit) => unit.ratedGenerationMW)).toEqual([350, 350, 350, 350]);
    expect(calculateGenerationPowerMW(topology, ['G1', 'G2', 'G3', 'G4'])).toBe(1400);
    expect(topology.estimated).toBe(true);
    expect(topology.confidenceNotes.join(' ')).toMatch(/temsili/i);
    expect(topology.penstocks.map((penstock) => penstock.connectedUnitIds.length)).toEqual([1, 1, 1, 1]);
    expect(topology.transformers.map((transformer) => transformer.connectedUnitIds.length)).toEqual([2, 1, 1]);
  });

  it('keeps Altinkaya footprint penstock count instead of generating one penstock per unit', () => {
    const topology = deriveLayout3DTopology(
      makeTestSite({ capacityMW: 1800, projectFlowCms: 350 }),
      makeFootprintPlan(2),
      makeComponentsDetail({
        penstock: { diameter_m: 6, length_m: 870, material: '', pressure_class: '', count: 4 },
        powerhouse: {
          cavern_width_m: 36,
          cavern_length_m: 213,
          cavern_height_m: 39,
          units: 4,
          turbine_type: '',
          unitPowerMW: 450,
        } as ComponentsDetail['powerhouse'] & { unitPowerMW: number },
        switchyard: { voltage_kv: 380, transformer_count: 2, connection_line_km: 1.2 },
      }),
    );

    expect(topology.units).toHaveLength(4);
    expect(topology.penstocks).toHaveLength(2);
    expect(topology.transformers).toHaveLength(2);
    expect(topology.units.map((unit) => unit.ratedGenerationMW)).toEqual([450, 450, 450, 450]);
    expect(topology.penstocks.map((penstock) => penstock.connectedUnitIds)).toEqual([
      ['G1', 'G2'],
      ['G3', 'G4'],
    ]);
  });
});

describe('layout3d simulation physics', () => {
  it('gates telemetry during stops, transitions and zero-unit operation; uses selected unit flow', () => {
    const topology = deriveLayout3DTopology(makeTestSite({ projectFlowCms: 200 }), makeFootprintPlan(4), makeComponentsDetail());
    for (const state of ['IDLE', 'STARTING_GENERATION', 'RESERVOIR_EMPTY'] as const) {
      expect(resolveSimulationSnapshot(topology, ['G1'], 'generate', state, true)).toMatchObject({ running: false, powerMW: 0, flowCms: 0 });
    }
    expect(resolveSimulationSnapshot(topology, [], 'generate', 'GENERATING', true).powerMW).toBe(0);
    expect(resolveSimulationSnapshot(topology, ['G1', 'G1', 'unknown'], 'generate', 'GENERATING', true)).toMatchObject({ powerMW: 350, flowCms: 50 });
    expect(resolveSimulationSnapshot(topology, ['G1'], 'pump', 'GENERATING', true).running).toBe(false);
    expect(resolveSimulationSnapshot(topology, ['G1'], 'pump', 'PUMPING', true).powerMW).toBeGreaterThan(350);
  });

  it('stops at either reservoir limit without creating or losing transferred volume', () => {
    const result = advanceReservoirSoc({ upperSoc: 0.7, lowerSoc: 0.94, mode: 'generate', flowCms: 1000, deltaSeconds: 1000, activeVolumeHm3: 1 });
    expect(result.lowerSoc).toBeCloseTo(0.95);
    expect(result.upperSoc).toBeCloseTo(0.69);
    expect(result.upperSoc + result.lowerSoc).toBeCloseTo(1.64);
    expect(result.limitState).toBe('RESERVOIR_EMPTY');
  });
  it('calculates generation and pumping power from active units with a separate estimated pump rating', () => {
    const topology = deriveLayout3DTopology(
      makeTestSite({ capacityMW: 1400, projectFlowCms: 193 }),
      makeFootprintPlan(4),
      makeComponentsDetail(),
    );

    expect(calculateGenerationPowerMW(topology, ['G1', 'G2'])).toBeCloseTo(700, 1);
    expect(calculatePumpingPowerMW(topology, ['G1', 'G2'])).toBeCloseTo(853.66, 1);
    expect(calculatePumpingPowerMW(topology, ['G1', 'G2'])).toBeGreaterThan(calculateGenerationPowerMW(topology, ['G1', 'G2']));
  });

  it('advances reservoir SOC by volume balance and reports hard limits', () => {
    const generation = advanceReservoirSoc({
      upperSoc: 0.5,
      lowerSoc: 0.5,
      mode: 'generate',
      flowCms: 100,
      deltaSeconds: 3600,
      activeVolumeHm3: 3.6,
    });
    expect(generation.upperSoc).toBeCloseTo(0.4);
    expect(generation.lowerSoc).toBeCloseTo(0.6);
    expect(generation.limitState).toBeNull();

    const empty = advanceReservoirSoc({
      upperSoc: 0.06,
      lowerSoc: 0.94,
      mode: 'generate',
      flowCms: 100,
      deltaSeconds: 3600,
      activeVolumeHm3: 3.6,
    });
    expect(empty.upperSoc).toBe(0.05);
    expect(empty.limitState).toBe('RESERVOIR_EMPTY');
  });

  it('transitions through explicit start/stop and reservoir limit states', () => {
    expect(transitionSimulationState('IDLE', { type: 'START', mode: 'generate' })).toBe('STARTING_GENERATION');
    expect(transitionSimulationState('STARTING_GENERATION', { type: 'TICK' })).toBe('GENERATING');
    expect(transitionSimulationState('GENERATING', { type: 'RESERVOIR_EMPTY' })).toBe('RESERVOIR_EMPTY');
    expect(transitionSimulationState('RESERVOIR_EMPTY', { type: 'STOP' })).toBe('IDLE');
    expect(transitionSimulationState('IDLE', { type: 'START', mode: 'pump' })).toBe('STARTING_PUMP');
    expect(transitionSimulationState('STARTING_PUMP', { type: 'TICK' })).toBe('PUMPING');
  });
});
