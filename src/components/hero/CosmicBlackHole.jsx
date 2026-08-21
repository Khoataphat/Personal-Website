import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const PARTICLE_COUNT = 700;

/**
 * CosmicBlackHole
 *
 * A black hole centerpiece positioned at the orb/hands of the avatar.
 * Three layers:
 *   1. Dark event horizon core sphere (absorbs light)
 *   2. Photon ring glow (thin glowing torus around the core)
 *   3. Accretion disc particle vortex (700 particles spiraling inward on a tilted disc)
 *
 * Position should match roughly where Maze_Maze_0 is on the avatar model.
 */
export function CosmicBlackHole({ position = [0, 0.0, 0], radius = 0.28 }) {
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
      // Distribute particles on a logarithmic spiral disc
      // Inner particles spiral tightly, outer ones more spread
      const t = i / PARTICLE_COUNT;
      const angle = t * Math.PI * 24; // multiple full revolutions
      const diskRadius = radius * (1.15 + t * 4.2); // from just outside core to far out
      const heightSpread = (Math.random() - 0.5) * 0.04 * (1 + t * 2); // flatter near center

      pos[i * 3 + 0] = diskRadius * Math.cos(angle) + (Math.random() - 0.5) * 0.04;
      pos[i * 3 + 1] = heightSpread;
      pos[i * 3 + 2] = diskRadius * Math.sin(angle) + (Math.random() - 0.5) * 0.04;

      // Color gradient: inner = white/cyan hot, outer = orange/red cooler
      const heat = 1 - t; // 1 = innermost, 0 = outermost
      if (heat > 0.7) {
        // Inner hot zone: white → cyan
        const mix = (heat - 0.7) / 0.3;
        col[i * 3 + 0] = mix * 1.0 + (1 - mix) * 0.0;   // R
        col[i * 3 + 1] = mix * 1.0 + (1 - mix) * 0.9;   // G
        col[i * 3 + 2] = 1.0;                              // B
      } else if (heat > 0.35) {
        // Mid zone: cyan → violet
        const mix = (heat - 0.35) / 0.35;
        col[i * 3 + 0] = mix * 0.0 + (1 - mix) * 0.47;  // R
        col[i * 3 + 1] = mix * 0.9 + (1 - mix) * 0.16;  // G
        col[i * 3 + 2] = mix * 1.0 + (1 - mix) * 0.79;  // B
      } else {
        // Outer cool zone: violet → deep purple/dark
        const mix = heat / 0.35;
        col[i * 3 + 0] = mix * 0.47 + (1 - mix) * 0.15; // R
        col[i * 3 + 1] = mix * 0.16 + (1 - mix) * 0.02; // G
        col[i * 3 + 2] = mix * 0.79 + (1 - mix) * 0.35; // B
      }

      // Size: innermost particles slightly larger (hotter/brighter)
      siz[i] = heat * 0.015 + 0.004;
    }

    return { positions: pos, colors: col, sizes: siz };
  }, [radius]);

  // ── Particle geometry ─────────────────────────────────────────────────
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  // ── Particle material with custom glowing circle texture ─────────────
  const particleMat = useMemo(() => {
    // Create a soft glowing circle canvas texture for each particle
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(0,242,254,0.8)');
    grad.addColorStop(0.7, 'rgba(121,40,202,0.4)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);

    return new THREE.PointsMaterial({
      size: 0.012,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      toneMapped: false,
    });
  }, []);

  // ── Photon ring (glowing torus) ───────────────────────────────────────
  const photonRingMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#00f2fe',
    transparent: true,
    opacity: 0.65,
    toneMapped: false,
    side: THREE.DoubleSide,
  }), []);

  const photonRingGeo = useMemo(() => new THREE.TorusGeometry(radius * 1.08, radius * 0.04, 8, 64), [radius]);

  // ── Inner warm ring (orange/gold) ─────────────────────────────────────
  const innerRingMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#ff8c00',
    transparent: true,
    opacity: 0.5,
    toneMapped: false,
    side: THREE.DoubleSide,
  }), []);
  const innerRingGeo = useMemo(() => new THREE.TorusGeometry(radius * 0.82, radius * 0.025, 8, 64), [radius]);

  // ── Event horizon core (dark sphere that blocks everything) ──────────
  const coreMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#000000',
    toneMapped: false,
  }), []);
  const coreGeo = useMemo(() => new THREE.SphereGeometry(radius * 0.72, 32, 32), [radius]);

  // ── Animation: disc tilt = 35°, spin, particles spiral in ────────────
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (particlesRef.current) {
      // Spin the accretion disc counter-clockwise (looking from top)
      particlesRef.current.rotation.y = -t * 0.22;

      // Particle breathing — slight pulsation on opacity
      const mat = particlesRef.current.material;
      mat.opacity = 0.72 + Math.sin(t * 2.1) * 0.13;
    }

    if (photonRingRef.current) {
      // Photon ring pulses and slowly precesses
      photonRingRef.current.material.opacity = 0.5 + Math.sin(t * 3.4) * 0.2;
      photonRingRef.current.rotation.z = t * 0.08;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.15;
      innerRingRef.current.material.opacity = 0.35 + Math.sin(t * 2.7 + 1) * 0.15;
    }

    if (coreRef.current) {
      // Subtle core pulse (gravitational lensing shimmer)
      const s = 1.0 + Math.sin(t * 5) * 0.012;
      coreRef.current.scale.setScalar(s);
    }
  });

  // Disc tilt angle: ~35 degrees off horizontal (like a real accretion disc)
  const DISC_TILT = THREE.MathUtils.degToRad(35);

  return (
    <group position={position}>
      {/* Dark event horizon core */}
      <mesh ref={coreRef} geometry={coreGeo} material={coreMat} renderOrder={1} />

      {/* Photon ring (equatorial plane, slightly tilted) */}
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

      {/* Accretion disc particle vortex — tilted 35° */}
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
