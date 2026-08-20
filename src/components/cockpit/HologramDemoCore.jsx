import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCockpitStore } from '../../store/cockpitStore';
import './shaders/HologramShaderMaterial';

export function HologramDemoCore() {
  const meshRef = useRef();
  const materialRef = useRef();
  const ringRef = useRef();

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const mouseNorm = useCockpitStore.getState().mouseNorm;

    // Update shader uTime uniform
    if (materialRef.current) {
      materialRef.current.uTime = elapsed;
    }

    // Gentle multi-axis rotation with mouse parallax dampening
    if (meshRef.current) {
      meshRef.current.rotation.x = elapsed * 0.3 + (mouseNorm.y * 0.3);
      meshRef.current.rotation.y = elapsed * 0.4 + (mouseNorm.x * 0.4);
      meshRef.current.rotation.z = Math.sin(elapsed * 0.2) * 0.2;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = -elapsed * 0.2;
      ringRef.current.rotation.y = elapsed * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Holographic Icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.9, 1]} />
        <hologramMaterial
          ref={materialRef}
          uColor="#00f2fe"
          uOpacity={0.85}
          uGlitchStrength={0.04}
          toneMapped={false}
        />
      </mesh>

      {/* Orbiting Hologram Accent Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.5, 0.015, 8, 48]} />
        <meshBasicMaterial color="#7928ca" transparent opacity={0.6} toneMapped={false} />
      </mesh>
    </group>
  );
}
