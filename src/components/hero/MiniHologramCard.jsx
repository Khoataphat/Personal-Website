import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useCockpitStore } from '../../store/cockpitStore';

// Colors per card
const CARD_ACCENT = [
  '#00f2fe', // ABOUT    — cyan
  '#00ff88', // SKILLS   — green
  '#7928ca', // PROJECTS — purple
  '#ff8c00', // BLOG     — orange
  '#f72585', // CONTACT  — pink
];

const CARD_ICON = ['◈', '⬡', '◎', '✦', '⬟'];
const CARD_LABELS = ['ABOUT', 'SKILLS', 'PROJECTS', 'BLOG', 'CONTACT'];
const CARD_SUBLABELS = ['Operator Profile', 'Tech Arsenal', 'Major Systems', 'Tech Chronicles', 'Transmission Link'];
const CARD_STATS = ['Full-Stack · IoT', '15+ Technologies', '4 Deployed Apps', 'Architecture Deep-dives', 'Open for Hire'];

/**
 * MiniHologramCard
 *
 * A single glowing mini card floating on the accretion disc orbit.
 * Uses Html from drei for rich DOM rendering with lookAt (billboard behavior).
 * Shows: glow border in accent color, icon, label, sublabel, stat.
 * On click: calls setActiveCard + setIsCardExpanded from the store.
 */
export function MiniHologramCard({ index, position, accentColor }) {
  const groupRef = useRef();
  const activeCard = useCockpitStore((s) => s.activeCard);
  const isCardExpanded = useCockpitStore((s) => s.isCardExpanded);
  const setActiveCard = useCockpitStore((s) => s.setActiveCard);
  const setIsCardExpanded = useCockpitStore((s) => s.setIsCardExpanded);

  const isActive = activeCard === index;
  const accent = accentColor ?? CARD_ACCENT[index] ?? '#00f2fe';

  useFrame(({ camera }) => {
    if (!groupRef.current) return;
    // Billboard: always face the camera
    groupRef.current.quaternion.copy(camera.quaternion);
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (isActive && isCardExpanded) {
      setIsCardExpanded(false);
      setActiveCard(null);
    } else {
      setActiveCard(index);
      setIsCardExpanded(true);
    }
  };

  return (
    <group ref={groupRef} position={position}>
      <Html
        center
        distanceFactor={5.5}
        zIndexRange={[10, 20]}
        style={{ pointerEvents: 'auto' }}
      >
        <div
          onClick={handleClick}
          style={{
            width: '120px',
            background: 'rgba(5, 5, 14, 0.82)',
            backdropFilter: 'blur(12px)',
            border: `1.5px solid ${isActive ? accent : accent + '55'}`,
            borderRadius: '10px',
            padding: '10px 10px 8px',
            cursor: 'pointer',
            userSelect: 'none',
            fontFamily: "'Share Tech Mono', 'Courier New', monospace",
            boxShadow: isActive
              ? `0 0 22px ${accent}88, 0 0 6px ${accent}44 inset`
              : `0 0 8px ${accent}33`,
            transform: isActive ? 'scale(1.12)' : 'scale(1)',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Icon */}
          <div style={{
            fontSize: '22px',
            textAlign: 'center',
            color: accent,
            textShadow: `0 0 12px ${accent}`,
            lineHeight: 1,
            marginBottom: '4px',
          }}>
            {CARD_ICON[index]}
          </div>

          {/* Label */}
          <div style={{
            fontSize: '10px',
            fontWeight: 'bold',
            color: accent,
            textAlign: 'center',
            letterSpacing: '2px',
            textShadow: `0 0 8px ${accent}`,
            marginBottom: '2px',
          }}>
            {CARD_LABELS[index]}
          </div>

          {/* Sublabel */}
          <div style={{
            fontSize: '8px',
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            letterSpacing: '0.5px',
            marginBottom: '5px',
          }}>
            {CARD_SUBLABELS[index]}
          </div>

          {/* Separator */}
          <div style={{
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${accent}77, transparent)`,
            marginBottom: '5px',
          }} />

          {/* Stat */}
          <div style={{
            fontSize: '8px',
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            letterSpacing: '0.5px',
          }}>
            {CARD_STATS[index]}
          </div>

          {/* Active indicator dot */}
          {isActive && (
            <div style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: accent,
              boxShadow: `0 0 6px ${accent}`,
              animation: 'pulse 1s infinite',
            }} />
          )}
        </div>
      </Html>
    </group>
  );
}
