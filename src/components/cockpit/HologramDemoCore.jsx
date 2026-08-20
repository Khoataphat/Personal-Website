import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCockpitStore } from '../../store/cockpitStore';
import './shaders/HologramShaderMaterial';

export function HologramDemoCore({ scale = 1 }) {
  const coreRef = useRef();
  const materialRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const mouseNorm = useCockpitStore.getState().mouseNorm;

    // Update shader uTime uniform
    if (materialRef.current) {
      materialRef.current.uTime = elapsed;
    }

    // Core gentle rotation
    if (coreRef.current) {
      coreRef.current.rotation.x = elapsed * 0.25 + (mouseNorm.y * 0.2);
      coreRef.current.rotation.y = elapsed * 0.35 + (mouseNorm.x * 0.25);
    }

    // Gyroscopic Ring 1
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = elapsed * 0.3;
      ring1Ref.current.rotation.y = -elapsed * 0.2;
    }

    // Gyroscopic Ring 2
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = elapsed * 0.25;
      ring2Ref.current.rotation.z = Math.sin(elapsed * 0.4) * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]} scale={scale}>
      {/* 1. Inner Neon Energy Pulse Sphere */}
      <mesh>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshBasicMaterial color="#00f2fe" toneMapped={false} />
      </mesh>

      {/* 2. Holographic Geometric Cage */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.75, 1]} />
        <hologramMaterial
          ref={materialRef}
          uColor="#00f2fe"
          uOpacity={0.88}
          uGlitchStrength={0.035}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Orbiting Gyro Ring 1 (Cyan) */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.05, 0.018, 16, 64]} />
        <meshBasicMaterial color="#00f2fe" transparent opacity={0.7} toneMapped={false} />
      </mesh>

      {/* 4. Orbiting Gyro Ring 2 (Purple) */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.25, 0.015, 16, 64]} />
        <meshBasicMaterial color="#7928ca" transparent opacity={0.6} toneMapped={false} />
      </mesh>
    </group>
  );
}
