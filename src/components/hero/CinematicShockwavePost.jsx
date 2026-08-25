import React, { useEffect, useState, useRef } from 'react';
import { useCockpitStore } from '../../store/cockpitStore';

/**
 * CinematicShockwavePost
 *
 * High-impact Fullscreen Optical Shockwave Overlay:
 * - Triggered during Phase 4 (Hand Crush) of the Cinematic Transition.
 * - Emits a high-energy expanding plasma ring & chromatic aberration ripple
 *   centered precisely at the Singularity Core's projected 2D screen coordinate.
 * - Renders at z-[55] (above 3D avatar & typography, below Navigation Rail).
 */
export function CinematicShockwavePost() {
  const heroTransition = useCockpitStore((s) => s.heroTransition);
  const orbScreenPos = useCockpitStore((s) => s.orbScreenPos);

  const [active, setActive] = useState(false);
  const [isVignetteActive, setIsVignetteActive] = useState(false);
  const [accent, setAccent] = useState('#00f2fe');
  const [epicenter, setEpicenter] = useState({ x: 500, y: 400 });
  const [animProgress, setAnimProgress] = useState(0);

  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  // Update epicenter whenever orbScreenPos updates
  useEffect(() => {
    const cx = (orbScreenPos?.x && orbScreenPos.x > 0)
      ? orbScreenPos.x
      : (typeof window !== 'undefined' ? window.innerWidth * 0.5 : 500);
    const cy = (orbScreenPos?.y && orbScreenPos.y > 0)
      ? orbScreenPos.y
      : (typeof window !== 'undefined' ? window.innerHeight * 0.48 : 400);

    setEpicenter({ x: cx, y: cy });
  }, [orbScreenPos]);

  useEffect(() => {
    if (heroTransition.active) {
      setAccent(heroTransition.accentColor || '#00f2fe');

      if (heroTransition.phase === 'clench') {
        setIsVignetteActive(true);
      } else if (heroTransition.phase === 'crush') {
        setIsVignetteActive(false);
        setActive(true);
        startTimeRef.current = performance.now();

        const DURATION = 880; // ms

        const animate = (now) => {
          const elapsed = now - startTimeRef.current;
          const p = Math.min(1, elapsed / DURATION);
          setAnimProgress(p);

          if (p < 1) {
            rafRef.current = requestAnimationFrame(animate);
          } else {
            setActive(false);
          }
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
      } else {
        setIsVignetteActive(false);
      }
    } else {
      setActive(false);
      setIsVignetteActive(false);
      setAnimProgress(0);
    }
  }, [heroTransition.active, heroTransition.phase, heroTransition.accentColor]);

  // Exponential expansion curve for explosive blast feeling
  const easeOutExpo = (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));
  const expansion = easeOutExpo(animProgress);

  // Maximum radius covering any 4K screen
  const maxRadius = typeof window !== 'undefined'
    ? Math.max(window.innerWidth, window.innerHeight) * 1.6
    : 1600;
  const currentRadius = expansion * maxRadius;

  // Flash alpha peaks instantly at start and decays quickly
  const flashAlpha = Math.max(0, (1 - expansion * 1.6) * 0.85);

  // Shockwave ring opacity decays as it expands
  const ringAlpha = Math.max(0, Math.sin(animProgress * Math.PI) * (1 - animProgress * 0.65));

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-[55]"
    >
      {/* ── 0. Phase 3 Bullet-Time Spotlight Darkness Vignette ──────── */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
        style={{
          opacity: isVignetteActive ? 1 : 0,
          background: `radial-gradient(circle at ${epicenter.x}px ${epicenter.y}px, rgba(0,0,0,0) 140px, rgba(3,5,15,0.78) 450px, rgba(1,2,8,0.92) 100%)`,
        }}
      />

      {/* ── 1. Fullscreen White-Hot Central Plasma Flash (Phase 4) ───── */}
      {active && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${epicenter.x}px ${epicenter.y}px, rgba(255, 255, 255, ${flashAlpha * 0.98}) 0%, ${accent}${Math.round(flashAlpha * 200).toString(16).padStart(2, '0')} 32%, transparent 75%)`,
              mixBlendMode: 'screen',
            }}
          />

          {/* ── 2. Primary Expanding Chromatic Wavefront Ring ───────────── */}
          <div
            className="absolute rounded-full"
            style={{
              left: epicenter.x - currentRadius,
              top: epicenter.y - currentRadius,
              width: currentRadius * 2,
              height: currentRadius * 2,
              border: `3.5px solid ${accent}`,
              boxShadow: `
                0 0 30px ${accent},
                0 0 70px ${accent}bb,
                inset 0 0 50px ${accent}99,
                0 0 120px #ffffff
              `,
              opacity: ringAlpha,
              transform: 'translateZ(0)',
              willChange: 'transform, width, height',
            }}
          />

          {/* ── 3. Secondary High-Frequency Interference Ring ───────────── */}
          <div
            className="absolute rounded-full"
            style={{
              left: epicenter.x - currentRadius * 0.82,
              top: epicenter.y - currentRadius * 0.82,
              width: currentRadius * 1.64,
              height: currentRadius * 1.64,
              border: `2px solid #ffffff`,
              boxShadow: `0 0 22px ${accent}ee, inset 0 0 22px #ffffff`,
              opacity: ringAlpha * 0.80,
            }}
          />

          {/* ── 4. Tertiary Outer Sub-Bass Pressure Ripple ──────────────── */}
          <div
            className="absolute rounded-full"
            style={{
              left: epicenter.x - currentRadius * 1.18,
              top: epicenter.y - currentRadius * 1.18,
              width: currentRadius * 2.36,
              height: currentRadius * 2.36,
              border: `1.5px solid ${accent}77`,
              boxShadow: `0 0 40px ${accent}55`,
              opacity: ringAlpha * 0.50,
            }}
          />
        </>
      )}
    </div>
  );
}
