import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const CYAN_HEX   = '#00E5FF';
const PURPLE_HEX = '#7A00FF';

/**
 * AvatarPedestal
 *
 * Decorative elements xung quanh avatar trung tâm, tách ra để
 * dùng được với cả HumanWireframeAvatar (procedural) lẫn GlbWireframeAvatar (GLB).
 *
 * Bao gồm:
 *   1. Floating Waist Gyro Neon Rings (Cyan & Purple)
 *   2. Holographic Scanner Pedestal Base (Outer Rim, Inner Circuit Ring, Radial Ticks)
 *   3. Outer Perimeter Pointer Ticks (24 nhỏ)
 *
 * Props:
 *   position [x, y, z]  — vị trí gốc (nên khớp với position của avatar, default [0, -0.9, 0])
 *   scale    number      — scale đồng đều (default: 1.0)
 */
export function AvatarPedestal({ position = [0, -0.9, 0], scale = 1.0 }) {
  const waistRing1Ref  = useRef();
  const waistRing2Ref  = useRef();
  const baseScannerRef = useRef();

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime();

    if (waistRing1Ref.current) {
      waistRing1Ref.current.rotation.z += delta * 0.6;
    }
    if (waistRing2Ref.current) {
      waistRing2Ref.current.rotation.z -= delta * 0.4;
      waistRing2Ref.current.rotation.x = Math.PI / 3 + Math.sin(elapsed * 0.8) * 0.12;
    }
    if (baseScannerRef.current) {
      baseScannerRef.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <group position={position} scale={scale}>

      {/* ══════════════════════════════════════════════════════════════
          1. FLOATING WAIST GYRO NEON RINGS (Cyan & Purple)
             — y offset relatif terhadap avatar position
      ══════════════════════════════════════════════════════════════ */}

      {/* Cyan horizontal ring */}
      <mesh ref={waistRing1Ref} position={[0, 1.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.68, 0.010, 8, 80]} />
        <meshBasicMaterial color={CYAN_HEX} toneMapped={false} />
      </mesh>

      {/* Purple tilted ring */}
      <mesh ref={waistRing2Ref} position={[0, 1.95, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.76, 0.008, 8, 80]} />
        <meshBasicMaterial color={PURPLE_HEX} transparent opacity={0.8} toneMapped={false} />
      </mesh>

      {/* ══════════════════════════════════════════════════════════════
          2. HOLOGRAPHIC SCANNER PEDESTAL BASE
      ══════════════════════════════════════════════════════════════ */}
      <group position={[0, -0.01, 0]}>

        {/* Outer Cyan Glowing Rim */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.78, 0.82, 64]} />
          <meshBasicMaterial color={CYAN_HEX} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>

        {/* Inner Purple Circuit Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.48, 48]} />
          <meshBasicMaterial color={PURPLE_HEX} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>

        {/* Radial Scanner Lines (16 lines, rotating) */}
        <group ref={baseScannerRef} rotation={[-Math.PI / 2, 0, 0]}>
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * (2 * Math.PI)) / 16;
            const cos   = Math.cos(angle);
            const sin   = Math.sin(angle);
            return (
              <line key={i}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([
                      0.48 * cos, 0.48 * sin, 0.001,
                      0.78 * cos, 0.78 * sin, 0.001,
                    ])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color={CYAN_HEX} transparent opacity={0.6} />
              </line>
            );
          })}
        </group>

        {/* ══════════════════════════════════════════════════════════════
            3. OUTER PERIMETER POINTER TICKS (24 small rectangles)
        ══════════════════════════════════════════════════════════════ */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * (2 * Math.PI)) / 24;
          const cos   = Math.cos(angle);
          const sin   = Math.sin(angle);
          return (
            <mesh
              key={i}
              position={[0.88 * cos, 0.001, 0.88 * sin]}
              rotation={[0, -angle, 0]}
            >
              <planeGeometry args={[0.035, 0.012]} />
              <meshBasicMaterial color={CYAN_HEX} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
