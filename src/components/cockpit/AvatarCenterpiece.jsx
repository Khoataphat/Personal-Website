import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCockpitStore } from '../../store/cockpitStore';
import { createHologramMaterial } from './shaders/HologramShaderMaterial';

const lerp = (a, b, t) => a + (b - a) * t;

export function AvatarCenterpiece() {
  const rootGroupRef = useRef();
  const bodyGroupRef = useRef();
  const headGroupRef = useRef();
  const reactorRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const baseRingRef = useRef();

  // Create Hologram materials for Avatar
  const hologramCyan = useMemo(() => createHologramMaterial('#00f2fe'), []);
  const hologramViolet = useMemo(() => createHologramMaterial('#7928ca'), []);

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime();
    const { mouseNorm, activePanel } = useCockpitStore.getState();

    // 1. Idle Harmonic Levitation / Breathing
    if (rootGroupRef.current) {
      rootGroupRef.current.position.y = -0.3 + Math.sin(elapsed * 1.6) * 0.045;
    }

    // 2. Head Tracking (Euler Lerp Damping with safety limit ~26 deg)
    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = lerp(
        headGroupRef.current.rotation.y,
        mouseNorm.x * 0.45,
        delta * 3.5
      );
      headGroupRef.current.rotation.x = lerp(
        headGroupRef.current.rotation.x,
        -mouseNorm.y * 0.22,
        delta * 3.5
      );
    }

    // 3. Body Gesture (Turns smoothly towards activePanel)
    if (bodyGroupRef.current) {
      const N = 5;
      const targetBodyY = -(activePanel * ((2 * Math.PI) / N));
      bodyGroupRef.current.rotation.y = lerp(
        bodyGroupRef.current.rotation.y,
        targetBodyY,
        delta * 2.0
      );
    }

    // 4. Chest Arc Reactor Pulse & Gyro Rings
    if (reactorRef.current) {
      reactorRef.current.rotation.y = elapsed * 1.2;
      reactorRef.current.rotation.z = Math.sin(elapsed * 2.0) * 0.3;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.6;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.4;
      ring2Ref.current.rotation.x = Math.PI / 3 + Math.sin(elapsed * 0.8) * 0.12;
    }
    if (baseRingRef.current) {
      baseRingRef.current.rotation.y += delta * 0.5;
    }

    // 5. Update Shader real-time uniforms
    if (hologramCyan?.uniforms?.uTime) {
      hologramCyan.uniforms.uTime.value = elapsed;
    }
    if (hologramViolet?.uniforms?.uTime) {
      hologramViolet.uniforms.uTime.value = elapsed;
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, -0.3, 0]}>
      {/* ── 1. BODY ROOT (Rotates toward active panel) ── */}
      <group ref={bodyGroupRef}>
        {/* ── CHEST & TORSO SKELETON ── */}
        {/* Upper Torso Capsule Body */}
        <mesh position={[0, 0.6, 0]}>
          <capsuleGeometry args={[0.32, 0.85, 8, 16]} />
          <primitive object={hologramCyan} />
        </mesh>

        {/* Torso Glowing Cyber Wireframe Lattice */}
        <mesh position={[0, 0.6, 0]}>
          <capsuleGeometry args={[0.325, 0.85, 6, 12]} />
          <meshBasicMaterial color="#00f2fe" wireframe transparent opacity={0.4} toneMapped={false} />
        </mesh>

        {/* Glowing Chest Arc Reactor Core */}
        <group position={[0, 0.72, 0.22]}>
          <mesh ref={reactorRef}>
            <octahedronGeometry args={[0.1, 0]} />
            <meshBasicMaterial color="#00f2fe" toneMapped={false} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.12, 0.14, 24]} />
            <meshBasicMaterial color="#00f2fe" side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        </group>

        {/* Cyber Spine Vertebrae Discs */}
        {[-0.1, 0.05, 0.2, 0.35].map((yOffset, i) => (
          <mesh key={i} position={[0, 0.4 + yOffset, -0.15]}>
            <cylinderGeometry args={[0.08, 0.08, 0.03, 12]} />
            <meshBasicMaterial color="#7928ca" toneMapped={false} />
          </mesh>
        ))}

        {/* ── SHOULDERS & ARMS ── */}
        {/* Left Shoulder Assembly */}
        <group position={[-0.46, 0.95, 0]}>
          <mesh>
            <sphereGeometry args={[0.15, 12, 12]} />
            <primitive object={hologramCyan} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.155, 6, 6]} />
            <meshBasicMaterial color="#00f2fe" wireframe transparent opacity={0.6} toneMapped={false} />
          </mesh>
          {/* Left Upper Arm & Forearm */}
          <mesh position={[-0.05, -0.38, 0]} rotation={[0, 0, 0.14]}>
            <capsuleGeometry args={[0.08, 0.55, 6, 12]} />
            <primitive object={hologramViolet} />
          </mesh>
          <mesh position={[-0.05, -0.38, 0]} rotation={[0, 0, 0.14]}>
            <capsuleGeometry args={[0.085, 0.55, 4, 8]} />
            <meshBasicMaterial color="#7928ca" wireframe transparent opacity={0.5} toneMapped={false} />
          </mesh>
        </group>

        {/* Right Shoulder Assembly */}
        <group position={[0.46, 0.95, 0]}>
          <mesh>
            <sphereGeometry args={[0.15, 12, 12]} />
            <primitive object={hologramCyan} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.155, 6, 6]} />
            <meshBasicMaterial color="#00f2fe" wireframe transparent opacity={0.6} toneMapped={false} />
          </mesh>
          {/* Right Upper Arm & Forearm */}
          <mesh position={[0.05, -0.38, 0]} rotation={[0, 0, -0.14]}>
            <capsuleGeometry args={[0.08, 0.55, 6, 12]} />
            <primitive object={hologramViolet} />
          </mesh>
          <mesh position={[0.05, -0.38, 0]} rotation={[0, 0, -0.14]}>
            <capsuleGeometry args={[0.085, 0.55, 4, 8]} />
            <meshBasicMaterial color="#7928ca" wireframe transparent opacity={0.5} toneMapped={false} />
          </mesh>
        </group>

        {/* ── 2. HEAD GROUP (Tracks mouse with clamp) ── */}
        <group ref={headGroupRef} position={[0, 1.38, 0]}>
          {/* Cyber Head Hologram Sphere */}
          <mesh>
            <sphereGeometry args={[0.26, 16, 16]} />
            <primitive object={hologramCyan} />
          </mesh>

          {/* Head Cyber Wireframe Cage */}
          <mesh>
            <icosahedronGeometry args={[0.275, 1]} />
            <meshBasicMaterial color="#00f2fe" wireframe transparent opacity={0.7} toneMapped={false} />
          </mesh>

          {/* Cyber Visor Horizon Glass */}
          <mesh position={[0, 0.04, 0.22]}>
            <boxGeometry args={[0.28, 0.05, 0.08]} />
            <meshBasicMaterial color="#00f2fe" transparent opacity={0.8} toneMapped={false} />
          </mesh>

          {/* Dual Glowing Cyber Eye Emitters */}
          <mesh position={[-0.08, 0.04, 0.26]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
          <mesh position={[0.08, 0.04, 0.26]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>

          {/* Temple Audio Sensor Antennas */}
          <mesh position={[-0.27, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
            <meshBasicMaterial color="#00f2fe" toneMapped={false} />
          </mesh>
          <mesh position={[0.27, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
            <meshBasicMaterial color="#00f2fe" toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* ── 3. FLOATING GYROSCOPIC NEON RINGS ── */}
      <mesh ref={ring1Ref} position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.82, 0.012, 8, 64]} />
        <meshBasicMaterial color="#00f2fe" toneMapped={false} />
      </mesh>

      <mesh ref={ring2Ref} position={[0, 0.55, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.92, 0.009, 8, 64]} />
        <meshBasicMaterial color="#7928ca" transparent opacity={0.8} toneMapped={false} />
      </mesh>

      {/* ── 4. PEDESTAL ENERGY REACTOR BASE ── */}
      <group position={[0, -0.65, 0]}>
        {/* Solid Base Platform */}
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.85, 1.0, 0.1, 24]} />
          <meshPhysicalMaterial
            color="#080c18"
            transparent
            opacity={0.85}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>

        {/* Base Wireframe Cage */}
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.855, 1.005, 0.1, 16]} />
          <meshBasicMaterial color="#00f2fe" wireframe transparent opacity={0.4} toneMapped={false} />
        </mesh>

        {/* Glowing Outer Neon Rim */}
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.82, 0.86, 36]} />
          <meshBasicMaterial color="#00f2fe" side={THREE.DoubleSide} toneMapped={false} />
        </mesh>

        {/* Rotating Energy Circuit on Pedestal Floor */}
        <group ref={baseRingRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.48, 0.52, 24]} />
          <meshBasicMaterial color="#7928ca" side={THREE.DoubleSide} toneMapped={false} />
        </group>
      </group>
    </group>
  );
}

// ── FUTURE GLB SWAP READY (30-sec drop-in) ──
// When you have 'public/avatar.glb':
// 1. const { nodes, animations } = useGLTF('/avatar.glb');
// 2. const { actions } = useAnimations(animations, bodyGroupRef);
// 3. Replace primitive geometry with: <primitive object={nodes.Scene || nodes.Body} material={hologramMat} />
// 4. Set headGroupRef.current = nodes['Head'] || nodes['mixamorigHead']
