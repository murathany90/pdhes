import { useMemo } from 'react';
import type { ComponentsDetail, Site } from '../types/site';
import {
  buildLayout3DFootprintPlan,
  type Layout3DFootprintPlan,
} from '../utils/layout3dFootprints';
import {
  deriveLayout3DTopology,
  resolveSimulationSnapshot,
  type DerivedLayout3DTopology,
  type SimulationMode,
  type SimulationState,
} from '../utils/layout3dSimulation';

export type Layout3DSnapshot = ReturnType<typeof resolveSimulationSnapshot>;

export interface Layout3DSnapshotInput {
  /** Manuel geometri override'ları uygulanmış efektif tesis. */
  site: Site | undefined;
  componentsDetail: ComponentsDetail | null;
  activeUnitIds: string[];
  mode: SimulationMode;
  simulationState: SimulationState;
  isPlaying: boolean;
}

export interface Layout3DSnapshotResult {
  footprintPlan: Layout3DFootprintPlan;
  topology: DerivedLayout3DTopology | null;
  snapshot: Layout3DSnapshot;
}

/**
 * Sayısal göstergeler (ThreeDPage telemetrisi) ile 3D animasyonların
 * (ThreeDModel sahnesi) aynı işletme anlık görüntüsünü kullanması için
 * tek türetme noktası. Her iki taraf da manuel geometri override'ları
 * uygulanmış aynı `site` nesnesiyle bu hook'u çağırmalıdır.
 */
export function useLayout3DSnapshot({
  site,
  componentsDetail,
  activeUnitIds,
  mode,
  simulationState,
  isPlaying,
}: Layout3DSnapshotInput): Layout3DSnapshotResult {
  const footprintPlan = useMemo<Layout3DFootprintPlan>(
    () => (site
      ? buildLayout3DFootprintPlan(site)
      : { enabled: false, hideLegacySquareReservoir: false, items: [] }),
    [site],
  );
  const topology = useMemo<DerivedLayout3DTopology | null>(
    () => (site && componentsDetail
      ? deriveLayout3DTopology(site, footprintPlan, componentsDetail)
      : null),
    [site, footprintPlan, componentsDetail],
  );
  const snapshot = useMemo<Layout3DSnapshot>(
    () => (topology
      ? resolveSimulationSnapshot(topology, activeUnitIds, mode, simulationState, isPlaying)
      : { running: false, activeUnitIds: [], powerMW: 0, flowCms: 0 }),
    [topology, activeUnitIds, mode, simulationState, isPlaying],
  );
  return { footprintPlan, topology, snapshot };
}
