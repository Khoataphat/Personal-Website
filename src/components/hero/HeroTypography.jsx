import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useCockpitStore } from '../../store/cockpitStore';

const VERTICAL_INDICATORS = ['01', '02', '03', '04', '05'];
const SECTION_LABELS = ['ABOUT', 'SKILLS', 'WORK', 'BLOG', 'CONTACT'];

// Clean cyber alphanumeric characters guaranteed to render perfectly in Outfit & Orbitron
const CYBER_GLYPHS = '0123456789ABCDEFXYZ0101';

const FLANKING_MESSAGES = [
  {
    topLeft: 'DANG',
    topRight: 'KHOA',
    bottomLeft: 'CREATIVE',
    bottomRight: 'DEV',
    sub: 'OPERATOR // DIGITAL ARCHITECT & IOT ENGINEER',
  },
  {
    topLeft: 'UNLOCK',
    topRight: 'YOUR',
    bottomLeft: 'REAL',
    bottomRight: 'ITY',
    sub: 'EXPLORE BEYOND THE MASK OF COGNITION',
  },
];

/**
 * Hook to smoothly scramble and decrypt text into target text
 */
function useScrambledText(targetText, triggerId, duration = 650) {
  const [displayText, setDisplayText] = useState(targetText);
  const rafRef = useRef(null);

  useEffect(() => {
    let startTime = null;
    const original = targetText;
    const length = original.length;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Number of characters resolved
      const resolvedCount = Math.floor(progress * length);

      let result = '';
      for (let i = 0; i < length; i++) {
        if (original[i] === ' ') {
          result += ' ';
        } else if (i < resolvedCount) {
          result += original[i];
        } else {
          // Pick random cyber code glyph
          const randomIndex = Math.floor(Math.random() * CYBER_GLYPHS.length);
          result += CYBER_GLYPHS[randomIndex];
        }
      }

      setDisplayText(result);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(original);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetText, triggerId, duration]);

  return displayText;
}

// Minimalist Kinetic Marquee Content
const MARQUEE_ROW_1_ITEMS = [
  'DANG KHOA',
  'DIGITAL ARCHITECT',
];

const MARQUEE_ROW_2_ITEMS = [
  'SOFTWARE ENGINEER',
  'IOT ARCHITECTURE',
];

/**
 * HeroBackgroundTypography
 *
 * Ambient Kinetic Chrome Marquee Typography Portal:
 *   - Rendered at z-0 BEHIND the 3D Canvas layer (z-10).
 *   - Row 1 (Upper neck/head level): Infinite ambient ticker gliding slowly to the LEFT (←←←).
 *   - Row 2 (Lower shoulder level): Infinite ambient ticker gliding slowly to the RIGHT (→→→).
 *   - Metallic Chrome & Frosted Glass gradient styling (Ice Cyan & Lavender Violet).
 *   - Minimalist text density with expansive breathing spacing (mx-12 md:mx-20).
 *   - Subtle ambient opacity (0.50) letting the 3D Avatar command 100% foreground focus.
 *   - 100% GPU accelerated, 60 FPS silky smooth continuous flow.
 */
export function HeroBackgroundTypography() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Repeat sequence 6 times to ensure seamless infinite looping on any screen resolution (including 4K)
  const row1Repeated = useMemo(() => [
    ...MARQUEE_ROW_1_ITEMS,
    ...MARQUEE_ROW_1_ITEMS,
    ...MARQUEE_ROW_1_ITEMS,
    ...MARQUEE_ROW_1_ITEMS,
    ...MARQUEE_ROW_1_ITEMS,
    ...MARQUEE_ROW_1_ITEMS,
  ], []);

  const row2Repeated = useMemo(() => [
    ...MARQUEE_ROW_2_ITEMS,
    ...MARQUEE_ROW_2_ITEMS,
    ...MARQUEE_ROW_2_ITEMS,
    ...MARQUEE_ROW_2_ITEMS,
    ...MARQUEE_ROW_2_ITEMS,
    ...MARQUEE_ROW_2_ITEMS,
  ], []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none flex flex-col items-center justify-center select-none overflow-hidden"
      style={{
        opacity: mounted ? 0.50 : 0,
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Kinetic Container with Screen Edge Vignette */}
      <div
        className="marquee-edge-fade w-screen flex flex-col items-center justify-center gap-3 md:gap-5 overflow-hidden"
        style={{
          transform: 'translateY(-6%)',
          fontFamily: "'Outfit', 'Orbitron', sans-serif",
        }}
      >
        {/* ── ROW 1: Glides LEFT (←←←) Chrome Ice Cyan ────────────────────── */}
        <div className="w-full overflow-hidden flex whitespace-nowrap py-1">
          <div className="kinetic-track-left items-center">
            {row1Repeated.map((item, idx) => (
              <span key={`r1-${idx}`} className="inline-flex items-center">
                <span
                  className="chrome-text-cyan uppercase"
                  style={{
                    fontSize: 'clamp(30px, 5.2vw, 92px)',
                    lineHeight: 0.95,
                  }}
                >
                  {item}
                </span>
                <span
                  className="mx-10 md:mx-20 text-[#00e5ff] opacity-40 font-light select-none"
                  style={{ fontSize: 'clamp(20px, 3.2vw, 54px)' }}
                >
                  {idx % 2 === 0 ? '✦' : '◈'}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* ── ROW 2: Glides RIGHT (→→→) Chrome Lavender Violet ────────────── */}
        <div className="w-full overflow-hidden flex whitespace-nowrap py-1">
          <div className="kinetic-track-right items-center">
            {row2Repeated.map((item, idx) => (
              <span key={`r2-${idx}`} className="inline-flex items-center">
                <span
                  className="chrome-text-violet uppercase"
                  style={{
                    fontSize: 'clamp(30px, 5.2vw, 92px)',
                    lineHeight: 0.95,
                  }}
                >
                  {item}
                </span>
                <span
                  className="mx-10 md:mx-20 text-[#c084fc] opacity-40 font-light select-none"
                  style={{ fontSize: 'clamp(20px, 3.2vw, 54px)' }}
                >
                  {idx % 2 === 0 ? '◈' : '✦'}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * HeroForegroundHUD
 *
 * Rendered at z-20 in FRONT of the 3D Canvas layer.
 * Minimalist HUD status overlay and vertical navigation indicators.
 */
export function HeroForegroundHUD() {
  const [mounted, setMounted] = useState(false);
  const isDossierOpen = useCockpitStore((s) => s.isDossierOpen);
  const activeDossierTab = useCockpitStore((s) => s.activeDossierTab);
  const openDossier = useCockpitStore((s) => s.openDossier);
  const switchDossierTab = useCockpitStore((s) => s.switchDossierTab);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleIndicatorClick = (i) => {
    if (!isDossierOpen) {
      openDossier(i);
    } else {
      switchDossierTab(i);
    }
  };

  return (
    <div
      className="fixed inset-0 z-20 pointer-events-none select-none"
      style={{ fontFamily: "'Fira Code', monospace" }}
    >
      {/* Left Subtitle & Bio Badge */}
      <div
        style={{
          position: 'absolute',
          left: '4%',
          bottom: '10%',
          maxWidth: '420px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(15px)',
          transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            letterSpacing: '3px',
            color: '#00f2fe',
            marginBottom: '8px',
            fontWeight: 600,
            textShadow: '0 0 10px rgba(0,242,254,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#00f2fe',
              display: 'inline-block',
              boxShadow: '0 0 8px #00f2fe',
            }}
          />
          <span>OPERATOR // DANG KHOA</span>
        </div>

        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '12px',
            letterSpacing: '0.04em',
            color: 'rgba(255,255,255,0.7)',
            margin: 0,
            marginBottom: '14px',
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          EXPLORE BEYOND THE MASK OF COGNITION · FULL-STACK & IOT CREATIVE DEV
        </p>

        <div
          style={{
            width: '70px',
            height: '2px',
            background: 'linear-gradient(90deg, #00f2fe, #7928ca)',
            borderRadius: '2px',
            boxShadow: '0 0 10px rgba(0,242,254,0.6)',
          }}
        />
      </div>

      {/* Right Vertical Step Indicators */}
      <div
        style={{
          position: 'absolute',
          right: '2.5%',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1s ease 0.4s',
          pointerEvents: 'auto',
        }}
      >
        {VERTICAL_INDICATORS.map((num, i) => {
          const isActive = isDossierOpen && activeDossierTab === i;
          return (
            <button
              key={i}
              onClick={() => handleIndicatorClick(i)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'flex-end',
              }}
            >
              <span
                style={{
                  fontSize: '9px',
                  letterSpacing: '1.5px',
                  color: isActive ? '#00f2fe' : 'rgba(255,255,255,0.3)',
                  transition: 'color 0.3s, text-shadow 0.3s',
                  fontFamily: "'Fira Code', monospace",
                  textShadow: isActive ? '0 0 8px rgba(0,242,254,0.6)' : 'none',
                }}
              >
                {isActive ? SECTION_LABELS[i] : num}
              </span>
              <div
                style={{
                  width: isActive ? '26px' : '6px',
                  height: '2px',
                  background: isActive ? '#00f2fe' : 'rgba(255,255,255,0.2)',
                  borderRadius: '2px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? '0 0 10px rgba(0,242,254,0.8)' : 'none',
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Bottom Orbit Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '9px',
          letterSpacing: '3px',
          color: 'rgba(255,255,255,0.3)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1.2s ease 0.6s',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <div
          style={{
            width: '1.5px',
            height: '18px',
            background: 'linear-gradient(180deg, transparent, rgba(0,242,254,0.6))',
            margin: '0 auto',
          }}
        />
        <span>PLANETARY ORBIT RING ACTIVE</span>
      </div>
    </div>
  );
}

/**
 * Combined export for convenience
 */
export function HeroTypography() {
  return (
    <>
      <HeroBackgroundTypography />
      <HeroForegroundHUD />
    </>
  );
}
