import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const PARTICLE_COUNT = 350;

/**
 * CosmicBlackHole
 *
 * A compact, refined black hole centerpiece positioned directly in the palm of the avatar.
 * Layers:
 *   1. Dark event horizon core sphere
 *   2. Glowing photon ring torus
 *   3. Inner warm accretion ring
 *   4. Micro-particle accretion vortex
 */
export function CosmicBlackHole({ position = [0, 0, 0], radius = 0.065 }) {
  const particlesRef = useRef();
  const photonRingRef = useRef();
  const coreRef = useRef();
  const innerRingRef = useRef();

  // ── Accretion disc particles ──────────────────────────────────────────
  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const siz = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = i / PARTICLE_COUNT;
      const angle = t * Math.PI * 18;
      const diskRadius = radius * (1.15 + t * 2.8);
      const heightSpread = (Math.random() - 0.5) * 0.015 * (1 + t * 2);

      pos[i * 3 + 0] = diskRadius * Math.cos(angle) + (Math.random() - 0.5) * 0.015;
      pos[i * 3 + 1] = heightSpread;
      pos[i * 3 + 2] = diskRadius * Math.sin(angle) + (Math.random() - 0.5) * 0.015;

      const heat = 1 - t;
      if (heat > 0.7) {
        const mix = (heat - 0.7) / 0.3;
        col[i * 3 + 0] = mix * 1.0 + (1 - mix) * 0.0;
        col[i * 3 + 1] = mix * 1.0 + (1 - mix) * 0.9;
        col[i * 3 + 2] = 1.0;
      } else if (heat > 0.35) {
        const mix = (heat - 0.35) / 0.35;
        col[i * 3 + 0] = mix * 0.0 + (1 - mix) * 0.47;
        col[i * 3 + 1] = mix * 0.9 + (1 - mix) * 0.16;
        col[i * 3 + 2] = mix * 1.0 + (1 - mix) * 0.79;
      } else {
        const mix = heat / 0.35;
        col[i * 3 + 0] = mix * 0.47 + (1 - mix) * 0.15;
        col[i * 3 + 1] = mix * 0.16 + (1 - mix) * 0.02;
        col[i * 3 + 2] = mix * 0.79 + (1 - mix) * 0.35;
      }

      siz[i] = heat * 0.008 + 0.002;
    }

    return { positions: pos, colors: col, sizes: siz };
  }, [radius]);

  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  const particleMat = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(0,242,254,0.85)');
    grad.addColorStop(0.7, 'rgba(121,40,202,0.4)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const texture = new THREE.CanvasTexture(canvas);

    return new THREE.PointsMaterial({
      size: 0.008,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      toneMapped: false,
    });
  }, []);

  const photonRingMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#00f2fe',
    transparent: true,
    opacity: 0.75,
    toneMapped: false,
    side: THREE.DoubleSide,
  }), []);
  const photonRingGeo = useMemo(() => new THREE.TorusGeometry(radius * 1.12, radius * 0.045, 8, 48), [radius]);

  const innerRingMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#ff8c00',
    transparent: true,
    opacity: 0.6,
    toneMapped: false,
    side: THREE.DoubleSide,
  }), []);
  const innerRingGeo = useMemo(() => new THREE.TorusGeometry(radius * 0.85, radius * 0.03, 8, 48), [radius]);

  const coreMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#000000',
    toneMapped: false,
  }), []);
  const coreGeo = useMemo(() => new THREE.SphereGeometry(radius * 0.75, 24, 24), [radius]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (particlesRef.current) {
      particlesRef.current.rotation.y = -t * 0.35;
      particlesRef.current.material.opacity = 0.8 + Math.sin(t * 2.5) * 0.15;
    }
    if (photonRingRef.current) {
      photonRingRef.current.material.opacity = 0.6 + Math.sin(t * 3.5) * 0.25;
      photonRingRef.current.rotation.z = t * 0.1;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.2;
      innerRingRef.current.material.opacity = 0.45 + Math.sin(t * 2.8 + 1) * 0.2;
    }
    if (coreRef.current) {
      const s = 1.0 + Math.sin(t * 6) * 0.015;
      coreRef.current.scale.setScalar(s);
    }
  });

  const DISC_TILT = THREE.MathUtils.degToRad(30);

  return (
    <group position={position}>
      {/* Dark event horizon core */}
      <mesh ref={coreRef} geometry={coreGeo} material={coreMat} renderOrder={1} />

      {/* Photon ring */}
      <mesh
        ref={photonRingRef}
        geometry={photonRingGeo}
        material={photonRingMat}
        rotation={[Math.PI / 2, 0, 0]}
        renderOrder={2}
      />

      {/* Inner warm ring */}
      <mesh
        ref={innerRingRef}
        geometry={innerRingGeo}
        material={innerRingMat}
        rotation={[Math.PI / 2 + 0.15, 0, 0]}
        renderOrder={2}
      />

      {/* Accretion disc particle vortex */}
      <points
        ref={particlesRef}
        geometry={particleGeo}
        material={particleMat}
        rotation={[DISC_TILT, 0, 0]}
        renderOrder={3}
      />
    </group>
  );
}
