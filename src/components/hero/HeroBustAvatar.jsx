import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useCockpitStore } from '../../store/cockpitStore';

// ── GLB Path ──────────────────────────────────────────────────────────
const GLB_PATH = `${import.meta.env.BASE_URL}models/avatar.glb`;

// ── Wireframe color per mesh name ─────────────────────────────────────
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
};

const FILL_OPACITY = {
  'Cloth_Robe_0':   0.40,
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

const WIRE_OPACITY = {
  'Cloth_Robe_0': 0.55,
  DEFAULT:         0.85,
};

/**
 * HeroBustAvatar — dual-layer GLB hero avatar.
 *
 * Architecture: clones the entire scene, then traverses and REPLACES each mesh
 * with two children:
 *   1. LineSegments (WireframeGeometry) — colored wireframe per body part
 *   2. Mesh (original geo + semi-transparent MeshBasicMaterial) — volumetric fill
 *
 * Maze_Maze_0 (orb) is excluded — rendered as CosmicBlackHole.
 *
 * Auto-scale normalizes the clone to TARGET_HEIGHT scene units, then the
 * <primitive> renders the whole hierarchy intact.
 */
export function HeroBustAvatar({ position = [0, -2.2, 0] }) {
  const rootRef = useRef();
  const { scene } = useGLTF(GLB_PATH);

  const dualLayerScene = useMemo(() => {
    // Clone preserving full hierarchy
    const cloned = scene.clone(true);
    cloned.updateMatrixWorld(true);

    // -- Collect mesh replacements to avoid mutating while traversing --
    const replacements = [];
    cloned.traverse((child) => {
      if (!child.isMesh && !child.isSkinnedMesh) return;
      replacements.push(child);
    });

    replacements.forEach((child) => {
      const meshName = child.name;

      // Skip the orb — handled by CosmicBlackHole
      if (meshName === 'Maze_Maze_0') {
        child.visible = false;
        return;
      }

      const geo = child.geometry;
      if (!geo) return;

      // ── Layer 1: Wireframe LineSegments ──────────────────────────────
      const wireGeo = new THREE.WireframeGeometry(geo);
      const wireColor = WIRE_COLOR[meshName] ?? '#00E5FF';
      const wireOpacity = WIRE_OPACITY[meshName] ?? WIRE_OPACITY.DEFAULT;
      const wireMat = new THREE.LineBasicMaterial({
        color: wireColor,
        transparent: true,
        opacity: wireOpacity,
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

      // Add both as children to the mesh's parent, at same local transform
      const parent = child.parent ?? cloned;
      child.add(wireLines);
      child.add(fillMesh);

      // Replace the original mesh material with invisible (we render our own layers)
      child.material = new THREE.MeshBasicMaterial({ visible: false, transparent: true, opacity: 0 });
      child.material.depthWrite = false;
    });

    // -- Auto-scale: bring to TARGET_HEIGHT world units --
    const TARGET_HEIGHT = 2.8;
    const bbox = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    if (size.y > 0) {
      const s = TARGET_HEIGHT / size.y;
      cloned.scale.setScalar(s);
      console.log(`[HeroBustAvatar] BBox h=${size.y.toFixed(2)} → scale=${s.toFixed(4)}`);
    }

    return cloned;
  }, [scene]);

  // Subtle breathing levitation + mouse parallax tilt
  useFrame(({ clock }) => {
    if (!rootRef.current) return;
    const t = clock.getElapsedTime();
    const mouse = useCockpitStore.getState().mouseNorm;
    // Breathing bob
    rootRef.current.position.y = position[1] + Math.sin(t * 1.1) * 0.04;
    // Mouse-driven gentle tilt
    rootRef.current.rotation.y = mouse.x * 0.07;
    rootRef.current.rotation.x = mouse.y * -0.03;
  });

  return (
    <group ref={rootRef} position={position}>
      <primitive object={dualLayerScene} />
    </group>
  );
}

useGLTF.preload(GLB_PATH);
