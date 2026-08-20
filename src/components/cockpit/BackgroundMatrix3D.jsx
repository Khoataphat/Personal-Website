import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function BackgroundMatrix3D({ particleCount = 500 }) {
  const laserRef = useRef();
  const instancedRef = useRef();

  // Create dummy object for calculating instance transformation matrices
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-generate particle positions, drift offsets, and individual speeds
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < particleCount; i++) {
      data.push({
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 12,
        z: (Math.random() - 0.5) * 20 - 2,
        speed: 0.2 + Math.random() * 0.4,
        scale: 0.015 + Math.random() * 0.02,
        initialY: (Math.random() - 0.5) * 12,
      });
    }
    return data;
  }, [particleCount]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    // 1. Laser Sweep Plane oscillation
    if (laserRef.current) {
      laserRef.current.position.y = Math.sin(elapsed * 0.4) * 2.5;
    }

    // 2. GPU InstancedMesh Particles floating animation
    if (instancedRef.current) {
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        // Slow vertical drift with looping bounding box
        let currentY = p.initialY + (elapsed * p.speed * 0.3);
        if (currentY > 6) {
          p.initialY -= 12;
          currentY = p.initialY + (elapsed * p.speed * 0.3);
        }

        dummy.position.set(p.x, currentY, p.z);
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        instancedRef.current.setMatrixAt(i, dummy.matrix);
      }
      instancedRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group name="background-matrix-3d">
      {/* Layer 1: Cyan Wireframe Floor Grid */}
      <group position={[0, -2, 0]}>
        <gridHelper args={[40, 40, '#00f2fe', '#00f2fe']}>
          <meshBasicMaterial color="#00f2fe" transparent opacity={0.15} />
        </gridHelper>
      </group>

      {/* Layer 2: Glowing Laser Sweep Plane */}
      <mesh ref={laserRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[35, 0.04]} />
        <meshBasicMaterial
          color="#00f2fe"
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Layer 3: GPU Instanced Neon Particles */}
      <instancedMesh
        ref={instancedRef}
        args={[undefined, undefined, particleCount]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#7928ca" toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
