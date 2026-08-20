import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { getGPUTier } from 'detect-gpu';
import { useCockpitStore } from '../../store/cockpitStore';
import { BackgroundMatrix3D } from './BackgroundMatrix3D';
import { HologramDemoCore } from './HologramDemoCore';

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
      // Fallback to tier 2 on detection error
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
        camera={{ fov: 45, position: [0, 0.5, 6], near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={isHighTier ? [1, 2] : 1}
      >
        {/* Cybernetic Ambient & Point Lights */}
        <ambientLight intensity={0.15} />
        <pointLight color="#00f2fe" position={[0, 4, 3]} intensity={2.5} />
        <pointLight color="#7928ca" position={[-3, 2, -2]} intensity={1.8} />

        {/* 3D Background Matrix Environment */}
        <BackgroundMatrix3D particleCount={particleCount} />

        {/* Centerpiece Hologram Core (Demo verification) */}
        <HologramDemoCore />

        {/* Child 3D components for future phases (Orbit Ring, Avatar, Panels) */}
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
