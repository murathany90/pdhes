import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Sky } from '@react-three/drei';
import * as THREE from 'three';
import type { ComponentsDetail } from '../../types/site';

interface ThreeDModelProps {
  siteId?: string;
  activeComponent: string;
  onSelectComponent: (comp: string) => void;
  layers: Record<string, boolean>;
  mode: 'generate' | 'pump';
  componentsDetail: ComponentsDetail;
  isPlaying: boolean;
  activeUnits: number;
  maxUnits: number;
  showTerrain: boolean;
  showLabels: boolean;
  terrainOpacity: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const logScale = (v: number, base: number, min: number, max: number) =>
  clamp(Math.log(v / base + 1) * 2, min, max);

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

/* ─────────────────────────────────────────────
   Realistic Terrain
   ───────────────────────────────────────────── */
function RealisticTerrain({ opacity, isPresenzano }: { opacity: number; isPresenzano?: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);

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
    return g;
  }, [isPresenzano]);

  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.9,
      metalness: 0.05,
      flatShading: false,
      transparent: true,
      opacity: opacity,
    });
    
    const pos = geometry.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const colorValley = new THREE.Color('#1b382b'); // deep green forest floor
    const colorGrass = new THREE.Color('#385a3c');  // healthy grassy slope
    const colorRock = new THREE.Color('#635c51');   // exposed earth/rocks
    const colorSnow = new THREE.Color('#e5e7eb');   // snowy peaks
    
    for (let i = 0; i < pos.count; i++) {
      const h = pos.getZ(i);
      const normalZ = geometry.attributes.normal.getZ(i);
      
      let c: THREE.Color;
      
      // Slope steepness (rocky cliffs where it is steep)
      if (normalZ < 0.76) {
        c = colorRock.clone();
      } else {
        if (h < 12) c = colorValley.clone().lerp(colorGrass, h / 12);
        else if (h < 66) c = colorGrass.clone().lerp(colorRock, (h - 12) / 54);
        else if (h < 96) c = colorRock.clone().lerp(colorSnow, (h - 66) / 30);
        else c = colorSnow.clone();
      }

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return m;
  }, [geometry, opacity]);

  return (
    <mesh ref={mesh} geometry={geometry} material={material}
      rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}
      receiveShadow
    />
  );
}

/* ─────────────────────────────────────────────
   Vegetation and Rocks System
   ───────────────────────────────────────────── */
function LowPolyTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh castShadow>
        <cylinderGeometry args={[0.12, 0.2, 1.0, 5]} />
        <meshStandardMaterial color="#422b1c" roughness={0.95} />
      </mesh>
      {/* Foliage (Cone layers) */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <coneGeometry args={[0.7, 1.2, 5]} />
        <meshStandardMaterial color="#1a3f24" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <coneGeometry args={[0.5, 0.8, 5]} />
        <meshStandardMaterial color="#225430" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

function ForestRock({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const rot: [number, number, number] = useMemo(() => [
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  ], []);
  return (
    <mesh position={position} rotation={rot} scale={[scale, scale, scale]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial color="#504c46" roughness={0.88} flatShading />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
   Realistic Upper Reservoir (Arch/Embankment Dam)
   ───────────────────────────────────────────── */
function RealisticUpperReservoir({ position, active, onClick, detail, waterLevelRef, showLabels, isPresenzano }: any) {
  const damH = logScale(detail.dam_height_m, 20, 3, 8) * 2.5;
  const vol = logScale(detail.active_volume_mcm, 5, 4, 10) * 2.5;
  const pos: [number, number, number] = [position.x, position.y - damH * 0.3, position.z];
  
  const waterMesh = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!waterMesh.current) return;
    const t = clock.getElapsedTime();
    // Simulate water depletion and subtle ripple oscillations
    waterMesh.current.position.y = (damH * 0.7) * waterLevelRef.current - damH / 2 + 0.3;
    const wave = Math.sin(t * 1.3) * 0.015;
    waterMesh.current.scale.set(1 + wave, 1, 1 + wave);
  });

  const damRadius = vol * 1.5 + 5;

  return (
    <group position={pos}>
      {/* Clickable structure */}
      <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
        {isPresenzano ? (
          /* Soil/Rockfill Embankment Dam for Presenzano (Cesima Upper Dam) */
          <>
            {/* Thick sloped embankment body */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[damRadius - 1.5, damRadius + 3.0, damH, 48, 1, false, Math.PI * 0.8, Math.PI * 0.5]} />
              <meshStandardMaterial color="#424549" roughness={0.9} side={THREE.DoubleSide} metalness={0.05} />
            </mesh>
            
            {/* Crest Road (flat roadway top) */}
            <mesh position={[0, damH/2 + 0.05, 0]} castShadow>
              <cylinderGeometry args={[damRadius - 1.3, damRadius - 1.3, 0.1, 48, 1, false, Math.PI * 0.8, Math.PI * 0.5]} />
              <meshStandardMaterial color="#5a5d61" roughness={0.8} side={THREE.DoubleSide} />
            </mesh>

            {/* Concrete Abutments on Cesima mountainside */}
            <mesh position={[-damRadius * 0.8, 0, damRadius * 0.51]} rotation={[0, -0.4, 0]} castShadow>
              <boxGeometry args={[4, damH + 2, 5]} />
              <meshStandardMaterial color="#686d72" roughness={0.85} />
            </mesh>
            <mesh position={[damRadius * 0.8, 0, damRadius * 0.51]} rotation={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[4, damH + 2, 5]} />
              <meshStandardMaterial color="#686d72" roughness={0.85} />
            </mesh>

            {/* Asphalt concrete sealing face overlay on the upstream side */}
            <mesh position={[0, 0, -0.05]} castShadow>
              <cylinderGeometry args={[damRadius - 1.6, damRadius + 2.8, damH - 0.2, 48, 1, true, Math.PI * 0.8, Math.PI * 0.5]} />
              <meshStandardMaterial color="#222426" roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
          </>
        ) : (
          /* Concrete Arch Dam for Generic sites */
          <>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[damRadius, damRadius + 1.2, damH, 48, 1, false, Math.PI * 0.8, Math.PI * 0.5]} />
              <meshStandardMaterial color="#888e95" roughness={0.85} side={THREE.DoubleSide} metalness={0.1} />
            </mesh>
            
            <mesh position={[0, damH/2 + 0.1, 0]} castShadow>
              <cylinderGeometry args={[damRadius + 0.2, damRadius + 0.2, 0.2, 48, 1, false, Math.PI * 0.8, Math.PI * 0.5]} />
              <meshStandardMaterial color="#6a6f75" roughness={0.75} side={THREE.DoubleSide} />
            </mesh>

            <mesh position={[-damRadius * 0.8, 0, damRadius * 0.51]} rotation={[0, -0.4, 0]} castShadow>
              <boxGeometry args={[3, damH + 2, 4]} />
              <meshStandardMaterial color="#7a8086" roughness={0.8} />
            </mesh>
            <mesh position={[damRadius * 0.8, 0, damRadius * 0.51]} rotation={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[3, damH + 2, 4]} />
              <meshStandardMaterial color="#7a8086" roughness={0.8} />
            </mesh>

            <group position={[0, damH/2 - 0.4, damRadius * 0.96]} rotation={[0, Math.PI, 0]}>
              <mesh position={[-1.2, 0.4, 0]} castShadow><boxGeometry args={[0.3, 1.1, 1.4]} /><meshStandardMaterial color="#888e95" /></mesh>
              <mesh position={[0, 0.4, 0]} castShadow><boxGeometry args={[0.3, 1.1, 1.4]} /><meshStandardMaterial color="#888e95" /></mesh>
              <mesh position={[1.2, 0.4, 0]} castShadow><boxGeometry args={[0.3, 1.1, 1.4]} /><meshStandardMaterial color="#888e95" /></mesh>
              <mesh position={[-0.6, 0.35, -0.05]} castShadow><boxGeometry args={[0.9, 0.7, 0.1]} /><meshStandardMaterial color="#ac421f" metalness={0.7} roughness={0.4} /></mesh>
              <mesh position={[0.6, 0.35, -0.05]} castShadow><boxGeometry args={[0.9, 0.7, 0.1]} /><meshStandardMaterial color="#ac421f" metalness={0.7} roughness={0.4} /></mesh>
              
              <mesh position={[0, -damH/2, -1.1]} rotation={[-0.65, 0, 0]} castShadow>
                <boxGeometry args={[2.7, 0.4, damH * 1.25]} />
                <meshStandardMaterial color="#757c82" roughness={0.85} />
              </mesh>
            </group>
          </>
        )}
      </group>
      
      {/* Reservoir Basin Bed */}
      <mesh position={[0, -damH/2, -vol * 0.5]} rotation={[-Math.PI/2, 0, 0]} scale={[1.5, 1.0, 1.0]} receiveShadow>
         <circleGeometry args={[vol, 64]} />
         <meshStandardMaterial color="#42352b" roughness={0.95} />
      </mesh>

      {/* Advanced Animated Physical Water */}
      <mesh ref={waterMesh} position={[0, 0, -vol * 0.5]} rotation={[-Math.PI/2, 0, 0]} scale={[1.44, 0.94, 1.0]}>
        <circleGeometry args={[vol, 64]} />
        <meshPhysicalMaterial 
          color="#0f5c94" 
          transparent 
          opacity={0.8}
          roughness={0.1} 
          metalness={0.05}
          transmission={0.85} 
          ior={1.333}
          thickness={4.0}
        />
      </mesh>

      <Html position={[0, damH + 3, 0]} center style={{ display: showLabels ? 'block' : 'none' }}>
        <div style={labelStyle(active, '#3d7dff')}>{isPresenzano ? 'Cesima Üst Rezervuarı (6 Milyon m³)' : 'Üst Rezervuar'}</div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Realistic Lower Reservoir (Organic Basin & Water)
   ───────────────────────────────────────────── */
function RealisticLowerReservoir({ position, active, onClick, waterLevelRef, showLabels, isPresenzano }: any) {
  const depth = 6;
  const pos: [number, number, number] = [position.x, position.y - depth * 0.25, position.z];
  const radius = 28;
  
  const waterMesh = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!waterMesh.current) return;
    const t = clock.getElapsedTime();
    waterMesh.current.position.y = -depth/2 + (depth * 0.8) * (1 - waterLevelRef.current) + 0.15;
    const wave = Math.cos(t * 1.1) * 0.015;
    waterMesh.current.scale.set(1 + wave, 1, 1 + wave);
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

      <Html position={[0, 4, 0]} center style={{ display: showLabels ? 'block' : 'none' }}>
        <div style={labelStyle(active, '#15cfe8')}>{isPresenzano ? 'Presenzano Alt Rezervuarı (6 Milyon m³)' : 'Alt Rezervuar'}</div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Realistic Powerhouse (Cavern Cutaway / Well Shafts)
   ───────────────────────────────────────────── */
function RealisticPowerhouse({ active, onClick, detail, activeUnits, isPlaying, showLabels, isPresenzano, mode }: any) {
  const w = logScale(detail.cavern_width_m, 20, 3, 6);
  const l = logScale(detail.cavern_length_m, 100, 6, 12);
  const h = logScale(detail.cavern_height_m, 20, 3, 6);
  const pos: [number, number, number] = [45, getTerrainHeight(45, 15, false) - 2, 15];
  
  const turbineRefs = useRef<THREE.Group[]>([]);

  useFrame(() => {
    if (!isPlaying) return;
    // Rotation direction switches based on mode: clockwise for generation, counter-clockwise for pumping
    const spinSpeed = mode === 'generate' ? 0.16 : -0.16;
    turbineRefs.current.forEach((ref, index) => {
      if (ref && index < activeUnits) {
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
          const isUnitActive = i < activeUnits && isPlaying;
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
          const isUnitActive = i < activeUnits && isPlaying;
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
        <div style={labelStyle(active, '#a855f7')}>{isPresenzano ? 'Presenzano Kuyu Tipi Santral (1.000 MW)' : `Güç Evi (Aktif: ${activeUnits}/${detail.units})`}</div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Realistic Switchyard (Substation detailed components)
   ───────────────────────────────────────────── */
function RealisticSwitchyard({ active, onClick, detail, showLabels, isPresenzano, isPlaying, mode, activeUnits, maxUnits, powerhouseDetail }: any) {
  const currentMW = powerhouseDetail?.total_capacity_mw ? (powerhouseDetail.total_capacity_mw / maxUnits) * activeUnits : 0;
  const pos: [number, number, number] = [60, getTerrainHeight(60, 5, isPresenzano) - 1, 5];
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
      <mesh position={[-5.6, 2.0, -4.6]} castShadow><boxGeometry args={[0.25, 4.0, 0.25]} /><meshStandardMaterial color="#88929e" metalness={0.7} /></mesh>
      <mesh position={[5.6, 2.0, -4.6]} castShadow><boxGeometry args={[0.25, 4.0, 0.25]} /><meshStandardMaterial color="#88929e" metalness={0.7} /></mesh>
      
      {/* Gantry insulators */}
      <mesh position={[-3.6, 3.4, -4.6]}><cylinderGeometry args={[0.04, 0.04, 0.8]} /><meshStandardMaterial color="#c0c4c8" /></mesh>
      <mesh position={[0, 3.4, -4.6]}><cylinderGeometry args={[0.04, 0.04, 0.8]} /><meshStandardMaterial color="#c0c4c8" /></mesh>
      <mesh position={[3.6, 3.4, -4.6]}><cylinderGeometry args={[0.04, 0.04, 0.8]} /><meshStandardMaterial color="#c0c4c8" /></mesh>

      <Html position={[0, 5, 0]} center style={{ display: showLabels ? 'block' : 'none' }}>
        <div style={labelStyle(active, '#10b981')}>{isPresenzano ? 'Presenzano Şalt Sahası (380 kV)' : `Şalt Sahası (${detail.voltage_kv} kV)`}</div>
      </Html>

      {isPlaying && activeUnits > 0 && (
        <Html position={[0, 22, 0]} center>
          <div style={{
            background: 'rgba(14,17,23,0.92)',
            border: mode === 'generate' ? '3px solid #10b981' : '3px solid #ef4444',
            padding: '16px 32px',
            borderRadius: '14px',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            boxShadow: mode === 'generate' ? '0 0 30px rgba(16,185,129,0.5)' : '0 0 30px rgba(239,68,68,0.5)',
            textAlign: 'center',
            minWidth: '180px'
          }}>
            <div style={{ color: mode === 'generate' ? '#10b981' : '#ef4444', marginBottom: 6, fontSize: '13px', letterSpacing: '1px' }}>
              {mode === 'generate' ? '⚡ ÜRETİM (ŞEBEKEYE)' : '🔋 POMPA (ŞEBEKEDEN)'}
            </div>
            <div style={{ fontSize: '28px' }}>{currentMW.toFixed(1)} MW</div>
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
    [80, getTerrainHeight(80, -15, isPresenzano), -15],
    [110, getTerrainHeight(110, -35, isPresenzano), -35],
    [140, getTerrainHeight(140, -55, isPresenzano), -55]
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
          <meshBasicMaterial color={mode === 'generate' ? '#10b981' : '#ef4444'} transparent opacity={0.8} />
        </instancedMesh>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────
   Steel Penstocks with Concrete Anchor Blocks (4 Lines for Presenzano)
   ───────────────────────────────────────────── */
function RealisticPenstock({ active, onClick, from, to, isPlaying, mode, activeUnits, maxUnits = 2, showLabels, isPresenzano }: any) {
  const linesData = useMemo(() => {
    const pTop = from.clone();
    
    // Middle point representation for steep slopes:
    // Presenzano upper section: 55% slope, lower section: 110% slope
    const pMid = isPresenzano
      ? new THREE.Vector3(from.x + 11.0, from.y - 6.5, (from.z + to.z) / 2)
      : new THREE.Vector3().lerpVectors(from, to, 0.55).setY(from.y - (from.y - to.y) * 0.45 - 2.5);
    const pBot = to.clone();

    // Spacing offsets along Z-axis dynamically calculated based on maxUnits
    const spacing = isPresenzano ? 1.4 : 2.2;
    const zOffsets = Array.from({ length: maxUnits }, (_, i) => (i - (maxUnits - 1) / 2) * spacing);
    
    return zOffsets.map((offsetVal, index) => {
      const offsetVec = new THREE.Vector3(0, 0, offsetVal);
      const cLine = new THREE.QuadraticBezierCurve3(
        pTop.clone().add(offsetVec),
        pMid.clone().add(offsetVec),
        pBot.clone().add(offsetVec)
      );
      const tubeGeo = new THREE.TubeGeometry(cLine, 64, isPresenzano ? 0.22 : 0.32, 12, false);
      return {
        geometry: tubeGeo,
        curve: cLine,
        id: index
      };
    });
  }, [from, to, isPresenzano, maxUnits]);

  const anchorPoints = useMemo(() => {
    const pTop = from.clone();
    const pMid = isPresenzano
      ? new THREE.Vector3(from.x + 11.0, from.y - 6.5, (from.z + to.z) / 2)
      : new THREE.Vector3().lerpVectors(from, to, 0.55).setY(from.y - (from.y - to.y) * 0.45 - 2.5);
    const pBot = to.clone();
    return [pTop, pMid, pBot];
  }, [from, to, isPresenzano]);

  // instanced water flow particles inside
  const particleCount = isPresenzano ? 45 : 90;
  const instancedMeshesRef = useRef<THREE.InstancedMesh[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(() => Array.from({ length: particleCount }, () => Math.random()), [particleCount]);

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
      if (pipeIndex >= activeUnits) {
        mesh.visible = false;
        return;
      }

      for (let i = 0; i < particleCount; i++) {
        let param = (offsets[i] + speed) % 1;
        if (mode === 'pump') param = 1 - param; // flow direction
        
        const pt = line.curve.getPoint(param);
        
        dummy.position.copy(pt);
        dummy.position.x += (Math.random() - 0.5) * (isPresenzano ? 0.08 : 0.12);
        dummy.position.y += (Math.random() - 0.5) * (isPresenzano ? 0.08 : 0.12);
        dummy.position.z += (Math.random() - 0.5) * (isPresenzano ? 0.08 : 0.12);
        dummy.scale.setScalar(isPresenzano ? 0.08 : 0.12);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    });
  });

  const steelMat = new THREE.MeshStandardMaterial({
    color: active ? '#f5b50b' : '#303438',
    metalness: 0.88,
    roughness: 0.28,
    emissive: active ? '#553c00' : '#000',
    emissiveIntensity: active ? 0.35 : 0
  });

  return (
    <group>
      {/* Pipelines */}
      {linesData.map((line) => (
        <mesh key={`pipe-${line.id}`} geometry={line.geometry} onClick={(e) => { e.stopPropagation(); onClick(); }} material={steelMat} castShadow />
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
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color={mode === 'generate' ? '#06b6d4' : '#10b981'} />
        </instancedMesh>
      ))}

      <Html position={[(from.x+to.x)/2, (from.y+to.y)/2 + 2, (from.z+to.z)/2]} center style={{ display: showLabels ? 'block' : 'none' }}>
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
      <Html position={[(from.x+to.x)/2, (from.y+to.y)/2 + 25 - 5, (from.z+to.z)/2]} center style={{ display: showLabels ? 'block' : 'none' }}>
        <div style={labelStyle(active, '#94a3b8')}>Yeraltı Tüneli</div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Tailrace Channel (Powerhouse outlet to Lower Basin)
   ───────────────────────────────────────────── */
function TailraceChannel({ from, to, active, onClick, showLabels }: any) {
  const { channelGeo, waterGeo } = useMemo(() => {
    const c = new THREE.LineCurve3(from, to);
    const channel = new THREE.TubeGeometry(c, 16, 0.8, 8, false);
    const water = new THREE.TubeGeometry(c, 16, 0.65, 8, false);
    return { channelGeo: channel, waterGeo: water };
  }, [from, to]);

  return (
    <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh geometry={channelGeo}>
        <meshStandardMaterial 
          color={active ? '#22d3ee' : '#64748b'} 
          roughness={0.88}
          emissive={active ? '#083344' : '#000'}
        />
      </mesh>
      <mesh geometry={waterGeo}>
        <meshPhysicalMaterial 
          color="#0891b2" 
          transparent 
          opacity={0.8} 
          transmission={0.85}
          roughness={0.1}
        />
      </mesh>
      <Html position={[(from.x+to.x)/2 + 4, (from.y+to.y)/2 + 2, (from.z+to.z)/2 - 5]} center style={{ display: showLabels ? 'block' : 'none' }}>
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
   Common Helpers
   ───────────────────────────────────────────── */
function labelStyle(active: boolean, color: string): React.CSSProperties {
  return {
    background: active ? color : 'rgba(15,20,25,0.9)',
    color: '#fff', padding: '4px 12px', borderRadius: 6,
    fontSize: 12, fontWeight: 'bold', pointerEvents: 'none',
    border: `1px solid ${color}`,
    boxShadow: active ? `0 0 15px ${color}` : '0 4px 10px rgba(0,0,0,0.5)',
    transition: 'all 0.3s',
    whiteSpace: 'nowrap'
  };
}

/* ─────────────────────────────────────────────
   Main Scene Assembly
   ───────────────────────────────────────────── */
function Scene({ siteId, activeComponent, onSelectComponent, layers, mode, componentsDetail, isPlaying, activeUnits, maxUnits, showTerrain, showLabels, terrainOpacity }: ThreeDModelProps) {
  const isPresenzano = siteId === 'presenzano';
  const d = componentsDetail;
  
  // Shared Simulation Water Levels
  const waterLevelRef = useRef(0.85);
  
  useFrame((_state, delta) => {
    if (isPlaying && activeUnits > 0) {
      const rate = 0.04 * (activeUnits / maxUnits) * delta;
      if (mode === 'generate') {
        waterLevelRef.current = clamp(waterLevelRef.current - rate, 0.05, 0.95);
      } else {
        waterLevelRef.current = clamp(waterLevelRef.current + rate, 0.05, 0.95);
      }
    }
  });

  // Calculate dynamic heights/positions aligned to terrain height field
  const upperTerrainY = getTerrainHeight(-90, 15, isPresenzano);
  const upperPos = useMemo(() => new THREE.Vector3(-90, upperTerrainY, -15), [upperTerrainY]);
  
  const surgeTankPos = useMemo(() => new THREE.Vector3(-30, getTerrainHeight(-30, 0, isPresenzano), 0), [isPresenzano]);
  
  const phTerrainY = getTerrainHeight(45, 15, isPresenzano);
  const powerhousePos = useMemo(() => new THREE.Vector3(45, phTerrainY - 2, 15), [phTerrainY]);
  
  const lowerTerrainY = getTerrainHeight(80, 30, isPresenzano);
  const lowerPos = useMemo(() => new THREE.Vector3(80, lowerTerrainY, 30), [lowerTerrainY]);

  // environment assets list
  const environmentAssets = useMemo(() => {
    const assets: Array<{ type: 'tree' | 'rock'; pos: [number, number, number]; scale: number; id: number }> = [];
    let count = 0;
    
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < 600; i++) {
      const rx = -210 + pseudoRandom(count++) * 420;
      const rz = -210 + pseudoRandom(count++) * 420;

      // Distance checks to clear the structures
      const distToUpper = Math.hypot(rx - (-90), rz - (-15));
      const distToLower = Math.hypot(rx - 80, rz - 30);
      const distToPH = Math.hypot(rx - 45, rz - 15);
      const distToSY = Math.hypot(rx - 60, rz - 5);
      const distToST = Math.hypot(rx - (-30), rz - 0);

      if (distToUpper < 45 || distToLower < 35 || distToPH < 25 || distToSY < 25 || distToST < 20) {
        continue;
      }

      const ry = getTerrainHeight(rx, rz, isPresenzano);

      // Grass/rock zone placement
      if (ry > -3 && ry < 99) {
        const type = pseudoRandom(count++) > 0.45 ? 'tree' : 'rock';
        const scale = 0.4 + pseudoRandom(count++) * 0.7;
        assets.push({ type, pos: [rx, ry, rz], scale, id: i });
      }
    }
    return assets;
  }, [isPresenzano]);

  return (
    <>
      <Sky sunPosition={[120, 30, 90]} turbidity={0.2} rayleigh={1.0} />
      <ambientLight intensity={0.45} />
      <directionalLight 
        position={[120, 150, 100]} intensity={1.8} castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-200} shadow-camera-right={200}
        shadow-camera-top={200} shadow-camera-bottom={-200}
      />
      <fog attach="fog" args={['#a2adb9', 150, 550]} />

      {showTerrain && <RealisticTerrain opacity={terrainOpacity} isPresenzano={isPresenzano} />}

      {/* Scattered Vegetation and Rocks */}
      {showTerrain && terrainOpacity >= 95 && environmentAssets.map((asset) => {
        if (asset.type === 'tree') {
          return <LowPolyTree key={asset.id} position={asset.pos} scale={asset.scale} />;
        } else {
          return <ForestRock key={asset.id} position={asset.pos} scale={asset.scale} />;
        }
      })}

      {/* Upper Reservoir & Dam */}
      {layers.upper_reservoir && (
        <RealisticUpperReservoir 
          position={upperPos}
          active={activeComponent === 'upper_reservoir'} 
          onClick={() => onSelectComponent('upper_reservoir')} 
          detail={d.upper_reservoir} 
          waterLevelRef={waterLevelRef} 
          showLabels={showLabels} 
          isPresenzano={isPresenzano}
        />
      )}
      
      {/* Lower Reservoir Basin */}
      {layers.lower_reservoir && (
        <RealisticLowerReservoir 
          position={lowerPos}
          active={activeComponent === 'lower_reservoir'} 
          onClick={() => onSelectComponent('lower_reservoir')} 
          waterLevelRef={waterLevelRef} 
          showLabels={showLabels} 
          isPresenzano={isPresenzano}
        />
      )}

      {/* Cavern Powerhouse */}
      {layers.powerhouse && (
        <RealisticPowerhouse 
          active={activeComponent === 'powerhouse'} 
          onClick={() => onSelectComponent('powerhouse')} 
          detail={d.powerhouse} 
          activeUnits={activeUnits} 
          isPlaying={isPlaying} 
          showLabels={showLabels} 
          isPresenzano={isPresenzano}
          mode={mode}
        />
      )}

      {/* Switchyard (Substation) */}
      {layers.switchyard && (
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
          powerhouseDetail={d.powerhouse}
        />
      )}

      {/* Surge Tank cylindrical concrete tower */}
      {layers.surge_tank && (
        <RealisticSurgeTank 
          position={surgeTankPos} 
          active={activeComponent === 'surge_tank'} 
          onClick={() => onSelectComponent('surge_tank')}
          showLabels={showLabels} 
        />
      )}

      {/* Steel Penstocks */}
      {layers.tunnel && (
        <RealisticPenstock 
          active={activeComponent === 'penstock'} 
          onClick={() => onSelectComponent('penstock')} 
          from={surgeTankPos} 
          to={new THREE.Vector3(powerhousePos.x, powerhousePos.y - 1.5, powerhousePos.z)} 
          isPlaying={isPlaying} 
          mode={mode} 
          activeUnits={activeUnits} 
          maxUnits={maxUnits}
          showLabels={showLabels} 
          isPresenzano={isPresenzano}
        />
      )}

      {/* Underground Concrete Tunnel */}
      {layers.tunnel && (
        <UndergroundTunnel 
          from={upperPos} 
          to={surgeTankPos} 
          active={activeComponent === 'tunnel'} 
          onClick={() => onSelectComponent('tunnel')} 
          showLabels={showLabels} 
        />
      )}

      {/* Tailrace Concrete Channel */}
      {layers.powerhouse && (
        <TailraceChannel 
          from={powerhousePos} 
          to={lowerPos} 
          active={activeComponent === 'tailrace'} 
          onClick={() => onSelectComponent('tailrace')} 
          showLabels={showLabels} 
        />
      )}

      {/* Transmission pylons and lines */}
      {layers.switchyard && <TransmissionLine isPresenzano={isPresenzano} isPlaying={isPlaying} mode={mode} activeUnits={activeUnits} />}

      <OrbitControls makeDefault enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI/2.1} minDistance={30} maxDistance={400} />
    </>
  );
}

export default function ThreeDModel(props: ThreeDModelProps) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 600, borderRadius: 16, overflow: 'hidden', background: '#0e1117' }}>
      <Canvas shadows camera={{ position: [150, 120, 180], fov: 45 }}>
        <Scene {...props} />
      </Canvas>
    </div>
  );
}
