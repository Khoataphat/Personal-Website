/**
 * HologramModel.jsx
 * Renders a GLB model as a neon wireframe hologram.
 * Features:
 *  - Mouse tracking: whole model tilts toward cursor
 *  - Float animation: model bobs gently in place
 *  - Bloom postprocessing: neon glow effect
 *  - Scan line: animated horizontal light sweep
 *
 * Usage in Hero.jsx:
 *   <HologramModel url="/models/avatar.glb" className="absolute inset-0" />
 */

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// ─── Config ────────────────────────────────────────────────────────────────
const WIRE_COLOR  = '#d946ef'; // Neon magenta-purple
const SCAN_COLOR  = '#f0abfc'; // Scan line color
const MODEL_URL   = '/models/avatar.glb'; // ← Change to your GLB filename here

// ─── Wireframe Scene ─────────────────────────────────────────────────────────
function WireframeScene({ url }) {
  const { scene } = useGLTF(url);

  const wireMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(WIRE_COLOR),
        wireframe: true,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
      }),
    []
  );

  useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map(() => wireMaterial);
        } else {
          child.material = wireMaterial;
        }
        child.castShadow    = false;
        child.receiveShadow = false;
      }
    });
  }, [scene, wireMaterial]);

  return <primitive object={scene} />;
}

// ─── Scan Line ───────────────────────────────────────────────────────────────
function ScanLine({ modelHeight = 3.5 }) {
  const meshRef = useRef(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = (clock.getElapsedTime() * 0.4) % 1;
    meshRef.current.position.y = THREE.MathUtils.lerp(
      modelHeight / 2,
      -modelHeight / 2,
      t
    );
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1.4, 0.012]} />
      <meshBasicMaterial
        color={SCAN_COLOR}
        transparent
        opacity={0.55}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Interactive Character ────────────────────────────────────────────────────
function InteractiveCharacter({ url, position, modelHeight }) {
  const groupRef = useRef(null);

  useFrame(({ pointer }) => {
    if (!groupRef.current) return;
    const targetY = (pointer.x * Math.PI) / 9;
    const targetX = (-pointer.y * Math.PI) / 18;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, targetY, 0.045
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, targetX, 0.045
    );
  });

  return (
    <group ref={groupRef} position={position}>
      <Float speed={1.6} rotationIntensity={0.08} floatIntensity={0.35}>
        <WireframeScene url={url} />
        <ScanLine modelHeight={modelHeight} />
      </Float>
    </group>
  );
}

// ─── Main Scene ───────────────────────────────────────────────────────────────
function HologramScene({ url, position, modelHeight }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <Stars radius={80} depth={40} count={2500} factor={3.5} saturation={0} fade speed={0.6} />
      <InteractiveCharacter url={url} position={position} modelHeight={modelHeight} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.05} luminanceSmoothing={0.85} intensity={1.8} radius={0.6} />
      </EffectComposer>
    </>
  );
}

// ─── Public Export ────────────────────────────────────────────────────────────
/**
 * HologramModel
 * Props:
 *   url         {string}   Path to GLB file in /public   default: '/models/avatar.glb'
 *   className   {string}   Extra CSS classes for wrapper div
 *   position    {number[]} [x, y, z] model position       default: [0, -1.6, 0]
 *   modelHeight {number}   Approx model height (scan line) default: 3.5
 *   fov         {number}   Camera field of view           default: 42
 *   cameraZ     {number}   Camera distance                default: 4.5
 */
export default function HologramModel({
  url         = MODEL_URL,
  className   = '',
  position    = [0, -1.6, 0],
  modelHeight = 3.5,
  fov         = 42,
  cameraZ     = 4.5,
}) {
  return (
    <div className={w-full h-full } style={{ pointerEvents: 'auto' }}>
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <HologramScene url={url} position={position} modelHeight={modelHeight} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
