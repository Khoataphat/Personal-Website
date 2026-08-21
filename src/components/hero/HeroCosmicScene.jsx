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
 * Hero Camera Rig
 *
 * Cinematic bust framing: camera positioned to frame the avatar from hands
 * up to the top of the head so it commands >60% of the viewport.
 */
function HeroCameraRig() {
  useFrame(({ camera }, delta) => {
    const mouse = useCockpitStore.getState().mouseNorm;

    const targetZ = 3.25;
    const targetY = 0.15;
    const targetX = 0;

    const finalX = targetX + mouse.x * 0.14;
    const finalY = targetY + mouse.y * 0.08;

    camera.position.x += (finalX - camera.position.x) * Math.min(1, delta * 6);
    camera.position.y += (finalY - camera.position.y) * Math.min(1, delta * 6);
    camera.position.z += (targetZ - camera.position.z) * Math.min(1, delta * 6);

    camera.lookAt(0, 0.05, 0);
  });

  return null;
}

/**
 * HeroCosmicScene
 *
 * Main R3F Canvas:
 *   - Background matrix deep space
 *   - HeroBustAvatar (contains the dual-layer model + palm-mounted CosmicBlackHole & PlanetaryOrbitRing)
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
        camera={{ fov: 45, position: [0, 0.15, 3.25], near: 0.1, far: 80 }}
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

        {/* Dual-layer Bust Avatar with Palm-mounted Black Hole & Planetary Orbit */}
        <Suspense fallback={null}>
          <HeroBustAvatar position={[0, -2.6, 0]} />
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
