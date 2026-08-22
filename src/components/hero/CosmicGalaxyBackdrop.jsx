import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCockpitStore } from '../../store/cockpitStore';

// ─────────────────────────────────────────────────────────────────────────────
// Texture Generators
// ─────────────────────────────────────────────────────────────────────────────

/** Pure white pinpoint star texture — tiny, crisp */
function createStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  grad.addColorStop(0,   'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.15,'rgba(220, 235, 255, 0.9)');
  grad.addColorStop(0.45,'rgba(180, 210, 255, 0.25)');
  grad.addColorStop(1,   'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 16, 16);
  const tex = new THREE.CanvasTexture(canvas);
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  return tex;
}

/** Elongated ray / streak texture for God Rays */
function createRayTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0,    'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.1,  'rgba(100, 80, 200, 0.08)');
  grad.addColorStop(0.5,  'rgba(80, 60, 180, 0.22)');
  grad.addColorStop(0.9,  'rgba(60, 40, 140, 0.06)');
  grad.addColorStop(1,    'rgba(0, 0, 0, 0)');
  // Width fade
  const hGrad = ctx.createLinearGradient(0, 0, 32, 0);
  hGrad.addColorStop(0,   'rgba(0,0,0,0)');
  hGrad.addColorStop(0.3, 'rgba(255,255,255,1)');
  hGrad.addColorStop(0.7, 'rgba(255,255,255,1)');
  hGrad.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 256);
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = hGrad;
  ctx.fillRect(0, 0, 32, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.generateMipmaps = false;
  return tex;
}

/** Soft radial glow blob for nebula */
function createNebulaTexture(r, g, b) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0,    `rgba(${r},${g},${b},0.28)`);
  grad.addColorStop(0.35, `rgba(${r},${g},${b},0.12)`);
  grad.addColorStop(0.7,  `rgba(${r},${g},${b},0.04)`);
  grad.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  return tex;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sparse Refined Starfield — tiny white pinpoints only
// ─────────────────────────────────────────────────────────────────────────────
function RefinedStarfield({ count = 700 }) {
  const ref = useRef();
  const starTex = useMemo(() => createStarTexture(), []);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(Math.random() * 2 - 1);
      const r     = 20 + Math.random() * 32;
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * 0.65;
      pos[i * 3 + 2] = -10 - Math.abs(r * Math.sin(phi) * Math.sin(theta));
      // Tiny stars — subtle variation
      siz[i] = 0.04 + Math.random() * 0.07;
    }
    return { positions: pos, sizes: siz };
  }, [count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [positions, sizes]);

  const mat = useMemo(() => new THREE.PointsMaterial({
    size: 0.08,
    map: starTex,
    color: new THREE.Color('#e8f0ff'),
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    toneMapped: false,
  }), [starTex]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Very slow drift — cinematic
    ref.current.rotation.y = clock.getElapsedTime() * 0.004;
    // Gentle twinkling via opacity
    mat.opacity = 0.65 + Math.sin(clock.getElapsedTime() * 1.2) * 0.08;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cool Midnight Nebula Clouds — deep indigo / midnight blue, very faint
// ─────────────────────────────────────────────────────────────────────────────
function CoolNebulaClouds({ gpuTier = 2 }) {
  const groupRef = useRef();

  // Cold palette textures only — midnight blue, deep indigo, steel purple
  const tex0 = useMemo(() => createNebulaTexture(30,  20,  90),  []); // Deep Indigo
  const tex1 = useMemo(() => createNebulaTexture(10,  18,  75),  []); // Midnight Blue
  const tex2 = useMemo(() => createNebulaTexture(40,  28, 110),  []); // Steel Purple
  const tex3 = useMemo(() => createNebulaTexture(8,   25,  80),  []); // Navy Void

  const clouds = useMemo(() => {
    const count = gpuTier <= 1 ? 4 : gpuTier === 2 ? 7 : 10;
    const textures = [tex0, tex1, tex2, tex3];
    const data = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.8;
      const dist  = 4 + Math.random() * 8;
      data.push({
        x:    Math.cos(angle) * dist,
        y:    Math.sin(angle) * dist * 0.5 + 0.2,
        z:    -15 - Math.random() * 5,
        size: 10 + Math.random() * 12,
        spd:  0.008 + Math.random() * 0.012,
        rot:  Math.random() * Math.PI * 2,
        tex:  textures[i % textures.length],
      });
    }
    return data;
  }, [gpuTier, tex0, tex1, tex2, tex3]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((mesh, i) => {
      const c = clouds[i];
      if (!c) return;
      mesh.rotation.z = c.rot + t * c.spd;
      const s = c.size * (1 + Math.sin(t * 0.4 + i) * 0.03);
      mesh.scale.set(s, s, 1);
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={c.tex}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Avatar God Rays — ethereal light rays emanating from behind the Avatar chest
// Creates a ghostly aura of cold violet/indigo beams, NO solid geometry
// ─────────────────────────────────────────────────────────────────────────────
function AvatarGodRays({ gpuTier = 2 }) {
  const groupRef = useRef();
  const rayTex = useMemo(() => createRayTexture(), []);

  const RAY_COUNT = gpuTier <= 1 ? 10 : gpuTier === 2 ? 16 : 22;

  // Each ray: angle offset, length scale, opacity, rotation speed
  const rays = useMemo(() => {
    const data = [];
    for (let i = 0; i < RAY_COUNT; i++) {
      const baseAngle = (i / RAY_COUNT) * Math.PI * 2;
      data.push({
        angle:   baseAngle + (Math.random() - 0.5) * 0.5,
        length:  2.5 + Math.random() * 3.5,
        opacity: 0.08 + Math.random() * 0.16,
        width:   0.15 + Math.random() * 0.25,
        phase:   Math.random() * Math.PI * 2,
        spd:     (Math.random() > 0.5 ? 1 : -1) * (0.003 + Math.random() * 0.006),
      });
    }
    return data;
  }, [RAY_COUNT]);

  // Core ambient glow behind Avatar (soft blue-violet radial bloom)
  const coreGlowTex = useMemo(() => createNebulaTexture(55, 35, 180), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Animate each ray — slow counter-rotating, pulsing
    groupRef.current.children.forEach((child, i) => {
      if (i === 0) return; // skip core glow
      const r = rays[i - 1];
      if (!r) return;
      child.rotation.z = r.angle + t * r.spd;
      // Subtle pulse on opacity
      const pulsed = r.opacity * (0.8 + Math.sin(t * 1.8 + r.phase) * 0.25);
      if (child.material) child.material.opacity = Math.max(0.02, pulsed);
    });
  });

  // Rays positioned starting from Avatar chest region (~y=0.0, behind Avatar)
  const ORIGIN_Y = 0.05;
  const ORIGIN_Z = -0.8; // slightly behind avatar

  return (
    <group ref={groupRef} position={[0, ORIGIN_Y, ORIGIN_Z]}>
      {/* Core ambient glow orb — very faint, just blue-violet haze */}
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={coreGlowTex}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* God Rays — elongated, narrow, rotating slowly outward */}
      {rays.map((r, i) => (
        <mesh
          key={i}
          rotation={[0, 0, r.angle]}
          position={[0, 0, -0.1]}
        >
          <planeGeometry args={[r.width, r.length]} />
          <meshBasicMaterial
            map={rayTex}
            transparent
            opacity={r.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CosmicGalaxyBackdrop — Master Export
//
// Clean Translucent Cosmic Space:
//   - 100% Transparent alpha canvas (HeroBackgroundTypography shows through clearly at z-0)
//   - Sparse refined starfield (pure white pinpoints, subtle twinkling)
//   - Cool midnight blue/indigo nebula clouds (soft gaseous atmosphere)
//   - Avatar God Rays — ethereal cold violet/indigo beams emanating from Avatar chest
//   - Fixed / locked in space (zero mouse parallax drift)
//   - GPU-adaptive quality
// ─────────────────────────────────────────────────────────────────────────────
export function CosmicGalaxyBackdrop({ gpuTier = 2 }) {
  const starCount = gpuTier <= 1 ? 350 : gpuTier === 2 ? 700 : 1100;

  return (
    <group name="cosmic-galaxy-backdrop" position={[0, 0, 0]}>
      {/* 1. Sparse refined starfield */}
      <RefinedStarfield count={starCount} />

      {/* 2. Cool midnight nebula clouds */}
      <CoolNebulaClouds gpuTier={gpuTier} />

      {/* 3. Avatar God Rays — aura emanating from chest */}
      <AvatarGodRays gpuTier={gpuTier} />
    </group>
  );
}

export default CosmicGalaxyBackdrop;
