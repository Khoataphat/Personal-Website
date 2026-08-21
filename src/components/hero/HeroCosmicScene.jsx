import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { getGPUTier } from 'detect-gpu';
import { useCockpitStore } from '../../store/cockpitStore';
import { BackgroundMatrix3D } from '../cockpit/BackgroundMatrix3D';
import { HeroBustAvatar } from './HeroBustAvatar';

/**
 * Telemetry tracker (FPS, UTC clock)
 */
function TelemetryTracker() {
  const setTelemetry = useCockpitStore((s) => s.setTelemetry);
  const lastUpdateRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  useFrame(() => {
    const now = performance.now();
    frameCountRef.current += 1;
    if (now - lastUpdateRef.current >= 300) {
      const elapsed = (now - lastUpdateRef.current) / 1000;
      const fps = Math.round(frameCountRef.current / elapsed);
      frameCountRef.current = 0;
      lastUpdateRef.current = now;
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, '0');
      const mm = String(d.getUTCMinutes()).padStart(2, '0');
      const ss = String(d.getUTCSeconds()).padStart(2, '0');
      setTelemetry({
        fps: Math.min(120, Math.max(1, fps)),
        latency: Math.round((performance.now() % 12) + 8),
        utcClock: `${hh}:${mm}:${ss} UTC`,
      });
    }
  });
  return null;
}

/**
 * Keyboard Orbit Controls Toggle
 * Set to `true` whenever you want to re-enable interactive WASD & QE inspection controls.
 */
const ENABLE_KEYBOARD_CONTROLS = false;

/**
 * Hero Camera Rig
 *
 * Cinematic Sovereign Low-Angle 3/4 Lock with Subtle Mouse Parallax.
 * Preserves full WASD & QE inspection orbit controls via `ENABLE_KEYBOARD_CONTROLS` toggle flag:
 *   - A / D (or ArrowLeft / ArrowRight): Horizontal 360° Orbit (Azimuth angle)
 *   - W / S (or ArrowUp / ArrowDown): Vertical Height / Pitch Angle (Polar angle)
 *   - Q / E (or PageUp / PageDown): Zoom In / Zoom Out (Distance radius)
 */
function HeroCameraRig() {
  const keysRef = useRef({
    w: false,
    s: false,
    a: false,
    d: false,
    q: false,
    e: false,
  });

  // Sovereign Low-Angle 3/4 Cinematic Lock
  // phi = Math.PI * 0.54 (subtly tilted upwards towards mask for an imposing royal presence)
  // theta = -0.22 (~12.6° subtle 3/4 angle showcasing chest, mask facets, and singularity core)
  // radius = 1.90 (close-up cinematic framing)
  const sphericalRef = useRef({
    radius: 1.90,
    phi: Math.PI * 0.54,
    theta: -0.22,
  });

  useEffect(() => {
    if (!ENABLE_KEYBOARD_CONTROLS) return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keysRef.current.w = true;
      if (key === 's' || key === 'arrowdown') keysRef.current.s = true;
      if (key === 'a' || key === 'arrowleft') keysRef.current.a = true;
      if (key === 'd' || key === 'arrowright') keysRef.current.d = true;
      if (key === 'q' || key === 'pageup') keysRef.current.q = true;
      if (key === 'e' || key === 'pagedown') keysRef.current.e = true;
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keysRef.current.w = false;
      if (key === 's' || key === 'arrowdown') keysRef.current.s = false;
      if (key === 'a' || key === 'arrowleft') keysRef.current.a = false;
      if (key === 'd' || key === 'arrowright') keysRef.current.d = false;
      if (key === 'q' || key === 'pageup') keysRef.current.q = false;
      if (key === 'e' || key === 'pagedown') keysRef.current.e = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(({ camera }, delta) => {
    const keys = keysRef.current;
    const s = sphericalRef.current;

    // Movement logic (active only when ENABLE_KEYBOARD_CONTROLS is true)
    if (ENABLE_KEYBOARD_CONTROLS) {
      const orbitSpeed = 2.0;  // rad/s
      const pitchSpeed = 1.6;  // rad/s
      const zoomSpeed = 2.4;   // units/s

      // Horizontal Orbit: A rotates left, D rotates right
      if (keys.a) s.theta -= orbitSpeed * delta;
      if (keys.d) s.theta += orbitSpeed * delta;

      // Vertical Orbit: W pitches up, S pitches down
      if (keys.w) s.phi -= pitchSpeed * delta;
      if (keys.s) s.phi += pitchSpeed * delta;
      s.phi = Math.max(0.05, Math.min(Math.PI - 0.05, s.phi));

      // Zoom: Q zooms in, E zooms out
      if (keys.q) s.radius -= zoomSpeed * delta;
      if (keys.e) s.radius += zoomSpeed * delta;
      s.radius = Math.max(0.35, Math.min(12.0, s.radius));
    }

    const mouse = useCockpitStore.getState().mouseNorm || { x: 0, y: 0 };

    const targetX = 0;
    const targetY = 0.05;
    const targetZ = 0;

    // Spherical to Cartesian calculation with subtle 3D mouse parallax
    const sinPhi = Math.sin(s.phi);
    const cosPhi = Math.cos(s.phi);
    const sinTheta = Math.sin(s.theta);
    const cosTheta = Math.cos(s.theta);

    const destX = targetX + s.radius * sinPhi * sinTheta + mouse.x * 0.045;
    const destY = targetY + s.radius * cosPhi + mouse.y * 0.035;
    const destZ = targetZ + s.radius * sinPhi * cosTheta;

    // Smooth camera transition
    const lerpFactor = Math.min(1, delta * 10);
    camera.position.x += (destX - camera.position.x) * lerpFactor;
    camera.position.y += (destY - camera.position.y) * lerpFactor;
    camera.position.z += (destZ - camera.position.z) * lerpFactor;

    camera.lookAt(targetX, targetY, targetZ);
  });

  return null;
}

/**
 * HeroCosmicScene
 *
 * Main R3F Canvas:
 *   - Background matrix deep space
 *   - HeroBustAvatar (close-up framed at AVATAR_Y = -2.85)
 *   - Cinematic Ultra Close-up Camera Rig (z = 1.95, targetY = 0.02)
 *   - Cinematic lights & adaptive Bloom postprocessing
 */
export function HeroCosmicScene() {
  const [gpuTier, setGpuTier] = useState(2);
  const setMouseNorm = useCockpitStore((s) => s.setMouseNorm);

  useEffect(() => {
    let alive = true;
    getGPUTier().then((r) => {
      if (alive && r?.tier !== undefined) setGpuTier(r.tier);
    }).catch(() => { if (alive) setGpuTier(2); });
    return () => { alive = false; };
  }, []);

  const handlePointerMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -((e.clientY / window.innerHeight) * 2 - 1);
    setMouseNorm(x, y);
  };

  const isHighTier = gpuTier >= 2;
  const particleCount = gpuTier <= 1 ? 180 : 350;

  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#070709] z-0"
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ fov: 45, position: [0, 0.02, 1.95], near: 0.1, far: 80 }}
        gl={{
          antialias: isHighTier,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={isHighTier ? [1, 1.5] : 1}
      >
        <HeroCameraRig />
        <TelemetryTracker />

        {/* Lights */}
        <ambientLight intensity={0.25} />
        <pointLight color="#00f2fe" position={[0, 3, 2.5]} intensity={3.2} />
        <pointLight color="#7928ca" position={[-2.5, 1.5, -1.5]} intensity={2.2} />
        <pointLight color="#ff8c00" position={[1.5, -0.2, 1.5]} intensity={1.5} />

        {/* Deep Space Background Matrix */}
        <BackgroundMatrix3D particleCount={particleCount} />

        {/* Dual-layer Bust Avatar (Framed at AVATAR_Y = -2.85) */}
        <Suspense fallback={null}>
          <HeroBustAvatar position={[0, -2.85, 0]} />
        </Suspense>

        {/* Adaptive Bloom */}
        {isHighTier && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.72}
              luminanceSmoothing={0.03}
              radius={0.8}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
