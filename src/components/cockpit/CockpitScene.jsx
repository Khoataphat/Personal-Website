import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { getGPUTier } from 'detect-gpu';
import { useCockpitStore } from '../../store/cockpitStore';
import { BackgroundMatrix3D } from './BackgroundMatrix3D';
import { HologramDemoCore } from './HologramDemoCore';
import { OrbitPanelRing } from './OrbitPanelRing';

function TelemetryTracker() {
  const setTelemetry = useCockpitStore((s) => s.setTelemetry);
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);
  const lastUpdateRef = useRef(performance.now());

  useFrame(() => {
    const now = performance.now();
    frameCountRef.current += 1;

    // Update telemetry state every ~300ms
    if (now - lastUpdateRef.current >= 300) {
      const elapsed = (now - lastUpdateRef.current) / 1000;
      const calculatedFps = Math.round(frameCountRef.current / elapsed);
      frameCountRef.current = 0;
      lastUpdateRef.current = now;

      const date = new Date();
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const mins = String(date.getUTCMinutes()).padStart(2, '0');
      const secs = String(date.getUTCSeconds()).padStart(2, '0');

      setTelemetry({
        fps: Math.min(120, Math.max(1, calculatedFps)),
        latency: Math.round((performance.now() % 12) + 8),
        utcClock: `${hours}:${mins}:${secs} UTC`,
      });
    }
  });

  return null;
}

function CockpitCameraRig() {
  const keysPressed = useRef({});
  const cameraTarget = useRef({ x: 0, y: 1.85, z: 5.4 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'q', 'e'].includes(key)) {
        keysPressed.current[key] = true;
      }
      if (key === 'r') {
        cameraTarget.current = { x: 0, y: 1.85, z: 5.4 };
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (keysPressed.current[key]) {
        delete keysPressed.current[key];
      }
    };

    window.resetCockpitCamera = () => {
      cameraTarget.current = { x: 0, y: 1.85, z: 5.4 };
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      delete window.resetCockpitCamera;
    };
  }, []);

  useFrame(({ camera }, delta) => {
    const isFreeCamActive = useCockpitStore.getState().isFreeCamActive;
    const speed = 4.2 * delta;
    const keys = keysPressed.current;

    // Movement updates only active when FreeCam Mode is enabled
    if (isFreeCamActive) {
      if (keys.w) cameraTarget.current.z -= speed;
      if (keys.s) cameraTarget.current.z += speed;
      if (keys.a) cameraTarget.current.x -= speed;
      if (keys.d) cameraTarget.current.x += speed;
      if (keys.e) cameraTarget.current.y += speed;
      if (keys.q) cameraTarget.current.y -= speed;

      // Safety Bounding Limits
      cameraTarget.current.x = Math.max(-3.0, Math.min(3.0, cameraTarget.current.x));
      cameraTarget.current.y = Math.max(0.6, Math.min(3.8, cameraTarget.current.y));
      cameraTarget.current.z = Math.max(3.2, Math.min(8.2, cameraTarget.current.z));
    } else {
      // Return to default cockpit camera anchor
      cameraTarget.current.x = 0;
      cameraTarget.current.y = 1.85;
      cameraTarget.current.z = 5.4;
    }

    // Mouse parallax subtle offset
    const mouseNorm = useCockpitStore.getState().mouseNorm;
    const finalX = cameraTarget.current.x + mouseNorm.x * 0.3;
    const finalY = cameraTarget.current.y + mouseNorm.y * 0.2;

    // Smooth Lerp
    camera.position.x += (finalX - camera.position.x) * Math.min(1, delta * 8);
    camera.position.y += (finalY - camera.position.y) * Math.min(1, delta * 8);
    camera.position.z += (cameraTarget.current.z - camera.position.z) * Math.min(1, delta * 8);

    camera.lookAt(0, -0.05, 0);
  });

  return null;
}

export function CockpitScene({ children }) {
  const [gpuTier, setGpuTier] = useState(2); // default assume Tier 2
  const setMouseNorm = useCockpitStore((s) => s.setMouseNorm);

  useEffect(() => {
    let isMounted = true;
    getGPUTier().then((tierResult) => {
      if (isMounted && tierResult?.tier !== undefined) {
        setGpuTier(tierResult.tier);
      }
    }).catch(() => {
      if (isMounted) setGpuTier(2);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePointerMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -((e.clientY / window.innerHeight) * 2 - 1);
    setMouseNorm(x, y);
  };

  const isHighTier = gpuTier >= 2;
  const particleCount = gpuTier <= 1 ? 250 : 500;

  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#070709] z-0 select-none"
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ fov: 42, position: [0, 1.85, 5.4], near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={isHighTier ? [1, 2] : 1}
      >
        <CockpitCameraRig />
        <TelemetryTracker />

        {/* Cybernetic Ambient & Point Lights */}
        <ambientLight intensity={0.25} />
        <pointLight color="#00f2fe" position={[0, 4, 3]} intensity={2.5} />
        <pointLight color="#7928ca" position={[-3, 2, -2]} intensity={1.8} />

        {/* 3D Background Matrix Environment */}
        <BackgroundMatrix3D particleCount={particleCount} />

        {/* Central Reactor Hologram Core */}
        <HologramDemoCore scale={0.8} />

        {/* Cylindrical 360 Orbit Panel Ring */}
        <OrbitPanelRing />

        {/* Child 3D components for future phases */}
        {children}

        {/* Adaptive Postprocessing Bloom */}
        {isHighTier && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={1.4}
              luminanceThreshold={0.85}
              luminanceSmoothing={0.025}
              radius={0.7}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
