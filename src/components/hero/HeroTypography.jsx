import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useCockpitStore } from '../../store/cockpitStore';
import { profileData } from '../../data/profile';
import { soundFx } from '../../services/soundFx';

// SVG Icon components for social links
const GithubIcon = ({ size = 13, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 13, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon = ({ size = 13, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const MailIcon = ({ size = 13, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

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
];

const MARQUEE_ROW_2_ITEMS = [
  'SOFTWARE ENGINEER',
];

/**
 * 3D Glass Fracture Shards Overlay
 * Renders high-fidelity crystalline polygonal glass shards exploding into Z-axis
 * when the Hand Crush Shockwave triggers at Phase 4.
 *
 * Performance: Uses direct DOM ref style mutation during animation (0 React re-renders).
 */
function GlassFractureOverlay({ active, accentColor, onComplete }) {
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const startTimeRef = useRef(null);
  const shardsDataRef = useRef([]);

  useEffect(() => {
    if (!active) {
      if (containerRef.current) containerRef.current.innerHTML = '';
      shardsDataRef.current = [];
      return;
    }

    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Reduced: 56 shards (from 128) for significant FPS gain without perceptible quality loss
    const NUM_SHARDS = 56;

    // Predefined faceted crystal polygon clip paths
    const polygonPaths = [
      'polygon(50% 0%, 0% 100%, 100% 100%)',
      'polygon(20% 0%, 90% 15%, 100% 85%, 10% 100%)',
      'polygon(0% 0%, 100% 25%, 75% 100%, 15% 80%)',
      'polygon(35% 0%, 100% 0%, 80% 100%, 0% 65%)',
      'polygon(0% 30%, 65% 0%, 100% 70%, 30% 100%)',
      'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    ];

    // Build shard data and create DOM elements once (no per-frame React re-render)
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    const shards = [];
    const domElements = [];

    for (let i = 0; i < NUM_SHARDS; i++) {
      const isRow1 = i < NUM_SHARDS / 2;
      const originX = (w * 0.08) + (w * 0.84) * ((i % (NUM_SHARDS / 2)) / (NUM_SHARDS / 2)) + (Math.random() * 40 - 20);
      const originY = isRow1
        ? h * 0.62 + (Math.random() * 60 - 30)
        : h * 0.72 + (Math.random() * 60 - 30);

      const shardColor = isRow1 ? (accentColor || '#00f2fe') : '#c084fc';
      const angle = (Math.random() * Math.PI * 2);
      const speed = 220 + Math.random() * 540;
      const size = 16 + Math.random() * 48;
      const aspect = 0.5 + Math.random() * 1.4;

      const shard = {
        originX, originY,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 140,
        vy: Math.sin(angle) * speed - (100 + Math.random() * 180),
        vz: -350 - Math.random() * 1100,
        rotX: Math.random() * 360,
        rotY: Math.random() * 360,
        rotZ: Math.random() * 360,
        vRotX: (Math.random() - 0.5) * 640,
        vRotY: (Math.random() - 0.5) * 640,
        vRotZ: (Math.random() - 0.5) * 480,
      };
      shards.push(shard);

      // Create DOM element once, mutate style directly in animation loop
      const el = document.createElement('div');
      el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size * aspect}px;
        clip-path: ${polygonPaths[i % polygonPaths.length]};
        background: linear-gradient(135deg, rgba(255,255,255,0.85) 0%, ${shardColor}cc 40%, rgba(5,10,25,0.7) 100%);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border: 1px solid ${shardColor};
        box-shadow: 0 0 14px ${shardColor}, inset 0 0 8px rgba(255,255,255,0.6);
        will-change: transform, opacity;
        transform-style: preserve-3d;
      `;
      container.appendChild(el);
      domElements.push(el);
    }

    shardsDataRef.current = shards;
    startTimeRef.current = performance.now();
    const DURATION = 1350;

    const animate = (now) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      const progress = Math.min(1, (now - startTimeRef.current) / DURATION);
      const drag = Math.pow(0.32, elapsed);
      const opacity = Math.max(0, (1 - Math.pow(progress, 1.6)) * 0.98);

      for (let i = 0; i < shards.length; i++) {
        const s = shards[i];
        const el = domElements[i];
        if (!el) continue;

        const x = s.originX + s.vx * elapsed * drag;
        const y = s.originY + s.vy * elapsed * drag + (elapsed * elapsed * 200);
        const z = s.vz * elapsed;
        const rX = s.rotX + s.vRotX * elapsed;
        const rY = s.rotY + s.vRotY * elapsed;
        const rZ = s.rotZ + s.vRotZ * elapsed;

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.opacity = opacity;
        el.style.transform = `translate3d(-50%, -50%, ${z}px) rotateX(${rX}deg) rotateY(${rY}deg) rotateZ(${rZ}deg)`;
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        if (container) container.innerHTML = '';
        onComplete?.();
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [active, accentColor, onComplete]);

  return (
    <div
      aria-hidden="true"
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-1 overflow-hidden"
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
    />
  );
}

/**
 * HeroBackgroundTypography
 *
 * Ambient Kinetic Chrome Marquee Typography Portal:
 *   - Rendered at z-0 BEHIND the 3D Canvas layer (z-10).
 *   - Row 1: Infinite ambient ticker gliding slowly to the LEFT (←←←) displaying "DANG KHOA".
 *   - Row 2: Infinite ambient ticker gliding slowly to the RIGHT (→→→) displaying "SOFTWARE ENGINEER".
 *   - Metallic Chrome & Frosted Glass gradient styling (Ice Cyan & Lavender Violet).
 *   - Subtle ambient opacity (0.50) letting the 3D Avatar command 100% foreground focus.
 *   - 100% GPU accelerated, 60 FPS silky smooth continuous flow.
 *   - Shatters into 3D Glass Fracture Shards when Hand Crush Shockwave triggers!
 */
export function HeroBackgroundTypography() {
  const [mounted, setMounted] = useState(false);
  const isDossierOpen = useCockpitStore((s) => s.isDossierOpen);
  const heroTransition = useCockpitStore((s) => s.heroTransition);

  const isTransitioning = heroTransition.active;
  const isShattered = isTransitioning && (heroTransition.phase === 'crush' || heroTransition.phase === 'reveal');

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Repeat sequence 12 times to ensure seamless infinite looping on any screen resolution (including 4K)
  const row1Repeated = useMemo(() => Array(12).fill('DANG KHOA'), []);
  const row2Repeated = useMemo(() => Array(12).fill('SOFTWARE ENGINEER'), []);

  return (
    <>
      {/* ── 3D Glass Shards Fracture Effect ────────────────────────── */}
      <GlassFractureOverlay
        active={isShattered}
        accentColor={heroTransition.accentColor || '#00f2fe'}
      />

      {/* ── Continuous Ambient Kinetic Marquee ──────────────────────── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none flex flex-col items-center justify-center select-none overflow-hidden"
        style={{
          opacity: (isDossierOpen || isShattered) ? 0 : (mounted ? 0.50 : 0),
          transition: isShattered ? 'opacity 0.05s ease-out' : 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Kinetic Container with Screen Edge Vignette */}
        <div
          className="marquee-edge-fade w-screen flex flex-col items-center justify-center gap-3 md:gap-5 overflow-hidden"
          style={{
            transform: 'translateY(36%)',
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
    </>
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

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-20 pointer-events-none select-none"
      style={{
        fontFamily: "'Fira Code', monospace",
        opacity: isDossierOpen ? 0 : (mounted ? 1 : 0),
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Bottom-Left Minimalist Creator HUD Tag */}
      <div
        style={{
          position: 'absolute',
          left: 'clamp(24px, 3.5vw, 48px)',
          bottom: 'clamp(20px, 3vh, 36px)',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '5px',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '2.5px',
            color: '#00f2fe',
            textShadow: '0 0 12px rgba(0, 242, 254, 0.55)',
            textTransform: 'uppercase',
          }}
        >
          <span>CREATED BY ĐĂNG KHOA</span>
        </div>

        <div
          style={{
            width: '45px',
            height: '1.5px',
            background: 'linear-gradient(90deg, #00f2fe, #7928ca, transparent)',
            borderRadius: '1px',
            boxShadow: '0 0 8px rgba(0, 242, 254, 0.4)',
          }}
        />
      </div>

      {/* Bottom-Right Social Hub & Version HUD */}
      <div
        className="pointer-events-auto"
        style={{
          position: 'absolute',
          right: 'clamp(24px, 3.5vw, 48px)',
          bottom: 'clamp(20px, 3vh, 36px)',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '5px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {/* Social Links Group */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {[
              { id: 'github', label: 'GitHub', url: profileData.socials.github, Icon: GithubIcon },
              { id: 'linkedin', label: 'LinkedIn', url: profileData.socials.linkedin, Icon: LinkedinIcon },
              { id: 'facebook', label: 'Facebook', url: profileData.socials.facebook, Icon: FacebookIcon },
              { id: 'mail', label: 'Email', url: `mailto:${profileData.email}`, Icon: MailIcon },
            ].map(({ id, label, url, Icon }) => (
              <a
                key={id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                aria-label={label}
                onMouseEnter={() => soundFx.playHover?.()}
                onClick={() => soundFx.playClick?.()}
                className="group relative flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '5px',
                  background: 'rgba(6, 9, 20, 0.75)',
                  border: '1px solid rgba(0, 242, 254, 0.22)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                }}
              >
                <Icon size={12} className="transition-colors duration-200 group-hover:text-[#00f2fe]" />
              </a>
            ))}
          </div>

          {/* Divider */}
          <span style={{ width: '1px', height: '12px', background: 'rgba(255, 255, 255, 0.15)' }} />

          {/* Project Version Tag */}
          <div
            style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '1.8px',
              color: '#00f2fe',
              textShadow: '0 0 10px rgba(0, 242, 254, 0.5)',
              textTransform: 'uppercase',
            }}
          >
            <span>v1.0.0</span>
          </div>
        </div>

        {/* Right Line Indicator */}
        <div
          style={{
            width: '45px',
            height: '1.5px',
            background: 'linear-gradient(270deg, #00f2fe, #7928ca, transparent)',
            borderRadius: '1px',
            boxShadow: '0 0 8px rgba(0, 242, 254, 0.4)',
          }}
        />
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
