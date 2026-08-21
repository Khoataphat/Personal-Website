import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCockpitStore } from '../../store/cockpitStore';
import { MiniHologramCard } from './MiniHologramCard';
import { soundFx } from '../../services/soundFx';

const N = 5;
const STEP = (2 * Math.PI) / N;

// Accretion disc orbit parameters
// Disc is tilted DISC_TILT degrees from horizontal, cards orbit on an ellipse
const ORBIT_RADIUS_X = 1.55; // semi-major axis (horizontal spread)
const ORBIT_RADIUS_Z = 0.55; // semi-minor (disc viewed from slightly above)
const DISC_TILT = THREE.MathUtils.degToRad(32); // disc tilt towards viewer

const CARD_ACCENT = [
  '#00f2fe', // ABOUT
  '#00ff88', // SKILLS
  '#7928ca', // PROJECTS
  '#ff8c00', // BLOG
  '#f72585', // CONTACT
];

/**
 * AccretionDiscOrbit
 *
 * Renders 5 MiniHologramCards orbiting on a tilted elliptical disc around
 * the CosmicBlackHole. Inherits orbit interaction from OrbitPanelRing logic
 * (wheel scroll, pointer drag, keyboard 1-5 / arrows).
 *
 * The disc is positioned at `orbCenter` which should match the
 * CosmicBlackHole position in the scene.
 */
export function AccretionDiscOrbit({ orbCenter = [0, 0.0, 0] }) {
  const angleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const dragDistRef = useRef(0);
  const lastActiveRef = useRef(0);

  const activeCard = useCockpitStore((s) => s.activeCard);
  const setActiveCard = useCockpitStore((s) => s.setActiveCard);
  const setDiscAngle = useCockpitStore((s) => s.setDiscAngle);

  // Snap disc to bring a specific card index to the front-facing position
  const snapToCard = (index) => {
    targetAngleRef.current = -index * STEP;
    soundFx.playDockClick?.();
  };

  // Expose snap globally for TopNav to call
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.snapToDiscCard = snapToCard;
    }
    return () => { delete window.snapToDiscCard; };
  }, []);

  // Keyboard 1-5 and Arrow keys
  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key >= '1' && e.key <= '5') {
        snapToCard(parseInt(e.key, 10) - 1);
      }
      // Read current activeCard from store (not stale closure)
      const currentActive = useCockpitStore.getState().activeCard ?? 0;
      if (e.key === 'ArrowRight') snapToCard((currentActive + 1) % N);
      if (e.key === 'ArrowLeft')  snapToCard((currentActive - 1 + N) % N);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []); // no deps — reads live state via getState()

  // Mouse wheel
  useEffect(() => {
    const onWheel = (e) => {
      // Don't hijack scroll inside expanded modal or overflow elements
      if (e.target?.closest?.('.hero-card-modal, .overflow-y-auto, .overflow-auto, textarea, iframe')) return;
      e.preventDefault();
      velocityRef.current += e.deltaY * 0.0009;
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  // Pointer drag
  useEffect(() => {
    const onDown = (e) => {
      if (e.target?.closest?.('button, input, textarea, a, select, .hero-card-modal, [role="button"]')) return;
      isDraggingRef.current = true;
      lastPointerXRef.current = e.clientX;
      dragDistRef.current = 0;
    };
    const onMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastPointerXRef.current;
      if (Math.abs(dx) < 1) return;
      lastPointerXRef.current = e.clientX;
      angleRef.current += dx * 0.004;
      targetAngleRef.current = angleRef.current;
      dragDistRef.current += Math.abs(dx);
    };
    const onUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      if (dragDistRef.current > 4) {
        const rawIdx = -angleRef.current / STEP;
        targetAngleRef.current = Math.round(rawIdx) * STEP;
      }
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  // Per-frame animation
  useFrame((_, delta) => {
    // 1. Velocity inertia from wheel
    if (Math.abs(velocityRef.current) > 0.0001) {
      angleRef.current -= velocityRef.current;
      targetAngleRef.current = angleRef.current;
      velocityRef.current *= 0.86;
    } else if (!isDraggingRef.current) {
      // 2. Smooth snap lerp
      angleRef.current += (targetAngleRef.current - angleRef.current) * Math.min(1, delta * 6);
    }

    // 3. Active card calculation
    const norm = ((-angleRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const idx = (Math.round(norm / STEP) % N + N) % N;
    if (idx !== lastActiveRef.current) {
      lastActiveRef.current = idx;
      setActiveCard(idx);
      soundFx.playPanelSwitch?.();
    }

    setDiscAngle(angleRef.current);
  });

  // Build card positions on the tilted elliptical disc
  // Each card is placed at angle (angleRef + i*STEP) on the orbit
  return (
    <group position={orbCenter} rotation={[DISC_TILT, 0, 0]}>
      {Array.from({ length: N }).map((_, i) => {
        const theta = angleRef.current + i * STEP;
        const x = ORBIT_RADIUS_X * Math.sin(theta);
        const z = ORBIT_RADIUS_Z * Math.cos(theta); // collapsed on Z due to disc view angle
        const y = 0;

        return (
          <MiniHologramCard
            key={i}
            index={i}
            position={[x, y, z]}
            accentColor={CARD_ACCENT[i]}
          />
        );
      })}
    </group>
  );
}
