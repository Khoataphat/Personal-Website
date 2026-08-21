import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

const N = 5;
const STEP = (2 * Math.PI) / N;

const CAPSULE_DATA = [
  { label: 'ABOUT',    icon: '◈', accent: '#00f2fe' },
  { label: 'SKILLS',   icon: '⬡', accent: '#00ff88' },
  { label: 'WORK',     icon: '◎', accent: '#7928ca' },
  { label: 'BLOG',     icon: '✦', accent: '#ff8c00' },
  { label: 'CONTACT',  icon: '⬟', accent: '#f72585' },
];

/**
 * PlanetaryOrbitRing
 *
 * A delicate glowing 3D planetary ring with 5 ultra-thin capsule badges
 * orbiting smoothly around the black hole orb. Purely visual ambient animation.
 *
 * Parameters:
 * - radius: orbit radius around the orb (default: 0.28 units)
 * - tilt: inclination angle of the orbital ring (default: ~25 deg)
 */
export function PlanetaryOrbitRing({ radius = 0.28, tilt = THREE.MathUtils.degToRad(25) }) {
  const ringRef = useRef();
  const orbitGroupRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y = -t * 0.18; // smooth planetary rotation
    }
  });

  return (
    <group rotation={[tilt, 0, 0]}>
      {/* ── Thin glowing orbital guide ring ─────────────────────────── */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.98, radius * 1.02, 64]} />
        <meshBasicMaterial
          color="#00f2fe"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* ── 5 Ultra-thin Capsule Tags orbiting the ring ────────────── */}
      <group ref={orbitGroupRef}>
        {CAPSULE_DATA.map((item, i) => {
          const theta = i * STEP;
          const x = radius * Math.sin(theta);
          const z = radius * Math.cos(theta);

          return (
            <group key={i} position={[x, 0, z]}>
              <Html
                center
                distanceFactor={4.5}
                zIndexRange={[15, 25]}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 8px',
                    background: 'rgba(5, 5, 14, 0.78)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: `1px solid ${item.accent}66`,
                    borderRadius: '9999px',
                    boxShadow: `0 0 10px ${item.accent}33, inset 0 0 4px ${item.accent}22`,
                    whiteSpace: 'nowrap',
                    fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                  }}
                >
                  <span
                    style={{
                      fontSize: '9px',
                      color: item.accent,
                      textShadow: `0 0 6px ${item.accent}`,
                      lineHeight: 1,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    style={{
                      fontSize: '8px',
                      fontWeight: 'bold',
                      letterSpacing: '1.5px',
                      color: item.accent,
                      textShadow: `0 0 6px ${item.accent}`,
                    }}
                  >
                    {item.label}
                  </span>
                  {/* Subtle pulsing led dot */}
                  <span
                    style={{
                      width: '3.5px',
                      height: '3.5px',
                      borderRadius: '50%',
                      background: item.accent,
                      boxShadow: `0 0 5px ${item.accent}`,
                      display: 'inline-block',
                    }}
                  />
                </div>
              </Html>
            </group>
          );
        })}
      </group>
    </group>
  );
}
