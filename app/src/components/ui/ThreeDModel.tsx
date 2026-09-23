import { Component, memo, useRef, useMemo, useEffect, useLayoutEffect, useState, type Dispatch, type MutableRefObject, type SetStateAction } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Line, Sky, MeshDistortMaterial } from '@react-three/drei';
import { RotateCcw, Focus, BatteryCharging, Zap } from 'lucide-react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { COMPONENTS } from '../../utils/constants';
import type { ComponentsDetail, Site } from '../../types/site';
import { useSiteStore } from '../../stores/useSiteStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { isSeaLowerReservoir } from '../../utils/siteDerived';
import {
  buildLayout3DFootprintPlan,
  LAYOUT_3D_MATERIAL_COLORS,
  type Layout3DProjectedFootprint,
  type Layout3DFootprintPlan,
  groupFootprintsByLayer,
  isLayerVisible,
  isFootprintLayerVisible,
} from '../../utils/layout3dFootprints';
import {
  resolveSimulationSnapshot,
  deriveLayout3DTopology,
  type DerivedLayout3DTopology,
  type SimulationQuality,
  type SimulationState,
} from '../../utils/layout3dSimulation';
import { useManualGeometryStore } from '../../stores/useManualGeometryStore';
import { overrideSiteWithManualGeometries } from '../../utils/manualGeometryConverter';
import { createFootprintPolygonGeometry, footprintRing, generationWaterwayPoints, representativeWaterwayLinks, reservoirSurfaceOffset } from '../../utils/layout3dGeometry';
import { useShallow } from 'zustand/react/shallow';



interface ThreeDModelProps {
  siteId?: string;
  activeComponent: string;
  onSelectComponent: (comp: string) => void;
  layers: Record<string, boolean>;
  mode: 'generate' | 'pump';
  componentsDetail: ComponentsDetail;
  site: Site;
  isPlaying: boolean;
  activeUnits: number;
  activeUnitIds?: string[];
  simulationState?: SimulationState;
  quality?: SimulationQuality;
  upperSoc?: number;
  lowerSoc?: number;
  maxUnits: number;
  showTerrain: boolean;
  showLabels: boolean;
  terrainOpacity: number;
  cameraRequest?: { revision: number; selected: boolean };
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const logScale = (v: number, base: number, min: number, max: number) =>
  clamp(Math.log(v / base + 1) * 2, min, max);

/** The 3D scene receives terrain opacity as a unit value, never as a percentage. */
export function normalizeTerrainOpacity(value: number): number {
  return clamp(Number.isFinite(value) ? value : 0, 0, 1);
}

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

/* ─────────────────────────────────────────────
   Terrain Height Lookup Helper (Cesima Mountain for Presenzano)
   ───────────────────────────────────────────── */
const getTerrainHeight = (x: number, z: number, isPresenzano?: boolean) => {
  const xOrig = x / 3;
  const zOrig = z / 3;
  const py = -zOrig;
  if (isPresenzano) {
    // Cesima Mountain is on the left (negative x), sloping down steeply to the Volturno Valley on the right (positive x)
    const slope = (-xOrig + 75) * 0.38;
    const valleyScale = xOrig > 10 ? Math.max(0, 1 - (xOrig - 10) * 0.035) : 1;
    
    const noise1 = Math.sin(xOrig * 0.04 + Math.cos(py * 0.03)) * 7 * valleyScale;
    const noise2 = Math.cos(py * 0.08) * Math.sin(xOrig * 0.06) * 4 * valleyScale;
    const noise3 = Math.sin(xOrig * 0.25 + py * 0.15) * 0.6;
    
    const h = slope + noise1 + noise2 + noise3;
    // Flatten the Volturno valley for the lower reservoir (x > 25)
    if (xOrig > 25) {
      return Math.max(2, h * Math.exp(-(xOrig - 25) * 0.08)) * 3;
    }
    return (h - 3) * 3;
  } else {
    // Generic site terrain
    const slope = (-xOrig + 75) * 0.3;
    const noise1 = Math.sin(xOrig * 0.05 + Math.cos(py * 0.04)) * 6;
    const noise2 = Math.cos(py * 0.1) * Math.sin(xOrig * 0.08) * 3;
    const noise3 = Math.sin(xOrig * 0.3 + py * 0.2) * 0.5;
    return (slope + noise1 + noise2 + noise3 - 5) * 3;
  }
};

const placeOnTerrain = (x: number, z: number, offsetY: number, isPresenzano?: boolean) => {
  return new THREE.Vector3(x, getTerrainHeight(x, z, isPresenzano) + offsetY, z);
};

/* ─────────────────────────────────────────────
   Realistic Terrain
   ───────────────────────────────────────────── */
function RealisticTerrain({ opacity, isPresenzano }: { opacity: number; isPresenzano?: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const normalizedOpacity = normalizeTerrainOpacity(opacity);

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(450, 450, 200, 200);
    const pos = g.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      
      const z = getTerrainHeight(x, -y, isPresenzano);
      pos.setZ(i, z);
    }
    g.computeVertexNormals();

    const colors = new Float32Array(pos.count * 3);
    const colorValley = new THREE.Color('#1b382b'); // deep green forest floor
    const colorGrass = new THREE.Color('#385a3c');  // healthy grassy slope
    const colorRock = new THREE.Color('#635c51');   // exposed earth/rocks
    const colorSnow = new THREE.Color('#e5e7eb');   // snowy peaks
    
    for (let i = 0; i < pos.count; i++) {
      const h = pos.getZ(i);
      const normalZ = g.attributes.normal.getZ(i);
      
      let c: THREE.Color;
      
      // Slope steepness (rocky cliffs where it is steep)
      if (normalZ < 0.76) {
        c = colorRock;
      } else {
        if (h < 12) c = colorValley.clone().lerp(colorGrass, clamp(h / 12, 0, 1));
        else if (h < 66) c = colorGrass.clone().lerp(colorRock, clamp((h - 12) / 54, 0, 1));
        else if (h < 96) c = colorRock.clone().lerp(colorSnow, clamp((h - 66) / 30, 0, 1));
        else c = colorSnow;
      }

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return g;
  }, [isPresenzano]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <mesh ref={mesh} geometry={geometry} receiveShadow><meshStandardMaterial vertexColors roughness={0.85} metalness={0.1} flatShading transparent opacity={normalizedOpacity} /></mesh>
      {/* Topographic grid overlay to make the 3D surface obvious */}
      <mesh geometry={geometry}>
        <meshBasicMaterial 
          color="#000000" 
          wireframe 
          transparent 
          opacity={0.06} 
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Realistic Upper Reservoir (Open Basin with Crescent Dam Wall)
   ───────────────────────────────────────────── */
function RealisticUpperReservoir({ position, active, onClick, detail, waterLevelRef, showLabels, isPresenzano, isPlaying, mode, activeUnits, site }: any) {
  const damH = logScale(detail.dam_height_m, 20, 3, 8) * 1.2;
  const radius = 22;
  const pos: [number, number, number] = [position.x, position.y - 2, position.z];
  
  const waterMesh = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!waterMesh.current) return;
    const t = clock.getElapsedTime();
    waterMesh.current.position.y = -damH/3 + (damH * 0.6) * waterLevelRef.current + 0.3;
    
    const isFlowing = isPlaying && activeUnits > 0;
    const waveSpeed = isFlowing ? 4.0 : 1.3;
    const waveAmp = isFlowing ? 0.03 : 0.015;
    const wave = Math.sin(t * waveSpeed) * waveAmp;
    waterMesh.current.scale.set(1 + wave, 1, 1 + wave);
    
    if (isFlowing) {
      waterMesh.current.rotation.z = t * 0.5 * (mode === 'generate' ? -1 : 1);
    }
  });

  return (
    <group position={pos}>
      {/* Clickable structure */}
      <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
        {/* Containment walls - open cylindrical basin like lower reservoir */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[radius, radius + 0.8, damH, 48, 1, true]} />
          <meshStandardMaterial color="#505457" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Crescent dam wall on the downstream side (partial arc) */}
        <mesh position={[0, 0, radius * 0.85]} castShadow receiveShadow>
          <boxGeometry args={[radius * 1.4, damH + 2, 4]} />
          <meshStandardMaterial color={isPresenzano ? '#424549' : '#888e95'} roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Dam crest road on top */}
        <mesh position={[0, damH/2 + 0.5, radius * 0.85]} castShadow>
          <boxGeometry args={[radius * 1.5, 0.2, 5]} />
          <meshStandardMaterial color="#5a5d61" roughness={0.8} />
        </mesh>

        {/* Abutments */}
        <mesh position={[-radius * 0.72, 0, radius * 0.55]} rotation={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[3, damH + 2, 4]} />
          <meshStandardMaterial color="#686d72" roughness={0.85} />
        </mesh>
        <mesh position={[radius * 0.72, 0, radius * 0.55]} rotation={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[3, damH + 2, 4]} />
          <meshStandardMaterial color="#686d72" roughness={0.85} />
        </mesh>
        
        {/* Water Intake Tower */}
        <group position={[radius - 2, 0, -2]} rotation={[0, 0.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.2, damH + 1, 1.8]} />
            <meshStandardMaterial color="#7a7f84" roughness={0.8} />
          </mesh>
          <mesh position={[0, damH/2 + 0.6, 0]} castShadow>
            <boxGeometry args={[0.8, 0.5, 0.6]} />
            <meshStandardMaterial color="#b8451f" />
          </mesh>
        </group>
      </group>
      
      {/* Basin Floor */}
      <mesh position={[0, -damH/2, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
         <circleGeometry args={[radius - 0.2, 48]} />
         <meshStandardMaterial color="#302620" roughness={1.0} />
      </mesh>

      {/* Water Body - open and clearly visible */}
      <mesh ref={waterMesh} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[radius - 0.3, 48]} />
        <meshPhysicalMaterial 
          color="#0f5c94" 
          transparent 
          opacity={0.85}
          roughness={0.1} 
          metalness={0.05}
          transmission={0.85} 
          ior={1.333}
        />
      </mesh>

      <Html position={[0, damH + 20, 0]} center style={{ display: showLabels ? 'block' : 'none' }} zIndexRange={[100, 0]}>
        <div style={labelStyle(active, '#3d7dff')}>
          {isPresenzano ? 'Cesima Üst Rezervuarı (6 Milyon m³)' : (site?.upper ? `${site.upper} (${detail.active_volume_mcm} Milyon m³)` : `Üst Rezervuar (${detail.active_volume_mcm} Milyon m³)`)}
        </div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Realistic Lower Reservoir (Organic Basin & Water)
   ───────────────────────────────────────────── */
function RealisticLowerReservoir({ position, active, onClick, waterLevelRef, showLabels, isPresenzano, isPlaying, mode, activeUnits }: any) {
  const depth = 6;
  const pos: [number, number, number] = [position.x, position.y - depth * 0.25, position.z];
  const radius = 28;
  
  const waterMesh = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!waterMesh.current) return;
    const t = clock.getElapsedTime();
    waterMesh.current.position.y = -depth/2 + (depth * 0.8) * waterLevelRef.current + 0.15;
    const wave = Math.cos(t * 1.1) * 0.015;
    waterMesh.current.scale.set(1 + wave, 1, 1 + wave);
    
    if (isPlaying && activeUnits > 0) {
      waterMesh.current.rotation.z = t * 0.5 * (mode === 'generate' ? -1 : 1);
    }
  });

  return (
    <group position={pos}>
      <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
        {/* Concrete Intake and Containment walls */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[radius, radius + 0.8, depth, 48, 1, true]} />
          <meshStandardMaterial color="#505457" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Water Intake / Outlet Tower */}
        <group position={[-radius + 1.6, 0.1, -1.8]} rotation={[0, 0.7, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.6, depth + 1.2, 2.2]} />
            <meshStandardMaterial color="#7a7f84" roughness={0.8} />
          </mesh>
          {/* Metal Trash Racks */}
          <mesh position={[0.2, 0, 1.15]} castShadow>
            <boxGeometry args={[2.0, depth - 0.2, 0.1]} />
            <meshStandardMaterial color="#212326" metalness={0.8} roughness={0.5} wireframe />
          </mesh>
          {/* Gate Hoist House */}
          <mesh position={[0, depth/2 + 0.8, 0]} castShadow>
            <boxGeometry args={[1.0, 0.6, 0.8]} />
            <meshStandardMaterial color="#b8451f" />
          </mesh>
        </group>
      </group>
      
      {/* Basin Floor */}
      <mesh position={[0, -depth/2, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
         <circleGeometry args={[radius - 0.2, 48]} />
         <meshStandardMaterial color="#302620" roughness={1.0} />
      </mesh>

      {/* Water Body */}
      <mesh ref={waterMesh} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[radius - 0.1, 48]} />
        <meshPhysicalMaterial 
          color="#12b3c9" 
          transparent 
          opacity={0.8}
          roughness={0.14} 
          metalness={0.05}
          transmission={0.8} 
          ior={1.333}
        />
      </mesh>

      <Html position={[0, depth + 25, 0]} center style={{ display: showLabels ? 'block' : 'none' }} zIndexRange={[100, 0]}>
        <div style={labelStyle(active, '#15cfe8')}>{isPresenzano ? 'Presenzano Alt Rezervuarı (6 Milyon m³)' : 'Alt Rezervuar'}</div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Sea Water Lower Reservoir (Open Ocean/Sea Plane)
   ───────────────────────────────────────────── */
function SeaWaterReservoir({ position, active, onClick, waterLevelRef, showLabels, isPlaying, activeUnits, mode }: any) {
  const pos: [number, number, number] = [position.x, position.y - 4, position.z];
  const waterMesh = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!waterMesh.current) return;
    const t = clock.getElapsedTime();
    // Subtle tide and waves
    waterMesh.current.position.y = (waterLevelRef.current - 0.5) * 1.5; 
    const isFlowing = isPlaying && activeUnits > 0;
    const waveSpeed = isFlowing ? 3.0 : 0.8;
    const waveAmp = isFlowing ? 0.03 : 0.01;
    const wave = Math.cos(t * waveSpeed) * waveAmp;
    waterMesh.current.scale.set(1 + wave, 1, 1 + wave);
    
    if (isFlowing) {
      waterMesh.current.rotation.z = t * 0.2 * (mode === 'generate' ? -1 : 1);
    }
  });

  return (
    <group position={pos}>
      <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
        {/* Coastal Intake/Outfall Structure */}
        <group position={[-25, 1, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[8, 4, 12]} />
            <meshStandardMaterial color="#6a737a" roughness={0.9} />
          </mesh>
          <mesh position={[2, 0, 0]} castShadow>
            <boxGeometry args={[4, 3.5, 8]} />
            <meshStandardMaterial color="#44484d" roughness={0.9} />
          </mesh>
          <mesh position={[4.1, -0.5, 0]}>
            <boxGeometry args={[0.2, 2.5, 6]} />
            <meshStandardMaterial color="#1a1c1e" wireframe />
          </mesh>
        </group>
      </group>

      {/* Infinite Sea Plane */}
      <mesh ref={waterMesh} rotation={[-Math.PI/2, 0, 0]} position={[260, 0, 0]}>
        <planeGeometry args={[400, 400, 32, 32]} />
        <MeshDistortMaterial 
          color="#045a7a" 
          transparent 
          opacity={0.85}
          roughness={0.1} 
          metalness={0.1}
          distort={isPlaying && activeUnits > 0 ? 0.2 : 0.05}
          speed={isPlaying && activeUnits > 0 ? 3 : 1}
        />
      </mesh>

      <Html position={[-20, 6, 0]} center style={{ display: showLabels ? 'block' : 'none' }}>
        <div style={labelStyle(active, '#15cfe8')}>Deniz Alım / Deşarj Yapısı</div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Realistic Powerhouse (Cavern Cutaway / Well Shafts)
   ───────────────────────────────────────────── */
function RealisticPowerhouse({ active, onClick, detail, activeUnits, activeUnitIds, isPlaying, showLabels, isPresenzano, mode }: any) {
  const w = logScale(detail.cavern_width_m, 20, 3, 6);
  const l = logScale(detail.cavern_length_m, 100, 6, 12);
  const h = logScale(detail.cavern_height_m, 20, 3, 6);
  const pos: [number, number, number] = [45, getTerrainHeight(45, 15, isPresenzano) - 2, 15];
  
  const turbineRefs = useRef<THREE.Group[]>([]);

  useFrame(() => {
    if (!isPlaying) return;
    // Rotation direction switches based on mode: clockwise for generation, counter-clockwise for pumping
    const spinSpeed = mode === 'generate' ? 0.16 : -0.16;
    turbineRefs.current.forEach((ref, index) => {
      if (ref && (activeUnitIds ? activeUnitIds.includes(`G${index + 1}`) : index < activeUnits)) {
        ref.rotation.y += spinSpeed;
      }
    });
  });

  return (
    <group position={pos}>
      {/* Outer Clickable Group */}
      <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
        {isPresenzano ? (
          /* Low-profile green painted control/assembly hall building integrated into landscape */
          <mesh position={[0, h/2 + 0.6, 0]} castShadow>
            <boxGeometry args={[w - 0.4, 1.2, l - 0.4]} />
            <meshStandardMaterial color="#2d3d30" roughness={0.8} /> {/* Camouflage dark green */}
          </mesh>
        ) : (
          /* Above-ground Control Building for generic candidates */
          <>
            <mesh position={[0, h/2 + 1.1, 0]} castShadow>
              <boxGeometry args={[w - 0.3, 2.2, l - 0.4]} />
              <meshStandardMaterial color="#70767f" roughness={0.7} />
            </mesh>
            {/* Glass Windows */}
            <mesh position={[w/2 - 0.14, h/2 + 1.1, 0]} castShadow>
              <boxGeometry args={[0.05, 1.0, l - 2]} />
              <meshPhysicalMaterial color="#6ae7ff" transparent opacity={0.65} transmission={0.95} roughness={0.1} />
            </mesh>
          </>
        )}
        
        {/* Excavated Cavern Vault Back walls */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[w, h, l]} />
          <meshStandardMaterial 
            color="#3d3835" 
            roughness={0.95} 
            transparent 
            opacity={0.2} 
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Supporting structural column frames (generic cavern only) */}
        {!isPresenzano && Array.from({ length: 4 }).map((_, i) => (
          <group key={`col-${i}`} position={[0, 0, -l/2 + (l/3)*i]}>
            <mesh position={[-w/2 + 0.2, 0, 0]}><boxGeometry args={[0.15, h, 0.15]} /><meshStandardMaterial color="#42494e" metalness={0.75} /></mesh>
            <mesh position={[w/2 - 0.2, 0, 0]}><boxGeometry args={[0.15, h, 0.15]} /><meshStandardMaterial color="#42494e" metalness={0.75} /></mesh>
            <mesh position={[0, h/2 - 0.1, 0]}><boxGeometry args={[w - 0.4, 0.15, 0.15]} /><meshStandardMaterial color="#42494e" metalness={0.75} /></mesh>
          </group>
        ))}
      </group>

      {/* Cavern Concrete Floor */}
      <mesh position={[0, -h/2 + 0.1, 0]} receiveShadow>
        <boxGeometry args={[w - 0.05, 0.2, l - 0.05]} />
        <meshStandardMaterial color="#5b5e62" roughness={0.8} />
      </mesh>

      {/* Highly Detailed Turbine & Generator Units */}
      {isPresenzano ? (
        /* Centrale a Pozzo: 4 Silindirik Dikey Şaft (Well) */
        Array.from({ length: 4 }).map((_, i) => {
          const isUnitActive = (activeUnitIds ? activeUnitIds.includes(`G${i + 1}`) : i < activeUnits) && isPlaying;
          // Space wells 40m apart (equivalent to l/5 intervals)
          const zPos = -l/2 + (l / 5) * (i + 1);
          const wellH = h - 0.4;
          
          return (
            <group key={i} position={[0, 0, zPos]}>
              {/* Upper Well Cylinder: 27.5m diameter (R: 1.38 units), H: wellH / 2 */}
              <mesh position={[0, wellH / 4 - h/2 + 0.2, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[1.38, 1.38, wellH / 2, 24, 1, true]} />
                <meshStandardMaterial color="#6c7075" roughness={0.85} side={THREE.DoubleSide} />
              </mesh>
              {/* Lower Well Cylinder: 23.6m diameter (R: 1.18 units), H: wellH / 2 */}
              <mesh position={[0, -wellH / 4 - h/2 + 0.2 + wellH / 2, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[1.18, 1.18, wellH / 2, 24, 1, true]} />
                <meshStandardMaterial color="#5d6063" roughness={0.85} side={THREE.DoubleSide} />
              </mesh>
              
              {/* Francis Pump-Turbine scroll case at the bottom */}
              <mesh position={[0, -h/2 + 0.6, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
                <torusGeometry args={[0.7, 0.22, 12, 24]} />
                <meshStandardMaterial color="#242629" metalness={0.8} roughness={0.4} />
              </mesh>
              
              {/* Red Generator Stator block inside lower cylinder */}
              <mesh position={[0, -h/2 + 1.5, 0]} castShadow>
                <cylinderGeometry args={[0.6, 0.68, 0.9, 16]} />
                <meshStandardMaterial 
                  color={isUnitActive ? '#f43f5e' : '#4b5563'} 
                  metalness={0.5} 
                  roughness={0.4} 
                  emissive={isUnitActive ? '#b91c1c' : '#000'}
                  emissiveIntensity={isUnitActive ? 0.65 : 0}
                />
              </mesh>
              
              {/* Exciter top cap */}
              <mesh position={[0, -h/2 + 2.0, 0]} castShadow>
                <cylinderGeometry args={[0.26, 0.3, 0.2, 16]} />
                <meshStandardMaterial color="#ea580c" metalness={0.6} roughness={0.4} />
              </mesh>

              {/* Rotating marked Shaft (Mil) */}
              <group ref={(el) => { if (el) turbineRefs.current[i] = el; }} position={[0, -h/2 + 0.95, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.11, 0.11, 0.7, 12]} />
                  <meshStandardMaterial color="#aab0b5" metalness={0.9} roughness={0.15} />
                </mesh>
                {/* Spinning visual marking line */}
                <mesh position={[0, 0, 0.12]}>
                  <boxGeometry args={[0.015, 0.5, 0.015]} />
                  <meshBasicMaterial color="#111" />
                </mesh>
              </group>
            </group>
          );
        })
      ) : (
        /* Standard Cavern Generator Units */
        Array.from({ length: Math.min(detail.units, 8) }).map((_, i) => {
          const isUnitActive = (activeUnitIds ? activeUnitIds.includes(`G${i + 1}`) : i < activeUnits) && isPlaying;
          const zPos = -l/2 + (l / (detail.units + 1)) * (i + 1);
          
          return (
            <group key={i} position={[0, -h/2 + 0.2, zPos]}>
              {/* Steel Spiral Scroll Case */}
              <mesh position={[0, 0.35, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
                <torusGeometry args={[0.85, 0.26, 12, 24]} />
                <meshStandardMaterial color="#2d3033" metalness={0.8} roughness={0.35} />
              </mesh>
              
              {/* Generator Stator Block */}
              <mesh position={[0, 1.4, 0]} castShadow>
                <cylinderGeometry args={[0.75, 0.85, 1.1, 16]} />
                <meshStandardMaterial 
                  color={isUnitActive ? '#f43f5e' : '#4b5563'} 
                  metalness={0.5} 
                  roughness={0.35} 
                  emissive={isUnitActive ? '#b91c1c' : '#000'}
                  emissiveIntensity={isUnitActive ? 0.7 : 0}
                />
              </mesh>
              
              {/* Top Actuator exciter cap */}
              <mesh position={[0, 2.05, 0]} castShadow>
                <cylinderGeometry args={[0.35, 0.4, 0.25, 16]} />
                <meshStandardMaterial color="#ea580c" metalness={0.6} roughness={0.35} />
              </mesh>

              {/* Rotating marked Shaft (Mil) */}
              <group ref={(el) => { if (el) turbineRefs.current[i] = el; }} position={[0, 0.85, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.13, 0.13, 0.75, 12]} />
                  <meshStandardMaterial color="#b0b5ba" metalness={0.9} roughness={0.15} />
                </mesh>
                {/* Spinning visual marking line */}
                <mesh position={[0, 0, 0.14]}>
                  <boxGeometry args={[0.02, 0.55, 0.02]} />
                  <meshBasicMaterial color="#111" />
                </mesh>
              </group>
            </group>
          );
        })
      )}

      <Html position={[0, h/2 + 2.4, 0]} center style={{ display: showLabels ? 'block' : 'none' }}>
        <div style={labelStyle(active, '#a855f7')}>{isPresenzano ? 'Presenzano Kuyu Tipi Santral (1.000 MW)' : `Türbin Odası (Aktif: ${activeUnits}/${detail.units})`}</div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Realistic Switchyard (Substation detailed components)
   ───────────────────────────────────────────── */
function RealisticSwitchyard({ active, onClick, detail, showLabels, isPresenzano, isPlaying, mode, activeUnits, powerMW }: any) {
  const currentMW = powerMW ?? 0;
  const pos: [number, number, number] = [75, getTerrainHeight(75, -25, isPresenzano) - 1, -25];
  const transformerCount = isPresenzano ? 4 : 3;
  
  return (
    <group position={pos} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Substation Gravel Yard */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[14, 0.2, 11]} />
        <meshStandardMaterial color="#4f5256" roughness={0.95} />
      </mesh>
      
      {/* Boundary Fence wires */}
      <mesh position={[0, 0.8, -5.4]}><boxGeometry args={[14, 1.4, 0.02]} /><meshStandardMaterial color="#444" wireframe /></mesh>
      <mesh position={[0, 0.8, 5.4]}><boxGeometry args={[14, 1.4, 0.02]} /><meshStandardMaterial color="#444" wireframe /></mesh>
      <mesh position={[-6.9, 0.8, 0]} rotation={[0, Math.PI/2, 0]}><boxGeometry args={[11, 1.4, 0.02]} /><meshStandardMaterial color="#444" wireframe /></mesh>
      <mesh position={[6.9, 0.8, 0]} rotation={[0, Math.PI/2, 0]}><boxGeometry args={[11, 1.4, 0.02]} /><meshStandardMaterial color="#444" wireframe /></mesh>

      {/* Transformers with details */}
      {Array.from({ length: transformerCount }).map((_, i) => {
        const spacing = isPresenzano ? 3.0 : 4.5;
        const tX = -(spacing * (transformerCount - 1)) / 2 + i * spacing;
        return (
          <group key={i} position={[tX, 0.1, 2.5]}>
            {/* Concrete Pad */}
            <mesh position={[0, 0.1, 0]} receiveShadow><boxGeometry args={[2.0, 0.2, 2.0]} /><meshStandardMaterial color="#7f8389" /></mesh>
            
            {/* Transformer Tank */}
            <mesh position={[0, 1.05, 0]} castShadow>
              <boxGeometry args={[1.3, 1.6, 1.3]} />
              <meshStandardMaterial color={active ? '#6c777a' : '#576063'} metalness={0.55} roughness={0.38} />
            </mesh>
            
            {/* Side Cooling Fins */}
            <mesh position={[-0.8, 1.05, 0]} castShadow><boxGeometry args={[0.15, 1.2, 0.9]} /><meshStandardMaterial color="#474e51" metalness={0.65} /></mesh>
            <mesh position={[0.8, 1.05, 0]} castShadow><boxGeometry args={[0.15, 1.2, 0.9]} /><meshStandardMaterial color="#474e51" metalness={0.65} /></mesh>
            
            {/* Expansion Conservator Tank */}
            <mesh position={[0, 1.9, 0.4]} rotation={[0, 0, Math.PI/2]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.9, 12]} />
              <meshStandardMaterial color="#576063" metalness={0.5} />
            </mesh>
            
            {/* Ribbed Bushings (Brown glazed porcelain insulators) */}
            <group position={[0, 1.8, -0.25]}>
              <mesh position={[-0.3, 0.4, 0]} rotation={[0, 0, -0.15]} castShadow><cylinderGeometry args={[0.025, 0.06, 0.7, 8]} /><meshStandardMaterial color="#784725" roughness={0.15} /></mesh>
              <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0]} castShadow><cylinderGeometry args={[0.025, 0.06, 0.7, 8]} /><meshStandardMaterial color="#784725" roughness={0.15} /></mesh>
              <mesh position={[0.3, 0.4, 0]} rotation={[0, 0, 0.15]} castShadow><cylinderGeometry args={[0.025, 0.06, 0.7, 8]} /><meshStandardMaterial color="#784725" roughness={0.15} /></mesh>
            </group>
          </group>
        );
      })}

      {/* Disconnector switches & breakers */}
      {Array.from({ length: 3 }).map((_, i) => {
        const bX = -4.5 + i * 4.5;
        return (
          <group key={`breaker-${i}`} position={[bX, 0.1, -1.2]}>
            {/* Actuator base */}
            <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[0.7, 0.9, 0.4]} /><meshStandardMaterial color="#4d5356" /></mesh>
            {/* Grey Porcelain Insulators */}
            <mesh position={[-0.22, 1.35, 0]} castShadow><cylinderGeometry args={[0.04, 0.06, 0.8, 8]} /><meshStandardMaterial color="#cccccc" roughness={0.1} /></mesh>
            <mesh position={[0.22, 1.35, 0]} castShadow><cylinderGeometry args={[0.04, 0.06, 0.8, 8]} /><meshStandardMaterial color="#cccccc" roughness={0.1} /></mesh>
          </group>
        );
      })}

      {/* Substation Outgoing Gantry Structure (Portal Yapısı) */}
      <mesh position={[0, 4.0, -4.6]} castShadow>
        <boxGeometry args={[12, 0.25, 0.25]} />
        <meshStandardMaterial color="#88929e" metalness={0.7} />
      </mesh>
      <mesh position={[-5.6, 2.0, -4.6]} castShadow><boxGeometry args={[0.25, 4.0, 0.25]} /><meshStandardMaterial color="#88929e" metalness={0.7} />
      </mesh>
      <mesh position={[5.6, 2.0, -4.6]} castShadow><boxGeometry args={[0.25, 4.0, 0.25]} /><meshStandardMaterial color="#88929e" metalness={0.7} />
      </mesh>
      
      {/* Gantry insulators */}
      <mesh position={[-3.6, 3.4, -4.6]}><cylinderGeometry args={[0.04, 0.04, 0.8]} /><meshStandardMaterial color="#c0c4c8" /></mesh>
      <mesh position={[0, 3.4, -4.6]}><cylinderGeometry args={[0.04, 0.04, 0.8]} /><meshStandardMaterial color="#c0c4c8" /></mesh>
      <mesh position={[3.6, 3.4, -4.6]}><cylinderGeometry args={[0.04, 0.04, 0.8]} /><meshStandardMaterial color="#c0c4c8" /></mesh>

      <Html position={[10, 15, 0]} center style={{ display: showLabels ? 'block' : 'none' }} zIndexRange={[100, 0]}>
        <div style={labelStyle(active, 'var(--green)')}>{isPresenzano ? 'Presenzano Şalt Sahası (380 kV)' : `Şalt Sahası (${detail.voltage_kv} kV)`}</div>
      </Html>

      {isPlaying && activeUnits > 0 && (
        <Html position={[0, 12, 0]} center>
          <div style={{
            background: 'rgba(14,17,23,0.88)',
            border: `2px solid ${mode === 'generate' ? 'var(--green)' : 'var(--red)'}`,
            padding: '6px 14px',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            boxShadow: mode === 'generate' ? '0 0 12px rgba(16,185,129,0.4)' : '0 0 12px rgba(239,68,68,0.4)',
            textAlign: 'center'
          }}>
            <div style={{
              color: mode === 'generate' ? 'var(--green)' : 'var(--red)',
              marginBottom: 2,
              fontSize: '12px',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}>
              {mode === 'generate'
                ? <><Zap size={13} aria-hidden="true" /> ÜRETİM</>
                : <><BatteryCharging size={13} aria-hidden="true" /> POMPA</>}
            </div>
            <div style={{ fontSize: '14px' }}>{currentMW.toFixed(0)} MW</div>
          </div>
        </Html>
      )}
    </group>
  );
}

/* ─────────────────────────────────────────────
   Steel Lattice Tower (High Voltage transmission pylons)
   ───────────────────────────────────────────── */
function LatticeTower({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* 4 Angle iron legs (truss frame) */}
      <mesh position={[-0.55, 3.8, -0.55]} rotation={[0.06, 0, -0.06]} castShadow><cylinderGeometry args={[0.05, 0.08, 7.6, 4]} /><meshStandardMaterial color="#88929e" metalness={0.7} /></mesh>
      <mesh position={[0.55, 3.8, -0.55]} rotation={[0.06, 0, 0.06]} castShadow><cylinderGeometry args={[0.05, 0.08, 7.6, 4]} /><meshStandardMaterial color="#88929e" metalness={0.7} /></mesh>
      <mesh position={[-0.55, 3.8, 0.55]} rotation={[-0.06, 0, -0.06]} castShadow><cylinderGeometry args={[0.05, 0.08, 7.6, 4]} /><meshStandardMaterial color="#88929e" metalness={0.7} /></mesh>
      <mesh position={[0.55, 3.8, 0.55]} rotation={[-0.06, 0, 0.06]} castShadow><cylinderGeometry args={[0.05, 0.08, 7.6, 4]} /><meshStandardMaterial color="#88929e" metalness={0.7} /></mesh>

      {/* Horizontal bracing rings */}
      {Array.from({ length: 4 }).map((_, i) => {
        const bY = 1.7 + i * 1.7;
        const bW = 1.1 - i * 0.18;
        return (
          <group key={i} position={[0, bY, 0]}>
            <mesh position={[0, 0, -bW/2]}><boxGeometry args={[bW, 0.04, 0.04]} /><meshStandardMaterial color="#88929e" /></mesh>
            <mesh position={[0, 0, bW/2]}><boxGeometry args={[bW, 0.04, 0.04]} /><meshStandardMaterial color="#88929e" /></mesh>
            <mesh position={[-bW/2, 0, 0]} rotation={[0, Math.PI/2, 0]}><boxGeometry args={[bW, 0.04, 0.04]} /><meshStandardMaterial color="#88929e" /></mesh>
            <mesh position={[bW/2, 0, 0]} rotation={[0, Math.PI/2, 0]}><boxGeometry args={[bW, 0.04, 0.04]} /><meshStandardMaterial color="#88929e" /></mesh>
          </group>
        );
      })}

      {/* Diagonal bracing cross lattices */}
      {Array.from({ length: 3 }).map((_, i) => {
        const bY = 0.85 + i * 1.7;
        const bW = 1.0 - i * 0.18;
        return (
          <group key={`diag-${i}`} position={[0, bY, 0]}>
            <mesh position={[0, 0, -bW/2]} rotation={[0, 0, 0.85]}><boxGeometry args={[bW * 1.45, 0.03, 0.03]} /><meshStandardMaterial color="#88929e" /></mesh>
            <mesh position={[0, 0, -bW/2]} rotation={[0, 0, -0.85]}><boxGeometry args={[bW * 1.45, 0.03, 0.03]} /><meshStandardMaterial color="#88929e" /></mesh>
            <mesh position={[0, 0, bW/2]} rotation={[0, 0, 0.85]}><boxGeometry args={[bW * 1.45, 0.03, 0.03]} /><meshStandardMaterial color="#88929e" /></mesh>
            <mesh position={[0, 0, bW/2]} rotation={[0, 0, -0.85]}><boxGeometry args={[bW * 1.45, 0.03, 0.03]} /><meshStandardMaterial color="#88929e" /></mesh>
          </group>
        );
      })}

      {/* Lattice Crossarms */}
      <mesh position={[0, 5.8, 0]} castShadow>
        <boxGeometry args={[3.8, 0.12, 0.2]} />
        <meshStandardMaterial color="#88929e" metalness={0.7} />
      </mesh>
      <mesh position={[0, 4.3, 0]} castShadow>
        <boxGeometry args={[4.8, 0.12, 0.2]} />
        <meshStandardMaterial color="#88929e" metalness={0.7} />
      </mesh>
      
      {/* Suspended Insulators */}
      <mesh position={[-1.7, 5.2, 0]}><cylinderGeometry args={[0.03, 0.03, 0.9, 6]} /><meshStandardMaterial color="#b0b5ba" roughness={0.15} /></mesh>
      <mesh position={[1.7, 5.2, 0]}><cylinderGeometry args={[0.03, 0.03, 0.9, 6]} /><meshStandardMaterial color="#b0b5ba" roughness={0.15} /></mesh>
      <mesh position={[-2.2, 3.7, 0]}><cylinderGeometry args={[0.03, 0.03, 0.9, 6]} /><meshStandardMaterial color="#b0b5ba" roughness={0.15} /></mesh>
      <mesh position={[2.2, 3.7, 0]}><cylinderGeometry args={[0.03, 0.03, 0.9, 6]} /><meshStandardMaterial color="#b0b5ba" roughness={0.15} /></mesh>
    </group>
  );
}

function TransmissionLine({ isPresenzano, isPlaying, mode, activeUnits }: any) {
  const poles = useMemo<[number, number, number][]>(() => [
    [90, getTerrainHeight(90, -35, isPresenzano), -35],
    [115, getTerrainHeight(115, -50, isPresenzano), -50],
    [140, getTerrainHeight(140, -65, isPresenzano), -65]
  ], [isPresenzano]);

  const wires = useMemo(() => {
    const curves = [];
    for (let i = 0; i < poles.length - 1; i++) {
      const p1 = new THREE.Vector3(poles[i][0], poles[i][1] + 5.8*0.75, poles[i][2]);
      const p2 = new THREE.Vector3(poles[i+1][0], poles[i+1][1] + 5.8*0.75, poles[i+1][2]);
      const mid = new THREE.Vector3().lerpVectors(p1, p2, 0.5);
      mid.y -= 1.3;
      curves.push(new THREE.QuadraticBezierCurve3(p1, mid, p2));
    }
    return curves;
  }, [poles]);

  // Particle animation logic
  const particleCount = 60;
  const instancedMeshesRef = useRef<THREE.InstancedMesh[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(() => Array.from({ length: particleCount }, () => Math.random()), [particleCount]);

  useFrame(({ clock }) => {
    const isFlowing = isPlaying && activeUnits > 0;
    instancedMeshesRef.current.forEach(mesh => {
      if (mesh) mesh.visible = isFlowing;
    });

    if (!isFlowing) return;

    const speed = (clock.getElapsedTime() * 0.15 * activeUnits);

    wires.forEach((curve, idx) => {
      const mesh = instancedMeshesRef.current[idx];
      if (!mesh) return;

      for (let i = 0; i < particleCount; i++) {
        let param = (offsets[i] + speed) % 1;
        if (mode === 'pump') param = 1 - param;

        const pt = curve.getPoint(param);
        
        // Offset for the 3 conductor lines
        const lineIdx = i % 3;
        const xOff = lineIdx === 0 ? -1.25 : lineIdx === 1 ? 1.25 : 0;
        const yOff = lineIdx === 2 ? 0.8 : 0;

        dummy.position.copy(pt);
        dummy.position.x += xOff + (Math.random() - 0.5) * 0.1;
        dummy.position.y += yOff + (Math.random() - 0.5) * 0.1;
        dummy.position.z += (Math.random() - 0.5) * 0.1;

        dummy.scale.setScalar(0.3);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group>
      {poles.map((p, i) => <LatticeTower key={i} position={p} scale={0.75} />)}
      
      {/* Sagging High Voltage Conductors */}
      {wires.map((curve, i) => {
        const pts = curve.getPoints(20);
        return (
          <group key={`cables-${i}`}>
            <Line points={pts.map(v => [v.x - 1.25, v.y, v.z]) as any} color="#111" lineWidth={1} />
            <Line points={pts.map(v => [v.x + 1.25, v.y, v.z]) as any} color="#111" lineWidth={1} />
            <Line points={pts.map(v => [v.x, v.y + 0.8, v.z]) as any} color="#111" lineWidth={1} />
          </group>
        );
      })}

      {/* Power Flow Particles */}
      {wires.map((_, idx) => (
        <instancedMesh
          key={`flow-${idx}`}
          ref={(el) => (instancedMeshesRef.current[idx] = el as THREE.InstancedMesh)}
          args={[undefined, undefined, particleCount]}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial 
            color={mode === 'generate' ? '#00ffff' : '#ff3333'} 
            transparent 
            opacity={0.9} 
            depthTest={false}
          />
        </instancedMesh>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────
   Steel Penstocks with Concrete Anchor Blocks (4 Lines for Presenzano)
   ───────────────────────────────────────────── */
function RealisticPenstock({ active, onClick, from, to, isPlaying, mode, activeUnits, activeUnitIds, maxUnits = 2, showLabels, isPresenzano }: any) {
  const linesData = useMemo(() => {
    // Spacing offsets along Z-axis dynamically calculated based on maxUnits
    const spacing = isPresenzano ? 1.4 : 2.2;
    const zOffsets = Array.from({ length: maxUnits }, (_, i) => (i - (maxUnits - 1) / 2) * spacing);
    
    return zOffsets.map((offsetVal, index) => {
      const offsetVec = new THREE.Vector3(0, 0, offsetVal);
      
      const pts: THREE.Vector3[] = [];
      const segments = 25;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const pt = new THREE.Vector3().lerpVectors(from, to, t);
        // Ensure Penstock stays slightly above the terrain
        pt.y = getTerrainHeight(pt.x, pt.z, isPresenzano) + 1.2;
        pts.push(pt.add(offsetVec));
      }
      const cLine = new THREE.CatmullRomCurve3(pts);
      const radius = isPresenzano ? 0.35 : 0.55;
      
      return {
        curve: cLine,
        radius,
        id: index
      };
    });
  }, [from, to, isPresenzano, maxUnits]);

  const anchorPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    // Place anchors at 0%, 50%, 100% of the curve
    [0, 0.5, 1].forEach(t => {
        const pt = new THREE.Vector3().lerpVectors(from, to, t);
        pt.y = getTerrainHeight(pt.x, pt.z, isPresenzano) + 0.5;
        pts.push(pt);
    });
    return pts;
  }, [from, to, isPresenzano]);

  // instanced water flow particles inside
  const particleCount = isPresenzano ? 45 : 90;
  const instancedMeshesRef = useRef<THREE.InstancedMesh[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(() => Array.from({ length: particleCount }, (_, i) => pseudoRandom(i * 100)), [particleCount]);

  useFrame(({ clock }) => {
    const isFlowing = isPlaying && activeUnits > 0;
    instancedMeshesRef.current.forEach((mesh) => {
      if (mesh) mesh.visible = isFlowing;
    });
    
    if (!isFlowing) return;
    
    const speed = (clock.getElapsedTime() * 0.08 * activeUnits);
    
    linesData.forEach((line, pipeIndex) => {
      const mesh = instancedMeshesRef.current[pipeIndex];
      if (!mesh) return;

      // Each pipe corresponds to one turbine.
      if (activeUnitIds ? !activeUnitIds.includes(`G${pipeIndex + 1}`) : pipeIndex >= activeUnits) {
        mesh.visible = false;
        return;
      }

      for (let i = 0; i < particleCount; i++) {
        let param = (offsets[i] + speed) % 1;
        if (mode === 'pump') param = 1 - param; // flow direction
        
        const pt = line.curve.getPoint(param);
        
        dummy.position.copy(pt);
        dummy.position.x += (pseudoRandom(i + 1) - 0.5) * (isPresenzano ? 0.08 : 0.12);
        dummy.position.y += (pseudoRandom(i + 2) - 0.5) * (isPresenzano ? 0.08 : 0.12);
        dummy.position.z += (pseudoRandom(i + 3) - 0.5) * (isPresenzano ? 0.08 : 0.12);
        dummy.scale.setScalar(isPresenzano ? 0.08 : 0.12);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    });
  });

  const steelMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: active ? '#f5b50b' : (isPlaying ? '#5aa8e3' : '#606972'),
    metalness: 0.7,
    roughness: 0.3,
    emissive: active ? '#553c00' : '#000',
    emissiveIntensity: active ? 0.35 : 0,
    transparent: true,
    opacity: isPlaying ? 0.35 : 1,
    depthWrite: true,
    wireframe: false,
    side: THREE.DoubleSide
  }), [active, isPlaying]);
  useEffect(() => () => steelMat.dispose(), [steelMat]);

  return (
    <group>
      {/* Pipelines */}
      {linesData.map((line) => (
        <mesh key={`pipe-${line.id}`} onClick={(e) => { e.stopPropagation(); onClick(); }} material={steelMat} castShadow>
          <tubeGeometry args={[line.curve, 64, line.radius, 12, false]} />
        </mesh>
      ))}

      {/* Concrete Anchor Blocks */}
      {anchorPoints.map((pt, i) => {
        const anchorW = maxUnits * (isPresenzano ? 1.4 : 2.2) + 1.2;
        return (
          <mesh key={`anchor-${i}`} position={pt} castShadow receiveShadow>
            <boxGeometry args={[4.2, 1.8, anchorW]} />
            <meshStandardMaterial color="#80848a" roughness={0.85} />
          </mesh>
        );
      })}

      {/* Fluid Flow Instances */}
      {linesData.map((line) => (
        <instancedMesh
          key={`flow-${line.id}`}
          ref={(el) => { if (el) instancedMeshesRef.current[line.id] = el; }}
          args={[undefined, undefined, particleCount]}
        >
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial 
            color={mode === 'generate' ? '#06b6d4' : '#10b981'} 
            transparent 
            opacity={0.9} 
            depthTest={false} 
          />
        </instancedMesh>
      ))}

      <Html position={[(from.x+to.x)/2, (from.y+to.y)/2 + 2, (from.z+to.z)/2]} center style={{ display: showLabels ? 'block' : 'none' }} zIndexRange={[100, 0]}>
        <div style={labelStyle(active, '#eab308')}>{isPresenzano ? 'Cebri Borular (4 Hat)' : 'Cebri Boru'}</div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Underground Energy Tunnel
   ───────────────────────────────────────────── */
function UndergroundTunnel({ from, to, active, onClick, showLabels }: any) {
  const { geometry } = useMemo(() => {
    const c = new THREE.LineCurve3(from, to);
    const geo = new THREE.TubeGeometry(c, 20, 0.95, 12, false);
    return { geometry: geo };
  }, [from, to]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial 
          color={active ? '#f59e0b' : '#64748b'} 
          transparent 
          opacity={0.35} 
          roughness={0.9}
          metalness={0.1}
          emissive={active ? '#663f00' : '#000'}
        />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#1e293b" wireframe transparent opacity={0.15} />
      </mesh>
      <Html position={[(from.x+to.x)/2, (from.y+to.y)/2 + 25, (from.z+to.z)/2]} center style={{ display: showLabels ? 'block' : 'none' }} zIndexRange={[100, 0]}>
        <div style={labelStyle(active, '#94a3b8')}>Yeraltı Tüneli</div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Tailrace Channel (Powerhouse outlet to Lower Basin)
   ───────────────────────────────────────────── */
function TailraceChannel({ from, to, active, onClick, showLabels, isPlaying, mode, activeUnits = 1 }: any) {
  const { channelGeo, waterGeo, curve } = useMemo(() => {
    const c = new THREE.LineCurve3(from, to);
    const channel = new THREE.TubeGeometry(c, 16, 0.8, 8, false);
    const water = new THREE.TubeGeometry(c, 16, 0.65, 8, false);
    return { channelGeo: channel, waterGeo: water, curve: c };
  }, [from, to]);

  useEffect(() => () => { channelGeo.dispose(); waterGeo.dispose(); }, [channelGeo, waterGeo]);
  const particleCount = 30;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(() => Array.from({ length: particleCount }, (_, i) => pseudoRandom(i * 100)), [particleCount]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const isFlowing = isPlaying && activeUnits > 0;
    meshRef.current.visible = isFlowing;
    if (!isFlowing) return;

    const speed = (clock.getElapsedTime() * 0.12 * activeUnits);
    for (let i = 0; i < particleCount; i++) {
      let param = (offsets[i] + speed) % 1;
      if (mode === 'pump') param = 1 - param;

      const pt = curve.getPoint(param);
      dummy.position.copy(pt);
      dummy.position.x += (pseudoRandom(i + 1) - 0.5) * 0.5;
      dummy.position.y += (pseudoRandom(i + 2) - 0.5) * 0.5;
      dummy.position.z += (pseudoRandom(i + 3) - 0.5) * 0.5;
      dummy.scale.setScalar(0.25);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh geometry={channelGeo}>
        <meshStandardMaterial 
          color={active ? '#22d3ee' : '#64748b'} 
          roughness={0.88}
          emissive={active ? '#083344' : '#000'}
          transparent={isPlaying}
          opacity={isPlaying ? 0.3 : 1}
        />
      </mesh>
      <mesh geometry={waterGeo}>
        <meshPhysicalMaterial 
          color="#0891b2" 
          transparent 
          opacity={0.6}
          roughness={0.1}
          transmission={0.8}
        />
      </mesh>
      <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color={mode === 'generate' ? '#06b6d4' : '#10b981'} />
      </instancedMesh>
      <Html position={[(from.x+to.x)/2 + 4, (from.y+to.y)/2 + 25, (from.z+to.z)/2 - 5]} center style={{ display: showLabels ? 'block' : 'none' }} zIndexRange={[100, 0]}>
        <div style={labelStyle(active, '#0891b2')}>Kuyruk Suyu</div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Surge Tank (Denge Bacası)
   ───────────────────────────────────────────── */
function RealisticSurgeTank({ position, active, showLabels, onClick }: any) {
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.8, 11, 24]} />
        <meshStandardMaterial color={active ? '#f59e0b' : '#82878c'} roughness={0.82} />
      </mesh>
      <mesh position={[0, 2.5, 0]}><torusGeometry args={[1.65, 0.08, 8, 24]} /><meshStandardMaterial color="#222" metalness={0.8} /></mesh>
      <mesh position={[0, -2.5, 0]}><torusGeometry args={[1.75, 0.08, 8, 24]} /><meshStandardMaterial color="#222" metalness={0.8} /></mesh>
      <mesh position={[0, 0, 1.7]} castShadow><boxGeometry args={[0.2, 11, 0.02]} /><meshStandardMaterial color="#444" metalness={0.8} wireframe /></mesh>
      <mesh position={[0, 5.5, 0]} castShadow>
        <cylinderGeometry args={[1.9, 1.6, 0.4, 24]} />
        <meshStandardMaterial color="#aa3b1a" roughness={0.4} />
      </mesh>
      <Html position={[0, 7.5, 0]} center style={{ display: showLabels ? 'block' : 'none' }}>
        <div style={labelStyle(active, '#f59e0b')}>Denge Bacası</div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Portal Structure (Tunnel Inlet/Outlet)
   ───────────────────────────────────────────── */
function Portal({ position, rotation, active, onClick, showLabels, label }: any) {
  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Concrete Arch / Retaining Wall */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 5, 2]} />
        <meshStandardMaterial color="#6a737a" roughness={0.9} />
      </mesh>
      {/* Tunnel Opening (Dark Hole) */}
      <mesh position={[0, 1.5, 1.05]}>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 32, 1, false, 0, Math.PI]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <Html position={[0, 5.5, 0]} center style={{ display: showLabels ? 'block' : 'none' }}>
        <div style={labelStyle(active, '#ff944d')}>{label || 'Tünel Portalı'}</div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Instanced Environment (Performance Optimization)
   ───────────────────────────────────────────── */
function InstancedEnvironment({ assets, opacity }: { assets: Array<{ type: 'tree' | 'rock'; pos: [number, number, number]; scale: number; rot: [number, number, number] }>; opacity: number }) {
  // `assets` is generated once per terrain variant. Keep these lists stable so
  // simulation/UI renders do not rewrite every instance matrix.
  const { trees, rocks } = useMemo(() => ({
    trees: assets.filter((asset) => asset.type === 'tree'),
    rocks: assets.filter((asset) => asset.type === 'rock'),
  }), [assets]);
  const normalizedOpacity = normalizeTerrainOpacity(opacity);

  const treeTrunkRef = useRef<THREE.InstancedMesh>(null);
  const treeFoliage1Ref = useRef<THREE.InstancedMesh>(null);
  const treeFoliage2Ref = useRef<THREE.InstancedMesh>(null);
  const rockRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    trees.forEach((tree, i) => {
      dummy.position.set(...tree.pos);
      dummy.rotation.set(...tree.rot);
      dummy.scale.setScalar(tree.scale);
      dummy.updateMatrix();

      // Trunk
      if (treeTrunkRef.current) treeTrunkRef.current.setMatrixAt(i, dummy.matrix);
      
      // Foliage 1 (Shifted up by 0.7 * scale locally, but instanced mesh args are applied to the base geometry, so we adjust dummy)
      dummy.position.set(tree.pos[0], tree.pos[1] + 0.7 * tree.scale, tree.pos[2]);
      dummy.updateMatrix();
      if (treeFoliage1Ref.current) treeFoliage1Ref.current.setMatrixAt(i, dummy.matrix);
      
      // Foliage 2
      dummy.position.set(tree.pos[0], tree.pos[1] + 1.1 * tree.scale, tree.pos[2]);
      dummy.updateMatrix();
      if (treeFoliage2Ref.current) treeFoliage2Ref.current.setMatrixAt(i, dummy.matrix);
    });

    if (treeTrunkRef.current) treeTrunkRef.current.instanceMatrix.needsUpdate = true;
    if (treeFoliage1Ref.current) treeFoliage1Ref.current.instanceMatrix.needsUpdate = true;
    if (treeFoliage2Ref.current) treeFoliage2Ref.current.instanceMatrix.needsUpdate = true;

    rocks.forEach((rock, i) => {
      dummy.position.set(...rock.pos);
      dummy.rotation.set(...rock.rot);
      dummy.scale.setScalar(rock.scale);
      dummy.updateMatrix();
      if (rockRef.current) rockRef.current.setMatrixAt(i, dummy.matrix);
    });

    if (rockRef.current) rockRef.current.instanceMatrix.needsUpdate = true;
  }, [trees, rocks, dummy]);

  return (
    <group>
      {trees.length > 0 && (
        <>
          <instancedMesh ref={treeTrunkRef} args={[undefined, undefined, trees.length]} castShadow>
            <cylinderGeometry args={[0.12, 0.2, 1.0, 5]} />
            <meshStandardMaterial color="#422b1c" roughness={0.95} transparent opacity={normalizedOpacity} />
          </instancedMesh>
          <instancedMesh ref={treeFoliage1Ref} args={[undefined, undefined, trees.length]} castShadow>
            <coneGeometry args={[0.7, 1.2, 5]} />
            <meshStandardMaterial color="#1a3f24" roughness={0.8} flatShading transparent opacity={normalizedOpacity} />
          </instancedMesh>
          <instancedMesh ref={treeFoliage2Ref} args={[undefined, undefined, trees.length]} castShadow>
            <coneGeometry args={[0.5, 0.8, 5]} />
            <meshStandardMaterial color="#225430" roughness={0.8} flatShading transparent opacity={normalizedOpacity} />
          </instancedMesh>
        </>
      )}
      {rocks.length > 0 && (
        <instancedMesh ref={rockRef} args={[undefined, undefined, rocks.length]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#504c46" roughness={0.88} flatShading transparent opacity={normalizedOpacity} />
        </instancedMesh>
      )}
    </group>
  );
}

/* ─────────────────────────────────────────────
   Common Helpers
   ───────────────────────────────────────────── */
function labelStyle(active: boolean, color: string): React.CSSProperties {
  return {
    background: active ? color : 'rgba(15,20,25,0.9)',
    color: '#fff',
    padding: '3px 8px',
    borderRadius: 5,
    fontSize: 9,
    lineHeight: 1.15,
    fontWeight: 'bold',
    pointerEvents: 'none',
    border: `1px solid ${color}`,
    boxShadow: active ? `0 0 10px ${color}` : '0 3px 8px rgba(0,0,0,0.42)',
    transition: 'all 0.3s',
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
    maxWidth: 126,
    textAlign: 'center'
  };
}

/* ─────────────────────────────────────────────
   Main Scene Assembly
   ───────────────────────────────────────────── */


function compactFootprintLabel(item: Layout3DProjectedFootprint): string {
  if (item.id.startsWith('penstock')) {
    const num = item.id.replace('penstock', '');
    return `Cebri Boru ${num}`.trim();
  }

  const labels: Record<string, string> = {
    upperReservoirWater: 'Üst Rezervuar',
    upperReservoirEmbankment: 'Üst Rezervuar Seti',
    upperDamCrestRoad: 'Kret Yolu',
    upperIntake: 'Su Alma Yapısı (Intake)',
    upperIntakeStructure: 'Su Alma Yapısı (Intake)',
    intake: 'Su Alma Yapısı (Intake)',
    headraceAlignment: 'Basınç Tüneli Ekseni',
    surgeTankFootprint: 'Denge Bacası',
    serviceDrainPortal: 'Servis Portalı',
    powerhouseFootprint: 'Türbin Odası',
    tailraceOutfall: 'Kuyruksuyu',
    switchyardFootprint: 'Şalt Sahası',
    existingSwitchyardFootprint: 'Mevcut Şalt Sahası',
    newSwitchyardFootprint: 'Yeni Şalt Sahası',
    lowerReservoirWater: 'Alt Rezervuar',
    lowerDamAxis: 'Alt Rezervuar Seddesi',
    lowerReservoirDamEmbankment: 'Alt Rezervuar Seti'
  };
  const componentLabels: Record<string, string> = {
    upper_reservoir: 'Üst Rezervuar',
    lower_reservoir: 'Alt Rezervuar',
    intake: 'Su Alma',
    headrace_tunnel: 'İletim Tüneli',
    pressure_tunnel: 'Basınç Tüneli',
    surge_tank: 'Denge Bacası',
    penstock: 'Cebri Boru',
    powerhouse: 'Santral',
    switchyard: 'Şalt',
    new_switchyard: 'Yeni Şalt',
    existing_switchyard: 'Mevcut Şalt',
    tailrace_tunnel: 'Kuyruksuyu',
    tailrace_channel: 'Kuyruksuyu',
    portal: 'Portal',
    service_portal: 'Servis Portalı',
  };
  return componentLabels[item.component] ?? labels[item.id] ?? COMPONENTS.find(c => c.key === item.component)?.label ?? item.component;
}

function footprintTooltip(item: Layout3DProjectedFootprint): string {
  return COMPONENTS.find(c => c.key === item.component)?.description ?? '';
}

function footprintCenter(item: Layout3DProjectedFootprint): [number, number, number] {
  const points = footprintRing(item);
  const count = Math.max(1, points.length);
  const sum = points.reduce((acc, point) => ({
    x: acc.x + point.x,
    y: acc.y + point.y,
    z: acc.z + point.z,
  }), { x: 0, y: 0, z: 0 });
  return [sum.x / count, Math.max(item.topY, sum.y / count) + 8, sum.z / count];
}

const FOOTPRINT_LABEL_OFFSETS: Record<string, [number, number, number]> = {
  upper_reservoir: [-22, 8, -18],
  lower_reservoir: [-18, 8, 20],
  intake: [-10, 8, 16],
  headrace_tunnel: [-16, 8, -10],
  pressure_tunnel: [16, 8, -8],
  surge_tank: [14, 10, -10],
  penstock: [14, 8, 9],
  powerhouse: [18, 9, 12],
  switchyard: [22, 12, -16],
  new_switchyard: [22, 12, -16],
  existing_switchyard: [22, 12, -16],
  tailrace_tunnel: [18, 7, 16],
  tailrace_channel: [18, 7, 16],
  portal: [-14, 8, 12],
  service_portal: [-14, 8, 12],
};

function labelPositionForFootprint(item: Layout3DProjectedFootprint): [number, number, number] {
  const center = footprintCenter(item);
  const id = item.id.toLowerCase();
  const idOffset = id.includes('portal')
    ? FOOTPRINT_LABEL_OFFSETS.portal
    : id.includes('intake')
      ? FOOTPRINT_LABEL_OFFSETS.intake
      : undefined;
  const [dx, dy, dz] = idOffset ?? FOOTPRINT_LABEL_OFFSETS[item.component] ?? [10, 8, -10];
  return [center[0] + dx, center[1] + dy, center[2] + dz];
}

const FootprintPolygon = memo(function FootprintPolygon({ item, layerKey, active, onSelectComponent, showLabels, waterOpening, soc }: {
  waterOpening?: Layout3DProjectedFootprint;
  soc?: number;
  item: Layout3DProjectedFootprint;
  layerKey: string;
  active: boolean;
  onSelectComponent: (component: string) => void;
  showLabels: boolean;
}) {
  const geometry = useMemo(() => createFootprintPolygonGeometry(item, waterOpening), [item, waterOpening]);
  
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  const color = LAYOUT_3D_MATERIAL_COLORS[item.material] ?? '#9aa3ad';
  const opacity = item.material === 'water' ? 0.9 : 1;
  const waterOffset = item.material === 'water' ? reservoirSurfaceOffset(soc ?? 1) : 0;
  const outline = useMemo(() => [...footprintRing(item), footprintRing(item)[0]].map((p) => [p.x, item.topY + 0.12, p.z] as [number, number, number]), [item]);
  const labelPosition = labelPositionForFootprint(item);

  if (!geometry.getAttribute('position')) return null;

  return (
    <group onClick={(event) => { event.stopPropagation(); onSelectComponent(layerKey); }}>
      <mesh geometry={geometry} position={[0, waterOffset, 0]} castShadow={item.material !== 'water'} receiveShadow>
        <meshStandardMaterial
          color={color}
          transparent={item.material === 'water'}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 0.28 : 0}
          opacity={opacity}
          roughness={item.material === 'water' ? 0.18 : 0.8}
          metalness={item.material === 'water' ? 0.04 : 0.02}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Line points={outline} color={active ? '#f8fafc' : color} lineWidth={active ? 2 : 0.8} />
      <Html position={labelPosition} center style={{ display: showLabels ? 'block' : 'none' }} zIndexRange={[100, 0]}>
        <div style={labelStyle(active, color)} title={footprintTooltip(item)}>{compactFootprintLabel(item)}</div>
      </Html>
    </group>
  );
});

const FootprintPolyline = memo(function FootprintPolyline({ item, layerKey, active, onSelectComponent, showLabels }: {
  item: Layout3DProjectedFootprint;
  layerKey: string;
  active: boolean;
  onSelectComponent: (component: string) => void;
  showLabels: boolean;
}) {
  const color = LAYOUT_3D_MATERIAL_COLORS[item.material] ?? '#36d6ff';
  const points = item.points
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z))
    .map((point) => [point.x, point.y + 1, point.z]) as [number, number, number][];
  const labelPosition = labelPositionForFootprint(item);

  if (points.length < 2) return null;

  return (
    <group onClick={(event) => { event.stopPropagation(); onSelectComponent(layerKey); }}>
      <Line points={points} color={active ? '#f8fafc' : color} lineWidth={active ? 5 : 3} dashed={item.material === 'tunnel_axis' || item.component.includes('tunnel')} dashSize={3} gapSize={1.5} />
      <Html position={labelPosition} center style={{ display: showLabels ? 'block' : 'none' }} zIndexRange={[100, 0]}>
        <div style={labelStyle(active, color)} title={footprintTooltip(item)}>{compactFootprintLabel(item)}</div>
      </Html>
    </group>
  );
});

function FootprintSceneLayer({ items, layers, activeComponent, onSelectComponent, showLabels, upperSoc, lowerSoc }: {
  upperSoc: number;
  lowerSoc: number;
  items: Layout3DProjectedFootprint[];
  layers: Record<string, boolean>;
  activeComponent: string;
  onSelectComponent: (component: string) => void;
  showLabels: boolean;
}) {
  const groupedItems = useMemo(() => groupFootprintsByLayer(items), [items]);

  return (
    <group>
      {groupedItems.map(({ layerKey, items: layerItems }) => (
        <group key={layerKey} visible={isLayerVisible(layerKey, layers)}>
          {layerItems.map((item) => {
            const active = activeComponent === item.component || activeComponent === layerKey;
            if (item.kind === 'polygon') {
              return (
                <FootprintPolygon
                  key={item.id}
                  item={item}
                  waterOpening={item.material === 'embankment' ? items.find((water) => water.component === item.component && water.material === 'water') : undefined}
                  soc={item.component === 'upper_reservoir' ? upperSoc : lowerSoc}
                  layerKey={layerKey}
                  active={active}
                  onSelectComponent={onSelectComponent}
                  showLabels={showLabels && isLayerVisible(layerKey, layers)}
                />
              );
            }
            return (
              <FootprintPolyline
                key={item.id}
                item={item}
                layerKey={layerKey}
                active={active}
                onSelectComponent={onSelectComponent}
                showLabels={showLabels && isLayerVisible(layerKey, layers)}
              />
            );
          })}
        </group>
      ))}
    </group>
  );
}

function componentsInPlan(plan: Layout3DFootprintPlan, components: string[]): Layout3DProjectedFootprint[] {
  return plan.items.filter((item) => components.includes(item.component));
}

function firstCenter(plan: Layout3DFootprintPlan, components: string[], fallback: [number, number, number]): [number, number, number] {
  const item = componentsInPlan(plan, components)[0];
  return item ? footprintCenter(item) : fallback;
}

function simulationLabelPosition(plan: Layout3DFootprintPlan, anchor: 'hydraulic' | 'equipment' | 'reservoir' | 'switchyard'): [number, number, number] {
  if (anchor === 'switchyard') {
    const base = firstCenter(plan, ['switchyard', 'new_switchyard', 'existing_switchyard'], [80, 18, -20]);
    return [base[0] + 22, base[1] + 18, base[2] - 16];
  }
  if (anchor === 'equipment') {
    const base = firstCenter(plan, ['powerhouse'], [20, 18, 0]);
    return [base[0] + 16, base[1] + 16, base[2] + 14];
  }
  if (anchor === 'reservoir') {
    const base = firstCenter(plan, ['upper_reservoir'], [-80, 24, -20]);
    return [base[0] - 22, base[1] + 12, base[2] - 18];
  }
  const base = firstCenter(plan, ['penstock', 'pressure_tunnel', 'headrace_tunnel'], [0, 20, 0]);
  return [base[0] + 18, base[1] + 14, base[2] + 10];
}

function activePenstockFootprintIds(topology: DerivedLayout3DTopology, activeUnitIds: string[]): Set<string> {
  const activeSet = new Set(activeUnitIds);
  return new Set(
    topology.penstocks
      .filter((penstock) => penstock.connectedUnitIds.some((unitId) => activeSet.has(unitId)))
      .map((penstock) => penstock.footprintId),
  );
}

function pathPointAt(points: [number, number, number][], progress: number): [number, number, number] {
  if (points.length === 0) return [0, 0, 0];
  if (points.length === 1) return points[0];
  const segments = points.slice(1).map((point, index) => {
    const prev = points[index];
    return Math.hypot(point[0] - prev[0], point[1] - prev[1], point[2] - prev[2]);
  });
  const total = segments.reduce((sum, length) => sum + length, 0) || 1;
  let remaining = ((progress % 1) + 1) % 1 * total;
  for (let index = 0; index < segments.length; index += 1) {
    const length = segments[index];
    if (remaining <= length || index === segments.length - 1) {
      const a = points[index];
      const b = points[index + 1];
      const t = length > 0 ? remaining / length : 0;
      return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
      ];
    }
    remaining -= length;
  }
  return points[points.length - 1];
}

function FlowParticles({ points, color, active, count = 5, speed = 0.18, radius = 1.25 }: {
  points: [number, number, number][];
  color: string;
  active: boolean;
  count?: number;
  speed?: number;
  radius?: number;
}) {
  const refs = useRef<Array<THREE.Mesh | null>>([]);
  const offsets = useMemo(() => Array.from({ length: count }, (_, index) => index / count), [count]);

  const phase = useRef(0);
  useFrame((_state, delta) => {
    if (!active) return;
    phase.current += Math.min(delta, 0.1) * speed;
    offsets.forEach((offset, index) => {
      const position = pathPointAt(points, offset + phase.current);
      refs.current[index]?.position.set(position[0], position[1], position[2]);
    });
  });

  if (!active) return null;

  return (
    <group>
      {offsets.map((offset, index) => {
        const position = pathPointAt(points, offset);
        return (
          <mesh
            key={`flow-particle-${index}`}
            ref={(node) => { refs.current[index] = node; }}
            position={position}
          >
            <sphereGeometry args={[radius, 10, 10]} />
            <meshBasicMaterial color={color} transparent opacity={0.88} />
          </mesh>
        );
      })}
    </group>
  );
}

function HiddenLayerMarker({ position, testId, attributes }: {
  position: [number, number, number];
  testId: string;
  attributes?: Record<string, string>;
}) {
  return (
    <Html position={position} center zIndexRange={[0, 0]}>
      <div data-testid={testId} aria-hidden="true" style={{ display: 'none' }} {...attributes} />
    </Html>
  );
}

function HydraulicFlowLayer({ plan, topology, activeUnitIds, mode, isPlaying, quality, layers }: {
  plan: Layout3DFootprintPlan;
  topology: DerivedLayout3DTopology;
  activeUnitIds: string[];
  mode: 'generate' | 'pump';
  isPlaying: boolean;
  quality: SimulationQuality;
  layers: Record<string, boolean>;
}) {
  const flowActive = isPlaying && activeUnitIds.length > 0;
  const activePenstocks = activePenstockFootprintIds(topology, activeUnitIds);
  const connections = useMemo(() => representativeWaterwayLinks(plan.items), [plan.items]);
  const flowItems = componentsInPlan(plan, ['headrace_tunnel', 'pressure_tunnel', 'penstock', 'tailrace_tunnel', 'tailrace_channel'])
    .filter((item) => item.kind === 'polyline' && isFootprintLayerVisible(item, layers))
    .filter((item) => item.component !== 'penstock' || activePenstocks.has(item.id));
  const sharedVisible = isLayerVisible('tunnel', layers) || isLayerVisible('tailrace', layers) || isLayerVisible('penstock', layers);
  const markerPosition = simulationLabelPosition(plan, 'hydraulic');
  const particleCount = quality === 'low' ? 3 : quality === 'high' ? 8 : 5;
  const direction = mode === 'generate' ? 'upper-to-lower' : 'lower-to-upper';

  return (
    <group visible={sharedVisible}>
      <HiddenLayerMarker
        position={markerPosition}
        testId="hydraulic-flow-layer"
        attributes={{
          'data-flow-active': String(flowActive),
          'data-flow-direction': direction,
        }}
      />
      {connections.filter((link) => isFootprintLayerVisible(link.from, layers) && isFootprintLayerVisible(link.to, layers)).map((link) => (
        <Line key={link.id} points={link.points} color="#d6a85e" lineWidth={1.2} dashed dashSize={1.5} gapSize={2} />
      ))}
      {flowItems.map((item) => {
        const generationPoints = generationWaterwayPoints(item, plan.items);
        const points = mode === 'generate' ? generationPoints : [...generationPoints].reverse();
        return (
          <group key={`hydraulic-${item.id}`}>
            <Line
              points={points}
              color={flowActive ? '#22d3ee' : '#64748b'}
              lineWidth={flowActive ? 3.5 : 1.4}
              dashed={item.material === 'tunnel_axis' || item.component.includes('tunnel')} dashSize={3} gapSize={1.5}
            />
            <Line
              points={points.map(([x, y, z]) => [x, y + 0.45, z] as [number, number, number])}
              color={flowActive ? '#67e8f9' : '#475569'}
              lineWidth={flowActive ? 1.2 : 0.8} dashed dashSize={1} gapSize={4}
            />
            <FlowParticles
              points={points}
              color="#67e8f9"
              active={flowActive}
              count={particleCount}
              speed={mode === 'generate' ? 0.2 : 0.16}
              radius={1.05}
            />
          </group>
        );
      })}
    </group>
  );
}

function ElectricalFlowLayer({ plan, topology, activeUnitIds, mode, isPlaying, powerMW, layers }: {
  plan: Layout3DFootprintPlan;
  topology: DerivedLayout3DTopology;
  activeUnitIds: string[];
  mode: 'generate' | 'pump';
  isPlaying: boolean;
  powerMW: number;
  layers: Record<string, boolean>;
}) {
  const flowActive = isPlaying && activeUnitIds.length > 0 && powerMW > 0;
  const powerhouse = firstCenter(plan, ['powerhouse'], [20, 18, 0]);
  const switchyard = firstCenter(plan, ['switchyard', 'new_switchyard', 'existing_switchyard'], [80, 16, -20]);
  const grid: [number, number, number] = [switchyard[0] + 55, switchyard[1] + 8, switchyard[2] - 26];
  const points = mode === 'generate' ? [powerhouse, switchyard, grid] : [grid, switchyard, powerhouse];
  const activeColor = mode === 'generate' ? '#22c55e' : '#ef4444';
  const flowColor = flowActive ? activeColor : '#64748b';
  const direction = mode === 'generate' ? 'powerhouse-to-grid' : 'grid-to-powerhouse';

  return (
    <group visible={isLayerVisible('transmission', layers)}>
      <Line points={points} color={flowColor} lineWidth={flowActive ? 3 : 1.6} dashed dashSize={4} gapSize={2} />
      <Line
        points={points.map(([x, y, z]) => [x, y + 0.75, z] as [number, number, number])}
        color={flowActive ? activeColor : '#475569'}
        lineWidth={flowActive ? 2.5 : 0.8}
      />
      <FlowParticles points={points} color={activeColor} active={flowActive} count={5} speed={0.24} radius={1.2} />
      <HiddenLayerMarker
        position={simulationLabelPosition(plan, 'switchyard')}
        testId="electrical-flow-layer"
        attributes={{
          'data-flow-active': String(flowActive),
          'data-flow-color': activeColor,
          'data-flow-direction': direction,
          'data-label-anchor': 'switchyard',
          'data-transformer-count': String(topology.transformers.length),
        }}
      />
    </group>
  );
}

function ReservoirLevelLayer({ plan, upperSoc, lowerSoc, showLabels }: {
  plan: Layout3DFootprintPlan;
  upperSoc: number;
  lowerSoc: number;
  showLabels: boolean;
}) {
  void showLabels;
  const upper = simulationLabelPosition(plan, 'reservoir');

  return (
    <group>
      <HiddenLayerMarker
        position={upper}
        testId="reservoir-level-layer"
        attributes={{
          'data-upper-soc': String(Math.round(upperSoc * 100)),
          'data-lower-soc': String(Math.round(lowerSoc * 100)),
        }}
      />
    </group>
  );
}

function EquipmentUnit({ position, radius, active, mode }: { position: [number, number, number]; radius: number; active: boolean; mode: 'generate' | 'pump' }) {
  const rotor = useRef<THREE.Group>(null);
  useFrame((_state, delta) => {
    if (active && rotor.current) rotor.current.rotation.y += Math.min(delta, 0.1) * (mode === 'generate' ? 2 : -2);
  });
  return <group position={position}>
    <mesh position={[0, radius * 1.8, 0]}>
      <cylinderGeometry args={[radius, radius, radius * 1.2, 16]} />
      <meshStandardMaterial color={active ? (mode === 'generate' ? '#34d399' : '#fb923c') : '#64748b'} metalness={0.35} roughness={0.5} />
    </mesh>
    <mesh position={[0, radius * 0.7, 0]}>
      <cylinderGeometry args={[radius * 0.18, radius * 0.18, radius * 2, 10]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
    </mesh>
    <group ref={rotor}>
      {[0, 1, 2, 3].map((blade) => <mesh key={blade} rotation={[0, blade * Math.PI / 2, 0]}>
        <boxGeometry args={[radius * 2.2, radius * 0.3, radius * 0.35]} />
        <meshStandardMaterial color={active ? '#38bdf8' : '#94a3b8'} />
      </mesh>)}
    </group>
  </group>;
}

function equipmentSlots(item: Layout3DProjectedFootprint, count: number) {
  const ring = footprintRing(item);
  const edges = ring.map((p, i) => ({ a: p, b: ring[(i + 1) % ring.length] }))
    .sort((a, b) => Math.hypot(b.a.x - b.b.x, b.a.z - b.b.z) - Math.hypot(a.a.x - a.b.x, a.a.z - a.b.z));
  const edge = edges[0];
  const length = Math.hypot(edge.b.x - edge.a.x, edge.b.z - edge.a.z) || 1;
  const width = Math.hypot(edges.at(-1)!.b.x - edges.at(-1)!.a.x, edges.at(-1)!.b.z - edges.at(-1)!.a.z) || 1;
  const center = footprintCenter(item);
  const radius = Math.max(0.3, Math.min(width * 0.23, length / Math.max(count, 1) * 0.24));
  return { radius, positions: Array.from({ length: count }, (_, index) => {
    const offset = ((index + 0.5) / count - 0.5) * length * 0.8;
    return [center[0] + (edge.b.x - edge.a.x) / length * offset, item.topY + radius * 0.5, center[2] + (edge.b.z - edge.a.z) / length * offset] as [number, number, number];
  }) };
}

function EquipmentAnimationLayer({ plan, topology, activeUnitIds, isPlaying, showLabels, mode, layers, onSelectComponent }: {
  plan: Layout3DFootprintPlan; topology: DerivedLayout3DTopology; activeUnitIds: string[];
  isPlaying: boolean; showLabels: boolean; mode: 'generate' | 'pump'; layers: Record<string, boolean>;
  onSelectComponent: (component: string) => void;
}) {
  const powerhouse = componentsInPlan(plan, ['powerhouse'])[0];
  const switchyard = componentsInPlan(plan, ['switchyard', 'new_switchyard', 'existing_switchyard'])[0];
  const units = useMemo(() => powerhouse ? equipmentSlots(powerhouse, topology.units.length) : null, [powerhouse, topology.units.length]);
  const transformers = useMemo(() => switchyard ? equipmentSlots(switchyard, topology.transformers.length) : null, [switchyard, topology.transformers.length]);
  return <group>
    <HiddenLayerMarker position={simulationLabelPosition(plan, 'equipment')} testId="equipment-animation-layer" attributes={{ 'data-active-unit-count': String(isPlaying ? activeUnitIds.length : 0) }} />
    {units && <group visible={isLayerVisible('powerhouse', layers)} onClick={(event) => { event.stopPropagation(); onSelectComponent('powerhouse'); }}>
      {topology.units.map((unit, index) => <EquipmentUnit key={unit.id} position={units.positions[index]} radius={units.radius} active={isPlaying && activeUnitIds.includes(unit.id)} mode={mode} />)}
      {showLabels && isLayerVisible('powerhouse', layers) && <Html position={simulationLabelPosition(plan, 'equipment')} center><div style={labelStyle(false, '#a78bfa')}>Pompa-türbin / motor-jeneratör · temsili kesit</div></Html>}
    </group>}
    {transformers && <group visible={isLayerVisible('switchyard', layers)} onClick={(event) => { event.stopPropagation(); onSelectComponent('switchyard'); }}>
      {topology.transformers.map((transformer, index) => {
        const active = isPlaying && transformer.connectedUnitIds.some((id) => activeUnitIds.includes(id));
        const r = transformers.radius;
        return <group key={transformer.id} position={transformers.positions[index]}>
          <mesh position={[0, r, 0]}><boxGeometry args={[r * 2, r * 2, r * 1.5]} /><meshStandardMaterial color={active ? '#34d399' : '#64748b'} roughness={0.65} /></mesh>
          {[-0.6, 0, 0.6].map((x) => <mesh key={x} position={[x * r, r * 2.5, 0]}><cylinderGeometry args={[r * 0.12, r * 0.16, r, 8]} /><meshStandardMaterial color="#dbeafe" /></mesh>)}
        </group>;
      })}
    </group>}
  </group>;
}

interface CameraFrame {
  target: [number, number, number];
  horizontalSpan: number;
  verticalSpan: number;
  depthSpan: number;
  key: string;
}

export function calculateCameraDistance(
  frame: Pick<CameraFrame, 'horizontalSpan' | 'verticalSpan' | 'depthSpan'>,
  fovDegrees: number,
  aspect: number,
): number {
  const safeFov = clamp(Number.isFinite(fovDegrees) ? fovDegrees : 45, 20, 100);
  const safeAspect = Math.max(0.25, Number.isFinite(aspect) && aspect > 0 ? aspect : 1);
  const verticalFov = THREE.MathUtils.degToRad(safeFov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * safeAspect);
  // Fit the whole 3D bounding sphere for the oblique view, including depth.
  // Fitting X and Y independently clipped the lower reservoir at this angle.
  const radius = Math.hypot(frame.horizontalSpan, frame.verticalSpan, frame.depthSpan) / 2;
  return Math.max(120, radius * 1.12 / Math.sin(Math.min(verticalFov, horizontalFov) / 2));
}

function WebGLContextMonitor({ setContextLost }: { setContextLost: Dispatch<SetStateAction<boolean>> }) {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    let disposed = false;
    const handleContextLost = (event: Event) => {
      if (disposed) return;
      // Keep the browser eligible to restore the existing renderer. This is an
      // active drawing failure, not the normal listener cleanup on unmount.
      event.preventDefault();
      setContextLost(true);
    };
    const handleContextRestored = () => {
      if (disposed) return;
      setContextLost(false);
      invalidate();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);
    return () => {
      disposed = true;
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl, invalidate, setContextLost]);

  return null;
}

function useSmoothedReservoirLevels(upperSoc: number, lowerSoc: number, isPlaying: boolean) {
  const upperLevelRef = useRef(normalizeTerrainOpacity(upperSoc));
  const lowerLevelRef = useRef(normalizeTerrainOpacity(lowerSoc));

  useEffect(() => {
    if (isPlaying) return;
    upperLevelRef.current = normalizeTerrainOpacity(upperSoc);
    lowerLevelRef.current = normalizeTerrainOpacity(lowerSoc);
  }, [isPlaying, lowerSoc, upperSoc]);

  useFrame((_state, delta) => {
    if (!isPlaying) return;
    // SOC is the only level source. Interpolation affects only visual
    // smoothness and never advances or synthesizes a hydraulic state.
    const blend = 1 - Math.exp(-Math.max(delta, 0) * 8);
    upperLevelRef.current = THREE.MathUtils.lerp(
      upperLevelRef.current,
      normalizeTerrainOpacity(upperSoc),
      blend,
    );
    lowerLevelRef.current = THREE.MathUtils.lerp(
      lowerLevelRef.current,
      normalizeTerrainOpacity(lowerSoc),
      blend,
    );
  });

  return { upperLevelRef, lowerLevelRef };
}

function CameraTarget({ frame, controlsRef }: { frame: CameraFrame; controlsRef: MutableRefObject<OrbitControlsImpl | null> }) {
  const { camera, invalidate, size } = useThree();
  const appliedFrameKeyRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const aspect = size.height > 0 ? size.width / size.height : 1;
    const isNewFrame = appliedFrameKeyRef.current !== frame.key;
    const controls = controlsRef.current;
    if (isNewFrame) {
      if (controls) controls.target.set(...frame.target);
      const distance = calculateCameraDistance(
        frame,
        (camera as THREE.PerspectiveCamera).fov,
        aspect,
      );
      const direction = new THREE.Vector3(0.72, 0.52, 0.72).normalize();
      camera.position.set(
        frame.target[0] + direction.x * distance,
        frame.target[1] + direction.y * distance,
        frame.target[2] + direction.z * distance,
      );
      camera.lookAt(...frame.target);
      appliedFrameKeyRef.current = frame.key;
    }
    controls?.update?.();
    camera.updateMatrixWorld(true);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, controlsRef, frame, invalidate, size.height, size.width]);

  return null;
}

function RepresentativeFootprintTerrain({ opacity, theme }: { opacity: number; theme?: string }) {
  const normalizedOpacity = normalizeTerrainOpacity(opacity);
  const geometry = useMemo(() => {
    const terrain = new THREE.PlaneGeometry(1000, 1000, 32, 32);
    terrain.rotateX(-Math.PI / 2);
    const positions = terrain.attributes.position as THREE.BufferAttribute;
    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const z = positions.getZ(index);
      const ridge = Math.sin(x / 130) * 5.5 + Math.cos(z / 160) * 4;
      const basin = -8 * Math.exp(-(x * x + (z - 60) * (z - 60)) / 160000);
      positions.setY(index, -6 + ridge + basin);
    }
    positions.needsUpdate = true;
    terrain.computeVertexNormals();
    return terrain;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const dark = theme === 'dark';
  const baseColor = dark ? '#172015' : '#78936f';
  const gridColor = dark ? '#2dd4bf' : '#346b5e';
  const gridOpacity = dark ? 0.14 : 0.18;
  const guides = [-360, -240, -120, 0, 120, 240, 360];

  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          color={baseColor}
          transparent
          opacity={normalizedOpacity * 0.82}
          roughness={0.96}
          metalness={0}
          flatShading
        />
      </mesh>
      {guides.map((offset) => (
        <Line
          key={`terrain-x-${offset}`}
          points={[[-420, -1.2, offset], [420, -1.2, offset]]}
          color={gridColor}
          lineWidth={0.35}
          transparent
          opacity={gridOpacity * normalizedOpacity}
        />
      ))}
      {guides.map((offset) => (
        <Line
          key={`terrain-z-${offset}`}
          points={[[offset, -1.15, -420], [offset, -1.15, 420]]}
          color={gridColor}
          lineWidth={0.28}
          transparent
          opacity={gridOpacity * normalizedOpacity * 0.8}
        />
      ))}
    </group>
  );
}

function Scene({
  site,
  activeComponent,
  onSelectComponent,
  layers,
  mode,
  componentsDetail,
  isPlaying,
  activeUnits,
  activeUnitIds,
  simulationState = 'IDLE',
  quality = 'auto',
  upperSoc = 0.72,
  lowerSoc = 0.28,
  maxUnits,
  showTerrain,
  showLabels,
  terrainOpacity,
  theme,
  cameraRequest,
}: ThreeDModelProps & { theme?: string }) {
  const worldExampleFocusId = useSiteStore(state => state.worldExampleFocusId);
  const isPresenzano = worldExampleFocusId === 'presenzano';
  const isSeaWater = site ? isSeaLowerReservoir(site) : false;
  const d = componentsDetail;
  const manualFeatures = useManualGeometryStore(useShallow(state => state.getFeaturesForSite(site?.id || '')));
  const footprintPlan = useMemo(
    () => {
      if (!site) return { enabled: false, hideLegacySquareReservoir: false, items: [] };
      const overriddenSite = overrideSiteWithManualGeometries(site, manualFeatures);
      return buildLayout3DFootprintPlan(overriddenSite);
    },
    [site, manualFeatures],
  );
  const resolvedActiveUnitIds = useMemo(
    () => activeUnitIds ?? Array.from({ length: activeUnits }, (_, index) => `G${index + 1}`),
    [activeUnitIds, activeUnits],
  );
  const topology = useMemo(
    () => deriveLayout3DTopology(site, footprintPlan, componentsDetail),
    [site, footprintPlan, componentsDetail],
  );
  const snapshot = resolveSimulationSnapshot(topology, resolvedActiveUnitIds, mode, simulationState, isPlaying);
  const powerMW = snapshot.powerMW;
  const flowActive = snapshot.running && snapshot.flowCms > 0;
  isPlaying = snapshot.running;

  const cameraFrame = useMemo<CameraFrame>(() => {
    if (footprintPlan.enabled && footprintPlan.items.length > 0) {
      const frameItems = cameraRequest?.selected ? footprintPlan.items.filter((item) => isFootprintLayerVisible(item, { [activeComponent]: true }) && (item.component === activeComponent || groupFootprintsByLayer([item])[0]?.layerKey === activeComponent)) : footprintPlan.items;
      const points = (frameItems.length ? frameItems : footprintPlan.items).flatMap((item) => item.points).filter((point) => (
        Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z)
      ));
      if (points.length > 0) {
        const xs = points.map((point) => point.x);
        const ys = points.map((point) => point.y);
        const zs = points.map((point) => point.z);
        const horizontalSpan = Math.max(Math.max(...xs) - Math.min(...xs), 40);
        const depthSpan = Math.max(Math.max(...zs) - Math.min(...zs), 40);
        const verticalSpan = Math.max(Math.max(...ys) - Math.min(...ys), 24);
        const target: [number, number, number] = [
            (Math.min(...xs) + Math.max(...xs)) / 2,
            (Math.min(...ys) + Math.max(...ys)) / 2,
            (Math.min(...zs) + Math.max(...zs)) / 2,
        ];
        return {
          target,
          horizontalSpan,
          verticalSpan,
          depthSpan,
          key: `${site.id}:${cameraRequest?.revision ?? 0}:${target.join(',')}:${horizontalSpan}:${verticalSpan}:${depthSpan}`,
        };
      }
    }
    return { target: [0, 20, 0], horizontalSpan: 120, verticalSpan: 40, depthSpan: 120, key: `${site.id}:fallback:${cameraRequest?.revision ?? 0}` };
  }, [footprintPlan, site.id, cameraRequest, activeComponent]);
  const fogSpan = Math.max(cameraFrame.horizontalSpan, cameraFrame.verticalSpan, cameraFrame.depthSpan);
  const fogNear = Math.max(600, fogSpan * 3);
  const fogFar = Math.max(fogNear + 1000, fogSpan * 10);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { upperLevelRef, lowerLevelRef } = useSmoothedReservoirLevels(upperSoc, lowerSoc, isPlaying);
  const terrainAlpha = normalizeTerrainOpacity(terrainOpacity);

  // Dynamic Spacing Factors based on real site properties
  const tunnelScale = site?.tunnelLengthKm ? Math.max(0.6, Math.min(1.8, site.tunnelLengthKm / 3)) : 1;

  // Calculate dynamic heights/positions aligned to terrain height field
  const upperPos = useMemo(() => placeOnTerrain(-140 * tunnelScale, -15, 0, isPresenzano), [tunnelScale, isPresenzano]);
  const surgeTankPos = useMemo(() => placeOnTerrain(-30 * tunnelScale, 0, 0, isPresenzano), [tunnelScale, isPresenzano]);
  const powerhousePos = useMemo(() => placeOnTerrain(45, 15, -2, isPresenzano), [isPresenzano]);
  const penstockEnd = useMemo(() => new THREE.Vector3(powerhousePos.x, powerhousePos.y - 1.5, powerhousePos.z), [powerhousePos]);
  const lowerPos = useMemo(() => isSeaWater ? new THREE.Vector3(80, 0, 0) : placeOnTerrain(80, 30, 0, isPresenzano), [isPresenzano, isSeaWater]);
  const portalUpperPos = useMemo(() => placeOnTerrain(-100 * tunnelScale, -10, 0, isPresenzano), [tunnelScale, isPresenzano]);
  const portalLowerPos = useMemo(() => isSeaWater ? new THREE.Vector3(60, 0, 0) : placeOnTerrain(60, 20, 0, isPresenzano), [isPresenzano, isSeaWater]);

  // environment assets list
  const environmentAssets = useMemo(() => {
    const assets: Array<{ type: 'tree' | 'rock'; pos: [number, number, number]; scale: number; rot: [number, number, number] }> = [];
    let count = 0;

    for (let i = 0; i < 600; i++) {
      const rx = -210 + pseudoRandom(count++) * 420;
      const rz = -210 + pseudoRandom(count++) * 420;

      // Distance checks to clear the structures
      const distToUpper = Math.hypot(rx - (-90), rz - (-15));
      const distToLower = Math.hypot(rx - 80, rz - 30);
      const distToPH = Math.hypot(rx - 45, rz - 15);
      const distToSY = Math.hypot(rx - 75, rz - (-25));
      const distToST = Math.hypot(rx - (-30), rz - 0);

      if (distToUpper < 45 || distToLower < 35 || distToPH < 25 || distToSY < 25 || distToST < 20) {
        continue;
      }

      const ry = getTerrainHeight(rx, rz, isPresenzano);

      // Grass/rock zone placement
      if (ry > -3 && ry < 99) {
        const type = pseudoRandom(count++) > 0.45 ? 'tree' : 'rock';
        const scale = 0.4 + pseudoRandom(count++) * 0.7;
        const rot: [number, number, number] = [
          type === 'rock' ? pseudoRandom(count++) * Math.PI : 0,
          pseudoRandom(count++) * Math.PI,
          type === 'rock' ? pseudoRandom(count++) * Math.PI : 0
        ];
        assets.push({ type, pos: [rx, ry, rz], scale, rot });
      }
    }
    return assets;
  }, [isPresenzano]);

  return (
    <>
      <CameraTarget frame={cameraFrame} controlsRef={controlsRef} />
      {footprintPlan.enabled ? (
        <color attach="background" args={[theme === 'dark' ? '#111c29' : '#d9e6ed']} />
      ) : theme === 'dark' ? (
        <Sky sunPosition={[0, -10, -50]} turbidity={10} rayleigh={0.1} mieCoefficient={0.005} />
      ) : (
        <Sky sunPosition={[120, 30, 90]} turbidity={0.2} rayleigh={1.0} />
      )}
      <hemisphereLight args={['#dceeff', '#53644c', 1.1]} />
      <ambientLight intensity={theme === 'dark' ? 0.8 : 0.9} />
      <directionalLight 
        position={[120, 150, 100]} intensity={theme === 'dark' ? 1.5 : 1.8} castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0003} shadow-normalBias={0.2}
        shadow-camera-left={-200} shadow-camera-right={200}
        shadow-camera-top={200} shadow-camera-bottom={-200}
      />
      <fog attach="fog" args={[theme === 'dark' ? '#0a0c10' : '#a2adb9', fogNear, fogFar]} />

      {showTerrain && !footprintPlan.enabled && <RealisticTerrain opacity={terrainAlpha} isPresenzano={isPresenzano} />}

      {/* Scattered Vegetation and Rocks (Instanced for Performance) */}
      {showTerrain && terrainAlpha > 0 && !footprintPlan.enabled && <InstancedEnvironment assets={environmentAssets} opacity={terrainAlpha} />}

      {showTerrain && footprintPlan.enabled && (
        <RepresentativeFootprintTerrain opacity={terrainAlpha} theme={theme} />
      )}

      {footprintPlan.enabled && (
        <>
          <FootprintSceneLayer
            items={footprintPlan.items}
            upperSoc={upperSoc}
            lowerSoc={lowerSoc}
            layers={layers}
            activeComponent={activeComponent}
            onSelectComponent={onSelectComponent}
            showLabels={showLabels}
          />
          <HydraulicFlowLayer
            plan={footprintPlan}
            topology={topology}
            activeUnitIds={resolvedActiveUnitIds}
            mode={mode}
            isPlaying={flowActive}
            quality={quality}
            layers={layers}
          />
          <ElectricalFlowLayer
            plan={footprintPlan}
            topology={topology}
            activeUnitIds={resolvedActiveUnitIds}
            mode={mode}
            isPlaying={isPlaying}
            powerMW={powerMW}
            layers={layers}
          />
          <ReservoirLevelLayer
            plan={footprintPlan}
            upperSoc={upperSoc}
            lowerSoc={lowerSoc}
            showLabels={showLabels}
          />
          <EquipmentAnimationLayer
            mode={mode}
            layers={layers}
            onSelectComponent={onSelectComponent}
            plan={footprintPlan}
            topology={topology}
            activeUnitIds={resolvedActiveUnitIds}
            isPlaying={isPlaying}
            showLabels={showLabels}
          />
        </>
      )}

      {/* Upper Reservoir & Dam */}
      {layers.upper_reservoir && !(footprintPlan.enabled && footprintPlan.items.some((item) => item.component === 'upper_reservoir' && item.material === 'water')) && (
        <RealisticUpperReservoir 
          position={upperPos}
          active={activeComponent === 'upper_reservoir'} 
          onClick={() => onSelectComponent('upper_reservoir')} 
          detail={d.upper_reservoir} 
          waterLevelRef={upperLevelRef}
          showLabels={showLabels} 
          isPresenzano={isPresenzano}
          isPlaying={isPlaying}
          mode={mode}
          activeUnits={activeUnits}
          site={site}
        />
      )}
      
      {/* Lower Reservoir Basin / Sea */}
      {layers.lower_reservoir && !(footprintPlan.enabled) && (
        isSeaWater ? (
          <SeaWaterReservoir 
            position={lowerPos}
            active={activeComponent === 'lower_reservoir'} 
            onClick={() => onSelectComponent('lower_reservoir')} 
            waterLevelRef={lowerLevelRef}
            showLabels={showLabels} 
            isPlaying={isPlaying}
            mode={mode}
            activeUnits={activeUnits}
          />
        ) : (
          <RealisticLowerReservoir 
            position={lowerPos}
            active={activeComponent === 'lower_reservoir'} 
            onClick={() => onSelectComponent('lower_reservoir')} 
            waterLevelRef={lowerLevelRef}
            showLabels={showLabels} 
            isPresenzano={isPresenzano}
            isPlaying={isPlaying}
            mode={mode}
            activeUnits={activeUnits}
          />
        )
      )}

      {/* Cavern Powerhouse */}
      {layers.powerhouse && !(footprintPlan.enabled) && (
        <RealisticPowerhouse 
          active={activeComponent === 'powerhouse'} 
          onClick={() => onSelectComponent('powerhouse')} 
          detail={d.powerhouse} 
          activeUnits={activeUnits}
          activeUnitIds={resolvedActiveUnitIds}
          isPlaying={isPlaying} 
          showLabels={showLabels} 
          isPresenzano={isPresenzano}
          mode={mode}
        />
      )}

      {/* Switchyard (Substation) */}
      {layers.switchyard && !(footprintPlan.enabled) && (
        <RealisticSwitchyard 
          active={activeComponent === 'switchyard'} 
          onClick={() => onSelectComponent('switchyard')}
          detail={d.switchyard} 
          showLabels={showLabels} 
          isPresenzano={isPresenzano}
          isPlaying={isPlaying}
          mode={mode}
          activeUnits={activeUnits}
          maxUnits={maxUnits}
          powerMW={powerMW}
        />
      )}

      {/* Surge Tank cylindrical concrete tower */}
      {layers.surge_tank && !(footprintPlan.enabled) && (
        <RealisticSurgeTank 
          position={surgeTankPos} 
          active={activeComponent === 'surge_tank'} 
          onClick={() => onSelectComponent('surge_tank')}
          showLabels={showLabels} 
        />
      )}

      {/* Portals */}
      {layers.portal && !(footprintPlan.enabled) && (
        <>
          <Portal 
            position={portalUpperPos} 
            rotation={[0, Math.PI/4, 0]} 
            active={activeComponent === 'portal'} 
            onClick={() => onSelectComponent('portal')} 
            showLabels={showLabels} 
            label="Üst Tünel Portalı"
          />
          <Portal 
            position={portalLowerPos} 
            rotation={[0, -Math.PI/6, 0]} 
            active={activeComponent === 'portal'} 
            onClick={() => onSelectComponent('portal')} 
            showLabels={showLabels} 
            label="Kuyruksuyu Portalı"
          />
        </>
      )}

      {/* Steel Penstocks */}
      {layers.penstock && !(footprintPlan.enabled) && (
        <RealisticPenstock 
          active={activeComponent === 'penstock'} 
          onClick={() => onSelectComponent('penstock')} 
          from={surgeTankPos} 
          to={penstockEnd}
          isPlaying={isPlaying} 
          mode={mode} 
          activeUnits={activeUnits}
          activeUnitIds={resolvedActiveUnitIds}
          maxUnits={maxUnits}
          showLabels={showLabels} 
          isPresenzano={isPresenzano}
        />
      )}

      {/* Underground Concrete Tunnel */}
      {layers.tunnel && !(footprintPlan.enabled) && (
        <UndergroundTunnel 
          from={upperPos} 
          to={surgeTankPos} 
          active={activeComponent === 'tunnel'} 
          onClick={() => onSelectComponent('tunnel')} 
          showLabels={showLabels} 
        />
      )}

      {/* Tailrace Concrete Channel */}
      {layers.tailrace && !(footprintPlan.enabled) && (
        <TailraceChannel 
          from={powerhousePos} 
          to={lowerPos}
          isPlaying={isPlaying}
          mode={mode}
          activeUnits={activeUnits}
          active={activeComponent === 'tailrace'} 
          onClick={() => onSelectComponent('tailrace')} 
          showLabels={showLabels} 
        />
      )}

      {/* Powerhouse to Switchyard underground cable */}
      {layers.switchyard && layers.powerhouse && !footprintPlan.enabled && (
        <group>
          {(() => {
            const syPos = new THREE.Vector3(75, getTerrainHeight(75, -25, isPresenzano) - 1, -25);
            const cableFrom = new THREE.Vector3(powerhousePos.x + 3, powerhousePos.y, powerhousePos.z - 2);
            const cableTo = new THREE.Vector3(syPos.x - 6, syPos.y, syPos.z + 4);
            const mid = new THREE.Vector3().lerpVectors(cableFrom, cableTo, 0.5);
            mid.y -= 2;
            const curve = new THREE.QuadraticBezierCurve3(cableFrom, mid, cableTo);
            const pts = curve.getPoints(20);
            return (
              <>
                <Line points={pts.map(v => [v.x, v.y, v.z]) as any} color="#333" lineWidth={2} />
                <Line points={pts.map(v => [v.x, v.y + 0.3, v.z]) as any} color="#333" lineWidth={2} />
                <Line points={pts.map(v => [v.x, v.y - 0.3, v.z]) as any} color="#333" lineWidth={2} />
              </>
            );
          })()}
        </group>
      )}

      {/* Switchyard to first transmission tower cable */}
      {layers.transmission && layers.switchyard && !footprintPlan.enabled && (
        <group>
          {(() => {
            const syPos = new THREE.Vector3(75, getTerrainHeight(75, -25, isPresenzano) - 1, -25);
            const firstPole = new THREE.Vector3(90, getTerrainHeight(90, -35, isPresenzano), -35);
            const cableFrom = new THREE.Vector3(syPos.x + 5, syPos.y + 4, syPos.z - 4);
            const cableTo = new THREE.Vector3(firstPole.x, firstPole.y + 5.8*0.75, firstPole.z);
            const mid = new THREE.Vector3().lerpVectors(cableFrom, cableTo, 0.5);
            mid.y -= 1.5;
            const curve = new THREE.QuadraticBezierCurve3(cableFrom, mid, cableTo);
            const pts = curve.getPoints(20);
            return (
              <>
                <Line points={pts.map(v => [v.x - 1, v.y, v.z]) as any} color="#111" lineWidth={1} />
                <Line points={pts.map(v => [v.x + 1, v.y, v.z]) as any} color="#111" lineWidth={1} />
                <Line points={pts.map(v => [v.x, v.y + 0.6, v.z]) as any} color="#111" lineWidth={1} />
              </>
            );
          })()}
        </group>
      )}

      {/* Transmission pylons and lines */}
      {layers.transmission && !footprintPlan.enabled && <TransmissionLine isPresenzano={isPresenzano} isPlaying={isPlaying} mode={mode} activeUnits={activeUnits} />}

      <OrbitControls ref={controlsRef} target={cameraFrame.target} makeDefault enableDamping dampingFactor={0.05} minDistance={20} maxDistance={Math.max(2500, fogSpan * 12)} />
    </>
  );
}

class ThreeDCanvasBoundary extends Component<{ children: React.ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    const webgl = /webgl|context/i.test(this.state.error.message);
    return <div role="alert" className="threed-render-error">
      <p>{webgl ? 'WebGL başlatılamadı. Bu tarayıcıda 3D çizim kullanılamıyor.' : '3D sahnesi yüklenemedi.'}</p>
      <p>{this.state.error.message}</p>
      <button type="button" className="btn ghost" onClick={() => this.setState({ error: null })}>3D görünümü yeniden dene</button>
    </div>;
  }
}

export default function ThreeDModel(props: ThreeDModelProps) {
  const theme = useSettingsStore(state => state.theme);
  const [webglContextLost, setWebglContextLost] = useState(false);
  const [cameraRequest, setCameraRequest] = useState({ revision: 0, selected: false });
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '50vh', borderRadius: 16, overflow: 'hidden', background: theme === 'dark' ? '#0a0c10' : '#d2e4f0' }}>
      <div className="threed-camera-controls" aria-label="Kamera kontrolleri">
        <button type="button" className="btn ghost" onClick={() => setCameraRequest((v) => ({ revision: v.revision + 1, selected: false }))}><RotateCcw size={15} /> Tesise odaklan</button>
        <button type="button" className="btn ghost" disabled={!props.activeComponent} onClick={() => setCameraRequest((v) => ({ revision: v.revision + 1, selected: true }))}><Focus size={15} /> Seçili bileşen</button>
      </div>
      {webglContextLost && (
        <div role="alert" style={{ position: 'absolute', zIndex: 2, top: 16, left: 16, right: 16, padding: 12, borderRadius: 8, color: '#fff', background: 'rgba(153, 27, 27, 0.94)' }}>
          WebGL görüntü bağlamı kaybedildi. Tarayıcı bağlamı geri yüklemeye çalışıyor; sorun sürerse sayfayı yenileyin.
        </div>
      )}
      <ThreeDCanvasBoundary>
      <Canvas
        shadows="basic"
        dpr={[1, 1.5]}
        frameloop={props.isPlaying ? 'always' : 'demand'}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [150, 120, 180], fov: 45, far: 30000 }}
        fallback={<div role="alert" style={{ padding: 24, color: '#f8fafc' }}>WebGL başlatılamadı. 3D görünüm bu tarayıcıda kullanılamıyor.</div>}
      >
        <WebGLContextMonitor setContextLost={setWebglContextLost} />
        <Scene {...props} theme={theme} cameraRequest={cameraRequest} />
      </Canvas>
      </ThreeDCanvasBoundary>
    </div>
  );
}
