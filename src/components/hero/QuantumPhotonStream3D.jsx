import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCockpitStore } from '../../store/cockpitStore';

// ── Circular Soft Glow Point Particle GLSL Shader ─────────────────
const PARTICLE_VERTEX_SHADER = `
attribute float aSize;
attribute float aAlpha;
attribute vec3 aCustomColor;

varying vec3 vColor;
varying float vAlpha;
uniform float uIntensity;

void main() {
  vColor = aCustomColor;
  vAlpha = aAlpha * uIntensity;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (260.0 / -mvPosition.z) * uIntensity;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const PARTICLE_FRAGMENT_SHADER = `
varying vec3 vColor;
varying float vAlpha;

void main() {
  if (vAlpha < 0.005) discard;

  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;

  // Gaussian Corona Falloff + White-hot Core
  float glow = exp(-dist * dist * 14.0);
  float core = smoothstep(0.20, 0.0, dist);
  
  vec3 finalColor = vColor + vec3(core * 0.90);
  float alpha = (glow * 0.80 + core * 0.20) * vAlpha;

  gl_FragColor = vec4(finalColor, alpha);
}
`;

// ── 6 Distinct Stream Specifications Fanning to Modal Border ────────
const STREAM_DEFINITIONS = [
  { id: 0, targetY: 0.42,  archY: 0.22,  turbScale: 0.035, speedMult: 0.95 }, // Top high-arch stream
  { id: 1, targetY: 0.22,  archY: 0.08,  turbScale: 0.025, speedMult: 1.10 }, // Upper-mid waving stream
  { id: 2, targetY: 0.02,  archY: 0.00,  turbScale: 0.015, speedMult: 1.25 }, // Center high-speed direct beam
  { id: 3, targetY: -0.18, archY: -0.08, turbScale: 0.025, speedMult: 1.05 }, // Lower-mid waving stream
  { id: 4, targetY: -0.38, archY: -0.20, turbScale: 0.035, speedMult: 0.90 }, // Bottom low-arch stream
  { id: 5, targetY: 0.00,  archY: 0.00,  turbScale: 0.070, speedMult: 1.15, isHelical: true }, // Cosmic spiral swirl stream
];

/**
 * QuantumPhotonStream3D
 * 
 * Multi-stream 3D photon particle system:
 * - Originates dead-center from the 3D Singularity Orb core in real-time world coordinates
 * - Emits across 6 distinct flowing particle streams / filaments with unique trajectories
 * - 180 glowing quantum particles with circular corona glow and additive blending
 * - 60 FPS single draw call
 */
export function QuantumPhotonStream3D() {
  const pointsRef = useRef(null);
  const matRef = useRef(null);

  const isDossierOpen = useCockpitStore((s) => s.isDossierOpen);
  const activeThemeAccent = useCockpitStore((s) => s.activeThemeAccent || '#00f2fe');
  const activeThemeSecondary = useCockpitStore((s) => s.activeThemeSecondary || '#818cf8');

  // Particle System Data Initialization
  const particleData = useMemo(() => {
    const count = 180;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);

    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    const streamIds = new Float32Array(count);
    const radialSpawnOffsets = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const baseSizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const streamId = i % STREAM_DEFINITIONS.length;
      streamIds[i] = streamId;

      const streamCfg = STREAM_DEFINITIONS[streamId];
      speeds[i] = (0.32 + (i % 5) * 0.07) * streamCfg.speedMult;
      offsets[i] = (i / count);
      seeds[i] = i * 1.618;
      baseSizes[i] = 0.022 + (i % 4) * 0.008;

      // Small spawn volume within orb core (radius ~0.035)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = Math.random() * 0.035;
      radialSpawnOffsets[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      radialSpawnOffsets[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      radialSpawnOffsets[i * 3 + 2] = r * Math.cos(phi);

      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      sizes[i] = baseSizes[i];
      alphas[i] = 0.0;
    }

    return {
      count,
      positions,
      colors,
      sizes,
      alphas,
      speeds,
      offsets,
      streamIds,
      radialSpawnOffsets,
      seeds,
      baseSizes,
    };
  }, []);

  const uniforms = useMemo(
    () => ({
      uIntensity: { value: 0 },
    }),
    []
  );

  const primaryCol = useMemo(() => new THREE.Color(activeThemeAccent), [activeThemeAccent]);
  const secondaryCol = useMemo(() => new THREE.Color(activeThemeSecondary), [activeThemeSecondary]);
  const whiteCol = useMemo(() => new THREE.Color('#ffffff'), []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !matRef.current) return;

    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    const targetIntensity = isDossierOpen && isDesktop ? 1.0 : 0.0;

    uniforms.uIntensity.value = THREE.MathUtils.lerp(
      uniforms.uIntensity.value,
      targetIntensity,
      Math.min(1, delta * 5.0)
    );

    if (uniforms.uIntensity.value <= 0.001) return;

    const t = state.clock.getElapsedTime();
    const orbWorld = useCockpitStore.getState().orbWorldPos || { x: 0.0, y: -0.28, z: 0.42 };

    const {
      count,
      positions,
      colors,
      sizes,
      alphas,
      speeds,
      offsets,
      streamIds,
      radialSpawnOffsets,
      seeds,
      baseSizes,
    } = particleData;

    // Target terminal coordinates at Obsidian Glass modal border
    const targetBaseX = -0.72;
    const targetBaseZ = 0.18;

    const tempCol = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const sId = streamIds[i];
      const streamCfg = STREAM_DEFINITIONS[sId];

      // Exact live 3D Origin in sphere core
      const startX = orbWorld.x + radialSpawnOffsets[i * 3];
      const startY = orbWorld.y + radialSpawnOffsets[i * 3 + 1];
      const startZ = orbWorld.z + radialSpawnOffsets[i * 3 + 2];

      const endX = targetBaseX;
      const endY = streamCfg.targetY;
      const endZ = targetBaseZ;

      // Progress along trajectory: 0.0 -> 1.0
      const progress = (t * speeds[i] + offsets[i]) % 1.0;
      const envelope = Math.sin(progress * Math.PI);

      let curveX = THREE.MathUtils.lerp(startX, endX, progress);
      let curveY = THREE.MathUtils.lerp(startY, endY, progress);
      let curveZ = THREE.MathUtils.lerp(startZ, endZ, progress);

      // Trajectory Arcs & Stream-Specific Turbulence
      if (streamCfg.isHelical) {
        // Double-Helix Spiral Swirl
        const spiralAngle = progress * Math.PI * 6.0 + seeds[i] + t * 3.0;
        const spiralRadius = 0.065 * envelope;
        curveY += Math.sin(spiralAngle) * spiralRadius;
        curveZ += Math.cos(spiralAngle) * spiralRadius;
      } else {
        // Smooth Bezier Arch + Stream Turbulence
        const archOffset = streamCfg.archY * envelope;
        const wave = Math.sin(progress * Math.PI * 2.0 + seeds[i] + t * 2.2) * streamCfg.turbScale * envelope;
        curveY += archOffset + wave;
        curveZ += Math.cos(progress * Math.PI + seeds[i] + t * 1.6) * streamCfg.turbScale * envelope;
      }

      positions[i * 3] = curveX;
      positions[i * 3 + 1] = curveY;
      positions[i * 3 + 2] = curveZ;

      // Color Interpolation per particle
      const mixRatio = (i % 6) / 5.0;
      if (sId === 2) {
        // Center direct beam has brilliant white-hot core
        tempCol.copy(whiteCol).lerp(primaryCol, 0.40);
      } else if (mixRatio < 0.3) {
        tempCol.copy(whiteCol).lerp(primaryCol, 0.60);
      } else {
        tempCol.copy(primaryCol).lerp(secondaryCol, mixRatio);
      }

      colors[i * 3] = tempCol.r;
      colors[i * 3 + 1] = tempCol.g;
      colors[i * 3 + 2] = tempCol.b;

      // Twinkle and Pulsing Size
      const pulse = 0.75 + 0.35 * Math.sin(t * 7.0 + seeds[i]);
      sizes[i] = baseSizes[i] * pulse * (0.5 + envelope * 0.8);

      // Alpha: Emerges from core, glows bright in flight, dissolves at panel
      alphas[i] = Math.pow(envelope, 0.70) * (0.75 + 0.25 * Math.sin(t * 9.0 + seeds[i]));
    }

    const geo = pointsRef.current.geometry;
    geo.attributes.position.needsUpdate = true;
    geo.attributes.aCustomColor.needsUpdate = true;
    geo.attributes.aSize.needsUpdate = true;
    geo.attributes.aAlpha.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleData.count}
          array={particleData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aCustomColor"
          count={particleData.count}
          array={particleData.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={particleData.count}
          array={particleData.sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aAlpha"
          count={particleData.count}
          array={particleData.alphas}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={PARTICLE_VERTEX_SHADER}
        fragmentShader={PARTICLE_FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
