import React, { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { getGPUTier } from 'detect-gpu';
import { useCockpitStore } from '../../store/cockpitStore';
import { CosmicGalaxyBackdrop } from './CosmicGalaxyBackdrop';
import { HeroBustAvatar } from './HeroBustAvatar';
import { QuantumPhotonStream3D } from './QuantumPhotonStream3D';
import { cutsceneDirector } from '../../services/cutscene';

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
 * Keyboard & Pointer Orbit Controls Toggle
 * Set to `true` to enable full interactive 360° inspection controls (WASD, QE, Drag, Wheel).
 */
const ENABLE_KEYBOARD_CONTROLS = false;

const DEFAULT_SPHERICAL = {
  radius: 1.90,
  phi: Math.PI * 0.54,
  theta: -0.22,
};

/**
 * Hero Camera Rig
 *
 * Full Interactive Inspection & Cinematic Sovereign Framing:
 *   - A / D (or ArrowLeft / ArrowRight): Horizontal 360° Orbit (Azimuth angle)
 *   - W / S (or ArrowUp / ArrowDown): Vertical Height / Pitch Angle (Polar angle)
 *   - Q / E (or PageUp / PageDown): Zoom In / Zoom Out (Distance radius)
 *   - R: Reset camera position to default Sovereign Framing
 *   - Pointer Drag (Left Click Drag): Free 360° Orbit Navigation
 *   - Wheel Scroll: Smooth Optical Zoom In / Out
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

  const sphericalRef = useRef({ ...DEFAULT_SPHERICAL });
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const currentShiftXRef = useRef(0);

  useEffect(() => {
    if (!ENABLE_KEYBOARD_CONTROLS) return;

    const handleKeyDown = (e) => {
      // Ignore keyboard navigation if typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keysRef.current.w = true;
      if (key === 's' || key === 'arrowdown') keysRef.current.s = true;
      if (key === 'a' || key === 'arrowleft') keysRef.current.a = true;
      if (key === 'd' || key === 'arrowright') keysRef.current.d = true;
      if (key === 'q' || key === 'pageup') keysRef.current.q = true;
      if (key === 'e' || key === 'pagedown') keysRef.current.e = true;

      // Reset camera to default pose
      if (key === 'r') {
        sphericalRef.current.radius = DEFAULT_SPHERICAL.radius;
        sphericalRef.current.phi = DEFAULT_SPHERICAL.phi;
        sphericalRef.current.theta = DEFAULT_SPHERICAL.theta;
      }
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

    const handlePointerDown = (e) => {
      // Only drag with primary left mouse button or single touch
      if (e.button !== 0 && e.button !== undefined) return;
      // Do not initiate camera drag if user clicks a button, link, or modal
      if (e.target.closest('button, a, input, [role="button"], .modal-content')) return;

      const state = useCockpitStore.getState();
      if (state.isCardExpanded || state.activeProjectModal || state.activeBlogModal || state.activePdfUrl) return;

      isDraggingRef.current = true;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevPointerRef.current.x;
      const deltaY = e.clientY - prevPointerRef.current.y;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };

      const s = sphericalRef.current;
      s.theta -= deltaX * 0.0055;
      s.phi -= deltaY * 0.0050;
      s.phi = Math.max(0.08, Math.min(Math.PI - 0.08, s.phi));
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e) => {
      const state = useCockpitStore.getState();
      if (state.isCardExpanded || state.activeProjectModal || state.activeBlogModal || state.activePdfUrl) return;

      const s = sphericalRef.current;
      s.radius += e.deltaY * 0.0018;
      s.radius = Math.max(0.40, Math.min(5.5, s.radius));
    };

    window.resetHeroCamera = () => {
      sphericalRef.current.radius = DEFAULT_SPHERICAL.radius;
      sphericalRef.current.phi = DEFAULT_SPHERICAL.phi;
      sphericalRef.current.theta = DEFAULT_SPHERICAL.theta;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('wheel', handleWheel);
      delete window.resetHeroCamera;
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
      s.phi = Math.max(0.08, Math.min(Math.PI - 0.08, s.phi));

      // Zoom: Q zooms in, E zooms out
      if (keys.q) s.radius -= zoomSpeed * delta;
      if (keys.e) s.radius += zoomSpeed * delta;
      s.radius = Math.max(0.40, Math.min(5.5, s.radius));
    }

    const isDossierOpen = useCockpitStore.getState().isDossierOpen;
    const heroTransition = useCockpitStore.getState().heroTransition;
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

    // Smoothly adapt target spherical values based on Split Stage vs Sovereign Hero vs Cutscene
    let targetRadius = DEFAULT_SPHERICAL.radius;
    let targetPhi = DEFAULT_SPHERICAL.phi;
    let targetTheta = DEFAULT_SPHERICAL.theta;
    let targetX = 0;
    let targetY = 0.05;
    let targetShiftX = 0;
    let shakeOffset = { x: 0, y: 0, z: 0 };
    let cameraSpeedFactor = 3.5;

    const cutsceneState = cutsceneDirector.getCurrentState();

    if (cutsceneDirector.active && cutsceneState?.camera) {
      const cam = cutsceneState.camera;
      targetRadius = cam.radius;
      targetPhi = cam.phi;
      targetTheta = cam.theta;
      targetY = cam.targetY;
      targetShiftX = cam.targetShiftX ?? 0;
      shakeOffset = cam.shakeOffset || { x: 0, y: 0, z: 0 };
      cameraSpeedFactor = cam.speedFactor || 5.5;

      if (cam.fov && Math.abs(camera.fov - cam.fov) > 0.01) {
        camera.fov = cam.fov;
        camera.updateProjectionMatrix();
      }
    } else if (isDossierOpen) {
      if (camera.fov !== 45) {
        camera.fov = 45;
        camera.updateProjectionMatrix();
      }
      if (isDesktop) {
        // True Frontal Square View (Z-axis 100% perpendicular to chest) + Asymmetric Camera Frustum Shift
        targetRadius = 2.05;
        targetPhi = Math.PI * 0.50; // Dead eye level
        targetTheta = 0.0;          // 100% frontal, zero orbit angle
        targetX = 0;
        targetY = 0.05;
        // Shift frustum projection so model sits at ~76.5% viewport with ZERO oblique distortion
        targetShiftX = -(window.innerWidth * 0.265);
      } else {
        // Mobile Full Drawer: Lift avatar slightly to head level
        targetRadius = 2.45;
        targetPhi = Math.PI * 0.51;
        targetTheta = -0.10;
        targetX = 0;
        targetY = 0.18;
        targetShiftX = 0;
      }
    } else if (camera.fov !== 45) {
      camera.fov = 45;
      camera.updateProjectionMatrix();
    }

    if (!ENABLE_KEYBOARD_CONTROLS && !isDraggingRef.current) {
      s.radius += (targetRadius - s.radius) * Math.min(1, delta * cameraSpeedFactor);
      s.phi += (targetPhi - s.phi) * Math.min(1, delta * cameraSpeedFactor);
      s.theta += (targetTheta - s.theta) * Math.min(1, delta * cameraSpeedFactor);
    }

    // Smooth Asymmetric Frustum Shift
    currentShiftXRef.current = THREE.MathUtils.lerp(
      currentShiftXRef.current,
      targetShiftX,
      Math.min(1, delta * 7.5)
    );

    if (Math.abs(currentShiftXRef.current) > 1.0 && typeof window !== 'undefined') {
      camera.setViewOffset(
        window.innerWidth,
        window.innerHeight,
        currentShiftXRef.current,
        0,
        window.innerWidth,
        window.innerHeight
      );
    } else if (camera.view !== null) {
      camera.clearViewOffset();
    }

    const targetZ = 0;

    // Spherical to Cartesian calculation
    const sinPhi = Math.sin(s.phi);
    const cosPhi = Math.cos(s.phi);
    const sinTheta = Math.sin(s.theta);
    const cosTheta = Math.cos(s.theta);

    // Fixed Sovereign Framing (zero camera mouse drift) + Dynamic Impact Shake
    const destX = targetX + s.radius * sinPhi * sinTheta + shakeOffset.x;
    const destY = targetY + s.radius * cosPhi + shakeOffset.y;
    const destZ = targetZ + s.radius * sinPhi * cosTheta + shakeOffset.z;

    // Smooth camera transition
    const lerpFactor = Math.min(1, delta * 9);
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
 *   - Dynamic Reactor Core Lighting tied to activeThemeAccent
 *   - Reading Performance Shield with Adaptive DPR
 *   - Cinematic lights & adaptive Bloom postprocessing
 */
export function HeroCosmicScene() {
  const [gpuTier, setGpuTier] = useState(2);
  const setMouseNorm = useCockpitStore((s) => s.setMouseNorm);
  const setMouseInactive = useCockpitStore((s) => s.setMouseInactive);
  const isDossierOpen = useCockpitStore((s) => s.isDossierOpen);
  const activeThemeAccent = useCockpitStore((s) => s.activeThemeAccent || '#00f2fe');
  const heroTransitionPhase = useCockpitStore((s) => s.heroTransition?.phase);

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
  // Phase 4 (crush): reduce DPR to 0.85x for FPS headroom during Supernova burst
  // Dossier open: lock to 1.0 DPR for crisp text rendering
  const canvasDpr = isDossierOpen
    ? 1.0
    : heroTransitionPhase === 'crush'
      ? (isHighTier ? Math.min(window.devicePixelRatio * 0.85, 1.25) : 0.85)
      : (isHighTier ? [1, 1.5] : 1);

  return (
    <div
      className="fixed inset-0 w-screen h-[100dvh] overflow-hidden bg-transparent z-10"
      onPointerMove={handlePointerMove}
      onPointerLeave={setMouseInactive}
    >
      <Canvas
        camera={{ fov: 45, position: [0, 0.02, 1.95], near: 0.1, far: 80 }}
        gl={{
          antialias: isHighTier,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={canvasDpr}
      >
        <HeroCameraRig />
        <TelemetryTracker />

        {/* Cinematic Cold Cosmic Lighting — Deep Void + Solar Gold Rim */}
        <ambientLight intensity={0.18} />
        {/* Dynamic Orb Reactor Core Light (Active Theme Accent) */}
        <pointLight
          color={activeThemeAccent}
          position={[0.35, -0.20, 0.65]}
          intensity={isDossierOpen ? 5.5 : 2.8}
          distance={4.5}
        />
        {/* Front Key Light (Ice Cyan — subtle, cool) */}
        <pointLight color="#00d4f5" position={[0, 2.4, 2.0]} intensity={2.2} />
        {/* Left Cold Fill Light (Midnight Indigo) */}
        <pointLight color="#4a2daa" position={[-2.8, 1.0, -1.0]} intensity={1.8} />
        {/* Back-Right Solar Gold Rim Light — strong, keeps Avatar edge lit */}
        <pointLight color="#ffaa00" position={[2.2, 0.5, -2.0]} intensity={4.8} />
        {/* Back-Left Cool Rim (Steel Blue — counterbalance) */}
        <pointLight color="#2060dd" position={[-1.8, 0.8, -2.5]} intensity={1.6} />
        {/* Bottom Subtle Fill */}
        <pointLight color={activeThemeAccent} position={[0, -2.0, 1.0]} intensity={0.9} />
        <pointLight color="#0088aa" position={[0, -2.0, 1.0]} intensity={0.8} />

        {/* Deep Void Cosmic Backdrop — Stars, Nebula, God Rays */}
        <CosmicGalaxyBackdrop gpuTier={gpuTier} />

        {/* Dual-layer Bust Avatar (Framed at AVATAR_Y = -2.85) */}
        <Suspense fallback={null}>
          <HeroBustAvatar position={[0, -2.85, 0]} />
          {/* 3D Quantum Photon Stream Particles */}
          <QuantumPhotonStream3D />
        </Suspense>

        {/* Adaptive Bloom */}
        {isHighTier && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={1.35}
              luminanceThreshold={0.70}
              luminanceSmoothing={0.04}
              radius={0.75}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
