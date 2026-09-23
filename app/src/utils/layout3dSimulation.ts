import type {
  ComponentsDetail,
  GridCircuitDefinition,
  Layout3DTopology,
  PenstockDefinition,
  Site,
  TransformerDefinition,
  UnitDefinition,
} from '../types/site';
import type { Layout3DFootprintPlan, Layout3DProjectedFootprint } from './layout3dFootprints';

export type SimulationMode = 'generate' | 'pump';
export type SimulationQuality = 'low' | 'medium' | 'high' | 'auto';
export type SimulationState =
  | 'IDLE'
  | 'STARTING_GENERATION'
  | 'GENERATING'
  | 'STOPPING_GENERATION'
  | 'STARTING_PUMP'
  | 'PUMPING'
  | 'STOPPING_PUMP'
  | 'RESERVOIR_EMPTY'
  | 'RESERVOIR_FULL'
  | 'FAULT';

export interface DerivedLayout3DTopology {
  units: UnitDefinition[];
  penstocks: PenstockDefinition[];
  transformers: TransformerDefinition[];
  gridCircuits: GridCircuitDefinition[];
  estimated: boolean;
  confidenceNotes: string[];
}

export interface ReservoirSocInput {
  upperSoc: number;
  lowerSoc: number;
  mode: SimulationMode;
  flowCms: number;
  deltaSeconds: number;
  activeVolumeHm3?: number | null;
  minSoc?: number;
  maxSoc?: number;
}

export interface ReservoirSocResult {
  upperSoc: number;
  lowerSoc: number;
  limitState: Extract<SimulationState, 'RESERVOIR_EMPTY' | 'RESERVOIR_FULL'> | null;
}

export type SimulationEvent =
  | { type: 'START'; mode: SimulationMode }
  | { type: 'STOP' }
  | { type: 'TICK' }
  | { type: 'RESERVOIR_EMPTY' }
  | { type: 'RESERVOIR_FULL' }
  | { type: 'FAULT' };

const DEFAULT_PUMP_POWER_FACTOR = 1 / 0.82;
const DEFAULT_MIN_SOC = 0.05;
const DEFAULT_MAX_SOC = 0.95;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function positiveInteger(value: unknown, fallback: number): number {
  return Number.isInteger(value) && Number(value) > 0 ? Number(value) : fallback;
}

function positiveNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;
}

function chunkContiguous(ids: string[], groupCount: number): string[][] {
  const safeGroupCount = Math.max(1, groupCount);
  const baseSize = Math.floor(ids.length / safeGroupCount);
  const remainder = ids.length % safeGroupCount;
  let cursor = 0;
  return Array.from({ length: safeGroupCount }, (_, index) => {
    const size = baseSize + (index < remainder ? 1 : 0);
    const group = ids.slice(cursor, cursor + size);
    cursor += size;
    return group;
  });
}

function unitLookup(units: UnitDefinition[]): Map<string, UnitDefinition> {
  return new Map(units.map((unit) => [unit.id, unit]));
}

function footprintItemsForComponent(plan: Layout3DFootprintPlan, component: string): Layout3DProjectedFootprint[] {
  return plan.enabled ? plan.items.filter((item) => item.component === component) : [];
}

function normalizeExplicitTopology(topology: Layout3DTopology): DerivedLayout3DTopology | null {
  if (!topology.units?.length) return null;
  return {
    units: topology.units,
    penstocks: topology.penstocks ?? [],
    transformers: topology.transformers ?? [],
    gridCircuits: topology.gridCircuits ?? [],
    estimated: Boolean(topology.estimated),
    confidenceNotes: topology.confidenceNote ? [topology.confidenceNote] : [],
  };
}

export function deriveLayout3DTopology(
  site: Site,
  footprintPlan: Layout3DFootprintPlan,
  componentsDetail: ComponentsDetail,
): DerivedLayout3DTopology {
  const explicit = normalizeExplicitTopology(site.layout3D?.topology ?? {});
  if (explicit) return explicit;

  const unitCount = positiveInteger(componentsDetail.powerhouse.units, 1);
  const unitIds = Array.from({ length: unitCount }, (_, index) => `G${index + 1}`);
  const penstockFootprints = footprintItemsForComponent(footprintPlan, 'penstock');
  const penstockCount = Math.max(1, penstockFootprints.length || positiveInteger(componentsDetail.penstock.count, 1));
  const transformerCount = Math.max(1, positiveInteger(componentsDetail.switchyard.transformer_count, 1));
  const unitPowerMW = positiveNumber(componentsDetail.powerhouse.unitPowerMW, site.capacityMW / unitCount);
  const unitPumpMW = positiveNumber(componentsDetail.powerhouse.unitPumpMW, unitPowerMW * DEFAULT_PUMP_POWER_FACTOR);
  const unitGenerationFlow = site.projectFlowCms ? site.projectFlowCms / unitCount : undefined;
  const unitPumpingFlow = unitGenerationFlow;
  const penstockGroups = chunkContiguous(unitIds, penstockCount);
  const transformerGroups = chunkContiguous(unitIds, transformerCount);

  const penstocks: PenstockDefinition[] = penstockGroups.map((connectedUnitIds, index) => ({
    id: `P${index + 1}`,
    footprintId: penstockFootprints[index]?.id ?? `penstock-${index + 1}`,
    connectedUnitIds,
    designFlowCms: site.projectFlowCms ? site.projectFlowCms / penstockCount : undefined,
    diameterM: componentsDetail.penstock.diameter_m,
    estimated: true,
  }));

  const transformers: TransformerDefinition[] = transformerGroups.map((connectedUnitIds, index) => ({
    id: `T${index + 1}`,
    connectedUnitIds,
    highVoltageKV: componentsDetail.switchyard.voltage_kv,
    estimated: true,
  }));

  const units: UnitDefinition[] = unitIds.map((id) => {
    const penstock = penstocks.find((candidate) => candidate.connectedUnitIds.includes(id));
    const transformer = transformers.find((candidate) => candidate.connectedUnitIds.includes(id));
    return {
      id,
      name: id,
      ratedGenerationMW: unitPowerMW,
      ratedPumpMW: unitPumpMW,
      generationFlowCms: unitGenerationFlow,
      pumpingFlowCms: unitPumpingFlow,
      penstockId: penstock?.id,
      transformerId: transformer?.id,
      estimated: true,
    };
  });

  const switchyard = footprintPlan.items.find((item) => ['switchyard', 'new_switchyard', 'existing_switchyard'].includes(item.component));
  const gridCircuits: GridCircuitDefinition[] = [{
    id: 'GRID-1',
    footprintId: switchyard?.id,
    transformerIds: transformers.map((transformer) => transformer.id),
    ratedVoltageKV: componentsDetail.switchyard.voltage_kv,
    estimated: true,
  }];

  return {
    units,
    penstocks,
    transformers,
    gridCircuits,
    estimated: true,
    confidenceNotes: [
      'Gerçek grup-cebri boru-trafo bağlantı şeması kaynakta verilmediği için temsili dağılım kullanılır.',
    ],
  };
}

export function activeUnits(topology: DerivedLayout3DTopology, activeUnitIds: string[]): UnitDefinition[] {
  const byId = unitLookup(topology.units);
  return activeUnitIds.map((id) => byId.get(id)).filter((unit): unit is UnitDefinition => Boolean(unit));
}

export function calculateGenerationPowerMW(topology: DerivedLayout3DTopology, activeUnitIds: string[]): number {
  return activeUnits(topology, activeUnitIds).reduce((sum, unit) => sum + unit.ratedGenerationMW, 0);
}

export function calculatePumpingPowerMW(topology: DerivedLayout3DTopology, activeUnitIds: string[]): number {
  return activeUnits(topology, activeUnitIds).reduce((sum, unit) => sum + unit.ratedPumpMW, 0);
}

export function calculateActiveFlowCms(
  topology: DerivedLayout3DTopology,
  activeUnitIds: string[],
  mode: SimulationMode,
): number {
  return activeUnits(topology, activeUnitIds).reduce((sum, unit) => {
    const flow = mode === 'generate' ? unit.generationFlowCms : unit.pumpingFlowCms;
    return sum + (flow ?? 0);
  }, 0);
}

/** One operating snapshot for the indicators, mass balance and scene. */
export function resolveSimulationSnapshot(
  topology: DerivedLayout3DTopology,
  unitIds: string[],
  mode: SimulationMode,
  state: SimulationState,
  isPlaying: boolean,
) {
  const ids = [...new Set(unitIds)].filter((id) => topology.units.some((unit) => unit.id === id));
  const running = isPlaying && ids.length > 0
    && state === (mode === 'generate' ? 'GENERATING' : 'PUMPING');
  return {
    running,
    activeUnitIds: ids,
    powerMW: running ? (mode === 'generate'
      ? calculateGenerationPowerMW(topology, ids)
      : calculatePumpingPowerMW(topology, ids)) : 0,
    flowCms: running ? calculateActiveFlowCms(topology, ids, mode) : 0,
  };
}

export const SIMULATION_STATE_LABELS: Record<SimulationState, string> = {
  IDLE: 'Duruş', STARTING_GENERATION: 'Üretime geçiş', GENERATING: 'Üretim',
  STOPPING_GENERATION: 'Üretim durduruluyor', STARTING_PUMP: 'Pompalamaya geçiş',
  PUMPING: 'Pompalama', STOPPING_PUMP: 'Pompalama durduruluyor',
  RESERVOIR_EMPTY: 'Alt SOC sınırı', RESERVOIR_FULL: 'Üst SOC sınırı', FAULT: 'Hata',
};

export function advanceReservoirSoc(input: ReservoirSocInput): ReservoirSocResult {
  const minSoc = input.minSoc ?? DEFAULT_MIN_SOC;
  const maxSoc = input.maxSoc ?? DEFAULT_MAX_SOC;
  const activeVolumeM3 = positiveNumber(input.activeVolumeHm3, 0) * 1_000_000;
  if (activeVolumeM3 <= 0 || input.flowCms <= 0 || input.deltaSeconds <= 0) {
    return {
      upperSoc: clamp(input.upperSoc, minSoc, maxSoc),
      lowerSoc: clamp(input.lowerSoc, minSoc, maxSoc),
      limitState: null,
    };
  }

  // Both SOCs refer to the same modeled transferable volume, not to the
  // measured total fullness of two differently sized reservoirs.
  const available = input.mode === 'generate'
    ? Math.min(input.upperSoc - minSoc, maxSoc - input.lowerSoc)
    : Math.min(maxSoc - input.upperSoc, input.lowerSoc - minSoc);
  const requested = (input.flowCms * input.deltaSeconds) / activeVolumeM3;
  const deltaSoc = Math.max(0, Math.min(requested, available));
  const rawUpper = input.mode === 'generate' ? input.upperSoc - deltaSoc : input.upperSoc + deltaSoc;
  const rawLower = input.mode === 'generate' ? input.lowerSoc + deltaSoc : input.lowerSoc - deltaSoc;
  const upperSoc = clamp(rawUpper, minSoc, maxSoc);
  const lowerSoc = clamp(rawLower, minSoc, maxSoc);
  let limitState: ReservoirSocResult['limitState'] = null;
  if (requested >= available) limitState = input.mode === 'generate' ? 'RESERVOIR_EMPTY' : 'RESERVOIR_FULL';
  return { upperSoc, lowerSoc, limitState };
}

export function transitionSimulationState(state: SimulationState, event: SimulationEvent): SimulationState {
  if (event.type === 'FAULT') return 'FAULT';
  if (event.type === 'STOP') return 'IDLE';
  if (event.type === 'RESERVOIR_EMPTY') return 'RESERVOIR_EMPTY';
  if (event.type === 'RESERVOIR_FULL') return 'RESERVOIR_FULL';
  if (event.type === 'START') {
    return event.mode === 'generate' ? 'STARTING_GENERATION' : 'STARTING_PUMP';
  }
  if (event.type === 'TICK') {
    if (state === 'STARTING_GENERATION') return 'GENERATING';
    if (state === 'STARTING_PUMP') return 'PUMPING';
    if (state === 'STOPPING_GENERATION' || state === 'STOPPING_PUMP') return 'IDLE';
  }
  return state;
}
