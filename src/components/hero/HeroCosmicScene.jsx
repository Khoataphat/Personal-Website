import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { getGPUTier } from 'detect-gpu';
import { useCockpitStore } from '../../store/cockpitStore';
import { BackgroundMatrix3D } from '../cockpit/BackgroundMatrix3D';
import { HeroBustAvatar } from './HeroBustAvatar';
import { CosmicBlackHole } from './CosmicBlackHole';
import { AccretionDiscOrbit } from './AccretionDiscOrbit';

/**
 * Telemetry tracker (FPS, UTC clock) — runs inside Canvas
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
 * Camera positioned for bust framing — looking slightly upward from below
 * the orb, so the hero frame shows from the orb/hands to the top of the head.
 *
 * Camera anchor: z = 3.5 (close), y = 0.5 (slightly below waist level),
 * looking at y = 1.6 (chest/neck area of the model).
 * This creates the "dramatic upward close-up" cinematic feeling.
 *
 * Mouse parallax adds subtle life to the frame.
 */
function HeroCameraRig() {
  const mouseNorm = useCockpitStore.getState().mouseNorm;

  useFrame(({ camera }, delta) => {
    const mouse = useCockpitStore.getState().mouseNorm;

    // Target bust position (looking slightly up from below the orb position)
    const targetZ = 3.2;
    const targetY = 0.15; // slightly below the orb level looking up
    const targetX = 0;

    // Apply mouse parallax offset (gentle)
    const finalX = targetX + mouse.x * 0.18;
    const finalY = targetY + mouse.y * 0.08;

    // Smooth lerp
    camera.position.x += (finalX - camera.position.x) * Math.min(1, delta * 6);
    camera.position.y += (finalY - camera.position.y) * Math.min(1, delta * 6);
    camera.position.z += (targetZ - camera.position.z) * Math.min(1, delta * 6);

    // Look at center of the bust frame (between orb and head)
    camera.lookAt(0, -0.15, 0);
  });

  return null;
}

/**
 * HeroCosmicScene
 *
 * Main R3F Canvas for the Hero page. Assembles:
 *   1. Deep space background (BackgroundMatrix3D)
 *   2. Dual-layer bust avatar (HeroBustAvatar)
 *   3. Cosmic black hole orb on avatar's hands (CosmicBlackHole)
 *   4. Accretion disc card orbit around the black hole (AccretionDiscOrbit)
 *   5. Adaptive Bloom postprocessing
 *
 * The black hole and disc orbit are positioned at the avatar's hand/orb
 * coordinates. Based on GlbWireframeAvatar testing, avatar auto-scales
 * to TARGET_HEIGHT=2.8, and Maze_Maze_0 is approximately at world y=1.05
 * when avatar root is at position [0, -2.2, 0].
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
  const particleCount = gpuTier <= 1 ? 200 : 400;

  // Avatar position: root at -2.2 so only the upper bust fills the camera frame
  // (camera at z=3.2, y=0.35 looking at y=1.35)
  const AVATAR_Y = -2.2;

  // Black hole orb position (Maze_Maze_0 world coords):
  //   native height = 8.51, normalizeScale = 0.3291
  //   Maze sits at ~38% of native height = 8.51 * 0.38 = 3.23 (native units)
  //   World y = -2.2 + (3.23 * 0.3291) = -2.2 + 1.063 = -1.137
  //   Slight forward Z to bring orb closer to camera
  const ORB_POS = [0.05, -1.15, 0.15];

  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#070709] z-0"
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ fov: 48, position: [0, 0.35, 3.2], near: 0.1, far: 80 }}
        gl={{
          antialias: isHighTier,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={isHighTier ? [1, 1.5] : 1}
      >
        <HeroCameraRig />
        <TelemetryTracker />

        {/* Lights */}
        <ambientLight intensity={0.2} />
        <pointLight color="#00f2fe" position={[0, 4, 3]} intensity={3} />
        <pointLight color="#7928ca" position={[-3, 2, -2]} intensity={2} />
        <pointLight color="#ff8c00" position={[1.5, 0, 2]} intensity={1.2} />

        {/* Deep Space Background */}
        <BackgroundMatrix3D particleCount={particleCount} />

        {/* Dual-layer Bust Avatar */}
        <Suspense fallback={null}>
          <HeroBustAvatar position={[0, AVATAR_Y, 0]} />
        </Suspense>

        {/* Cosmic Black Hole at orb position */}
        <CosmicBlackHole position={ORB_POS} radius={0.26} />

        {/* Accretion Disc Card Orbit centered on black hole */}
        <AccretionDiscOrbit orbCenter={ORB_POS} />

        {/* Adaptive Bloom */}
        {isHighTier && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={1.6}
              luminanceThreshold={0.75}
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
