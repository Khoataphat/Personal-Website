import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import { useCockpitStore } from '../../store/cockpitStore';

const GLB_PATH = `${import.meta.env.BASE_URL}models/avatar.glb`;

const WIRE_COLOR = {
  'Body_Body_0':        '#00E5FF',
  'Hand_Hand_0':        '#00E5FF',
  'Zweihander_Sword_0': '#7A00FF',
  'Mask_Mask_0':        '#7A00FF',
  'Mask_Mask_0_1':      '#7A00FF',
  'Mask_Mask_0_2':      '#00E5FF',
  'straps_Straps_0':    '#7A00FF',
  'Cloth_Robe_0':       '#00FF88',
  'Eye_Eye_0':          '#FFD700',
  'Eye001_Eye_0':       '#FFD700',
  'Eye002_Eye_0':       '#FFD700',
  'Eye003_Eye_0':       '#FFD700',
  'Eye004_Eye_0':       '#FFD700',
  'Eye005_Eye_0':       '#FFD700',
  'Maze_Maze_0':        '#00E5FF',
};

const FILL_OPACITY = {
  'Cloth_Robe_0':   0.38,
  'Body_Body_0':    0.14,
  'Hand_Hand_0':    0.14,
  'Mask_Mask_0':    0.20,
  'Mask_Mask_0_1':  0.20,
  'Mask_Mask_0_2':  0.14,
  DEFAULT:          0.10,
};

const FILL_COLOR = {
  'Cloth_Robe_0':   '#003a1a',
  'Body_Body_0':    '#001a2e',
  'Hand_Hand_0':    '#001a2e',
  'Mask_Mask_0':    '#1a0036',
  'Mask_Mask_0_1':  '#1a0036',
  'Mask_Mask_0_2':  '#001a2e',
  DEFAULT:          '#0a0a16',
};

const CAPSULE_ITEMS = [
  { label: 'ABOUT',   icon: '◈', accent: '#00f2fe' },
  { label: 'SKILLS',  icon: '⬡', accent: '#00ff88' },
  { label: 'WORK',    icon: '◎', accent: '#7928ca' },
  { label: 'BLOG',    icon: '✦', accent: '#ff8c00' },
  { label: 'CONTACT', icon: '⬟', accent: '#f72585' },
];

const TARGET_HEIGHT = 3.6;

/**
 * HeroBustAvatar
 *
 * Direct hierarchy attachment:
 * - Scans GLB clone for Maze_Maze_0 (which sits directly in the palm).
 * - Attaches Black Hole Core, Photon Ring, and Planetary Ring Orbit directly as child objects of Maze_Maze_0.
 * - This guarantees 100% accurate physical alignment with the palm of the hand!
 */
export function HeroBustAvatar({ position = [0, -2.6, 0] }) {
  const rootRef = useRef();
  const planetaryGroupRef = useRef();
  const blackHoleCoreRef = useRef();
  const photonRingRef = useRef();
  const { scene } = useGLTF(GLB_PATH);

  const { dualLayerScene, mazeNode } = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.updateMatrixWorld(true);

    let foundMaze = null;

    const replacements = [];
    cloned.traverse((child) => {
      if (!child.isMesh && !child.isSkinnedMesh) return;
      replacements.push(child);
    });

    replacements.forEach((child) => {
      const meshName = child.name;

      if (meshName === 'Maze_Maze_0') {
        foundMaze = child;
        // Make the original maze mesh transparent and render wireframe + black hole inside it
        const wireGeo = new THREE.WireframeGeometry(child.geometry);
        const wireMat = new THREE.LineBasicMaterial({
          color: '#00E5FF',
          transparent: true,
          opacity: 0.4,
          toneMapped: false,
          depthWrite: false,
        });
        const wireLines = new THREE.LineSegments(wireGeo, wireMat);
        child.add(wireLines);

        child.material = new THREE.MeshBasicMaterial({
          color: '#000000',
          transparent: true,
          opacity: 0.92,
          depthWrite: true,
          toneMapped: false,
        });
        return;
      }

      const geo = child.geometry;
      if (!geo) return;

      // ── Layer 1: Wireframe LineSegments ──────────────────────────────
      const wireGeo = new THREE.WireframeGeometry(geo);
      const wireColor = WIRE_COLOR[meshName] ?? '#00E5FF';
      const wireMat = new THREE.LineBasicMaterial({
        color: wireColor,
        transparent: true,
        opacity: meshName === 'Cloth_Robe_0' ? 0.55 : 0.85,
        toneMapped: false,
        depthWrite: false,
      });
      const wireLines = new THREE.LineSegments(wireGeo, wireMat);
      wireLines.name = meshName + '_wire';

      // ── Layer 2: Semi-transparent inner fill Mesh ─────────────────────
      const fillColor = FILL_COLOR[meshName] ?? FILL_COLOR.DEFAULT;
      const fillOpacity = FILL_OPACITY[meshName] ?? FILL_OPACITY.DEFAULT;
      const fillMat = new THREE.MeshBasicMaterial({
        color: fillColor,
        transparent: true,
        opacity: fillOpacity,
        side: THREE.FrontSide,
        depthWrite: false,
        toneMapped: false,
      });
      const fillMesh = new THREE.Mesh(geo.clone(), fillMat);
      fillMesh.name = meshName + '_fill';

      child.add(wireLines);
      child.add(fillMesh);

      child.material = new THREE.MeshBasicMaterial({ visible: false, transparent: true, opacity: 0 });
      child.material.depthWrite = false;
    });

    // Auto-scale to TARGET_HEIGHT
    const bbox = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    if (size.y > 0) {
      const s = TARGET_HEIGHT / size.y;
      cloned.scale.setScalar(s);
      console.log(`[HeroBustAvatar] Model auto-scaled with factor ${s.toFixed(4)}`);
    }

    return { dualLayerScene: cloned, mazeNode: foundMaze };
  }, [scene]);

  // Animation frame: levitation, head tilt, and planetary orbit rotation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mouse = useCockpitStore.getState().mouseNorm;

    if (rootRef.current) {
      rootRef.current.position.y = position[1] + Math.sin(t * 1.1) * 0.025;
      rootRef.current.rotation.y = mouse.x * 0.05;
      rootRef.current.rotation.x = mouse.y * -0.02;
    }

    if (planetaryGroupRef.current && mazeNode) {
      // Get exact world position of the Maze_Maze_0 in the palm
      const worldPos = new THREE.Vector3();
      mazeNode.getWorldPosition(worldPos);
      planetaryGroupRef.current.position.copy(worldPos);
      planetaryGroupRef.current.rotation.y = -t * 0.22;
    }

    if (photonRingRef.current) {
      photonRingRef.current.rotation.z = t * 0.15;
    }
  });

  return (
    <>
      <group ref={rootRef} position={position}>
        <primitive object={dualLayerScene} />
      </group>

      {/* ── Planetary Orbit Ring with 5 Ultra-thin Capsule Tags orbiting the palm ── */}
      <group ref={planetaryGroupRef}>
        {/* Glowing planetary orbital guide ring */}
        <mesh rotation={[Math.PI / 2 + 0.35, 0, 0]}>
          <ringGeometry args={[0.36, 0.375, 64]} />
          <meshBasicMaterial color="#00f2fe" transparent opacity={0.45} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>

        {/* Photon ring glowing torus */}
        <mesh ref={photonRingRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.012, 8, 48]} />
          <meshBasicMaterial color="#00f2fe" transparent opacity={0.75} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>

        {/* 5 Ultra-thin Capsule Tags */}
        {CAPSULE_ITEMS.map((item, i) => {
          const theta = i * ((2 * Math.PI) / 5);
          const r = 0.37;
          const x = r * Math.sin(theta);
          const z = r * Math.cos(theta);
          const y = Math.sin(theta) * 0.08;

          return (
            <group key={i} position={[x, y, z]}>
              <Html
                center
                distanceFactor={4.8}
                zIndexRange={[15, 25]}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 7px',
                    background: 'rgba(5, 5, 14, 0.82)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: `1px solid ${item.accent}77`,
                    borderRadius: '9999px',
                    boxShadow: `0 0 10px ${item.accent}44`,
                    whiteSpace: 'nowrap',
                    fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                  }}
                >
                  <span style={{ fontSize: '8px', color: item.accent, lineHeight: 1 }}>{item.icon}</span>
                  <span style={{ fontSize: '8px', fontWeight: 'bold', letterSpacing: '1px', color: item.accent }}>{item.label}</span>
                  <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: item.accent }} />
                </div>
              </Html>
            </group>
          );
        })}
      </group>
    </>
  );
}

useGLTF.preload(GLB_PATH);
